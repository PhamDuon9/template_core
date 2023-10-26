using Backend.Infrastructure.Common.Interfaces;
using Backend.Infrastructure.Middleware.Auth.Jwt;
using Backend.Infrastructure.Middleware.Permissions;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Infrastructure.Middleware.Auth
{
    internal static class Startup
    {
        internal static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration config)
        {
            services
                .AddCurrentUser()
                .AddPermissions();

            // Must add identity before adding auth!
            //.AddIdentity();
            services.Configure<SecuritySettings>(config.GetSection(nameof(SecuritySettings)));
            //return config["SecuritySettings:Provider"].Equals("AzureAd", StringComparison.OrdinalIgnoreCase)
            //    ? services.AddAzureAdAuth(config)
            //    : services.AddJwtAuth(config);
            return services.AddJwtAuth(config);
        }

        internal static IApplicationBuilder UseCurrentUser(this IApplicationBuilder app) =>
            app.UseMiddleware<CurrentUserMiddleware>();

        private static IServiceCollection AddCurrentUser(this IServiceCollection services) =>
            services
                .AddScoped<CurrentUserMiddleware>()
                .AddScoped<ICurrentUser, CurrentUser>()
                .AddScoped(sp => (ICurrentUserInitializer)sp.GetRequiredService<ICurrentUser>());

        private static IServiceCollection AddPermissions(this IServiceCollection services) =>
            services
                .AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>()
                .AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
    }
}
