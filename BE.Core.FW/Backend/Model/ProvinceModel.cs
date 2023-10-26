namespace Backend.Model
{
    public class ProvinceModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public int Area { get; set; }
        public List<DistrictModel>? Districts { get; set; }
    }
}
