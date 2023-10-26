using RestSharp;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Shared.Core.Utils
{
    public static class RestsharpUtils
    {
        #region Async Function
        public async static Task<T> GetAsync<T>(string url, List<KeyValuePair<string, string>> header = null, List<KeyValuePair<string, string>> param = null)
        {
            var client = new RestClient(url);
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            if (header != null)
            {
                foreach (var item in header)
                {
                    request.AddHeader(item.Key, item.Value);
                }
            }
            if (param != null)
            {
                foreach (var item in param)
                {
                    request.AddParameter(item.Key, item.Value);
                }
            }

            IRestResponse response = await client.ExecuteAsync(request);
            if (!string.IsNullOrEmpty(response.Content))
                return NewtonJson.Deserialize<T>(response.Content);
            else
                return default;
        }

        public async static Task<T> PostAsync<T>(string url, List<KeyValuePair<string, string>> header = null, object body = default, List<KeyValuePair<string, string>> param = null)
        {
            var client = new RestClient(url);
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            if (body != null)
                request.AddJsonBody(body);
            if (header != null)
            {
                foreach (var item in header)
                {
                    request.AddHeader(item.Key, item.Value);
                }
            }
            if (param != null)
            {
                foreach (var item in param)
                {
                    request.AddParameter(item.Key, item.Value);
                }
            }
            IRestResponse response = await client.ExecuteAsync(request);
            if (!string.IsNullOrEmpty(response.Content))
                return NewtonJson.Deserialize<T>(response.Content);
            else
                return default;
        }
        #endregion

        #region Sync Function
        public static T Get<T>(string url, List<KeyValuePair<string, string>> header = null, List<KeyValuePair<string, string>> param = null)
        {
            var client = new RestClient(url);
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            if (header != null)
            {
                foreach (var item in header)
                {
                    request.AddHeader(item.Key, item.Value);
                }
            }
            if (param != null)
            {
                foreach (var item in param)
                {
                    request.AddParameter(item.Key, item.Value);
                }
            }

            IRestResponse response = client.Execute(request);
            if (!string.IsNullOrEmpty(response.Content))
                return NewtonJson.Deserialize<T>(response.Content);
            else
                return default;
        }

        public static T Post<T>(string url, List<KeyValuePair<string, string>> header = null, object body = default, List<KeyValuePair<string, string>> param = null)
        {
            var client = new RestClient(url);
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            if (body != null)
                request.AddJsonBody(body);
            if (header != null)
            {
                foreach (var item in header)
                {
                    request.AddHeader(item.Key, item.Value);
                }
            }
            if (param != null)
            {
                foreach (var item in param)
                {
                    request.AddParameter(item.Key, item.Value);
                }
            }
            IRestResponse response = client.Execute(request);
            if (!string.IsNullOrEmpty(response.Content))
                return NewtonJson.Deserialize<T>(response.Content);
            else
                return default;
        }
        #endregion
    }
}
