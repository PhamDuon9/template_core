using AutoMapper;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Backend.Model;
using Newtonsoft.Json;
using Serilog;

namespace Backend.Business.Department;

public class DepartmentHandler : IDepartmentHandler
{
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DepartmentHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    public ResponseData Create(DepartmentModel model)
    {
        try
        {
            using UnitOfWork unitOfWork = new(_httpContextAccessor);
            model.Id = Guid.NewGuid();
            if (model.ParentId.HasValue)
            {
                model.Level = (unitOfWork.Repository<SysDepartment>().GetById(model.ParentId.Value)?.Level ?? 0) + 1;
            }
            unitOfWork.Repository<SysDepartment>().Insert(_mapper.Map<SysDepartment>(model));
            unitOfWork.Save();
            return new ResponseData(Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData Delete(Guid id)
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysDepartment>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            unitOfWork.Repository<SysDepartment>().Delete(iigDepartmentData);
            unitOfWork.Save();
            return new ResponseData(Code.Success, "Xóa thành công");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData Get(string filter)
    {
        try
        {
            int pageNumber = 0;
            int pageSize = 20;
            int totalCount = 0;
            var filterModel = JsonConvert.DeserializeObject<DepartmentFilterModel>(filter);
            if (filterModel == null)
                return new ResponseDataError(Code.BadRequest, "Filter invalid");
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysDepartment>().Get();
            if (!string.IsNullOrEmpty(filterModel.TextSearch))
                iigDepartmentData = iigDepartmentData.Where(x => x.Name.ToLower().Contains(filterModel.TextSearch.ToLower()));
            if (filterModel.BranchId.HasValue)
                iigDepartmentData = iigDepartmentData.Where(x => x.BranchId == filterModel.BranchId.Value);
            totalCount = iigDepartmentData.Count();
            if (filterModel.Page.HasValue && filterModel.Size.HasValue)
            {
                iigDepartmentData = iigDepartmentData.OrderBy(g => g.CreatedOnDate).Skip((filterModel.Page.Value - 1) * filterModel.Size.Value).Take(filterModel.Size.Value);
                pageNumber = filterModel.Page.Value;
                pageSize = filterModel.Size.Value;
            }
            var result = new List<DepartmentModel>();
            foreach (var school in iigDepartmentData)
            {
                var mappingModel = _mapper.Map<DepartmentModel>(school);
                mappingModel.BranchName = mappingModel.BranchId.HasValue ? unitOfWork.Repository<SysBranch>().GetById(mappingModel.BranchId.Value)?.Name : null;
                result.Add(mappingModel);
            }
            var pagination = new Pagination()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPage = (int)Math.Ceiling((decimal)totalCount / pageSize)
            };
            return new PageableData<List<DepartmentModel>>(result, pagination, Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData GetById(Guid id)
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysDepartment>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            var result = _mapper.Map<DepartmentModel>(iigDepartmentData);
            return new ResponseDataObject<DepartmentModel>(result, Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData GetTree()
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var root = unitOfWork.Repository<SysDepartment>().Get();
            if (root == null)
            {
                return new ResponseDataError(Code.NotFound, "Not found");
            }
            //var result = BuildDepartment(root);
            var result = RecursiveDepartment(root?.ToList() ?? new List<SysDepartment>(), null);
            return new ResponseDataObject<List<DepartmentTreeModel>>(result, Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    private List<DepartmentTreeModel> RecursiveDepartment(List<SysDepartment> inputDepartments, Guid? parentId)
    {
        List<DepartmentTreeModel> departments = new List<DepartmentTreeModel>();
        if (!parentId.HasValue)
        {
            foreach (var department in inputDepartments)
            {
                if (!department.ParentId.HasValue || (department.ParentId.HasValue && department.ParentId.Value == Guid.Empty))
                {
                    var convertDepartment = new DepartmentTreeModel()
                    {
                        Title = department.Name,
                        Value = department.Id.ToString(),
                        Key = department.Id.ToString(),
                    };
                    convertDepartment.Children = RecursiveDepartment(inputDepartments, department.Id);
                    departments.Add(convertDepartment);
                }
            }
        }
        else
        {
            foreach (var department in inputDepartments)
            {
                if (department.ParentId == parentId)
                {
                    var convertDepartment = new DepartmentTreeModel()
                    {
                        Title = department.Name,
                        Value = department.Id.ToString(),
                        Key = department.Id.ToString(),
                    };
                    convertDepartment.Children = RecursiveDepartment(inputDepartments, department.Id);
                    departments.Add(convertDepartment);
                }
            }
        }
        return departments;
    }

    // private DepartmentModel BuildDepartment(SysDepartment department)
    // {
    //     using var unitOfWork = new UnitOfWork(_httpContextAccessor);
    //     DepartmentModel result = _mapper.Map<DepartmentModel>(department);
    //     var children = unitOfWork.Repository<SysDepartment>().Get(x => x.ParentId == department.Id);
    //     if (children.Any())
    //     {
    //         foreach (var item in children)
    //         {
    //             result.Children.Add(BuildDepartment(item));
    //         }
    //     }
    //     return result;
    // }

    public ResponseData Update(Guid id, DepartmentModel model)
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysDepartment>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            if (!string.IsNullOrEmpty(model.Code))
                iigDepartmentData.Code = model.Code;
            if (!string.IsNullOrEmpty(model.Name))
                iigDepartmentData.Name = model.Name;
            if (model.ParentId != Guid.Empty)
                iigDepartmentData.ParentId = model.ParentId;
            if (!string.IsNullOrEmpty(model.Description))
                iigDepartmentData.Description = model.Description;
            if (model.ParentId.HasValue)
            {
                iigDepartmentData.Level = (unitOfWork.Repository<SysDepartment>().GetById(model.ParentId.Value)?.Level ?? 0) + 1;
            }
            unitOfWork.Repository<SysDepartment>().Update(iigDepartmentData);

            unitOfWork.Save();
            return new ResponseData(Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }
}