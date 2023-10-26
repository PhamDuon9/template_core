using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysBranch : BaseTable<SysBranch>
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string Code { get; set; }= default!;
        public string? Description { get; set; }
    }
}
