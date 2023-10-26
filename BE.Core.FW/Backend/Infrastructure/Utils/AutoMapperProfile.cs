using AutoMapper;
using Backend.Business;
using Backend.Business.DividingRoom;
using Backend.Business.Navigation;
using Backend.Business.Policy;
using Backend.Business.Role;
using Backend.Business.User;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Model;

namespace Backend.Infrastructure.Utils
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<SysUser, UserModel>().ReverseMap();
            CreateMap<SysUserMetadata, UserMetadataModel>().ReverseMap();
            CreateMap<SysNavigation, NavigationModel>().ReverseMap();
            CreateMap<SysPolicy, PolicyModel>().ReverseMap();
            CreateMap<SysDividingExamPlace, DividingExamPlaceModel>().ReverseMap();
            CreateMap<SysRole, RoleModel>().ReverseMap();
            CreateMap<string, string>().ConvertUsing(s => string.IsNullOrEmpty(s) ? s : s.Trim());
            CreateMap<SysDepartment, DepartmentModel>().ReverseMap();
            CreateMap<SysProductCategory, ProductCategoryModel>().ReverseMap();
            CreateMap<SysProductType, ProductTypeModel>().ReverseMap();
            CreateMap<SysProduct, ProductModel>().ReverseMap();
            CreateMap<SysCustomerCategory, CustomerCategoryModel>().ReverseMap();
            CreateMap<SysCustomerType, CustomerTypeModel>().ReverseMap();
            CreateMap<SysCustomer, CustomerModel>().ReverseMap();
            CreateMap<SysBranch, BranchModel>().ReverseMap();
        }
    }
}
