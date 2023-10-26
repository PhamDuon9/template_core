using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Caching.Common
{
    public class ConnectionMultiplexerHelper
    {
        public ConnectionMultiplexer ConnectionMultipexe;
        public Task<ConnectionMultiplexer> ConnectionMultipexeAsync;
        public ConnectionMultiplexerHelper(CachingConfigModel configuration)
        {
            SetConnectionMutlplexer(configuration, configuration.ServerList);
        }

        private void SetConnectionMutlplexer(CachingConfigModel configuration, List<RedisHostModel> redisHosts)
        {
            try
            {
                if (configuration == null || redisHosts == null)
                {
                    throw new ArgumentNullException("Redis server is null");
                }
                ConfigurationOptions config = new ConfigurationOptions
                {
                    DefaultDatabase = configuration.Database,
                    SyncTimeout = configuration.Timeout,
                    //AsyncTimeout = configuration.Timeout / 2,
                    ClientName = configuration.Name,
                    AbortOnConnectFail = false,
                    ConnectRetry = 3,
                    KeepAlive = 20,
                    Password = configuration.Password,
                    AllowAdmin = configuration.Allow
                };
                foreach (var item in redisHosts)
                {
                    config.EndPoints.Add(item.Host, item.Port);
                }
                config.CommandMap = CommandMap.Create(new HashSet<string>
            { // EXCLUDE a few commands
                "INFO", "CONFIG", "CLUSTER",
                "PING", "ECHO", "CLIENT"
            }, available: false);
                ConnectionMultipexe = new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.Connect(config)).Value;
                ConnectionMultipexeAsync = new Lazy<Task<ConnectionMultiplexer>>(() => ConnectionMultiplexer.ConnectAsync(config)).Value;
            }
            catch (Exception ex)
            {
            }
        }
    }
}
