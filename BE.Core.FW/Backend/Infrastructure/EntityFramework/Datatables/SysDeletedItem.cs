using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysDeletedItem
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Type { get; set; } = string.Empty;
        [Required]
        public string Data { get; set; } = string.Empty;
    }
}
