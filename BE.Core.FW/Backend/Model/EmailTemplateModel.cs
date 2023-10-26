namespace Backend.Model
{
    public class EmailTemplateModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string SubjectInVietnamese { get; set; } = null!;
        public string? SubjectInEnglish { get; set; }
        public string? SubjectInKorean { get; set; }
        public string ContentInVietnamese { get; set; } = null!;
        public string? ContentInEnglish { get; set; }
        public string? ContentInKorean { get; set; }
        public bool Status { get; set; }
        public int Type { get; set; }
    }
}
