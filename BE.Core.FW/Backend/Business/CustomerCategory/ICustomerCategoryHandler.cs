using Backend.Infrastructure.Utils;
using Backend.Model;

namespace Backend.Business.Branch;

public interface ICustomerCategoryHandler
{
    ResponseData Get(string filter);
    ResponseData GetById(Guid id);
    ResponseData Create(CustomerCategoryModel model);
    ResponseData Update(Guid id, CustomerCategoryModel model);
    ResponseData Delete(Guid id);
}