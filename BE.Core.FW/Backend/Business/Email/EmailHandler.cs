using AutoMapper;
using Backend.Business.Mailing;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Backend.Infrastructure.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Serilog;
using System;
using System.Dynamic;
using System.Text;

namespace Backend.Business.User
{
    public class EmailHandler : IEmailHandler
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailTemplateHandler _emailTemplateHandler;

        public EmailHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor, IEmailTemplateHandler emailTemplateHandler)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _emailTemplateHandler = emailTemplateHandler;
        }

        public async Task<ResponseData> SendOneEmail(EmailModel model)
        {
            try
            {
                using UnitOfWork unitOfWork = new(_httpContextAccessor);
                var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, Utils.GetConfig("ZetaMail:SendOne"));
                var content = new MultipartFormDataContent();
                content.Add(new StringContent(model.Subject), "Subject");
                content.Add(new StringContent(Utils.GetConfig("ZetaMail:FromName")), "FromName");
                content.Add(new StringContent(Utils.GetConfig("ZetaMail:FromAddress")), "ReplyTo");
                content.Add(new StringContent(Utils.GetConfig("ZetaMail:FromAddress")), "FromAddress");
                content.Add(new StringContent(model.HTMLBody != null ? model.HTMLBody : string.Empty), "HTMLBody");
                content.Add(new StringContent(model.TextBody != null ? model.TextBody : string.Empty), "TextBody");
                content.Add(new StringContent(model.ToAddress), "ToAddress");
                content.Add(new StringContent(Utils.GetConfig("ZetaMail:Token")), "token");
                content.Add(new StringContent("1"), "queue");
                request.Content = content;
                var response = await client.SendAsync(request);
                if (response.IsSuccessStatusCode && response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    return new ResponseData(Code.Success, "Gửi thành công tới địa chỉ email " + model.ToAddress);
                }
                string result = await response.Content.ReadAsStringAsync();
                return new ResponseDataError(Code.ServerError, result);
            }
            catch (Exception exception)
            {
                Log.Error(exception, exception.Message);
                return new ResponseDataError(Code.ServerError, exception.Message);
            }
        }
    }
}
