namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysDistrict : BaseTable<SysDistrict>
    {
        public Guid Id { get; set; }
        public Guid? ProvinceId { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
    }
}
