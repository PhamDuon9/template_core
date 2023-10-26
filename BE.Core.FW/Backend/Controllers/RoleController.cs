using Backend.Business.Auth;
using Backend.Business.Policy;
using Backend.Business.Role;
using Backend.Infrastructure.Utils;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleHandler _handler;
        private readonly IPolicyHandler _policyHandler;

        public RoleController(IRoleHandler handler, IPolicyHandler policyHandler)
        {
            _handler = handler;
            _policyHandler = policyHandler;
        }

        /// <summary>
        /// lấy về danh sách các role sử dụng phân trang
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ResponseData Get([FromQuery] string? name, int pageIndex = 1, int pageSize = 10)
        {
            return _handler.Get(name, pageIndex, pageSize);
        }

        /// <summary>
        /// lấy về danh sách các role sử dụng phân trang
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetValueType")]
        public ResponseData GetCombobox()
        {
            return _handler.GetCombobox();
        }

        [HttpGet]
        [Route("{id}")]
        public ResponseData GetById(Guid id)
        {
            return _handler.GetById(id);
        }

        [HttpPut]
        [Route("{id}")]
        public ResponseData Update(Guid id, [FromBody] RoleModel model)
        {
            return _handler.Update(id, model);
        }

        [HttpPost]
        public ResponseData Create([FromBody] RoleModel model)
        {
            model.Id = Guid.NewGuid();
            var responseCreateRole = _handler.Create(model);
            if (responseCreateRole != null && responseCreateRole.Code == Code.Success && model.RecordCloneId.HasValue)
            {
                return _policyHandler.CloneFromRole(model.RecordCloneId.Value, model.Id);
            }
            return new ResponseData(Code.NotFound, responseCreateRole?.Message ?? "Thêm mới thất bại");
        }

        [HttpDelete]
        [Route("{id}")]
        public ResponseData Delete(Guid id)
        {
            return _handler.Delete(id);
        }


        /// <summary>
        /// Cây đơn vị địa điểm thi theo khu vực
        /// </summary>
        /// <param name="IsTopik">Địa điểm thi của bài topik</param>
        /// <param name="isShow">Cho phép hiển thị hay không</param>
        /// <returns></returns>
        [HttpGet("AccessData/TreeView")]
        public async Task<ResponseData> TreeView(bool? topik, bool? isShow)
        {
            var accessToken = HttpHelper.GetAccessFromHeader(Request) != null ? HttpHelper.GetAccessFromHeader(Request) : string.Empty;
            return await _handler.TreeView(topik, isShow, accessToken);
        }

        /// <summary>
        /// Gán mức truy cập dữ liệu cho vai trò
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("AssignAccessData/{id}")]
        public ResponseData AssignAccessData(Guid id, [FromBody] RoleModel model)
        {
            return _handler.AssignAccessData(id, model);
        }
    }
}
