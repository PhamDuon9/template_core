using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysB2BUser
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Fullname { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public DateTime DOB { get; set; }
        [Phone]
        public string Phone { get; set; } = string.Empty;
        public Guid SyncId { get; set; }
        public bool IsDisabled { get; set; } = false;
    }
}
