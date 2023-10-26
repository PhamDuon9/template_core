namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysProvince : BaseTable<SysProvince>
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public int Area { get; set; }
    }
}
