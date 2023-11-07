using Backend.Infrastructure.Utils;
using Backend.Model;

namespace Backend.Business.AdministrativeUnit
{
    public interface IAdministrativeUnitHandler
    {
        ResponseData Get(string filter);
        ResponseData GetTree();
        ResponseData GetById(Guid id);
        ResponseData GetByParentId(Guid parentId);
        ResponseData Create(AdministrativeUnitModel model);
        ResponseData Update(Guid id, AdministrativeUnitModel model);
        ResponseData Delete(Guid id);
    }
}
