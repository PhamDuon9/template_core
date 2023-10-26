using Backend.Business.Policy;
using Backend.Infrastructure.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    //[Authorize]
    public class PolicyController : ControllerBase
    {
        private readonly IPolicyHandler _handler;

        public PolicyController(IPolicyHandler handler)
        {
            _handler = handler;
        }

        [HttpGet]
        public ResponseData Get()
        {
            return _handler.Get();
        }

        [HttpGet]
        [Route("GetByRole/{roleId}")]
        public ResponseData GetByRole([FromRoute] Guid roleId)
        {
            return _handler.GetByRoleId(roleId);
        }

        [HttpGet]
        [Route("{id}")]
        public ResponseData GetById(Guid id)
        {
            return _handler.GetById(id);
        }

        [HttpPut]
        [Route("{id}")]
        public ResponseData Update(Guid id, [FromBody] PolicyModel model)
        {
            return _handler.Update(id, model);
        }

        [HttpPost]
        public ResponseData Create([FromBody] PolicyModel model)
        {
            return _handler.Create(model);
        }

        [HttpPost("CreateOrUpdate")]
        public ResponseData CreateOrUpdate([FromBody] PolicyModel model)
        {
            return _handler.CreateOrUpdate(model);
        }

        [HttpDelete]
        [Route("{id}")]
        public ResponseData Delete(Guid id)
        {
            return _handler.Delete(id);
        }
    }
}
