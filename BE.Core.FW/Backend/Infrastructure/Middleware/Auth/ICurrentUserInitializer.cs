using System.Security.Claims;

namespace Backend.Infrastructure.Middleware.Auth
{
    public interface ICurrentUserInitializer
    {
        void SetCurrentUser(ClaimsPrincipal user);

        void SetCurrentUserId(string userId);
    }
}
