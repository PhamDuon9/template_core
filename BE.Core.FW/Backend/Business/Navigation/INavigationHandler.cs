using Backend.Infrastructure.Utils;

namespace Backend.Business.Navigation
{
    public interface INavigationHandler
    {
        Task<ResponseData> Get();
        ResponseData GetById(Guid id);
        ResponseData Create(NavigationModel model);
        ResponseData Update(Guid id, NavigationModel model);
        ResponseData Delete(Guid id);
        ResponseData DeleteMany(List<string> ids);
    }
}
