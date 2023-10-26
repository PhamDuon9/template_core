using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysEmailHistory : BaseTable<SysEmailHistory>
    {
        [Key]
        public Guid Id { get; set; }
        public string? ToEmail { get; set; }
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public bool IsSend { get; set; }
        public string? Note { get; set; }
    }

}
