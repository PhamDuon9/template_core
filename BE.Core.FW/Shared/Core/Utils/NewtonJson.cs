using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Core.Utils
{
    public class NewtonJson
    {
        private static readonly JsonSerializerSettings MicrosoftDateFormatSettings;

        static NewtonJson()
        {
            var settings = new JsonSerializerSettings
            {
                DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
            };
            MicrosoftDateFormatSettings = settings;
        }

        public static T Deserialize<T>(string jsonString)
        {
            return JsonConvert.DeserializeObject<T>(jsonString, MicrosoftDateFormatSettings);
        }

        public static T Deserialize<T>(string jsonString, string dateTimeFormat)
        {
            var converters = new JsonConverter[1];
            var converter = new IsoDateTimeConverter
            {
                DateTimeFormat = dateTimeFormat
            };
            converters[0] = converter;
            return JsonConvert.DeserializeObject<T>(jsonString, converters);
        }

        public static object DeserializeObject(string jsonString, Type type)
        {
            return JsonConvert.DeserializeObject(jsonString, type);
        }

        public static string Serialize(object @object)
        {
            return JsonConvert.SerializeObject(@object, MicrosoftDateFormatSettings);
        }

        public static string Serialize(object @object, string dateTimeFormat)
        {

            var converters = new JsonConverter[1];
            var converter = new IsoDateTimeConverter
            {
                DateTimeFormat = dateTimeFormat
            };
            converters[0] = converter;
            return JsonConvert.SerializeObject(@object, converters);
        }
    }
}
