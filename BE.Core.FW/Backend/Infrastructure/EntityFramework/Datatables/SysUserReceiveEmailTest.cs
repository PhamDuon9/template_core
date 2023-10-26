using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysUserReceiveEmailTest : BaseTable<SysUserReceiveEmailTest>
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string FullName { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// trạng thái
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// Ngôn ngữ thí sinh chọn để đăng ký TOPIK - dùng để gửi mail thông báo SBD về đúng ngôn ngữ thí sinh đã đăng ký
        /// </summary>
        public string? LanguageSendMail { get; set; }
    }
}
