using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Net;
using Backend.Model;
using Serilog;
using DocumentFormat.OpenXml.Office2016.Excel;
using Org.BouncyCastle.Asn1.Ocsp;
using NetCasbin.Rbac;
using System.Security.Claims;
using Backend.Business.User;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
//using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authentication;
using static Backend.Infrastructure.Middleware.CustomAuthenticationHandler;

namespace Backend.Infrastructure.Utils
{
    public static class HttpHelper
    {
        //public static async Task<T> Post<T>(string host, string url, object contentValue)
        //{
        //    using (var client = new HttpClient())
        //    {
        //        client.BaseAddress = new Uri(host);
        //        var content = new StringContent(JsonConvert.SerializeObject(contentValue), Encoding.UTF8, "application/json");
        //        var result = await client.PostAsync(url, content);
        //        result.EnsureSuccessStatusCode();
        //        string resultContentString = await result.Content.ReadAsStringAsync();
        //        T resultContent = JsonConvert.DeserializeObject<T>(resultContentString);
        //        return resultContent;
        //    }
        //}

        public static async Task<T?> Post<T>(string url, object postValue)
        {
            using (var client = new HttpClient())
            {
                try
                {
                    var result = await client.PostAsJsonAsync(url, postValue);
                    result.EnsureSuccessStatusCode();
                    return JsonConvert.DeserializeObject<T>(await result.Content.ReadAsStringAsync());
                }
                catch (System.Exception ex)
                {
                    Log.Error(ex.Message, ex.Message);
                    return default;
                }
            }
        }

        public static async Task Put<T>(string host, string url, T stringValue)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(host);
                var content = new StringContent(JsonConvert.SerializeObject(stringValue), Encoding.UTF8, "application/json");
                var result = await client.PutAsync(url, content);
                result.EnsureSuccessStatusCode();
            }
        }

        public static async Task<T> Get<T>(string host, string url, string accessToken = "", string? tenant = "")
        {
            try
            {
                HttpClientHandler clientHandler = new HttpClientHandler();
                clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
                using (var client = new HttpClient(clientHandler))
                {
                    client.BaseAddress = new Uri(host);
                    if (!string.IsNullOrEmpty(accessToken))
                    {
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    }
                    client.DefaultRequestHeaders.Add("apikey", Utils.GetConfig("ApiKey"));
                    client.DefaultRequestHeaders.Add("Tenant", tenant);
                    var result = await client.GetAsync(url);
                    result.EnsureSuccessStatusCode();
                    string resultContentString = await result.Content.ReadAsStringAsync();
                    Log.Information(host + url + " : " + resultContentString, resultContentString);
                    T resultContent = JsonConvert.DeserializeObject<T>(resultContentString);
                    return resultContent;
                }
            }
            catch (System.Exception ex)
            {
                Log.Error(ex.Message, ex.Message);
                var mes = ex.Message;
                T resultContent = JsonConvert.DeserializeObject<T>("");
                return resultContent;
            }

        }

        public static async Task Delete(string host, string url)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(host);
                var result = await client.DeleteAsync(url);
                result.EnsureSuccessStatusCode();
            }
        }

        public static async Task<bool> GetAuthStatusWSO2(string host, string url, string accessToken = "")
        {
            try
            {
                HttpClientHandler clientHandler = new HttpClientHandler();
                clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

                // Pass the handler to httpclient(from you are calling api)
                using (var client = new HttpClient(clientHandler))
                {
                    client.BaseAddress = new Uri(host);
                    if (!string.IsNullOrEmpty(accessToken))
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    var result = await client.GetAsync(url);
                    string resultContentString = await result.Content.ReadAsStringAsync();
                    if (result.IsSuccessStatusCode && result.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        return true;
                    }
                    return false;
                }
            }
            catch (System.Exception ex)
            {
                return false;
            }

        }
        public static async Task<string> UpdateProfileUser(string host, string url, MultipartFormDataContent stringValue, string accessToken = "")
        {
            try
            {
                HttpClientHandler clientHandler = new HttpClientHandler();
                clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
                using (var client = new HttpClient(clientHandler) { BaseAddress = new Uri(host) })
                {
                    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, url);
                    if (!string.IsNullOrEmpty(accessToken))
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "multipart/form-data");
                    client.DefaultRequestHeaders.Add("Accept", "*/*");
                    var ress = await client.PutAsync(url, stringValue);
                    string resultContent = await ress.Content.ReadAsStringAsync();
                    if (ress.IsSuccessStatusCode)
                    {
                        string resultContentString = await ress.Content.ReadAsStringAsync();
                        var resultContentS = JsonConvert.DeserializeObject<ResponseDataObject<dynamic>>(resultContentString);
                        return resultContentS.Data.ProfileId;
                    }
                }
                return string.Empty;
            }
            catch (System.Exception ex)
            {
                var mes = ex.Message;
                return ex.Message;
            }

        }

        public static string GetAccessFromHeader(HttpRequest request)
        {
            string accessToken = request.Headers["authorization"].ToString();
            accessToken = accessToken.Replace("Bearer", "").Trim();
            return accessToken;
        }

        public static string GetTenantFromHeader(HttpRequest request)
        {
            return request.Headers["Tenant"].ToString();
        }

        public static async Task<Business.User.UserLoginInfo> GetInfoUserLoginAsync(IHttpContextAccessor _httpContextAccessor, string access_token)
        {
            using var unitOfWork = new UnitOfWork(_httpContextAccessor);
            var user = new Business.User.UserLoginInfo();
            string endPoint = Utils.GetConfig("Authentication:WSO2:Admin:Uri") + Utils.GetConfig("Authentication:WSO2:Tenants:iig") + Utils.GetConfig("Authentication:WSO2:API:GetMe");

            var handler = new HttpClientHandler
            {
                ClientCertificateOptions = ClientCertificateOption.Manual,
                ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) =>
                {
                    return true;
                }
            };

            var httpClient = new HttpClient(handler);

            httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + access_token);

            HttpResponseMessage response = await httpClient.GetAsync(endPoint);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                string responseData = await response.Content.ReadAsStringAsync();

                var dataConvert = JsonConvert.DeserializeObject<Root>(responseData);
                var getUser = unitOfWork.Repository<SysUser>().FirstOrDefault(p => p.SyncId.ToString().ToLower() == (dataConvert != null ? dataConvert.basic.httpwso2orgclaimsuserid.ToLower() : string.Empty));
                if (getUser == null)
                    return user;
                user.Fullname = getUser.Fullname;
                user.Email = getUser.Email;
                var getRole = unitOfWork.Repository<SysRole>().FirstOrDefault(p => p.Id == getUser.RoleId);
                if (getRole == null)
                    return user;
                var roles = !string.IsNullOrEmpty(getRole.AccessDataHeaderQuater) ? getRole.AccessDataHeaderQuater.Split(",").Select(p => new Guid(p)).ToList() : new List<Guid>();
                user.AccessDataHeaderQuater = roles;
            }
            return user;
        }
    }
}
