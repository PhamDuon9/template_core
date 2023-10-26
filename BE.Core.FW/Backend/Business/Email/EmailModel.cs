namespace Backend.Business.User
{
    public class EmailModel
    {
        public string Subject { get; set; } = string.Empty;
        public string ToAddress { get; set; } = string.Empty;
        public string? TextBody { get; set; }
        public string? HTMLBody { get; set; }
    }
}
