namespace Backend.Model
{
    public class WSO2ResponseModel
    {
        public string? access_token { get; set; } = string.Empty;
        public string? id_token { get; set; } = string.Empty;
        public string? scope { get; set; } = string.Empty;
        public string? token_type { get; set; } = string.Empty;
        public long? expires_in { get; set; }
    }
}
