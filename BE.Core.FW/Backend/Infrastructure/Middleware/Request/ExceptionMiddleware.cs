﻿using Backend.Infrastructure.Common.Interfaces;
using Backend.Infrastructure.Exception;
using Microsoft.Extensions.Localization;
using Serilog;
using Serilog.Context;
using System.Net;

namespace Backend.Infrastructure.Middleware.Request
{
    internal class ExceptionMiddleware : IMiddleware
    {
        private readonly ICurrentUser _currentUser;
        private readonly IStringLocalizer<ExceptionMiddleware> _localizer;

        public ExceptionMiddleware(
            ICurrentUser currentUser,
            IStringLocalizer<ExceptionMiddleware> localizer
            )
        {
            _localizer = localizer;
            _currentUser = currentUser;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (System.Exception exception)
            {
                string email = _currentUser.GetUserEmail() is string userEmail ? userEmail : "Anonymous";
                var userId = _currentUser.GetUserId();
                string tenant = _currentUser.GetTenant() ?? string.Empty;
                if (userId != Guid.Empty) LogContext.PushProperty("UserId", userId);
                LogContext.PushProperty("UserEmail", email);
                if (!string.IsNullOrEmpty(tenant)) LogContext.PushProperty("Tenant", tenant);
                string errorId = Guid.NewGuid().ToString();
                LogContext.PushProperty("ErrorId", errorId);
                LogContext.PushProperty("StackTrace", exception.StackTrace);
                var errorResult = new ErrorResult
                {
                    Source = exception.TargetSite?.DeclaringType?.FullName,
                    Exception = exception.Message.Trim(),
                    ErrorId = errorId,
                    SupportMessage = _localizer["exceptionmiddleware.supportmessage"]
                };
                errorResult.Messages!.Add(exception.Message);
                var response = context.Response;
                response.ContentType = "application/json";
                if (exception is not CustomException && exception.InnerException != null)
                {
                    while (exception.InnerException != null)
                    {
                        exception = exception.InnerException;
                    }
                }

                switch (exception)
                {
                    case CustomException e:
                        response.StatusCode = errorResult.StatusCode = (int)e.StatusCode;
                        if (e.ErrorMessages is not null)
                        {
                            errorResult.Messages = e.ErrorMessages;
                        }

                        break;

                    case KeyNotFoundException:
                        response.StatusCode = errorResult.StatusCode = (int)HttpStatusCode.NotFound;
                        break;

                    default:
                        response.StatusCode = errorResult.StatusCode = (int)HttpStatusCode.InternalServerError;
                        break;
                }

                Log.Error($"{errorResult.Exception} Request failed with Status Code {context.Response.StatusCode} and Error Id {errorId}.");
                await response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject(errorResult));
            }
        }
    }
}
