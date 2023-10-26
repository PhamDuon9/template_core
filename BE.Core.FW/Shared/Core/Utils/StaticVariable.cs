using System.Collections.Generic;

namespace Shared.Core.Utils
{
    public static class StaticVariable
    {
        public static readonly int CacheType = AppSettings.Instance.GetInt32("Cache:Redis:UsingModeImplementation", 0);
        public static readonly int CacheDataExpireShortTime = AppSettings.Instance.GetInt32("Cache:Redis:Data:ShortTime", 30);
        public static readonly int CacheDataExpireMediumTime = AppSettings.Instance.GetInt32("Cache:Redis:Data:MediumTime", 60);
        public static readonly int CacheDataExpireLongTime = AppSettings.Instance.GetInt32("Cache:Redis:Data:LongTime", 180);
        public static readonly int CacheDataExpireOneDay = AppSettings.Instance.GetInt32("Cache:Redis:Data:OneDay", 1440);
        public static readonly string CachePrefix = AppSettings.Instance.GetString("Cache:Redis:PreCacheKey", "IIG");
        public static readonly int LoginSessionExperidMinute = AppSettings.Instance.GetInt32("LoginSessionExperidMinute", 60);
        public static readonly string QTHT_API_URL = AppSettings.Instance.GetString("QTHTApiUrl");
        public static readonly Dictionary<string, string> EsConfig = AppSettings.Instance.Get<Dictionary<string, string>>("Elasticsearch");
        public static readonly Dictionary<string, string> WFConfig = AppSettings.Instance.Get<Dictionary<string, string>>("Workflow");
        public static readonly Dictionary<string, string> MdmConfig = AppSettings.Instance.Get<Dictionary<string, string>>("Mdm");
        public static readonly Dictionary<string, string> BackupDatabaseConfig = AppSettings.Instance.Get<Dictionary<string, string>>("AppSettings");
    }
    public static class WFConfig
    {
        public static readonly string ApiUrl = StaticVariable.WFConfig["ApiUrl"];
        public static readonly string WebUrl = StaticVariable.WFConfig["WebUrl"];
    }
}
