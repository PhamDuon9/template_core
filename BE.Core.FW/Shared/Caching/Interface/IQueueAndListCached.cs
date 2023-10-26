using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Caching.Interface
{
    public interface IQueueAndListCached
    {
        void EnQueue(string key, string item);
        Task EnQueueAsync(string key, string item);
        string DeQueue(string key);
        T DeQueue<T>(string key);
        Task<string> DeQueueAsync(string key);
        Task<T> DeQueueAsync<T>(string key);
    }
}
