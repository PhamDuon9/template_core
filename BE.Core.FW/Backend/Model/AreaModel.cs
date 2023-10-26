namespace Backend.Model
{
    public class AreaModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? EnglishName { get; set; }
        public string? KoreaName { get; set; }
        public string Code { get; set; } = string.Empty;
        public string? Note { get; set; } = string.Empty;
        public uint Order { get; set; }
        public bool IsShow { get; set; } = true;
        public bool IsTopik { get; set; } = false;
        public string? RegistrationCode { get; set; }

        public int Region { get; set; }
        public string? RegionName { get; set; }
    }
}
