using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysHistory
    {
        [Key]
        public Guid Id { get; set; }
        [AllowNull]
        public string Type { get; set; } = string.Empty;
        [AllowNull]
        public string Ip { get; set; } = string.Empty;
        [AllowNull]
        public string Username { get; set; } = string.Empty;
        [AllowNull]
        public string Action { get; set; } = string.Empty;
        [AllowNull]
        public DateTime ActionDate { get; set; }
        [AllowNull]
        public Guid ObjectId { get; set; }
        [AllowNull]
        public string Detail { get; set; } = string.Empty;
    }
}
