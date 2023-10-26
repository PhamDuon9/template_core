using Backend.Infrastructure.Utils;

namespace Backend.Business.Policy
{
    public interface IPolicyHandler
    {
        ResponseData Get();
        ResponseData GetById(Guid id);
        ResponseData GetByRoleId(Guid roleId);
        List<PolicyModel> GetPolicyByRole(Guid roleId);
        ResponseData Create(PolicyModel model);
        ResponseData CreateOrUpdate(PolicyModel model);
        ResponseData BulkCreate(List<PolicyModel> model);
        ResponseData Update(Guid id, PolicyModel model);
        ResponseData Delete(Guid id);

        /// <summary>
        /// Clone permission từ role nào sang role nào
        /// </summary>
        /// <param name="fromRoleId">lấy quyền trong role này</param>
        /// <param name="toRoleId">clone sang role này</param>
        /// <returns></returns>
        ResponseData CloneFromRole(Guid fromRoleId, Guid toRoleId);
    }
}
