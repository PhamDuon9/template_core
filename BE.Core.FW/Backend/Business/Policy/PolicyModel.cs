using System.ComponentModel.DataAnnotations;

namespace Backend.Business.Policy
{
    public class PolicyModel
    {
        public Guid Id { get; set; }

        /// <summary>
        /// Code của Menu
        /// </summary>
        public string LayoutCode { get; set; }

        /// <summary>
        /// Id vai trò
        /// </summary>
        public Guid RoleId { get; set; }

        /// <summary>
        /// Tổng quyền của người dùng(Theo kỹ thuật bit field trong phân quyền)
        /// </summary>
        public int Permission { get; set; }

    }
}
