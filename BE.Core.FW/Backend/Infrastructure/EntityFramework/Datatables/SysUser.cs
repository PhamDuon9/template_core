using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysUser : BaseTable<SysUser>
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Fullname { get; set; } = string.Empty;

        [EmailAddress]
        public string? Email { get; set; }
        public DateTime? DOB { get; set; }
        [Phone]
        public string? Phone { get; set; }

        /// <summary>
        /// Id đồng bộ với account của wsO2
        /// </summary>
        public Guid SyncId { get; set; }

        /// <summary>
        /// mặc định tài khoản ở trạng thái khóa
        /// </summary>
        public bool IsLocked { get; set; } = false;


        /// <summary>
        /// id nhóm người dùng
        /// </summary>
        public Guid? RoleId { get; set; }

        /// <summary>
        /// id phòng ban
        /// </summary>
        public Guid? DepartmentId { get; set; }

        public string? EmployeeAccessLevels { get; set; }

        public bool IsAccessMaxLevel { get; set; } = false;

        public string? Password { get; set; }
    }
}
