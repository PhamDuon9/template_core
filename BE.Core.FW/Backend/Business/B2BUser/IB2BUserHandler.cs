using Backend.Business.User;
using Backend.Infrastructure.Utils;

namespace Backend.Business.B2BUser
{
    public interface IB2BUserHandler
    {
        ResponseData Get();
        ResponseData GetById(Guid id);
        ResponseData Create(B2BUserModel model);
        ResponseData Update(Guid id, B2BUserModel model);
        ResponseData Delete(Guid id);
        ResponseData Enable(Guid id);
        ResponseData Disable(Guid id);
    }
}
