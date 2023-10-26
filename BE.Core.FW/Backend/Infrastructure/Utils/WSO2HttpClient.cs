using Newtonsoft.Json.Linq;
using System.Text;

namespace Backend.Infrastructure.Utils
{
    public class WSO2HttpClient
    {
        private readonly string _wso2uri = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:Uri");
        private readonly string _clientId = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:Clientid");
        private readonly string _clientSecret = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:Secret");
        private readonly string _username = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:Username");
        private readonly string _password = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:Password");
        private readonly string _tenant = Backend.Infrastructure.Utils.Utils.GetConfig("Authentication:WSO2:Tenant");

        public WSO2HttpClient()
        {
            string endPoint = new(_wso2uri + "/t/" + _tenant);

            var handler = new HttpClientHandler
            {
                ClientCertificateOptions = ClientCertificateOption.Manual,
                ServerCertificateCustomValidationCallback = (httpRequestMessage, cert, cetChain, policyErrors) =>
                {
                    return true;
                }
            };

            var httpClient = new HttpClient(handler);

            httpClient.DefaultRequestHeaders.Add("accept", "application/json");
            httpClient.DefaultRequestHeaders.Add("Authorization", Convert.ToBase64String(Encoding.UTF8.GetBytes(_username + ":" + _password)));
        }
    }
}
