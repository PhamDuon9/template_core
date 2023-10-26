using AutoMapper;
using Backend.Business.Policy;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using DocumentFormat.OpenXml.Office2010.Excel;
using Serilog;
using Shared.Caching.Interface;
using System.Reflection.Metadata;

namespace Backend.Business.Policy
{
    public class PolicyHandler : IPolicyHandler
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICached _cached;

        public PolicyHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor, ICached cached)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _cached = cached;
        }

        public ResponseData Create(PolicyModel model)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                model.Id = Guid.NewGuid();
                unitOfWork.Repository<SysPolicy>().Insert(_mapper.Map<SysPolicy>(model));
                unitOfWork.Save();
                return new ResponseData(Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData CreateOrUpdate(PolicyModel model)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                string keyCache = $"{nameof(Backend.Business.User.UserLoginInfo)}";
                _cached.FlushNameSpace(keyCache);
                if (model.Id != Guid.Empty)
                {
                    var exist = unitOfWork.Repository<SysPolicy>().GetById(model.Id);
                    if (exist != null)
                    {
                        exist.Permission = model.Permission;
                        unitOfWork.Repository<SysPolicy>().Update(exist);
                        unitOfWork.Save();
                        return new ResponseData(Code.Success, "Upsert success");
                    }
                }
                model.Id = Guid.NewGuid();
                unitOfWork.Repository<SysPolicy>().Insert(_mapper.Map<SysPolicy>(model));
                unitOfWork.Save();
                return new ResponseData(Code.Success, "Upsert success");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData BulkCreate(List<PolicyModel> model)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                List<SysPolicy> entity = new List<SysPolicy>();

                foreach (var item in model)
                {
                    entity.Add(
                        new SysPolicy
                        {
                            Id = Guid.NewGuid(),
                            LayoutCode = item.LayoutCode,
                            RoleId = item.RoleId,
                            Permission = item.Permission,
                        });
                }

                unitOfWork.Repository<SysPolicy>().InsertRange(entity);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "Bulk Insert success");
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
                var existPolicy = unitOfWork.Repository<SysPolicy>().GetById(id);
                if (existPolicy == null)
                    return new ResponseDataError(Code.NotFound, "Id not found");
                unitOfWork.Repository<SysPolicy>().Delete(existPolicy);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "delete success");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData Get()
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var data = unitOfWork.Repository<SysPolicy>().Get();
                var result = new List<PolicyModel>();
                if (data != null)
                {
                    result = _mapper.Map<List<PolicyModel>>(data);

                }
                return new ResponseDataObject<List<PolicyModel>>(result, Code.Success, "");
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
                var existData = unitOfWork.Repository<SysPolicy>().GetById(id);
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");
                var result = _mapper.Map<PolicyModel>(existData);
                return new ResponseDataObject<PolicyModel>(result, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData Update(Guid id, PolicyModel model)
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var existPolicy = unitOfWork.Repository<SysPolicy>().GetById(id);
                if (existPolicy == null)
                    return new ResponseDataError(Code.NotFound, "Id not found");

                existPolicy.Permission = model.Permission;

                unitOfWork.Repository<SysPolicy>().Update(existPolicy);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "update success");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData GetByRoleId(Guid roleId)
        {
            try
            {
                var result = GetPolicyByRole(roleId);
                return new ResponseDataObject<List<PolicyModel>>(result, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public List<PolicyModel> GetPolicyByRole(Guid roleId)
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var data = unitOfWork.Repository<SysPolicy>().Get(g => g.RoleId == roleId);
            var result = new List<PolicyModel>();
            if (data != null)
            {
                result = _mapper.Map<List<PolicyModel>>(data);

            }
            return result;
        }

        /// <summary>
        /// Clone permission từ role nào sang role nào
        /// </summary>
        /// <param name="fromRoleId">lấy quyền trong role này</param>
        /// <param name="toRoleId">clone sang role này</param>
        /// <returns></returns>
        public ResponseData CloneFromRole(Guid fromRoleId, Guid toRoleId)
        {
            try
            {
                var queryData = GetPolicyByRole(fromRoleId);

                if (queryData != null && queryData.Count() > 0)
                {
                    queryData.ForEach(g =>
                    {
                        g.RoleId = toRoleId;
                        g.Id = Guid.NewGuid();
                    });
                    var response = BulkCreate(queryData);
                    return response;
                }
                return new ResponseData(Code.NotFound, "Không có danh sách quyền");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }
    }
}
