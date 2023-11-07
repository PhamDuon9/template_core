namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysAdministrativeUnit:BaseTable<SysAdministrativeUnit>
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public int Level { get; set; }
        public Guid? ParentId { get; set; }
        public string? Description { get; set; }
    }
}
