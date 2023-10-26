using AutoMapper;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Serilog;
using System.Linq;

namespace Backend.Business.Navigation
{
    public class NavigationHandler : INavigationHandler
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public NavigationHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public ResponseData Create(NavigationModel model)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                if (unitOfWork.Repository<SysNavigation>().Get(x => x.Code == model.Code).FirstOrDefault() != null)
                    return new ResponseDataError(Code.BadRequest, "Code already exists");
                model.Id = Guid.NewGuid();
                if (!string.IsNullOrEmpty(model.Resource))
                    model.Resource += ";";
                unitOfWork.Repository<SysNavigation>().Insert(_mapper.Map<SysNavigation>(model));
                if (model.ParentId.HasValue)
                {
                    var parentNav = unitOfWork.Repository<SysNavigation>().GetById(model.ParentId.Value);
                    if (parentNav != null)
                    {
                        parentNav.HasChild = true;
                        parentNav.Resource += model.Resource;
                        unitOfWork.Repository<SysNavigation>().Update(parentNav);
                    }
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

        public ResponseData Delete(Guid id)
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var childNav = unitOfWork.Repository<SysNavigation>().Get(x => x.ParentId == id);
                if (childNav?.Count() != 0)
                    return new ResponseDataError(Code.BadRequest, "Id in use");
                var existNav = unitOfWork.Repository<SysNavigation>().GetById(id);
                if (existNav == null)
                    return new ResponseDataError(Code.NotFound, "Id not found");
                unitOfWork.Repository<SysNavigation>().Delete(existNav);
                if (existNav.ParentId.HasValue)
                {
                    var parentNav = unitOfWork.Repository<SysNavigation>().GetById(existNav.ParentId.Value);
                    if (parentNav != null)
                    {
                        if (!string.IsNullOrEmpty(parentNav.Resource))
                        {
                            string newResource = "";
                            foreach (var item in parentNav.Resource.Split(';'))
                            {
                                if (existNav.Resource != item)
                                {
                                    newResource += item + ";";
                                }
                            }
                            parentNav.Resource = newResource;
                        }
                    }
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

        public ResponseData DeleteMany(List<string> ids)
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var existNavs = unitOfWork.Repository<SysNavigation>().Get(x => ids.Contains(x.Id.ToString()));
                if (existNavs.Count() > 0)
                {
                    foreach (var item in existNavs)
                    {
                        unitOfWork.Repository<SysNavigation>().Delete(item);
                    }
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

        public async Task<ResponseData> Get()
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var data = unitOfWork.Repository<SysNavigation>().Get();
                var result = new List<NavigationModel>();
                foreach (var item in data)
                {
                    result.Add(BuildMenu(item));
                }
                return new ResponseDataObject<List<NavigationModel>>(result.Where(p => string.IsNullOrEmpty(p.ParentId.ToString())).ToList(), Code.Success, "");
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
                var existData = unitOfWork.Repository<SysNavigation>().GetById(id);
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");
                var result = BuildMenu(existData);
                return new ResponseDataObject<NavigationModel>(result, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData Update(Guid id, NavigationModel model)
        {
            try
            {
                using var unitOfWork = new UnitOfWork(_httpContextAccessor);
                var existNav = unitOfWork.Repository<SysNavigation>().GetById(id);
                if (existNav == null)
                    return new ResponseDataError(Code.NotFound, "Id not found");
                if (model.Code != existNav.Code)
                    return new ResponseDataError(Code.BadRequest, "Code cannot be changed");
                existNav.IconClass = model.IconClass;
                existNav.Name = model.Name;
                existNav.Order = model.Order;
                existNav.Url = model.Url;
                existNav.IsShow = model.IsShow;
                if (existNav.ParentId.HasValue)
                {
                    var parentNav = unitOfWork.Repository<SysNavigation>().GetById(existNav.ParentId.Value);
                    if (parentNav != null)
                    {
                        if (!string.IsNullOrEmpty(parentNav.Resource))
                        {
                            string newResource = "";
                            foreach (var item in parentNav.Resource.Split(';'))
                            {
                                if (existNav.Resource != item)
                                {
                                    newResource += item + ";";
                                }
                            }
                            parentNav.Resource = newResource;
                        }
                    }
                }
                if (model.ParentId.HasValue)
                {
                    if (!string.IsNullOrEmpty(model.Resource))
                        model.Resource += ";";
                    existNav.Resource = model.Resource;

                    existNav.ParentId = model.ParentId;
                    var parentNav = unitOfWork.Repository<SysNavigation>().GetById(model.ParentId.Value);
                    if (parentNav != null)
                    {
                        parentNav.HasChild = true;
                        parentNav.Resource += model.Resource + ";";
                        unitOfWork.Repository<SysNavigation>().Update(parentNav);
                    }
                }
                unitOfWork.Repository<SysNavigation>().Update(existNav);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        private NavigationModel BuildMenu(SysNavigation navigation)
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);

            NavigationModel result = _mapper.Map<NavigationModel>(navigation);
            var children = unitOfWork.Repository<SysNavigation>().Get(x => x.ParentId == navigation.Id);
            if (children.Any())
            {
                children = children.OrderBy(p => p.Order);
                foreach (var item in children)
                {
                    result.Children.Add(BuildMenu(item));
                }
            }
            return result;
        }
    }
}
