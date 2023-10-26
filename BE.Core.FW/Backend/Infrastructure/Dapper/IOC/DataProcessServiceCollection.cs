using Backend.Infrastructure.Dapper.Impl;
using Backend.Infrastructure.Dapper.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.DependencyInjection;
using System.Data;

namespace IIG.Core.Framework.ICom.Infrastructure.Dapper.IOC
{
    public static class DataProcessServiceCollection
    {
        public static void AddDataProcessServices(this IServiceCollection services)
        {
            var connectionsDic = Backend.Infrastructure.Utils.Utils.GetConfig("ConnectionStrings:Core.Framework");
            services.AddTransient<IDbConnection>((sp) => new SqlConnection(connectionsDic));
            services.AddScoped<IDapperUnitOfWork, DapperUnitOfWork>();
            services.AddScoped<IDapperReposity, DapperReposity>();
        }
    }
}
