using System.Collections.Generic;
using Microsoft.Extensions.Configuration;

namespace Shared.Core.Utils
{
    public class AppSettings
    {
        private static AppSettings _instance;
        private static readonly object ObjLocked = new object();
        private IConfiguration _configuration;

        protected AppSettings()
        {
        }

        public void SetConfiguration(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public static AppSettings Instance
        {
            get
            {
                if (null == _instance)
                {
                    lock (ObjLocked)
                    {
                        if (null == _instance)
                            _instance = new AppSettings();
                    }
                }
                return _instance;
            }
        }

        public bool GetBool(string key, bool defaultValue = false)
        {
            try
            {
                string value = Get<string>(key);
                if (!string.IsNullOrEmpty(value))
                {
                    return value.ToBool();
                }
                else
                {
                    return defaultValue;
                }
            }
            catch
            {
                return defaultValue;
            }
        }

        public string GetConnection(string key, string defaultValue = "")
        {
            try
            {
                return _configuration.GetConnectionString(key);
            }
            catch
            {
                return defaultValue;
            }
        }

        public int GetInt32(string key, int defaultValue = 0)
        {
            try
            {
                string value = Get<string>(key);
                if (!string.IsNullOrEmpty(value))
                {
                    return value.ToInt();
                }
                else
                {
                    return defaultValue;
                }
            }
            catch
            {
                return defaultValue;
            }
        }

        public long GetInt64(string key, long defaultValue = 0L)
        {
            try
            {
                string value = Get<string>(key);
                if (!string.IsNullOrEmpty(value))
                {
                    return value.ToLong();
                }
                else
                {
                    return defaultValue;
                }
            }
            catch
            {
                return defaultValue;
            }
        }

        public string GetString(string key, string defaultValue = "")
        {
            try
            {
                string value = Get<string>(key);
                return (!string.IsNullOrEmpty(value) ? value : defaultValue);
            }
            catch
            {
                return defaultValue;
            }
        }

        public T Get<T>(string key = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(key))
                    return _configuration.Get<T>();
                else
                {
                    T value = _configuration.GetSection(key).Get<T>();
                    return value;
                }
            }
            catch (System.Exception)
            {
                return default;
            }
        }

        public T Get<T>(string key, T defaultValue)
        {
            if (_configuration.GetSection(key) == null)
                return defaultValue;

            if (string.IsNullOrWhiteSpace(key))
                return _configuration.Get<T>();
            var value = _configuration.GetSection(key).Get<T>();
            return (value == null || EqualityComparer<T>.Default.Equals(value, default)) ? defaultValue : value;
        }

        public static T GetObject<T>(string key = null)
        {
            if (string.IsNullOrWhiteSpace(key))
                return Instance._configuration.Get<T>();
            else
            {
                var section = Instance._configuration.GetSection(key);
                return section.Get<T>();
            }
        }

        public static T GetObject<T>(string key, T defaultValue)
        {
            if (Instance._configuration.GetSection(key) == null)
                return defaultValue;

            if (string.IsNullOrWhiteSpace(key))
                return Instance._configuration.Get<T>();
            else
                return Instance._configuration.GetSection(key).Get<T>();
        }
    }
}
