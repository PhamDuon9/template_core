using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using Shared.Core.Utils;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Core.Helper
{
    public class HttpHelper : IHttpHelper
    {
        private HttpClient _client;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public HttpHelper(HttpClient client, IHttpContextAccessor httpContextAccessor)
        {
            _client = client;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<T> GetAsync<T>(string url)
        {
            Dictionary<string, string> lstHeaderParams = new Dictionary<string, string>();
            StringValues token = string.Empty;
            var accessToken = string.Empty;
            StringValues operatingSystem = string.Empty;
            StringValues geoLocation = string.Empty;
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.AUTHORIZATION, out token);
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.OPERATING_SYSTEM, out operatingSystem);
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.GEO_LOCATION, out geoLocation);
            if (!string.IsNullOrEmpty(token))
            {
                accessToken = token.ToString().StartsWith(Constant.RequestHeader.BEARER) ? token.ToString().Substring(7) : token.ToString();
                lstHeaderParams.Add(Constant.RequestHeader.AUTHORIZATION, accessToken);
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.AUTHORIZATION, accessToken);
            }
            if (!string.IsNullOrEmpty(operatingSystem))
            {
                lstHeaderParams.Add(Constant.RequestHeader.OPERATING_SYSTEM, operatingSystem.ToString());
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.OPERATING_SYSTEM, operatingSystem.ToString());
            }
            if (!string.IsNullOrEmpty(geoLocation))
            {
                lstHeaderParams.Add(Constant.RequestHeader.GEO_LOCATION, geoLocation.ToString());
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.GEO_LOCATION, geoLocation.ToString());
            }
            var response = await _client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                return NewtonJson.Deserialize<T>(content);
            }
            else
            {
                return default;
            }
        }

        public async Task<T> GetAsync<T>(string url, string accessToken)
        {
            Dictionary<string, string> lstHeaderParams = new Dictionary<string, string>();
            //StringValues token = string.Empty;
            //var accessToken = string.Empty;
            StringValues operatingSystem = string.Empty;
            StringValues geoLocation = string.Empty;
            //_httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.AUTHORIZATION, out token);
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.OPERATING_SYSTEM, out operatingSystem);
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.GEO_LOCATION, out geoLocation);
            if (!string.IsNullOrEmpty(accessToken))
            {
                accessToken = accessToken.ToString().StartsWith(Constant.RequestHeader.BEARER) ? accessToken.ToString().Substring(7) : accessToken.ToString();
                lstHeaderParams.Add(Constant.RequestHeader.AUTHORIZATION, accessToken);
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.AUTHORIZATION, accessToken);
            }
            if (!string.IsNullOrEmpty(operatingSystem))
            {
                lstHeaderParams.Add(Constant.RequestHeader.OPERATING_SYSTEM, operatingSystem.ToString());
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.OPERATING_SYSTEM, operatingSystem.ToString());
            }
            if (!string.IsNullOrEmpty(geoLocation))
            {
                lstHeaderParams.Add(Constant.RequestHeader.GEO_LOCATION, geoLocation.ToString());
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.GEO_LOCATION, geoLocation.ToString());
            }
            var response = await _client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                return NewtonJson.Deserialize<T>(content);
            }
            else
            {
                return default;
            }
        }

        public async Task<T> PostAsync<T>(string url, object data = null)
        {
            Dictionary<string, string> lstHeaderParams = new Dictionary<string, string>();
            StringValues token = string.Empty;
            var accessToken = string.Empty;
            StringValues operatingSystem = string.Empty;
            StringValues geoLocation = string.Empty;
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.AUTHORIZATION, out token);
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.OPERATING_SYSTEM, out operatingSystem);
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.GEO_LOCATION, out geoLocation);
            if (!string.IsNullOrEmpty(token))
            {
                accessToken = token.ToString().StartsWith(Constant.RequestHeader.BEARER) ? token.ToString().Substring(7) : token.ToString();
                lstHeaderParams.Add(Constant.RequestHeader.AUTHORIZATION, accessToken);
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.AUTHORIZATION, accessToken);
            }
            if (!string.IsNullOrEmpty(operatingSystem))
            {
                lstHeaderParams.Add(Constant.RequestHeader.OPERATING_SYSTEM, operatingSystem.ToString());
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.OPERATING_SYSTEM, operatingSystem.ToString());
            }
            if (!string.IsNullOrEmpty(geoLocation))
            {
                lstHeaderParams.Add(Constant.RequestHeader.GEO_LOCATION, geoLocation.ToString());
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.GEO_LOCATION, geoLocation.ToString());
            }
            if (data != null)
            {
                var json = NewtonJson.Serialize(data);
                var dataPost = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _client.PostAsync(url, dataPost);
                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    return NewtonJson.Deserialize<T>(content);
                }
                else
                {
                    return default;
                }
            }
            else
            {
                var response = await _client.PostAsync(url, null);
                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    return NewtonJson.Deserialize<T>(content);
                }
                else
                {
                    return default;
                }
            }
        }

        public async Task<T> DeleteAsync<T>(string url)
        {
            Dictionary<string, string> lstHeaderParams = new Dictionary<string, string>();
            StringValues token = string.Empty;
            var accessToken = string.Empty;
            StringValues operatingSystem = string.Empty;
            StringValues geoLocation = string.Empty;
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.AUTHORIZATION, out token);
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.OPERATING_SYSTEM, out operatingSystem);
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.GEO_LOCATION, out geoLocation);
            if (!string.IsNullOrEmpty(token))
            {
                accessToken = token.ToString().StartsWith(Constant.RequestHeader.BEARER) ? token.ToString().Substring(7) : token.ToString();
                lstHeaderParams.Add(Constant.RequestHeader.AUTHORIZATION, accessToken);
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.AUTHORIZATION, accessToken);
            }
            if (!string.IsNullOrEmpty(operatingSystem))
            {
                lstHeaderParams.Add(Constant.RequestHeader.OPERATING_SYSTEM, operatingSystem.ToString());
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.OPERATING_SYSTEM, operatingSystem.ToString());
            }
            if (!string.IsNullOrEmpty(geoLocation))
            {
                lstHeaderParams.Add(Constant.RequestHeader.GEO_LOCATION, geoLocation.ToString());
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.GEO_LOCATION, geoLocation.ToString());
            }
            var response = await _client.DeleteAsync(url);
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                return NewtonJson.Deserialize<T>(content);
            }
            else
            {
                return default;
            }
        }

        public async Task<T> PostAsyncCustomGrid<T>(string url, object data = null)
        {
            Dictionary<string, string> lstHeaderParams = new Dictionary<string, string>();
            StringValues token = string.Empty;
            var accessToken = string.Empty;
            StringValues operatingSystem = string.Empty;
            StringValues geoLocation = string.Empty;
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.AUTHORIZATION, out token);
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.OPERATING_SYSTEM, out operatingSystem);
            _httpContextAccessor.HttpContext.Request.Headers.TryGetValue(Constant.RequestHeader.GEO_LOCATION, out geoLocation);
            if (!string.IsNullOrEmpty(token))
            {
                accessToken = token.ToString().StartsWith(Constant.RequestHeader.BEARER) ? token.ToString().Substring(7) : token.ToString();
                lstHeaderParams.Add(Constant.RequestHeader.AUTHORIZATION, accessToken);
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.AUTHORIZATION, accessToken);
            }
            if (!string.IsNullOrEmpty(operatingSystem))
            {
                lstHeaderParams.Add(Constant.RequestHeader.OPERATING_SYSTEM, operatingSystem.ToString());
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.OPERATING_SYSTEM, operatingSystem.ToString());
            }
            if (!string.IsNullOrEmpty(geoLocation))
            {
                lstHeaderParams.Add(Constant.RequestHeader.GEO_LOCATION, geoLocation.ToString());
                _client.DefaultRequestHeaders.Add(Constant.RequestHeader.GEO_LOCATION, geoLocation.ToString());
            }
            if (data != null)
            {
                var json = JsonConvert.SerializeObject(data);
                var dataPost = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _client.PostAsync(url, dataPost);
                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    return NewtonJson.Deserialize<T>(content);
                }
                else
                {
                    return default;
                }
            }
            else
            {
                var response = await _client.PostAsync(url, null);
                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    return NewtonJson.Deserialize<T>(content);
                }
                else
                {
                    return default;
                }
            }
        }
    }
}
