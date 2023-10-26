using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Dynamic;
using System.Net;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace Backend.Infrastructure.Middleware
{
    internal class CustomAuthenticationHandler : AuthenticationHandler<CustomAuthenticationOptions>
    {
        private readonly string apiBasicUriWSO2 = Utils.Utils.GetConfig("Authentication:WSO2:Admin:Uri");

        public CustomAuthenticationHandler(IOptionsMonitor<CustomAuthenticationOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock) : base(options, logger, encoder, clock)
        {
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            string authHeader = Request.Headers["Authorization"];
            if (authHeader != null && authHeader.StartsWith("Bearer "))
            {
                string token = authHeader.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries)[1].Trim();
                string accessToken = token;
                string tenant = Request.Headers["Tenant"];
                string endPoint = apiBasicUriWSO2 + Utils.Utils.GetConfig("Authentication:WSO2:Tenants:iig") + Utils.Utils.GetConfig("Authentication:WSO2:API:GetMe");
                if (!string.IsNullOrEmpty(tenant))
                {
                    endPoint = apiBasicUriWSO2 + tenant + Utils.Utils.GetConfig("Authentication:WSO2:API:GetMe");
                }

                var handler = new HttpClientHandler
                {
                    ClientCertificateOptions = ClientCertificateOption.Manual,
                    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) =>
                    {
                        return true;
                    }
                };

                var httpClient = new HttpClient(handler);

                httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);

                HttpResponseMessage response = await httpClient.GetAsync(endPoint);

                if (response.StatusCode == HttpStatusCode.OK)
                {
                    string responseData = await response.Content.ReadAsStringAsync();

                    var dataConvert = JsonConvert.DeserializeObject<Root>(responseData);

                    ClaimsIdentity claimsIdentity = new(new List<Claim>()
                    {
                        new Claim(ClaimTypes.NameIdentifier, dataConvert != null ? dataConvert.basic.httpwso2orgclaimsuserid : string.Empty),
                        new Claim(ClaimTypes.Name, dataConvert != null ? dataConvert.basic.httpwso2orgclaimsusername : string.Empty)
                    }, "custom");

                    ClaimsPrincipal claimsPrincipal = new ClaimsPrincipal(claimsIdentity);


                    return AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, new AuthenticationProperties(), "custom"));
                }

                return AuthenticateResult.Fail("Unauthorized");
            }
            return AuthenticateResult.Fail("Unauthorized");
        }

        public class Basic
        {
            [JsonProperty("http://wso2.org/claims/userid")]
            public string httpwso2orgclaimsuserid { get; set; } = string.Empty;

            [JsonProperty("http://wso2.org/claims/username")]
            public string httpwso2orgclaimsusername { get; set; } = string.Empty;

            [JsonProperty("http://wso2.org/claims/created")]
            public string? httpwso2orgclaimscreated { get; set; }

            [JsonProperty("http://wso2.org/claims/role")]
            public string? httpwso2orgclaimsrole { get; set; }

            [JsonProperty("http://wso2.org/claims/modified")]
            public string? httpwso2orgclaimsmodified { get; set; }

            [JsonProperty("http://wso2.org/claims/roles")]
            public string? httpwso2orgclaimsroles { get; set; }

            [JsonProperty("http://wso2.org/claims/resourceType")]
            public string? httpwso2orgclaimsresourceType { get; set; }

            [JsonProperty("http://wso2.org/claims/groups")]
            public string? httpwso2orgclaimsgroups { get; set; }

            [JsonProperty("http://wso2.org/claims/userprincipal")]
            public string? httpwso2orgclaimsuserprincipal { get; set; }
        }

        public class Root
        {
            public Basic basic { get; set; } = new Basic();
        }

    }
}
