using AutoMapper;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Backend.Model;
using Serilog;

namespace Backend.Business.Role
{
    public class RoleHandler : IRoleHandler
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private static readonly string apiBasicUriCatalog = Backend.Infrastructure.Utils.Utils.GetConfig("Catalog");

        public RoleHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public ResponseData Create(RoleModel model)
        {
            try
            {
                model.Name = model.Name.Trim();
                model.Code = model.Code.Trim();
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var existRole = unitOfWork.Repository<SysRole>().Get(g => g.Code.ToLower() == model.Code.ToLower());
                if (existRole != null && existRole.Count() > 0)
                    return new ResponseDataError(Code.NotFound, "Mã vai trò đã tồn tại");
                model.CreatedOnDate = DateTime.Now;
                model.LastModifiedOnDate = DateTime.Now;
                unitOfWork.Repository<SysRole>().Insert(_mapper.Map<SysRole>(model));
                unitOfWork.Save();
                return new ResponseDataObject<RoleModel>(model, Code.Success, "Tạo thành công");
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
                var existRole = unitOfWork.Repository<SysRole>().GetById(id);
                if (existRole == null)
                    return new ResponseDataError(Code.NotFound, "Id not found");

                var existPermissionByRole = unitOfWork.Repository<SysPolicy>().Get(g => g.RoleId == id);
                foreach (var item in existPermissionByRole)
                {
                    unitOfWork.Repository<SysPolicy>().Delete(item);
                }
                unitOfWork.Repository<SysRole>().Delete(existRole);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "Delete success");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData Get(string? name, int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var data = (from role in unitOfWork.Repository<SysRole>().dbSet
                            where (!string.IsNullOrEmpty(name) && role.Name.ToLower().Contains(name.ToLower())) || string.IsNullOrEmpty(name)
                            select role
                           ).Skip((pageIndex - 1) * pageSize).Take(pageSize);

                int countTotal = (from role in unitOfWork.Repository<SysRole>().dbSet
                                  where (!string.IsNullOrEmpty(name) && role.Name.ToLower().Contains(name.ToLower())) || string.IsNullOrEmpty(name)
                                  select role
                           ).Count();
                var result = new List<RoleModel>();
                if (data != null && data.Count() > 0)
                {
                    result = _mapper.Map<List<RoleModel>>(data);
                }

                int totalPage = (int)Math.Ceiling((decimal)countTotal / pageSize);
                var pagination = new Pagination(pageIndex, pageSize, countTotal, totalPage);
                return new PageableData<List<RoleModel>>(result, pagination, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData GetCombobox()
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var result = (from role in unitOfWork.Repository<SysRole>().dbSet
                              select new ValueType()
                              {
                                  Label = role.Name,
                                  Value = role.Id.ToString().ToLower(),
                              })?.ToList() ?? new List<ValueType>();


                return new ResponseDataObject<List<ValueType>>(result, Code.Success, "");
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
                var existData = unitOfWork.Repository<SysRole>().GetById(id);
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");
                var result = _mapper.Map<RoleModel>(existData);
                return new ResponseDataObject<RoleModel>(result, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData Update(Guid id, RoleModel model)
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var existRole = unitOfWork.Repository<SysRole>().GetById(id);
                if (existRole == null)
                    return new ResponseDataError(Code.NotFound, "Id not found");

                existRole.Name = model.Name;
                existRole.Description = model.Description;
                existRole.LastModifiedOnDate = DateTime.Now;
                unitOfWork.Repository<SysRole>().Update(existRole);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "update success");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        /// <summary>
        /// Cây đơn vị địa điểm thi theo khu vực
        /// </summary>
        /// <param name="IsTopik">Địa điểm thi của bài topik</param>
        /// <param name="isShow">Cho phép hiển thị hay không</param>
        /// <returns></returns>
        public async Task<ResponseData> TreeView(bool? isTopik, bool? isShow, string accessToken)
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                List<TreeView> result = new List<TreeView>();
                var response = await HttpHelper.Get<ResponseDataObject<List<TreeView>>>(apiBasicUriCatalog, $"Area/treeview?topik={isTopik}&isShow={isShow}", accessToken);
                if (response != null && response.Code == Code.Success && response.Data != null && response.Data.Count() > 0)
                {
                    result = response.Data;
                }
                return new ResponseDataObject<List<TreeView>>(result, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }


        public ResponseData AssignAccessData(Guid id, RoleModel model)
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var existRole = unitOfWork.Repository<SysRole>().GetById(id);
                if (existRole == null)
                    return new ResponseDataError(Code.NotFound, "Id not found");

                existRole.AccessDataHeaderQuater = model.AccessDataHeaderQuater;
                existRole.LastModifiedOnDate = DateTime.Now;
                unitOfWork.Repository<SysRole>().Update(existRole);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "update success");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }


    }
}
