using Backend.Business;
using Backend.Business.Auth;
using Backend.Business.DividingRoom;
using Backend.Business.Mailing;
using Backend.Business.Navigation;
using Backend.Business.Policy;
using Backend.Business.Role;

using Backend.Business.UploadFile;
using Backend.Business.User;
using Backend.Infrastructure.EntityFramework;
using Backend.Infrastructure.Middleware;
using Backend.Infrastructure.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using Serilog;
using WebAPI.Infrastructure.Localization;
using Serilog.Sinks.Elasticsearch;
using Shared.Caching.Ioc;
using Shared.Core.Utils;
using Microsoft.Extensions.Options;
using static Shared.Core.Utils.Constant;
using Hangfire;
using StackExchange.Redis;
using Hangfire.Redis.StackExchange;
using Microsoft.Extensions.Configuration;
using System.Net;
using HangfireBasicAuthenticationFilter;
using Backend.Infrastructure.BackgroundJobs;
using Microsoft.EntityFrameworkCore.Storage;
using Shared.Caching.Common;
using Serilog.Events;
using IIG.Core.Framework.ICom.Infrastructure.Dapper.IOC;
using Backend.Infrastructure.Middleware.Request;
using Backend.Infrastructure.Middleware.Auth.Jwt;
using Backend.Infrastructure.Middleware.Permissions;
using Backend.Infrastructure.Middleware.Auth;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);
//Log.Logger = new LoggerConfiguration()
//                .MinimumLevel.Debug()
//                .WriteTo.Console()
//                .WriteTo.File("logs/b2c-.txt", rollingInterval: RollingInterval.Day)
//                .WriteTo.Elasticsearch(new ElasticsearchSinkOptions()
//                {
//                    BufferFileRollingInterval = RollingInterval.Day,
//                    AutoRegisterTemplate = true,
//                    IndexFormat = "iig-{0:yyyy.MM.dd}"
//                })
//                .Enrich.FromLogContext()
//                .CreateLogger();
Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.Console()
                .WriteTo.Logger(lc => lc
                .Filter.ByIncludingOnly(evt => evt.Level == LogEventLevel.Information)
                .WriteTo.File("logs/Log-Information/information_.txt", rollingInterval: RollingInterval.Day))
                .WriteTo.Logger(lc => lc
                .Filter.ByIncludingOnly(evt => evt.Level == LogEventLevel.Error)
                .WriteTo.File("logs/Log-Error/error_.txt", rollingInterval: RollingInterval.Day))
                .WriteTo.Logger(lc => lc
                .Filter.ByIncludingOnly(evt => evt.Level == LogEventLevel.Debug)
                .WriteTo.File("logs/Log-Debug/debug_.txt", rollingInterval: RollingInterval.Day))
                .WriteTo.Elasticsearch(new ElasticsearchSinkOptions()
                {
                    BufferFileRollingInterval = RollingInterval.Day,
                    AutoRegisterTemplate = true,
                    IndexFormat = "iig-{0:yyyy.MM.dd}"
                })
                .Enrich.FromLogContext()
                .CreateLogger();
Log.Information("Hello, world!");

AppSettings.Instance.SetConfiguration(builder.Configuration);
builder.Services.AddCachingProcessServices();
builder.Services.AddDataProcessServices();
// Add services to the container.
builder.Services.Configure<MiddlewareSettings>(builder.Configuration.GetSection($"MiddlewareSettings"));
builder.Services.AddControllers();
builder.Services.AddLocalization(builder.Configuration);
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("MailSettings"));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebApi", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
    c.OperationFilter<AddRequiredHeaderParameter>();
});
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = 2147483648;
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
                      });
});

//builder.Services.AddHangfire(x =>
//{
//    var stringConnection = Backend.Infrastructure.Utils.Utils.GetConfig("Cache:Redis:Data");
//    var cacheDataConfig = AppSettings.Instance.Get<CachingConfigModel>("Cache:Redis:Data");
//    ConnectionMultiplexer Redis = ConnectionMultiplexer.Connect($"{cacheDataConfig.ServerList[0].Host}:{cacheDataConfig.ServerList[0].Port}");
//    x.UseRedisStorage(Redis, new RedisStorageOptions
//    {
//        Prefix = "{hangfire-job}:",
//        Db = cacheDataConfig.Database
//    });
//});
//builder.Services.AddHangfireServer(options =>
//{
//    options.Queues = new string[] { "notdefault", "default" };
//    options.WorkerCount = 30;
//    options.ServerName = String.Format(
//        "{0}.{1}",
//        Environment.MachineName,
//        Guid.NewGuid().ToString());
//});


//add middleware
builder.Services.AddExceptionMiddleware();
builder.Services.AddRequestLogging(builder.Configuration);
//builder.Services.AddJwtAuth(builder.Configuration);
builder.Services.AddAuth(builder.Configuration);

builder.Services.AddServices();
builder.Services.AddInjectionBussiness();



builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

////Authen với ws02
//builder.Services.AddAuthentication(option =>
//{
//    option.DefaultAuthenticateScheme = "Custom Scheme";
//    option.DefaultChallengeScheme = "Custom Scheme";
//}).AddScheme<CustomAuthenticationOptions, CustomAuthenticationHandler>("Custom Scheme", "Custom Auth", options => { });

builder.Services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>()
    .AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
builder.Services.AddDbContext<CoreFrameworkContext>();
var app = builder.Build();
app.UseForwardedHeaders();
// Configure the HTTP request pipeline.
app.UseSwagger();
//app.UseHangfireDashboard("/tasks",
//    new DashboardOptions()
//    {
//        Authorization = new[]
//        {
//           new HangfireCustomBasicAuthenticationFilter
//           {
//                User = "admin",
//                Pass = "12345678@Abc"
//           }
//        },
//        DashboardTitle = "BackgroundJobs"
//    });
app.UseSwaggerUI(c =>
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApi v1"));
});
app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "OutputExcel")),
    RequestPath = new PathString("/OutputExcel")
});
app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "EmailTemplates")),
    RequestPath = new PathString("/EmailTemplates")
});

Directory.CreateDirectory(Path.Combine(Environment.CurrentDirectory, "FileDownload"));
app.UseStaticFiles(new StaticFileOptions()
{
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "FileDownload")),
    RequestPath = new PathString("/FileDownload")
});
app.UseLocalization(builder.Configuration);
app.UseCors(MyAllowSpecificOrigins);
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseExceptionMiddleware();
app.UseAuthentication();
app.UseAuthorization();
app.UseRequestLogging(builder.Configuration);
app.UseCurrentUser();


app.MapControllers();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CoreFrameworkContext>();
    db.Database.Migrate();
}
app.Run();
