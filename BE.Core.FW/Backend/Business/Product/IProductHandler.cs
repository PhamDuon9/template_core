using Backend.Infrastructure.Utils;
using Backend.Model;

namespace Backend.Business.Branch;

public interface IProductHandler
{
    ResponseData Get(string filter);
    ResponseData GetById(Guid id);
    ResponseData Create(ProductModel model);
    ResponseData Update(Guid id, ProductModel model);
    ResponseData Delete(Guid id);
    ResponseData GetFileTemplate();
    ResponseData Import(IFormFile file);
}