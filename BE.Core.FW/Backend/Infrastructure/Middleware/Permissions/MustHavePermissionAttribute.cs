using Microsoft.AspNetCore.Authorization;
//using Microsoft.Office.Core;
using NetCasbin.Model;

namespace Backend.Infrastructure.Middleware.Permissions
{
    /// <summary>
    /// Attribute Custom
    /// </summary>
    public class MustHavePermissionAttribute : AuthorizeAttribute
    {
        /// <summary>
        /// Attribute Custom
        /// </summary>
        /// <param name="action">Action truy cập</param>
        /// <param name="resource">layout Code truy cập</param>
        public MustHavePermissionAttribute(string action, string resource) =>
            Policy = FSHPermission.NameFor(action, resource);
    }
}
