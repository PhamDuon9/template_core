using System.Collections.Generic;
namespace Shared.Caching.Common
{
    public class CachingConfigModel
    {
        public List<RedisHostModel> ServerList { get; set; }
        public int Database { get; set; }
        public int Timeout { get; set; }
        public string Server { get; set; }
        public int Port { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public bool Allow { get; set; }
    }

    public class RedisHostModel
    {
        public string Host { get; set; }
        public int Port { get; set; }
    }
}
