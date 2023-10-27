using Backend.Infrastructure.Utils;

namespace Backend.Business.User
{
    public interface IUserHandler
    {
        ResponseData Get(string filter);
        ResponseData GetById(Guid id);
        ResponseData GetBySyncId(Guid syncId);
        ResponseData GetUserInforById(Guid Id);
        ResponseData Create(UserModel model);
        ResponseData Update(Guid id, UserModel model);
        ResponseData Delete(Guid id);
        ResponseData DeleteMany(List<string> ids);
        ResponseData ToggleStatus(Guid id, bool status);
        ResponseData AsignRole(Guid userId, UserModel model);
        ResponseData ChangePassword(Guid userId, UserChangePassword model);
        Task<bool> HasPermissionAsync(Guid userId, string permissionBit);
    }
}
