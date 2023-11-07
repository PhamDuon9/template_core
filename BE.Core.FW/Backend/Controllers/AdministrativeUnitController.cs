using Backend.Business.AdministrativeUnit;
using Backend.Infrastructure.Utils;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AdministrativeUnitController : ControllerBase
    {
        private readonly IAdministrativeUnitHandler _handler;

        public AdministrativeUnitController(IAdministrativeUnitHandler handler)
        {
            _handler = handler;
        }

        [HttpPost]
        public ResponseData Create([FromBody] AdministrativeUnitModel model)
        {
            return _handler.Create(model);
        }

        [HttpDelete]
        [Route("id")]
        public ResponseData Delete(Guid id)
        {
            return _handler.Delete(id);
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

        [HttpGet]
        [Route("parentid")]
        public ResponseData GetByParentId(Guid parentId)
        {
            return _handler.GetByParentId(parentId);
        }

        [HttpGet]
        [Route("tree")]
        public ResponseData GetTree()
        {
            return _handler.GetTree();
        }


        [HttpPut]
        [Route("id")]
        public ResponseData Update(Guid id, AdministrativeUnitModel model)
        {
            return _handler.Update(id, model);
        }
    }
}
