using Backend.Business.User;
using Backend.Infrastructure.Utils;

namespace Backend.Business.Mailing
{
    public interface IEmailTemplateHandler
    {
        string GenerateEmailTemplate<T>(string templateName, T mailTemplateModel);
        ResponseData SendEmail(EmailRequest request);
        Task<ResponseData> SendEmailAsync(EmailRequest request);
        Task<ResponseData> SendOneZetaEmail(EmailRequest model);
    }
}
