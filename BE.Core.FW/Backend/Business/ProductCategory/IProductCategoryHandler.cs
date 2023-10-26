using Backend.Infrastructure.Utils;
using Backend.Model;

namespace Backend.Business.Branch;

public interface IProductCategoryHandler
{
    ResponseData Get(string filter);
    ResponseData GetById(Guid id);
    ResponseData Create(ProductCategoryModel model);
    ResponseData Update(Guid id, ProductCategoryModel model);
    ResponseData Delete(Guid id);
}