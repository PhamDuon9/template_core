using Backend.Infrastructure.Utils;
using Backend.Model;

namespace Backend.Business.Branch;

public interface IBranchHandler
{
    ResponseData Get(string filter);
    ResponseData GetById(Guid id);
    ResponseData Create(BranchModel model);
    ResponseData Update(Guid id, BranchModel model);
    ResponseData Delete(Guid id);
}