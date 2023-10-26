using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysApplicationConfig
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Key { get; set; } = string.Empty;
        [Required]
        public string Value { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        [Required]
        public Guid AppId { get; set; }
    }
}
