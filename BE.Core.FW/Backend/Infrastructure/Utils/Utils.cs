using Newtonsoft.Json;
using Serilog;
using System.Text.RegularExpressions;
using System.Text;
using System.Web;
using static Backend.Infrastructure.Utils.Constant;
using static System.Net.Mime.MediaTypeNames;
using DocumentFormat.OpenXml.Drawing.Charts;
using Formatting = Newtonsoft.Json.Formatting;
using System.Security.Cryptography;

namespace Backend.Infrastructure.Utils
{
    public class Utils
    {
        public static string GetConfig(string code)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
                                                                         .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
                                                                         .Build();

            var value = configuration[code];
            return value;
        }

        public static string ConvertImageIntoBase64(string filePath)
        {
            byte[] imageArray = System.IO.File.ReadAllBytes(filePath);
            string base64ImageRepresentation = Convert.ToBase64String(imageArray);
            return base64ImageRepresentation;
        }

        public static bool IsGuid(string value)
        {
            Guid x;
            return Guid.TryParse(value, out x);
        }

        public static string GetFileContentType(string fileName)
        {
            if (!new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider().TryGetContentType(fileName, out var contentType))
                contentType = "application/octet-stream";

            return contentType;
        }

        public static void LogRequest(HttpRequest request, object? body = null)
        {
            var requestId = Guid.NewGuid().ToString();
            var logText = "Request: " + requestId + " - " + request.HttpContext.Connection.RemoteIpAddress + ":" + request.HttpContext.Connection.RemotePort + "\r\n";
            logText += "Method: " + request.Method + "\r\n";
            logText += "Path: " + request.Path + "\r\n";
            if (request.QueryString.HasValue)
                logText += "QueryString: " + HttpUtility.UrlDecode(request.QueryString.Value!) + "\r\n";
            request.Headers.Add("RequestId", requestId);
            foreach (var header in request.Headers)
            {
                if (header.Key == "Authorization")
                    logText += "Headers: " + header.Key + ": " + header.Value + "\r\n";
            }
            logText += "Body: " + JsonConvert.SerializeObject(body, Formatting.Indented) + "\r\n";

            Log.Information(logText);
        }

        public static void LogResponse(string requestId, object data)
        {
            var logText = "Reponse: " + requestId + "\r\n";
            logText += JsonConvert.SerializeObject(data, Formatting.Indented) + "\r\n";
            Log.Information(logText);
        }

        static Regex? ConvertToUnsign_rg = null;
        public static string ConvertToUnsign(string strInput)
        {
            if (ReferenceEquals(ConvertToUnsign_rg, null))
            {
                ConvertToUnsign_rg = new Regex("p{IsCombiningDiacriticalMarks}+");
            }
            var temp = strInput.Normalize(NormalizationForm.FormD);
            return ConvertToUnsign_rg.Replace(temp, string.Empty).Replace("đ", "d").Replace("Đ", "D").ToLower();
        }

