using Backend.Infrastructure.Utils;


namespace Backend.Business.AdministrativeDivision
{
    public interface IAdministrativeDivisionHandler
    {
        ResponseData ImportProvince(IFormFile file);
        ResponseData ImportDistrict(IFormFile file);
        ResponseData GetProvince(bool isGetAllDistrict);
        ResponseData GetDistrict(Guid provinceId);
        ResponseData GetProvinceId(Guid provinceId);
    }
}
