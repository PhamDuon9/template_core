using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysPolicy : BaseTable<SysPolicy>
    {
        [Key]
        public Guid Id { get; set; }

        /// <summary>
        /// Mã của Menu
        /// </summary>
        [Required]
        public string LayoutCode { get; set; }

        /// <summary>
        /// Id vai trò
        /// </summary>
        [Required]
        public Guid RoleId { get; set; }

        /// <summary>
        /// Tổng quyền của người dùng(Theo kỹ thuật bit field trong phân quyền)
        /// </summary>
        [Required]
        public int Permission { get; set; }

    }
}