        public static string RemoveUnicode(string text)
        {
            string[] arr1 = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
    "đ",
    "é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ",
    "í","ì","ỉ","ĩ","ị",
    "ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ",
    "ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự",
    "ý","ỳ","ỷ","ỹ","ỵ",};
            string[] arr2 = new string[] { "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
    "d",
    "e","e","e","e","e","e","e","e","e","e","e",
    "i","i","i","i","i",
    "o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o",
    "u","u","u","u","u","u","u","u","u","u","u",
    "y","y","y","y","y",};
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
                text = text.Replace(arr1[i].ToUpper(), arr2[i].ToUpper());
            }
            return text;
        }

        public static string RemoveSpecialCharacters(string str)
        {
            StringBuilder sb = new StringBuilder();
            foreach (char c in str)
            {
                if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '.' || c == '_')
                {
                    sb.Append(c);
                }
            }
            return sb.ToString();
        }

        public static string ConvertJob(string id, string? other)
        {
            var result = string.Empty;
            switch (id)
            {
                case "1":
                    result = "HS/SV";
                    break;
                case "2":
                    result = "Viên chức";
                    break;
                case "3":
                    result = "Nhân viên VP";
                    break;
                case "4":
                    result = "KD tự do";
                    break;
                case "5":
                    result = "Nội trợ";
                    break;
                case "6":
                    result = "Giáo viên";
                    break;
                case "7":
                    result = "Thất nghiệp";
                    break;
                case "8":
                    result = "Khác " + other;
                    break;
            }
            return result;
        }

        public static string ConvertPurpose(string id)
        {
            string result = string.Empty;
            switch (id)
            {
                case "1":
                    result = "Đánh giá trình độ";
                    break;
                case "2":
                    result = "Du học";
                    break;
                case "3":
                    result = "Xin việc hoặc nâng ngạch";
                    break;
                case "4":
                    result = "Xét tốt nghiệp";
                    break;
            }
            return result;
        }

        public static string ConvertKnowWhere(string id)
        {
            string stringResult = string.Empty;
            switch (id)
            {
                case "1":
                    stringResult = "Truyền hình";
                    break;
                case "2":
                    stringResult = "Báo chí";
                    break;
                case "3":
                    stringResult = "Tạp chí";
                    break;
                case "4":
                    stringResult = "Cơ quan giáo dục(Trường ĐH, trung tâm ngoại ngữ)";
                    break;
                case "5":
                    stringResult = "Poster";
                    break;
                case "6":
                    stringResult = "Người quen";
                    break;
                case "7":
                    stringResult = "Bạn bè";
                    break;
                case "8":
                    stringResult = "Internet";
                    break;
                case "9":
                    stringResult = "Khác";
                    break;
                case "10":
                    stringResult = "Người thân (gia đình, bạn bè,...)";
                    break;
                case "11":
                    stringResult = "Trang chủ TOPIK";
                    break;
            }
            return stringResult;
        }


        public static string ConvertPurposeTopik(string id)
        {
            string result = string.Empty;
            switch (id)
            {
                case "1":
                    result = "Du học";
                    break;
                case "2":
                    result = "Xin việc";
                    break;
                case "3":
                    result = "Du lịch";
                    break;
                case "4":
                    result = "Nghiên cứu học thuật";
                    break;
                case "5":
                    result = "Kiểm tra năng lực tiếng Hàn";
                    break;
                case "6":
                    result = "Tìm hiểu văn hoá Hàn Quốc";
                    break;
                case "7":
                    result = "Khác";
                    break;
                case "8":
                    result = "Xin VISA hoặc Thẻ cư trú";
                    break;
                case "9":
                    result = "Đạt thành tích học tập";
                    break;
                case "10":
                    result = "Tham gia hoạt động xã hội";
                    break;
                case "15":
                    result = "Quản lý tư cách lưu trú";
                    break;
            }
            return result;
        }

        public static int GetBusinessDays(DateTime start, DateTime end)
        {
            if (start.DayOfWeek == DayOfWeek.Saturday)
            {
                start = start.AddDays(2);
            }
            else if (start.DayOfWeek == DayOfWeek.Sunday)
            {
                start = start.AddDays(1);
            }

            if (end.DayOfWeek == DayOfWeek.Saturday)
            {
                end = end.AddDays(-1);
            }
            else if (end.DayOfWeek == DayOfWeek.Sunday)
            {
                end = end.AddDays(-2);
            }
            int diff = (int)end.Subtract(start).TotalDays;
            int result = diff / 7 * 5 + diff % 7;

            if (end.DayOfWeek < start.DayOfWeek)
            {
                return result - 2;
            }
            else
            {
                return result;
            }
        }

        public static string HmacSHA512(string inputData)
        {
            var keyEncrpt = GetConfig("VnPayConfig:Key");
            var hash = new StringBuilder();
            var keyBytes = Encoding.UTF8.GetBytes(keyEncrpt);
            var inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                    hash.Append(theByte.ToString("x2"));
            }

            return hash.ToString();
        }
    }
}
