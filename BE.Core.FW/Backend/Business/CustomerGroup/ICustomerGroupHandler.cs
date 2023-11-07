using Backend.Infrastructure.Utils;
using Backend.Model;

namespace Backend.Business.CustomerGroup;

public interface ICustomerGroupHandler
{
    ResponseData Get(string filter);
    ResponseData GetById(Guid id);
    ResponseData Create(CustomerGroupModel model);
    ResponseData Update(Guid id, CustomerGroupModel model);
    ResponseData Delete(Guid id);
    ResponseData DeleteMany(List<string> ids);
}