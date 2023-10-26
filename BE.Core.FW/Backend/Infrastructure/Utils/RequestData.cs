namespace Backend.Infrastructure.Utils;

public class RequestData
{
    public int? Page { get; set; }
    public int? Size { get; set; }
    public string TextSearch { get; set; } = string.Empty;
}