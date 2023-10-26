using Backend.Infrastructure.Utils;

namespace Backend.Business.User
{
    public interface IEmailHandler
    {
        Task<ResponseData> SendOneEmail(EmailModel model);
    }
}
