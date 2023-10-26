namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysProductType : BaseTable<SysProductType>
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public Guid? ProductCategoryId { get; set; }
    }
}
