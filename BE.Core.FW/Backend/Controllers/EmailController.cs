using Backend.Business.Mailing;
using Backend.Business.User;
using Backend.Infrastructure.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailTemplateHandler _handler;

        public EmailController(IEmailTemplateHandler handler)
        {
            _handler = handler;
        }

        [HttpPost]
        [Route("SendOneEmail")]
        public Task<ResponseData> SendOneEmail([FromBody] EmailRequest model)
        {
            return _handler.SendOneZetaEmail(model);
        }
    }
}
