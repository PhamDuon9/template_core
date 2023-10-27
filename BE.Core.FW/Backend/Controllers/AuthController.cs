using Backend.Business.Auth;
using Backend.Business.Navigation;
using Backend.Business.User;
using Backend.Infrastructure.Utils;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    //[Authorize]
    public class AuthController : ControllerBase
    {
        private readonly IAuthHandler _handler;

        public AuthController(IAuthHandler handler)
        {
            _handler = handler;
        }

        #region dành cho wso2
        //[HttpGet]
        //public async Task<bool> CheckAuthWSO2()
        //{
        //    string accessToken = Request.Headers["authorization"].ToString();
        //    accessToken = accessToken.Replace("Bearer", "").Trim();
        //    return await _handler.CheckAuthWso2(accessToken);
        //}

        //[HttpGet]
        //[Route("GetToken")]
        //public async Task<ResponseData> GetToken(string code)
        //{
        //    return await _handler.GetToken(code);
        //}
        #endregion

        [HttpGet]
        [Route("GetNavigation")]
        public async Task<ResponseData> GetNavigation()
        {
            return await _handler.GetNavigation();
        }

        /// <summary>
        /// Lấy danh sách quyền theo userId đang đăng nhập
        /// </summary>
        /// <returns></returns>
        //[Authorize]
        [HttpPost("whoiam")]
        public async Task<TokenResponse> GetTokenAPI([FromBody] UserLogin model)
        {
            string ipAddress = GetIpAddress();
            return await _handler.GetTokenAPI(model, ipAddress);
        }

        private string GetIpAddress() =>
       Request.Headers.ContainsKey("X-Forwarded-For")
           ? Request.Headers["X-Forwarded-For"]
           : HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString() ?? "N/A";
    }
}
