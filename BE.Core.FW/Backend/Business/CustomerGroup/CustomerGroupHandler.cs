using AutoMapper;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Backend.Model;
using Newtonsoft.Json;
using Serilog;

namespace Backend.Business.CustomerGroup;

public class CustomerGroupHandler : ICustomerGroupHandler
{
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CustomerGroupHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    public ResponseData Create(CustomerGroupModel model)
    {
        try
        {
            using UnitOfWork unitOfWork = new(_httpContextAccessor);
            model.Id = Guid.NewGuid();

            unitOfWork.Repository<SysCustomerGroup>().Insert(_mapper.Map<SysCustomerGroup>(model));
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
            var existData = unitOfWork.Repository<SysCustomerGroup>().GetById(id);
            if (existData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            unitOfWork.Repository<SysCustomerGroup>().Delete(existData);
            unitOfWork.Save();
            return new ResponseData(Code.Success, "Xóa thành công");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }
    public ResponseData DeleteMany(List<string> ids)
    {
        try
        {
            using UnitOfWork unitOfWork = new(_httpContextAccessor);
            var listExistData = unitOfWork.Repository<SysCustomerGroup>().Get(x => ids.Contains(x.Id.ToString()));
            foreach (var item in listExistData)
            {
                unitOfWork.Repository<SysCustomerGroup>().Delete(item);
            }
            unitOfWork.Save();
            return new ResponseData(Code.Success, "");
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
            var filterModel = JsonConvert.DeserializeObject<CustormerGroupFilterModel>(filter);
            if (filterModel == null)
                return new ResponseDataError(Code.BadRequest, "Filter invalid");
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);

            var data = unitOfWork.Repository<SysCustomerGroup>().Get();
            if (!string.IsNullOrEmpty(filterModel.textSearch))
                data = data.Where(x => x.Name.ToLower().Contains(filterModel.textSearch.ToLower()));
            var totalCount = data.Count();
            if (filterModel.pageNumber != 0 && filterModel.pageSize != 0)
            {
                data = data.OrderBy(g => g.CreatedOnDate).Skip((filterModel.pageNumber - 1) * filterModel.pageSize).Take(filterModel.pageSize);
            }

            var result = _mapper.Map<List<CustomerGroupModel>>(data);

            var pagination = new Pagination()
            {
                PageNumber = filterModel.pageNumber,
                PageSize = filterModel.pageSize,
                TotalCount = totalCount,
                TotalPage = filterModel.pageSize != 0 ? (int)Math.Ceiling((decimal)totalCount / filterModel.pageSize) : 1
            };
            //var result = (from customerGroup in unitOfWork.Repository<SysCustomerGroup>().dbSet
            //              where string.IsNullOrEmpty(filterModel.textSearch) || customerGroup.Name.ToLower().Contains(filterModel.textSearch.Trim().ToLower())
            //              select new CustomerGroupModel()
            //              {
            //                  Code = customerGroup.Code,
            //                  Name = customerGroup.Name,
            //                  Description = customerGroup.Description,
            //                  CreatedOnDate= customerGroup.CreatedOnDate
            //              })?.OrderByDescending(g => g.CreatedOnDate).Skip((filterModel.pageNumber - 1) * filterModel.pageSize).Take(filterModel.pageSize).ToList() ?? new List<CustomerGroupModel>();

            //int countTotal = unitOfWork.Repository<CustomerGroupModel>().GetQueryable(
            //    g => string.IsNullOrEmpty(filterModel.textSearch) || g.Name.ToLower().Contains(filterModel.textSearch.Trim().ToLower())
            //    )?.Count() ?? 0;
            //int totalPage = filterModel.pageSize != 0 ? (int)Math.Ceiling((decimal)countTotal / filterModel.pageSize) : 1;
            //var pagination = new Pagination(filterModel.pageNumber, filterModel.pageSize, countTotal, totalPage);
            return new PageableData<List<CustomerGroupModel>>(result, pagination, Code.Success, "");
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
            var iigDepartmentData = unitOfWork.Repository<SysCustomerGroup>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            var result = _mapper.Map<CustomerGroupModel>(iigDepartmentData);
            return new ResponseDataObject<CustomerGroupModel>(result, Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData Update(Guid id, CustomerGroupModel model)
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var existData = unitOfWork.Repository<SysCustomerGroup>().GetById(id);
            if (existData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            existData.Code = model.Code;
            existData.Name = model.Name;
            existData.Description = model.Description;
            unitOfWork.Repository<SysCustomerGroup>().Update(existData);

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