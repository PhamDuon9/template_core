namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysProduct : BaseTable<SysProduct>
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public Guid? ProductCategoryId { get; set; }
        public Guid? ProductTypeId { get; set; }
        public int Price { get; set; }
        public float Tax { get; set; }
    }
}
