using AutoMapper;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Backend.Model;
using Newtonsoft.Json;
using Serilog;

namespace Backend.Business.Branch;

public class BranchHandler : IBranchHandler
{
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public BranchHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    public ResponseData Create(BranchModel model)
    {
        try
        {
            using UnitOfWork unitOfWork = new(_httpContextAccessor);
            model.Id = Guid.NewGuid();

            unitOfWork.Repository<SysBranch>().Insert(_mapper.Map<SysBranch>(model));
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
            var iigDepartmentData = unitOfWork.Repository<SysBranch>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            unitOfWork.Repository<SysBranch>().Delete(iigDepartmentData);
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
            var Departments = unitOfWork.Repository<SysBranch>().Get(x => ids.Contains(x.Id.ToString()));
            foreach (var item in Departments)
            {
                unitOfWork.Repository<SysBranch>().Delete(item);
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
            var filterModel = JsonConvert.DeserializeObject<BranchFilterModel>(filter);
            if (filterModel == null)
                return new ResponseDataError(Code.BadRequest, "Filter invalid");
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var data = unitOfWork.Repository<SysBranch>().Get();
            if (!string.IsNullOrEmpty(filterModel.textSearch))
                data = data.Where(x => x.Name.ToLower().Contains(filterModel.textSearch.ToLower()));
            var totalCount = data.Count();
            if (filterModel.pageNumber != 0 && filterModel.pageSize != 0)
            {
                data = data.OrderBy(g => g.CreatedOnDate).Skip((filterModel.pageNumber - 1) * filterModel.pageSize).Take(filterModel.pageSize);
            }

            var result = _mapper.Map<List<BranchModel>>(data);

            var pagination = new Pagination()
            {
                PageNumber = filterModel.pageNumber,
                PageSize = filterModel.pageSize,
                TotalCount = totalCount,
                TotalPage = filterModel.pageSize != 0 ? (int)Math.Ceiling((decimal)totalCount / filterModel.pageSize) : 1
            };

            //var result = (from branch in unitOfWork.Repository<SysBranch>().dbSet
            //              where string.IsNullOrEmpty(filterModel.textSearch) || branch.Name.ToLower().Contains(filterModel.textSearch.Trim().ToLower())
            //              select new BranchModel()
            //              {
            //                  Code = branch.Code,
            //                  Name = branch.Name,
            //                  Description = branch.Description,
            //                  CreatedOnDate = branch.CreatedOnDate
            //              }).OrderByDescending(g => g.CreatedOnDate).Skip((filterModel.pageNumber - 1) * filterModel.pageSize).Take(filterModel.pageSize).ToList() ?? new List<BranchModel>();

            //int countTotal = unitOfWork.Repository<SysBranch>().GetQueryable(
            //    g => string.IsNullOrEmpty(filterModel.textSearch) || g.Name.ToLower().Contains(filterModel.textSearch.Trim().ToLower())
            //    )?.Count() ?? 0;
            //int totalPage = filterModel.pageSize != 0 ? (int)Math.Ceiling((decimal)countTotal / filterModel.pageSize) : 1;
            //var pagination = new Pagination(filterModel.pageNumber, filterModel.pageSize, countTotal, totalPage);
            return new PageableData<List<BranchModel>>(result, pagination, Code.Success, "");
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
            var iigDepartmentData = unitOfWork.Repository<SysBranch>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            var result = _mapper.Map<BranchModel>(iigDepartmentData);
            return new ResponseDataObject<BranchModel>(result, Code.Success, "");
        }
        catch (Exception exception)
        {
            Log.Error(exception, exception.Message);
            return new ResponseDataError(Code.ServerError, exception.Message);
        }
    }

    public ResponseData Update(Guid id, BranchModel model)
    {
        try
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var iigDepartmentData = unitOfWork.Repository<SysBranch>().GetById(id);
            if (iigDepartmentData == null)
            {
                return new ResponseDataError(Code.NotFound, "Id not found");
            }
            iigDepartmentData.Code = model.Code;
            iigDepartmentData.Name = model.Name;
            iigDepartmentData.Description = model.Description;

            unitOfWork.Repository<SysBranch>().Update(iigDepartmentData);

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