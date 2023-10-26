using Backend.Business.User;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Infrastructure.Middleware.Permissions
{
    internal class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IUserHandler _userService;

        public PermissionAuthorizationHandler(IUserHandler userService) =>
            _userService = userService;

        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            string syncIdFromWSO2 = context?.User.Claims.FirstOrDefault(g => g.Type == ClaimTypes.NameIdentifier)?.Value ?? "";
            Guid.TryParse(syncIdFromWSO2, out Guid syncId);
            if (syncId != Guid.Empty &&
                await _userService.HasPermissionAsync(syncId, requirement.Permission))
            {
                context.Succeed(requirement);
            }
        }
    }
}
