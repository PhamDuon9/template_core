using AutoMapper;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using Serilog;
using System.Dynamic;
using System.Text;
using Backend.Business.User;

namespace Backend.Business.B2BUser
{
    public class B2BUserHandler : IB2BUserHandler
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private readonly string _wso2uri = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:B2B:Uri");
        private readonly string _username = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:B2B:Username");
        private readonly string _password = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:B2B:Password");
        private readonly string _tenant = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:B2B:Tenant");

        public B2BUserHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public ResponseData Create(B2BUserModel model)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                if (unitOfWork.Repository<SysB2BUser>().Get(x => x.Username == model.Username).FirstOrDefault() != null)
                    return new ResponseDataError(Code.BadRequest, "Username already exists");
                #region wso2
                var handler = new HttpClientHandler
                {
                    ClientCertificateOptions = ClientCertificateOption.Manual,
                    ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) =>
                    {
                        return true;
                    }
                };
                var httpClient = new HttpClient(handler);
                string endPoint = new(_wso2uri + "/t/" + _tenant + "/scim2/Users");
                httpClient.DefaultRequestHeaders.Add("Accept", "application/scim+json");
                httpClient.DefaultRequestHeaders.Add("Authorization", "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes(_username + ":" + _password)));
                dynamic wso2UserObj = new ExpandoObject();
                wso2UserObj.Schemas = new List<ExpandoObject>();
                wso2UserObj.UserName = model.Username;
                wso2UserObj.Password = "iigvn2022@";
                wso2UserObj.Name = new ExpandoObject();
                wso2UserObj.Name.GivenName = model.Fullname;
                wso2UserObj.Emails = new List<ExpandoObject>();
                dynamic email = new ExpandoObject();
                email.Type = "work";
                email.Value = model.Email;
                email.Primary = true;
                wso2UserObj.Emails.Add(email);
                var json = JsonConvert.SerializeObject(wso2UserObj, new JsonSerializerSettings() { ContractResolver = new CamelCasePropertyNamesContractResolver() });
                var data = new StringContent(json, Encoding.UTF8, "application/scim+json");
                HttpResponseMessage response = httpClient.PostAsync(endPoint, data).Result;
                #endregion
                if ((int)response.StatusCode != StatusCodes.Status201Created)
                {
                    var resp = response.Content.ReadAsStringAsync().Result;
                    dynamic? respData = JsonConvert.DeserializeObject<ExpandoObject>(resp);
                    if (!((IDictionary<String, object>)respData!).ContainsKey("Id"))
                    {
                        // insert db
                        model.Id = Guid.NewGuid();
                        var user = _mapper.Map<SysB2BUser>(model);
                        user.SyncId = Guid.Parse((string)respData!.id);
                        foreach (var metadata in model.Metadata)
                        {
                            if (unitOfWork.Repository<SysB2BUserMetadata>().FirstOrDefault(x => x.Id == metadata.Id) == null)
                                return new ResponseDataError(Code.BadRequest, "Metadata " + metadata.Id + " is invalid");
                            if (string.IsNullOrEmpty(metadata.Value))
                                return new ResponseDataError(Code.BadRequest, "Metadata " + metadata.Id + " value is null or empty");
                            metadata.Id = Guid.NewGuid();
                            metadata.UserId = model.Id;
                            unitOfWork.Repository<SysB2BUserMetadata>().Insert(_mapper.Map<SysB2BUserMetadata>(metadata));
                        }
                        unitOfWork.Repository<SysB2BUser>().Insert(user);
                        unitOfWork.Save();
                        return new ResponseData(Code.Success, "");
                    }
                }
                return new ResponseDataError(Code.BadRequest, "Syn WSO2 fail");
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

                return new ResponseData(Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData Disable(Guid id)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var existData = unitOfWork.Repository<SysB2BUser>().GetById(id);
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");
                if (existData.IsDisabled)
                    return new ResponseDataError(Code.BadRequest, "User is disabled");
                // sync wso2

                // update db
                existData.IsDisabled = false;
                unitOfWork.Repository<SysB2BUser>().Update(existData);
                return new ResponseData(Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData Enable(Guid id)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var existData = unitOfWork.Repository<SysB2BUser>().GetById(id);
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");
                if (!existData.IsDisabled)
                    return new ResponseDataError(Code.BadRequest, "User is enabled");
                // sync wso2

                // update db
                return new ResponseData(Code.Success, "");
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
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var userData = unitOfWork.Repository<SysB2BUser>().Get();
                var userMetadataData = unitOfWork.Repository<SysB2BUserMetadata>().Get();
                var result = new List<B2BUserModel>();
                foreach (var item in userData)
                {
                    var tempUser = _mapper.Map<B2BUserModel>(item);
                    var tempUserMetadata = userMetadataData.Where(x => x.UserId == item.Id);
                    foreach (var itemMetadata in tempUserMetadata)
                    {
                        tempUser.Metadata.Add(_mapper.Map<B2BUserMetadataModel>(itemMetadata));
                    }
                    result.Add(tempUser);
                }
                return new ResponseDataObject<List<B2BUserModel>>(result, Code.Success, "");
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
                var existData = unitOfWork.Repository<SysB2BUser>().GetById(id);
                if (existData == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");
                var result = _mapper.Map<B2BUserModel>(existData);
                var userMetadataData = unitOfWork.Repository<SysB2BUserMetadata>().Get(x => x.UserId == id);
                var metadata = unitOfWork.Repository<SysMetadata>().Get();
                foreach (var itemMetadata in userMetadataData)
                {
                    var item = _mapper.Map<B2BUserMetadataModel>(itemMetadata);
                    var temp = metadata.FirstOrDefault(x => x.Id == item.MetadataId);
                    if (temp != null)
                    {
                        item.MetadataCode = temp.Code;
                        item.MetadataName = temp.Name;
                    }
                    result.Metadata.Add(item);
                }
                return new ResponseDataObject<B2BUserModel>(result, Code.Success, "");
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }

        public ResponseData Update(Guid id, B2BUserModel model)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var existUser = unitOfWork.Repository<SysB2BUser>().GetById(id);
                if (existUser == null)
                    return new ResponseDataError(Code.BadRequest, "Id not found");

                existUser.DOB = model.DOB;
                existUser.Fullname = model.Fullname;
                existUser.Phone = model.Phone;
                unitOfWork.Repository<SysB2BUser>().Update(existUser);

                var existMetadata = unitOfWork.Repository<SysB2BUserMetadata>().Get(x => x.UserId == id);
                foreach (var metadata in model.Metadata)
                {
                    var temp = existMetadata.FirstOrDefault(x => x.UserId == id && x.MetadataId == metadata.MetadataId);
                    if (temp == null)
                    {
                        metadata.Id = Guid.NewGuid();
                        metadata.UserId = model.Id;
                        unitOfWork.Repository<SysB2BUserMetadata>().Insert(_mapper.Map<SysB2BUserMetadata>(metadata));
                    }
                    else
                    {
                        temp.Value = metadata.Value;
                        unitOfWork.Repository<SysB2BUserMetadata>().Update(temp);
                    }
                }
                foreach (var metadata in existMetadata.Where(x => model.Metadata.Select(y => y.MetadataId).Contains(x.MetadataId)))
                {
                    unitOfWork.Repository<SysB2BUserMetadata>().Delete(metadata);
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
    }
}
