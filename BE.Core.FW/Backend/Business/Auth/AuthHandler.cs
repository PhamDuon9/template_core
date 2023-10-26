using AutoMapper;
using Backend.Business.Navigation;
using Backend.Business.User;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Exception;
using Backend.Infrastructure.Middleware.Auth.Jwt;
using Backend.Infrastructure.Middleware.Permissions;
using Backend.Infrastructure.Utils;
using Backend.Model;
using DocumentFormat.OpenXml.EMMA;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NetCasbin;
using Newtonsoft.Json;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using System.Security.Claims;
using System.Text;
using Constant = Backend.Infrastructure.Utils.Constant;

namespace Backend.Business.Auth
{
    public class AuthHandler : IAuthHandler
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private static readonly string apiBasicUriWSO2 = Utils.GetConfig("Authentication:WSO2:Admin:Uri");
        private static readonly string RedirectUri = Utils.GetConfig("Authentication:WSO2:Admin:RedirectUri");
        private static readonly string Secret = Utils.GetConfig("Authentication:WSO2:Admin:Secret");
        private static readonly string Clientid = Utils.GetConfig("Authentication:WSO2:Admin:Clientid");
        private readonly JwtSettings _jwtSettings;


        public AuthHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor, IOptions<JwtSettings> jwtSettings)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _jwtSettings = jwtSettings.Value;

        }

        public async Task<bool> CheckAuthWso2(string accessToken)
        {
            try
            {
                // hardcode tạm
                return await HttpHelper.GetAuthStatusWSO2(apiBasicUriWSO2, Utils.GetConfig("Authentication:WSO2:Tenants:iig") + Utils.GetConfig("Authentication:WSO2:API:Auth"), accessToken);
            }
            catch (Exception e)
            {
                Log.Error(e, e.Message);
                return true;
            }
        }

        public async Task<ResponseData> GetToken(string code)
        {
            try
            {
                // hardcode tạm
                HttpClientHandler clientHandler = new HttpClientHandler();
                clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
                var body = new
                {
                    grant_type = "authorization_code",
                    code = code,
                    redirect_uri = RedirectUri
                };

                using (var client = new HttpClient(clientHandler))
                {
                    client.BaseAddress = new Uri(apiBasicUriWSO2);
                    client.DefaultRequestHeaders.Add("Authorization", "Basic " + System.Convert.ToBase64String(Encoding.GetEncoding("ISO-8859-1").GetBytes(Clientid + ":" + Secret)));
                    var content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
                    var result = await client.PostAsync(Utils.GetConfig("Authentication:WSO2:Tenants:iig") + Utils.GetConfig("Authentication:WSO2:API:PostToken"), content);
                    string resultContentString = await result.Content.ReadAsStringAsync();
                    if (result.IsSuccessStatusCode && result.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        if (resultContentString != null)
                        {
                            var resultContent = JsonConvert.DeserializeObject<WSO2ResponseModel>(resultContentString);
                            return new ResponseDataObject<WSO2ResponseModel>(resultContent != null ? resultContent : new WSO2ResponseModel(), Code.Success, "Thành công ");
                        }
                    }
                    return new ResponseDataError(Code.ServerError, "Lỗi lấy dữ liệu WSO2");
                }
            }
            catch (Exception e)
            {
                Log.Error(e, e.Message);
                return new ResponseDataError(Code.ServerError, e.Message);
            }
        }
        public async Task<ResponseData> GetNavigation()
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var data = unitOfWork.Repository<SysNavigation>().Get();
                var result = new List<NavigationModel>();
                foreach (var item in data)
                {
                    result.Add(BuildMenu(item));
                }
                return new ResponseDataObject<List<NavigationModel>>(result.Where(p => string.IsNullOrEmpty(p.ParentId.ToString())).ToList(), Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }
        private NavigationModel BuildMenu(SysNavigation navigation)
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);

            NavigationModel result = _mapper.Map<NavigationModel>(navigation);
            var children = unitOfWork.Repository<SysNavigation>().Get(x => x.ParentId == navigation.Id);
            if (children.Any())
            {
                foreach (var item in children)
                {
                    result.Children.Add(BuildMenu(item));
                }
            }
            return result;
        }

        public async Task<TokenResponse> GetTokenAPI(UserLogin model, string ipAddress)
        {
            using UnitOfWork unitOfWork = new(_httpContextAccessor);
            var existUser = unitOfWork.Repository<SysUser>().Get(g => g.Username == model.Username)?.FirstOrDefault();
            if (existUser == null)
            {
                throw new UnauthorizedException("Unauthorized");
            }
            var token = await GenerateTokensAndUpdateUser(_mapper.Map<UserModel>(existUser), ipAddress);
            return token;
        }
        private async Task<TokenResponse> GenerateTokensAndUpdateUser(UserModel user, string ipAddress)
        {
            string token = GenerateJwt(user, ipAddress);

            //user.RefreshToken = GenerateRefreshToken();
            //user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationInDays);

            //await _userManager.UpdateAsync(user);

            //return new TokenResponse(token, user.RefreshToken, user.RefreshTokenExpiryTime);
            return new TokenResponse(token, "", DateTime.Now);
        }

        private string GenerateJwt(UserModel user, string ipAddress) =>
        GenerateEncryptedToken(GetSigningCredentials(), GetClaims(user, ipAddress));

        private IEnumerable<Claim> GetClaims(UserModel user, string ipAddress) =>
            new List<Claim>
            {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(FSHClaims.Fullname, $"{user.Fullname}"),
            new(ClaimTypes.Name, user.Username ?? string.Empty),
            //new(ClaimTypes.Surname, user.LastName ?? string.Empty),
            new(FSHClaims.IpAddress, ipAddress),
            //new(FSHClaims.Tenant, _currentTenant!.Id),
            //new(FSHClaims.ImageUrl, user.ImageUrl ?? string.Empty),
            new(ClaimTypes.MobilePhone, user.Phone ?? string.Empty)
            };
        private string GenerateEncryptedToken(SigningCredentials signingCredentials, IEnumerable<Claim> claims)
        {
            var token = new JwtSecurityToken(
               claims: claims,
               expires: DateTime.UtcNow.AddMinutes(_jwtSettings.TokenExpirationInMinutes),
               signingCredentials: signingCredentials);
            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
        }

        private SigningCredentials GetSigningCredentials()
        {
            if (string.IsNullOrEmpty(_jwtSettings.Key))
            {
                throw new InvalidOperationException("No Key defined in JwtSettings config.");
            }

            byte[] secret = Encoding.UTF8.GetBytes(_jwtSettings.Key);
            return new SigningCredentials(new SymmetricSecurityKey(secret), SecurityAlgorithms.HmacSha256);
        }
    }
}
