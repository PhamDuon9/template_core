using AutoMapper;
using Backend.Infrastructure.EntityFramework.Datatables;
using Backend.Infrastructure.EntityFramework.Repositories;
using Microsoft.AspNetCore.Authorization;
using NetCasbin.Model;
using System.Security.Claims;
using static System.Net.Mime.MediaTypeNames;

namespace Backend.Infrastructure.Middleware.Permissions
{
    public class CustomAuthorizationHandler : IAuthorizationHandler
    {
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CustomAuthorizationHandler(IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task HandleAsync(AuthorizationHandlerContext context)
        {
            if (context!.User!.Identity!.IsAuthenticated)
            {
                return;
            }
            return;
        }
    }
}
