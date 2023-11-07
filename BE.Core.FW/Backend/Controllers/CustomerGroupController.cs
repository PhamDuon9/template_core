using Microsoft.AspNetCore.Mvc;
using Backend.Business.CustomerGroup;
using Backend.Infrastructure.Utils;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerGroupController : Controller
    {
        private readonly ICustomerGroupHandler _handler;

        public CustomerGroupController(ICustomerGroupHandler handler)
        {
            _handler = handler;
        }

        [HttpPost]
        public ResponseData Create([FromBody] CustomerGroupModel model)
        {
            return _handler.Create(model);
        }

        [HttpDelete]
        [Route("id")]
        public ResponseData Delete(Guid id)
        {
            return _handler.Delete(id);
        }

        [HttpDelete]
        [Route("DeleteMany")]
        public ResponseData DeleteMany([FromBody] List<string> ids)
        {
            return _handler.DeleteMany(ids);
        }

        [HttpGet]
        public ResponseData Get(string filter = "{}")
        {
            return _handler.Get(filter);
        }

        [HttpGet]
        [Route("id")]
        public ResponseData GetById(Guid id)
        {
            return _handler.GetById(id);
        }

        [HttpPut]
        [Route("id")]
        public ResponseData Update(Guid id, CustomerGroupModel model)
        {
            return _handler.Update(id, model);
        }
    }
}
