using Backend.Infrastructure.Utils;

namespace Backend.Business.Role
{
    public interface IRoleHandler
    {
        ResponseData Get(string? name, int pageIndex = 1, int pageSize = 10);
        ResponseData GetCombobox();
        ResponseData GetById(Guid id);
        ResponseData Create(RoleModel model);
        ResponseData Update(Guid id, RoleModel model);

        /// <summary>
        /// Gán mức truy cập dữ liệu cho vai trò
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        ResponseData AssignAccessData(Guid id, RoleModel model);
        ResponseData Delete(Guid id);

        /// <summary>
        /// Cây đơn vị địa điểm thi theo khu vực
        /// </summary>
        /// <param name="IsTopik">Địa điểm thi của bài topik</param>
        /// <param name="isShow">Cho phép hiển thị hay không</param>
        /// <returns></returns>
        Task<ResponseData> TreeView(bool? topik, bool? isShow, string? accessToken);
    }
}
