using System.Net;

namespace Backend.Infrastructure.Exception
{
    public class UnauthorizedException : CustomException
    {
        public UnauthorizedException(string message)
       : base(message, null, HttpStatusCode.Unauthorized)
        {
        }
    }
}
