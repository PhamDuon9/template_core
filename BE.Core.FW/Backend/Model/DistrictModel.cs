namespace Backend.Model
{
    public class DistrictModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public Guid? ProvinceId { get; set; }
    }
}
