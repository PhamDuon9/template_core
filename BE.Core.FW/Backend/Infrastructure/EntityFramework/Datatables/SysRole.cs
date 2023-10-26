using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysRole : BaseTable<SysRole>
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Code { get; set; } = string.Empty;
        [Required]
        public string Name { get; set; } = string.Empty;
        public string? AccessDataHeaderQuater { get; set; }
        public string? Description { get; set; } = string.Empty;

        /// <summary>
        /// Là vai trò mặc định không cho phép chỉnh sửa
        /// </summary>
        [Required]
        public Boolean IsDefault { get; set; }
    }
}
