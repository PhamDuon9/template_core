using Shared.Caching.Interface;
using System.Threading.Tasks;

namespace Shared.Caching.Impl
{
    public class NoCacheQueue : IQueueAndListCached
    {
        public string DeQueue(string key)
        {
            return string.Empty;
        }

        public T DeQueue<T>(string key)
        {
            return default;
        }

        public Task<string> DeQueueAsync(string key)
        {
            return Task.FromResult(string.Empty);
        }

        public Task<T> DeQueueAsync<T>(string key)
        {
            return Task.FromResult(default(T));
        }

        public void EnQueue(string key, string item)
        {
            return;
        }

        public Task EnQueueAsync(string key, string item)
        {
            return Task.FromResult(0);
        }
    }
}
