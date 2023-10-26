using Backend.Infrastructure.Utils;
using Backend.Model;

namespace Backend.Business.Branch;

public interface IProductTypeHandler
{
    ResponseData Get(string filter);
    ResponseData GetById(Guid id);
    ResponseData Create(ProductTypeModel model);
    ResponseData Update(Guid id, ProductTypeModel model);
    ResponseData Delete(Guid id);
}