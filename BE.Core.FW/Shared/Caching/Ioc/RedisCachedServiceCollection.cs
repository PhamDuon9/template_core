using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Shared.Caching.Common;
using Shared.Caching.Impl;
using Shared.Caching.Interface;
using Shared.Core.Utils;

namespace Shared.Caching.Ioc
{
    public static class RedisCachedServiceCollection
    {
        public static IServiceCollection RegisterIoCs(ref IServiceCollection services)
        {
            var cacheQueueConfig = AppSettings.Instance.Get<CachingConfigModel>("Cache:Redis:Queue");
            var cacheDataConfig = AppSettings.Instance.Get<CachingConfigModel>("Cache:Redis:Data");
            if (cacheDataConfig.Allow)
            {
                services.AddSingleton<ICached>(sv => { return new RedisCached(cacheDataConfig); });
            }
            else
            {
                services.AddSingleton<ICached>(sv => { return new NoCached(); });
            }

            if (cacheQueueConfig.Allow)
            {
                services.AddSingleton<IQueueAndListCached>(sv => { return new RedisCached(cacheQueueConfig); });
            }
            else
            {
                services.AddSingleton<IQueueAndListCached>(sv => { return new NoCacheQueue(); });
            }

            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            return services;
        }
    }
}
