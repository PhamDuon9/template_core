using AutoMapper;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Backend.Model;
using Newtonsoft.Json;
using Serilog;

namespace Backend.Business.Branch;

public class CustomerTypeHandler : ICustomerTypeHandler
{
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CustomerTypeHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    public ResponseData Create(CustomerTypeModel model)
    {
        try
        {
            using UnitOfWork unitOfWork = new(_httpContextAccessor);
            model.Id = Guid.NewGuid();

            unitOfWork.Repository<SysCustomerType>().Insert(_mapper.Map<SysCustomerType>(model));
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
            var iigDepartmentData = unitOfWork.Repository<SysCustomerType>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            unitOfWork.Repository<SysCustomerType>().Delete(iigDepartmentData);
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
            var filterModel = JsonConvert.DeserializeObject<RequestData>(filter);
            if (filterModel == null)
                return new ResponseDataError(Code.BadRequest, "Filter invalid");
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysCustomerType>().Get();
            if (!string.IsNullOrEmpty(filterModel.TextSearch))
                iigDepartmentData = iigDepartmentData.Where(x => x.Name.ToLower().Contains(filterModel.TextSearch.ToLower()));
            totalCount = iigDepartmentData.Count();
            if (filterModel.Page.HasValue && filterModel.Size.HasValue)
            {
                iigDepartmentData = iigDepartmentData.OrderBy(g => g.CreatedOnDate).Skip((filterModel.Page.Value - 1) * filterModel.Size.Value).Take(filterModel.Size.Value);
                pageNumber = filterModel.Page.Value;
                pageSize = filterModel.Size.Value;
            }

            var result = _mapper.Map<List<CustomerTypeModel>>(iigDepartmentData);

            var pagination = new Pagination()
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPage = (int)Math.Ceiling((decimal)totalCount / pageSize)
            };
            return new PageableData<List<CustomerTypeModel>>(result, pagination, Code.Success, "");
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
            var iigDepartmentData = unitOfWork.Repository<SysCustomerType>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            var result = _mapper.Map<CustomerTypeModel>(iigDepartmentData);
            return new ResponseDataObject<CustomerTypeModel>(result, Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData Update(Guid id, CustomerTypeModel model)
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysCustomerType>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            if (!string.IsNullOrEmpty(model.Code))
                iigDepartmentData.Code = model.Code;
            if (!string.IsNullOrEmpty(model.Name))
                iigDepartmentData.Name = model.Name;

            if (!string.IsNullOrEmpty(model.Description))
                iigDepartmentData.Description = model.Description;

            unitOfWork.Repository<SysCustomerType>().Update(iigDepartmentData);

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