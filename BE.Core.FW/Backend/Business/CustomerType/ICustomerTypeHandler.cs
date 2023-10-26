using Backend.Infrastructure.Utils;
using Backend.Model;

namespace Backend.Business.Branch;

public interface ICustomerTypeHandler
{
    ResponseData Get(string filter);
    ResponseData GetById(Guid id);
    ResponseData Create(CustomerTypeModel model);
    ResponseData Update(Guid id, CustomerTypeModel model);
    ResponseData Delete(Guid id);
}