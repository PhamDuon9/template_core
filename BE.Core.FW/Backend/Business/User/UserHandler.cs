using AutoMapper;
using Backend.Business.Policy;
using Backend.Business.Role;
using Backend.Infrastructure.Common.Interfaces;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Middleware;
using Backend.Infrastructure.Utils;
using Backend.Model;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.VariantTypes;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
//using Microsoft.Office.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Org.BouncyCastle.Ocsp;
using Serilog;
using Shared.Caching.Interface;
using System;
using System.Dynamic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.AccessControl;
using System.Security.Claims;
using System.Text;
using static Backend.Infrastructure.Utils.Constant;

namespace Backend.Business.User
{
    public class UserHandler : IUserHandler
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICached _cached;

        private readonly string _wso2uri = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:Admin:Uri");
        private readonly string _username = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:Admin:Username");
        private readonly string _password = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:Admin:Password");
        private readonly string _tenant = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:Tenants:iig");
        // private static readonly string apiBasicUriCatalog = Backend.Infrastructure.Utils.Utils.GetConfig("Catalog");

        public UserHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor, ICached cached)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _cached = cached;
        }

        public ResponseData Create(UserModel model)
        {
            try
            {
                model.Username = model.Username.Trim().ToLower();
                model.Fullname = model.Fullname.Trim();
                model.Email = model.Email.Trim();
                model.IsLocked = false;

                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                if (unitOfWork.Repository<SysUser>().FirstOrDefault(x => x.Username.ToLower() == model.Username.ToLower()) != null)
                    return new ResponseDataError(Code.BadRequest, "Username already exists");
                if (unitOfWork.Repository<SysUser>().FirstOrDefault(x => x.Email.ToLower() == model.Email.ToLower()) != null)
                    return new ResponseDataError(Code.BadRequest, "Email already exists");

                // insert db
                model.Id = Guid.NewGuid();
                var user = _mapper.Map<SysUser>(model);
                user.SyncId = Guid.Empty;

                unitOfWork.Repository<SysUser>().Insert(user);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "");
                //#region wso2
                //var handler = new HttpClientHandler
                //{
                //    ClientCertificateOptions = ClientCertificateOption.Manual,
                //    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) =>
                //    {
                //        return true;
                //    }
                //};
                //var httpClient = new HttpClient(handler);
                //string endPoint = new(_wso2uri + _tenant + "/scim2/Users");
                //httpClient.DefaultRequestHeaders.Add("Accept", "application/scim+json");
                //httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(_username + ":" + _password)));

                //var wso2UserObj = new Dictionary<string, object>()
                //{
                //    { "Schemas",new string[] {"urn:ietf:params:scim:schemas:core:2.0:User","urn:ietf:params:scim:schemas:extension:enterprise:2.0:User","urn:scim:wso2:schema"}},
                //    {"UserName",model.Username },
                //    {"Password","12345678" },
                //    {"Active",true },
                //    {"Emails", new List<dynamic>() {
                //            //new
                //            //{
                //            //    Type = "work",
                //            //    Value = model.Email,
                //            //    Primary = true
                //            //},
                //            //new
                //            //{
                //            //    Type = "home",
                //            //    Value = model.Email,
                //            //},
                //             model.Email } },
                //    {"Meta",new
                //    {
                //        ResourceType = "User"
                //    } },
                //    {"Name",new
                //    {
                //        GivenName = givenName,// tên
                //        FamilyName = familyName,//họ
                //        Formatted = model.Fullname,
                //    } },
                //    //{"PhoneNumbers", new List<dynamic>()
                //    //{
                //    //    new {
                //    //        Type= "mobile",
                //    //        Value= model.Phone
                //    //        }
                //    //} },
                //    //{"urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",new
                //    //{
                //    //    Country = "Vietnam",
                //    //    DateOfBirth= model.DOB.ToString("yyyy-MM-dd")
                //    //}},
                //    {"Roles",new List<ExpandoObject>() },
                //};

                //var json = JsonConvert.SerializeObject(wso2UserObj, new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() });
                //var data = new StringContent(json, Encoding.UTF8, "application/scim+json");
                //HttpResponseMessage response = httpClient.PostAsync(endPoint, data).Result;
                //#endregion
                //if ((int)response.StatusCode == StatusCodes.Status201Created)
                //{
                //    var resp = response.Content.ReadAsStringAsync().Result;
                //    dynamic? respData = JsonConvert.DeserializeObject<ExpandoObject>(resp);
                //    if (!((IDictionary<String, object>)respData!).ContainsKey("Id"))
                //    {
                //        // insert db
                //        model.Id = Guid.NewGuid();
                //        var user = _mapper.Map<SysUser>(model);
                //        user.SyncId = Guid.Parse((string)respData!.id);

                //        unitOfWork.Repository<SysUser>().Insert(user);
                //        unitOfWork.Save();
                //        return new ResponseData(Code.Success, "");
                //    }
                //}
                //return new ResponseDataError(Code.BadRequest, "Syn WSO2 fail");
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
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var user = unitOfWork.Repository<SysUser>().FirstOrDefault(x => x.Id == id);
                if (user == null)
                    return new ResponseDataError(Code.BadRequest, "User not found");
                string keyCache = $"{nameof(UserLoginInfo)}:{user.SyncId}";
                var checkKeyExist = _cached.CheckKeyExist(keyCache);
                if (checkKeyExist)
                {
                    _cached.Remove(keyCache);
                }
                unitOfWork.Repository<SysUser>().Delete(user);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "");
                //#region wso2
                //var handler = new HttpClientHandler
                //{
                //    ClientCertificateOptions = ClientCertificateOption.Manual,
                //    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) =>
                //    {
                //        return true;
                //    }
                //};
                //var httpClient = new HttpClient(handler);
                //string endPoint = new(_wso2uri + _tenant + $"/scim2/Users/{user.SyncId}");
                //httpClient.DefaultRequestHeaders.Add("Accept", "application/scim+json");
                //httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(_username + ":" + _password)));

                //HttpResponseMessage response = httpClient.DeleteAsync(endPoint).Result;
                //#endregion
                //if ((int)response.StatusCode == StatusCodes.Status204NoContent)
                //{
                //    unitOfWork.Repository<SysUser>().Delete(user);
                //    unitOfWork.Save();
                //    return new ResponseData(Code.Success, "");
                //}


                //return new ResponseData(Code.Success, "");
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
                var users = unitOfWork.Repository<SysUser>().Get(x => ids.Contains(x.Id.ToString()));
                foreach (var item in users)
                {
                    unitOfWork.Repository<SysUser>().Delete(item);
                    string keyCache = $"{nameof(UserLoginInfo)}:{item.SyncId}";
                    var checkKeyExist = _cached.CheckKeyExist(keyCache);
                    if (checkKeyExist)
                    {
                        _cached.Remove(keyCache);
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

        public ResponseData ToggleStatus(Guid id, bool status)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var existData = unitOfWork.Repository<SysUser>().GetById(id);
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");

                string keyCache = $"{nameof(UserLoginInfo)}:{existData.SyncId}";
                var checkKeyExist = _cached.CheckKeyExist(keyCache);
                if (checkKeyExist)
                {
                    _cached.Remove(keyCache);
                }
                // update db
                existData.IsLocked = !status;
                unitOfWork.Repository<SysUser>().Update(existData);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "Thay đổi thành công");
                //// sync wso2
                //#region wso2
                //var handler = new HttpClientHandler
                //{
                //    ClientCertificateOptions = ClientCertificateOption.Manual,
                //    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) =>
                //    {
                //        return true;
                //    }
                //};
                //var httpClient = new HttpClient(handler);
                //string endPoint = new(_wso2uri + _tenant + $"/scim2/Users/{existData.SyncId}");
                //httpClient.DefaultRequestHeaders.Add("Accept", "application/scim+json");
                //httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(_username + ":" + _password)));

                //var wso2UserObj = new Dictionary<string, object>()
                //{
                //    { "Schemas",new string[] {"urn:ietf:params:scim:api:messages:2.0:PatchOp"}},
                //    {"Operations",new List<dynamic>(){
                //        new
                //        {
                //            op = "Replace",
                //            path = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:accountLocked",
                //            value = !status
                //        }
                //    } }
                //};

                ////var json = JsonConvert.SerializeObject(wso2UserObj, new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() });
                //var json = JsonConvert.SerializeObject(wso2UserObj);
                //var data = new StringContent(json, Encoding.UTF8, "application/scim+json");
                //HttpResponseMessage response = httpClient.PatchAsync(endPoint, data).Result;
                //#endregion
                //if ((int)response.StatusCode == StatusCodes.Status200OK)
                //{
                //    // update db
                //    existData.IsDisabled = !status;
                //    unitOfWork.Repository<SysUser>().Update(existData);
                //    unitOfWork.Save();
                //    return new ResponseData(Code.Success, "Thay đổi thành công");
                //}

                //return new ResponseData(Code.BadRequest, "Thay đổi thất bại");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData AsignRole(Guid userId, UserModel model)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var existData = unitOfWork.Repository<SysUser>().GetById(userId);
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");
                // sync wso2
                string keyCache = $"{nameof(UserLoginInfo)}:{existData.SyncId}";
                var checkKeyExist = _cached.CheckKeyExist(keyCache);
                if (checkKeyExist)
                {
                    _cached.Remove(keyCache);
                }
                // update db
                existData.RoleId = model.RoleId.HasValue && model.RoleId.Value != Guid.Empty ? model.RoleId : null;
                unitOfWork.Repository<SysUser>().Update(existData);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "Thay đổi thành công");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public async Task<ResponseData> Get(string? name, string accessToken = "", int pageIndex = 1, int pageSize = 10)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);

                var iigDepartmentQuery = unitOfWork.Repository<SysDepartment>().GetAll();

                var userData = unitOfWork.Repository<SysUser>().GetQueryable(
                    g => string.IsNullOrEmpty(name) || (!string.IsNullOrEmpty(name) && (g.Fullname.ToLower().Contains(name.Trim().ToLower()) || g.Username.ToLower().Contains(name.Trim().ToLower())))
                    ).OrderByDescending(g => g.CreatedOnDate).Skip((pageIndex - 1) * pageSize).Take(pageSize);
                var result = (from user in unitOfWork.Repository<SysUser>().dbSet
                              join role in unitOfWork.Repository<SysRole>().dbSet on user.RoleId equals role.Id into userRoleDefault
                              from userRoleTable in userRoleDefault.DefaultIfEmpty()
                              where string.IsNullOrEmpty(name) || (!string.IsNullOrEmpty(name) && (user.Fullname.ToLower().Contains(name.Trim().ToLower()) || user.Username.ToLower().Contains(name.Trim().ToLower())))
                              select new UserModel()
                              {
                                  Username = user.Username,
                                  Fullname = user.Fullname,
                                  RoleId = user.RoleId,
                                  RoleName = userRoleTable.Name,
                                  IsLocked = user.IsLocked,
                                  Id = user.Id,
                                  DepartmentId = user.DepartmentId,
                                  SyncId = user.SyncId,
                                  CreatedOnDate = user.CreatedOnDate,
                              })?.OrderByDescending(g => g.CreatedOnDate).Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList() ?? new List<UserModel>();

                int countTotal = unitOfWork.Repository<SysUser>().GetQueryable(
                    g => string.IsNullOrEmpty(name) || (!string.IsNullOrEmpty(name) && (g.Fullname.ToLower().Contains(name.Trim().ToLower()) || g.Username.ToLower().Contains(name.Trim().ToLower())))
                    )?.Count() ?? 0;
                int totalPage = (int)Math.Ceiling((decimal)countTotal / pageSize);
                var pagination = new Pagination(pageIndex, pageSize, countTotal, totalPage);
                foreach (var item in result)
                {
                    item.DepartmentName = iigDepartmentQuery.FirstOrDefault(g => g.Id == item.DepartmentId)?.Name;
                }
                return new PageableData<List<UserModel>>(result, pagination, Code.Success, "");
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
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var existData = unitOfWork.Repository<SysUser>().GetById(id);
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");
                var result = _mapper.Map<UserModel>(existData);

                return new ResponseDataObject<UserModel>(result, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }


        public ResponseData GetBySyncId(Guid syncId)
        {
            try
            {
                string keyCache = $"{nameof(UserLoginInfo)}:{syncId}";
                var checkKeyExist = _cached.CheckKeyExist(keyCache);
                if (checkKeyExist)
                {
                    var dataFromRedis = _cached.Get<UserLoginInfo>(keyCache);
                    if (dataFromRedis != null)
                    {
                        return new ResponseDataObject<UserLoginInfo>(dataFromRedis, Code.Success, "Success From Redis");
                    }
                }

                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                //var existData = unitOfWork.Repository<SysUser>().Get(g => g.SyncId == syncId)?.FirstOrDefault();
                var existData = (from user in unitOfWork.Repository<SysUser>().dbSet
                                 join role in unitOfWork.Repository<SysRole>().dbSet on user.RoleId equals role.Id into roleTable
                                 from roleDefault in roleTable.DefaultIfEmpty()
                                 where user.SyncId == syncId
                                 select new UserLoginInfo()
                                 {
                                     Id = user.Id,
                                     RoleId = user.RoleId,
                                     RoleName = roleDefault != null ? roleDefault.Name : "",
                                     SyncId = syncId,
                                     DepartmentId = user.DepartmentId,
                                     Fullname = user.Fullname,
                                     Username = user.Username,
                                     DOB = user.DOB,
                                 })?.FirstOrDefault();
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "SyncId not found");

                var permissions = unitOfWork.Repository<SysPolicy>().Get(g => g.RoleId == existData.RoleId);
                if (permissions != null)
                {
                    existData.Permissions = _mapper.Map<List<PolicyModel>>(permissions);
                }

                var getRole = unitOfWork.Repository<SysRole>().FirstOrDefault(p => p.Id == existData.RoleId);
                existData.AccessDataHeaderQuater = !string.IsNullOrEmpty(getRole?.AccessDataHeaderQuater) ? getRole.AccessDataHeaderQuater.Split(",").Select(p => new Guid(p)).ToList() : new List<Guid>();

                _cached.Add(keyCache, existData, 30);
                return new ResponseDataObject<UserLoginInfo>(existData, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData GetUserInforById(Guid userId)
        {
            try
            {
                string keyCache = $"{nameof(UserLoginInfo)}:{userId}";
                var checkKeyExist = _cached.CheckKeyExist(keyCache);
                if (checkKeyExist)
                {
                    var dataFromRedis = _cached.Get<UserLoginInfo>(keyCache);
                    if (dataFromRedis != null)
                    {
                        return new ResponseDataObject<UserLoginInfo>(dataFromRedis, Code.Success, "Success From Redis");
                    }
                }

                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                //var existData = unitOfWork.Repository<SysUser>().Get(g => g.SyncId == syncId)?.FirstOrDefault();
                var existData = (from user in unitOfWork.Repository<SysUser>().dbSet
                                 join role in unitOfWork.Repository<SysRole>().dbSet on user.RoleId equals role.Id into roleTable
                                 from roleDefault in roleTable.DefaultIfEmpty()
                                 where user.Id == userId
                                 select new UserLoginInfo()
                                 {
                                     Id = user.Id,
                                     RoleId = user.RoleId,
                                     RoleName = roleDefault != null ? roleDefault.Name : "",
                                     SyncId = user.SyncId,
                                     DepartmentId = user.DepartmentId,
                                     Fullname = user.Fullname,
                                     Username = user.Username,
                                     DOB = user.DOB,
                                 })?.FirstOrDefault();
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "SyncId not found");

                var permissions = unitOfWork.Repository<SysPolicy>().Get(g => g.RoleId == existData.RoleId);
                if (permissions != null)
                {
                    existData.Permissions = _mapper.Map<List<PolicyModel>>(permissions);
                }

                var getRole = unitOfWork.Repository<SysRole>().FirstOrDefault(p => p.Id == existData.RoleId);
                existData.AccessDataHeaderQuater = !string.IsNullOrEmpty(getRole?.AccessDataHeaderQuater) ? getRole.AccessDataHeaderQuater.Split(",").Select(p => new Guid(p)).ToList() : new List<Guid>();

                _cached.Add(keyCache, existData, 30);
                return new ResponseDataObject<UserLoginInfo>(existData, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public async Task<bool> HasPermissionAsync(Guid userId, string permissionBit)
        {
            List<SysPolicy> permissions = new List<SysPolicy>();
            string keyCache = $"{nameof(SysPolicy)}:{userId}";
            var checkKeyExist = _cached.CheckKeyExist(keyCache);
            if (checkKeyExist)
            {
                var dataFromRedis = _cached.Get<List<SysPolicy>>(keyCache);
                if (dataFromRedis != null)
                {
                    permissions = dataFromRedis;
                }
            }
            else
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var existData = unitOfWork.Repository<SysUser>().Get(g => g.SyncId == userId)?.FirstOrDefault();

                if (existData == null)
                    return false;

                permissions = unitOfWork.Repository<SysPolicy>().Get(g => g.RoleId == existData.RoleId).ToList();

                _cached.Add(keyCache, permissions, 1440);
            }

            string[] policies = null;
            if (!string.IsNullOrEmpty(permissionBit))
            {
                policies = permissionBit.Split(".");
                string layoutCode = policies[1];
                int action = 0;
                switch (policies[2])
                {
                    case nameof(ActionPermission.View):
                        action = ActionPermission.View;
                        break;
                    case nameof(ActionPermission.Create):
                        action = ActionPermission.Create;
                        break;
                    case nameof(ActionPermission.Edit):
                        action = ActionPermission.View;
                        break;
                    case nameof(ActionPermission.Delete):
                        action = ActionPermission.View;
                        break;
                    default:
                        break;
                }

                bool allowPermission = false;
                foreach (var itemPermission in permissions)
                {
                    int itemPermissionBit = itemPermission.Permission;
                    int bitWise = itemPermissionBit & action;
                    allowPermission = bitWise != 0 && itemPermission.LayoutCode == layoutCode;
                    if (allowPermission)
                        return allowPermission;
                }
                return allowPermission;
            }
            return false;
        }

        public ResponseData Update(Guid id, UserModel model)
        {
            try
            {

                model.Username = model.Username.Trim().ToLower();
                model.Fullname = model.Fullname.Trim();
                model.Email = model.Email.Trim();

                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                if (unitOfWork.Repository<SysUser>().FirstOrDefault(x => x.Id != id && x.Email.ToLower() == model.Email.ToLower()) != null)
                    return new ResponseDataError(Code.BadRequest, "Email đã tồn tại");

                var existUser = unitOfWork.Repository<SysUser>().GetById(id);
                if (existUser == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");

                string keyCache = $"{nameof(UserLoginInfo)}:{existUser.SyncId}";
                var checkKeyExist = _cached.CheckKeyExist(keyCache);
                if (checkKeyExist)
                {
                    _cached.Remove(keyCache);
                }
                // update db
                existUser.DOB = model.DOB;
                existUser.Fullname = model.Fullname;
                existUser.Email = model.Email;
                existUser.Phone = model.Phone;
                existUser.DepartmentId = model.DepartmentId;
                unitOfWork.Repository<SysUser>().Update(existUser);
                unitOfWork.Save();
                return new ResponseData(Code.Success, "Thay đổi thành công");

                //// sync wso2
                //#region wso2
                //var handler = new HttpClientHandler
                //{
                //    ClientCertificateOptions = ClientCertificateOption.Manual,
                //    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) =>
                //    {
                //        return true;
                //    }
                //};
                //var httpClient = new HttpClient(handler);
                //string endPoint = new(_wso2uri + _tenant + $"/scim2/Users/{existUser.SyncId}");
                //httpClient.DefaultRequestHeaders.Add("Accept", "application/scim+json");
                //httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(_username + ":" + _password)));

                //var wso2UserObj = new Dictionary<string, object>()
                //{
                //    { "Schemas",new string[] {"urn:ietf:params:scim:api:messages:2.0:PatchOp"}},
                //    {"Operations",new List<dynamic>(){
                //        new
                //        {
                //            op = "Replace",
                //            //path = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:accountLocked",
                //            value = new Dictionary<string,object>() {
                //                { "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User", new  { verifyEmail= "true" }  },
                //                { "emails", new List<object>()
                //                        {
                //                            new  { primary=true,value=model.Email }
                //                        }
                //                }
                //            }
                //        },
                //         new
                //        {
                //            op = "Replace",
                //            path = "name.familyName",
                //            value =familyName
                //        },
                //        //  new
                //        //{
                //        //    op = "Replace",
                //        //    path = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:dateOfBirth",
                //        //    value =model.DOB.ToString("yyyy-MM-dd")
                //        //},
                //            new
                //        {
                //            op = "Replace",
                //            path = "name.givenName",
                //            value =givenName
                //        },
                //        //       new
                //        //{
                //        //    op = "Replace",
                //        //    path = "phoneNumbers[type eq \"mobile\"].value",
                //        //    value =model.Phone
                //        //}

                //    } }
                //};

                ////var json = JsonConvert.SerializeObject(wso2UserObj, new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() });
                //var json = JsonConvert.SerializeObject(wso2UserObj);
                //var data = new StringContent(json, Encoding.UTF8, "application/scim+json");
                //HttpResponseMessage response = httpClient.PatchAsync(endPoint, data).Result;
                //#endregion
                //if ((int)response.StatusCode == StatusCodes.Status200OK)
                //{
                //    // update db
                //    existUser.DOB = model.DOB;
                //    existUser.Fullname = model.Fullname;
                //    existUser.Email = model.Email;
                //    existUser.Phone = model.Phone;
                //    existUser.IIGDepartmentId = model.IIGDepartmentId;
                //    unitOfWork.Repository<SysUser>().Update(existUser);
                //    unitOfWork.Save();
                //    return new ResponseData(Code.Success, "Thay đổi thành công");
                //}

                //var existMetadata = unitOfWork.Repository<SysUserMetadata>().Get(x => x.UserId == id);
                //foreach (var metadata in model.Metadata)
                //{
                //    var temp = existMetadata.FirstOrDefault(x => x.UserId == id && x.MetadataId == metadata.MetadataId);
                //    if (temp == null)
                //    {
                //        metadata.Id = Guid.NewGuid();
                //        metadata.UserId = model.Id;
                //        unitOfWork.Repository<SysUserMetadata>().Insert(_mapper.Map<SysUserMetadata>(metadata));
                //    }
                //    else
                //    {
                //        temp.Value = metadata.Value;
                //        unitOfWork.Repository<SysUserMetadata>().Update(temp);
                //    }
                //}
                //foreach (var metadata in existMetadata.Where(x => model.Metadata.Select(y => y.MetadataId).Contains(x.MetadataId)))
                //{
                //    unitOfWork.Repository<SysUserMetadata>().Delete(metadata);
                //}


                return new ResponseData(Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData ChangePassword(Guid userId, UserChangePassword model)
        {
            try
            {
                if (model.ConfirmNewPassword != model.ConfirmNewPassword)
                {
                    return new ResponseDataError(Code.BadRequest, "Xác nhận mật khẩu mới chưa khớp!");
                }
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var existUser = unitOfWork.Repository<SysUser>().Get(g => g.Id == userId)?.FirstOrDefault();
                if (existUser == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");

                //#region wso2
                //var handler = new HttpClientHandler
                //{
                //    ClientCertificateOptions = ClientCertificateOption.Manual,
                //    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) =>
                //    {
                //        return true;
                //    }
                //};
                //var httpClient = new HttpClient(handler);
                //string endPoint = new(_wso2uri + _tenant + $"/scim2/Users/{syncId}");
                //httpClient.DefaultRequestHeaders.Add("Accept", "application/scim+json");
                //httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(_username + ":" + _password)));

                //var wso2UserObj = new Dictionary<string, object>()
                //{
                //    { "Schemas",new string[] {"urn:ietf:params:scim:api:messages:2.0:PatchOp"}},
                //    {"Operations",new List<dynamic>(){
                //        new
                //        {
                //            op = "Replace",
                //            path = "password",
                //            value = model.NewPassword
                //        }
                //    } }
                //};

                ////var json = JsonConvert.SerializeObject(wso2UserObj, new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() });
                //var json = JsonConvert.SerializeObject(wso2UserObj);
                //var data = new StringContent(json, Encoding.UTF8, "application/scim+json");
                //HttpResponseMessage response = httpClient.PatchAsync(endPoint, data).Result;
                //#endregion
                //if ((int)response.StatusCode == StatusCodes.Status200OK)
                //{
                //    return new ResponseData(Code.Success, "Thay đổi mật khẩu thành công");
                //}

                return new ResponseData(Code.Success, "Thay đổi mật khẩu thành công");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }
    }
}
