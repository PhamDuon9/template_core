namespace Backend.Model
{
    public class CountryModel
    {
        public Guid? Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string? EnglishName { get; set; }
        public string? KoreanName { get; set; }
    }
}
