using Backend.Infrastructure.Utils;
using Backend.Model;

namespace Backend.Business.Customer;

public interface ICustomerHandler
{
    ResponseData Get(string filter);
    ResponseData GetById(Guid id);
    ResponseData Create(CustomerModel model);
    ResponseData Update(Guid id, CustomerModel model);
    ResponseData Delete(Guid id);
    ResponseData GetFileTemplate();
    ResponseData Import(IFormFile file);
}