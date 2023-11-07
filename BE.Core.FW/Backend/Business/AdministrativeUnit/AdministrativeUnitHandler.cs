using AutoMapper;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Backend.Model;
using Newtonsoft.Json;
using Serilog;

namespace Backend.Business.AdministrativeUnit
{
    public class AdministrativeUnitHandler : IAdministrativeUnitHandler
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AdministrativeUnitHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public ResponseData Create(AdministrativeUnitModel model)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var existData = GetByCode(model.Code);
                if (existData != null)
                {
                    return new ResponseDataError(Code.NotFound, "Code is exist");
                }
                model.Id = Guid.NewGuid();
                unitOfWork.Repository<SysAdministrativeUnit>().Insert(_mapper.Map<SysAdministrativeUnit>(model));
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
                var existData = unitOfWork.Repository<SysAdministrativeUnit>().GetById(id);
                if (existData == null)
                {
                    return new ResponseDataError(Code.NotFound, "Id not found");
                }
                unitOfWork.Repository<SysAdministrativeUnit>().Delete(existData);
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
                var filterModel = JsonConvert.DeserializeObject<AdministrativeUnitFilterModel>(filter);
                if (filterModel == null)
                    return new ResponseDataError(Code.BadRequest, "Filter invalid");
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var result = (from administrativeUnit in unitOfWork.Repository<SysAdministrativeUnit>().dbSet
                              where (string.IsNullOrEmpty(filterModel.textSearch) || administrativeUnit.Name.ToLower().Contains(filterModel.textSearch.Trim().ToLower()))
                              && (filterModel.ParentId==null || administrativeUnit.ParentId==filterModel.ParentId)
                              select new AdministrativeUnitModel()
                              {
                                  Id= administrativeUnit.Id,
                                  Code = administrativeUnit.Code,
                                  Name = administrativeUnit.Name,
                                  Level=administrativeUnit.Level,
                                  CreatedOnDate = administrativeUnit.CreatedOnDate
                              })?.OrderByDescending(g => g.CreatedOnDate).Skip((filterModel.pageNumber - 1) * filterModel.pageSize).Take(filterModel.pageSize).ToList() ?? new List<AdministrativeUnitModel>();

                int countTotal = unitOfWork.Repository<SysAdministrativeUnit>().GetQueryable(
                    g => string.IsNullOrEmpty(filterModel.textSearch) || g.Name.ToLower().Contains(filterModel.textSearch.Trim().ToLower())
                    )?.Count() ?? 0;
                int totalPage = filterModel.pageSize != 0 ? (int)Math.Ceiling((decimal)countTotal / filterModel.pageSize) : 1;
                var pagination = new Pagination(filterModel.pageNumber, filterModel.pageSize, countTotal, totalPage);
                return new PageableData<List<AdministrativeUnitModel>>(result, pagination, Code.Success, "");
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
                var data = unitOfWork.Repository<SysAdministrativeUnit>().GetById(id);
                if (data == null)
                {
                    return new ResponseDataError(Code.NotFound, "Id not found");
                }
                var result = _mapper.Map<AdministrativeUnitModel>(data);
                return new ResponseDataObject<AdministrativeUnitModel>(result, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }
        private SysAdministrativeUnit GetByCode(string code)
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var result = unitOfWork.Repository<SysAdministrativeUnit>().Get(x => x.Code == code).FirstOrDefault();
            return result;
        }

        public ResponseData GetByParentId(Guid parentId)
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var data = unitOfWork.Repository<SysAdministrativeUnit>().Get(x=>(parentId==Guid.Empty && x.ParentId==null) || x.ParentId==parentId).ToList();
                var result = _mapper.Map<List<AdministrativeUnitModel>>(data);
                return new ResponseDataObject<List<AdministrativeUnitModel>>(result, Code.Success, "");
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
                var root = unitOfWork.Repository<SysAdministrativeUnit>().Get();
                if (root == null)
                {
                    return new ResponseDataError(Code.NotFound, "Not found");
                }
                var result = RecursiveAdministrativeUnit(root?.ToList() ?? new List<SysAdministrativeUnit>(), null);
                return new ResponseDataObject<List<AdministrativeUnitTreeModel>>(result, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }
        private List<AdministrativeUnitTreeModel> RecursiveAdministrativeUnit(List<SysAdministrativeUnit> inputAdministrativeUnit, Guid? parentId)
        {
            List<AdministrativeUnitTreeModel> administrativeUnits = new List<AdministrativeUnitTreeModel>();
            if (!parentId.HasValue)
            {
                foreach (var administrativeUnit in inputAdministrativeUnit)
                {
                    if (!administrativeUnit.ParentId.HasValue || (administrativeUnit.ParentId.HasValue && administrativeUnit.ParentId.Value == Guid.Empty))
                    {
                        var convertAdministrativeUnit = new AdministrativeUnitTreeModel()
                        {
                            Title = administrativeUnit.Name,
                            Value = administrativeUnit.Id.ToString(),
                            Key = administrativeUnit.Id.ToString(),
                        };
                        convertAdministrativeUnit.Children = RecursiveAdministrativeUnit(inputAdministrativeUnit, administrativeUnit.Id);
                        administrativeUnits.Add(convertAdministrativeUnit);
                    }
                }
            }
            else
            {
                foreach (var administrativeUnit in inputAdministrativeUnit)
                {
                    if (administrativeUnit.ParentId == parentId)
                    {
                        var convertAdministrativeUnit = new AdministrativeUnitTreeModel()
                        {
                            Title = administrativeUnit.Name,
                            Value = administrativeUnit.Id.ToString(),
                            Key = administrativeUnit.Id.ToString(),
                        };
                        convertAdministrativeUnit.Children = RecursiveAdministrativeUnit(inputAdministrativeUnit, administrativeUnit.Id);
                        administrativeUnits.Add(convertAdministrativeUnit);
                    }
                }
            }
            return administrativeUnits;
        }

        public ResponseData Update(Guid id, AdministrativeUnitModel model)
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var existData = unitOfWork.Repository<SysAdministrativeUnit>().GetById(id);
                if (existData == null)
                {
                    return new ResponseDataError(Code.NotFound, "Id not found");
                }

                existData.Code = model.Code;
                existData.Name = model.Name;
                existData.ParentId = model.ParentId;
                existData.Description = model.Description;
                if (model.ParentId.HasValue)
                {
                    existData.Level = (unitOfWork.Repository<SysAdministrativeUnit>().GetById(model.ParentId.Value)?.Level ?? 0) + 1;
                }
                unitOfWork.Repository<SysAdministrativeUnit>().Update(existData);

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
}
