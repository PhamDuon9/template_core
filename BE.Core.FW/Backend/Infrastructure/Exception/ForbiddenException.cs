using System.Net;

namespace Backend.Infrastructure.Exception
{
    public class ForbiddenException : CustomException
    {
        public ForbiddenException(string message)
            : base(message, null, HttpStatusCode.Forbidden)
        {
        }
    }
}
