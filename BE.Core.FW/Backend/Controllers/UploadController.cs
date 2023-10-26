using Backend.Business.UploadFile;
using Backend.Infrastructure.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    [EnableCors]
    public class UploadController : ControllerBase
    {
        private readonly IUploadFileHandler _handler;

        public UploadController(IUploadFileHandler handler)
        {
            _handler = handler;
        }


        [HttpPost]
        public async Task<ResponseData> ImportFile([FromForm] UploadFileModel fileDetails)
        {
            return await _handler.PostFileAsync(fileDetails);
        }
    }
}
