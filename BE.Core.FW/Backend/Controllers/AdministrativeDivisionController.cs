using Backend.Business;
using Backend.Business.AdministrativeDivision;
using Backend.Business.Auth;
using Backend.Business.Branch;
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
    public class AdministrativeDivisionController : ControllerBase
    {
        private readonly IAdministrativeDivisionHandler _handler;

        public AdministrativeDivisionController(IAdministrativeDivisionHandler handler)
        {
            _handler = handler;
        }

        [HttpGet]
        [Route("province")]
        public ResponseData GetProvince(bool isGetAllDistrict)
        {
            return _handler.GetProvince(isGetAllDistrict);
        }

        [HttpGet]
        [Route("province/{provinceId}")]
        public ResponseData GetProvinceId(Guid provinceId)
        {
            return _handler.GetProvinceId(provinceId);
        }

        [HttpGet]
        [Route("district")]
        public ResponseData Update(Guid provinceId)
        {
            return _handler.GetDistrict(provinceId);
        }

        [HttpPost]
        [Route("province/import")]
        public ResponseData ImportProvince(IFormFile file)
        {
            return _handler.ImportProvince(file);
        }

        [HttpPost]
        [Route("district/import")]
        public ResponseData ImportDistrict(IFormFile file)
        {
            return _handler.ImportDistrict(file);
        }
    }
}
