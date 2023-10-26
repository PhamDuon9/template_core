using Backend.Business.Auth;
using Backend.Business.Department;
using Backend.Business.Navigation;
using Backend.Business.User;
using Backend.Infrastructure.Utils;
using Backend.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    // [Authorize]
    [ApiController]
    [Route("[controller]")]
    //[Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentHandler _iigDepartmentHandler;

        public DepartmentController(IDepartmentHandler iigDepartmentHandler)
        {
            _iigDepartmentHandler = iigDepartmentHandler;
        }

        [HttpPost]
        public ResponseData Create([FromBody] DepartmentModel model)
        {
            return _iigDepartmentHandler.Create(model);
        }

        [HttpDelete]
        [Route("id")]
        public ResponseData Delete(Guid id)
        {
            return _iigDepartmentHandler.Delete(id);
        }

        [HttpGet]
        public ResponseData Get(string filter = "{}")
        {
            return _iigDepartmentHandler.Get(filter);
        }

        [HttpGet]
        [Route("id")]
        public ResponseData GetById(Guid id)
        {
            return _iigDepartmentHandler.GetById(id);
        }

        [HttpGet]
        [Route("tree")]
        public ResponseData GetTree()
        {
            return _iigDepartmentHandler.GetTree();
        }


        [HttpPut]
        [Route("id")]
        public ResponseData Update(Guid id, DepartmentModel model)
        {
            return _iigDepartmentHandler.Update(id, model);
        }
    }
}
