using System.ComponentModel.DataAnnotations;

namespace Backend.Model
{
    public class HeadQuarterModel
    {
        public Guid Id { get; set; }
        public Guid AreaId { get; set; }
        public string Name { get; set; } = null!;
        public string? EnglishName { get; set; }
        public string? KoreaName { get; set; }
        public string Code { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? Note { get; set; }
        public bool CanRegisterExam { get; set; } = false;
        public bool IsShow { get; set; } = false;
        public bool IsTopik { get; set; } = false;
        public int MaxQuantity { get; set; }
        public string? RegistrationCode { get; set; }
        public string? ProfileCode { get; set; }
        public string? LinkGoogleMap { get; set; }
    }

    public class HeadQuarterResponseTopikModel
    {
        public Guid Id { get; set; }
        public Guid AreaId { get; set; }
        public string Name { get; set; } = null!;
        public string? EnglishName { get; set; }
        public string? KoreaName { get; set; }
        public string Code { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string? Note { get; set; }
        public bool CanRegisterExam { get; set; } = false;
        public bool IsShow { get; set; } = false;
        public bool IsTopik { get; set; } = false;
        public int MaxQuantity { get; set; }
        public int Registed { get; set; }
        public string? ProfileCode { get; set; }
        public string? LinkGoogleMap { get; set; }
    }
}
