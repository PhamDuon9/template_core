namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysCustomerCategory : BaseTable<SysCustomerCategory>
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
    }
}
