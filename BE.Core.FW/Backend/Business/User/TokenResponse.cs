namespace Backend.Business.User
{
    public record TokenResponse(string Token, string RefreshToken, DateTime RefreshTokenExpiryTime);
}
