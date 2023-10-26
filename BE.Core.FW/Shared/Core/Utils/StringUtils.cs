using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Mail;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Shared.Core.Utils
{
    public static class StringUtils
    {
        public static string NewLineToBr(string text)
        {
            if (string.IsNullOrEmpty(text))
                return string.Empty;
            else
            {
                var builder = new StringBuilder();
                var lines = text.Split('\n');
                for (var i = 0; i < lines.Length; i++)
                {
                    if (i > 0)
                        builder.Append("<br/>\n");
                    builder.Append(lines[i]);
                }
                return builder.ToString();
            }
        }
        public static string CalculateMD5Hash(string input)
        {
            // step 1, calculate MD5 hash from input
            var md5 = MD5.Create();
            var inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
            var hash = md5.ComputeHash(inputBytes);

            // step 2, convert byte array to hex string
            var sb = new StringBuilder();
            for (var i = 0; i < hash.Length; i++)
            {
                sb.Append(hash[i].ToString("X2"));
            }
            return sb.ToString();
        }

        public static string QuoteString(string inputString)
        {
            var str = inputString.Trim();
            if (str != "")
            {
                str = str.Replace("'", "''");
            }
            return str;
        }

        public static string AddSlash(string input)
        {
            var str = !string.IsNullOrEmpty(input) ? input.Trim() : "";
            if (str != "")
            {
                str = str.Replace("'", "'").Replace("\"", "\\\"");
            }
            return str;
        }

        public static string RefreshText(string text)
        {
            if (string.IsNullOrEmpty(text) || string.IsNullOrEmpty(text.Trim())) return text;

            text = HttpUtility.HtmlDecode(text);

            text = HttpUtility.UrlDecode(text);

            return text;
        }

        public static string RemoveStrHtmlTags(object inputObject)
        {
            if (inputObject == null)
            {
                return string.Empty;
            }
            var input = Convert.ToString(inputObject).Trim();
            if (input != "")
            {
                input = Regex.Replace(input, @"<(.|\n)*?>", string.Empty);
            }
            return input;
        }

        public static string ReplaceSpaceToPlus(string input)
        {
            if (!string.IsNullOrEmpty(input))
            {
                return Regex.Replace(input, @"\s+", "+", RegexOptions.IgnoreCase);
            }
            return input;
        }

        public static string ReplaceSpecialCharater(object inputObject)
        {
            if (inputObject == null)
            {
                return string.Empty;
            }
            return Convert.ToString(inputObject).Trim().Trim().Replace(@"\", @"\\").Replace("\"", "&quot;").Replace("“", "&ldquo;").Replace("”", "&rdquo;").Replace("‘", "&lsquo;").Replace("’", "&rsquo;").Replace("'", "&#39;");
        }

        public static string JavaScriptSring(string input)
        {
            input = input.Replace("'", @"\u0027");
            input = input.Replace("\"", @"\u0022");
            return input;
        }

        public static int CountWords(string stringInput)
        {
            if (string.IsNullOrEmpty(stringInput))
            {
                return 0;
            }
            stringInput = RemoveStrHtmlTags(stringInput);
            return Regex.Matches(stringInput, @"[\S]+").Count;
        }

        public static string GetEnumDescription(Enum value)
        {
            try
            {
                var fi = value.GetType().GetField(value.ToString());

                var attributes =
                    (DescriptionAttribute[])fi.GetCustomAttributes(
                        typeof(DescriptionAttribute),
                        false);

                return attributes.Length > 0 ? attributes[0].Description : value.ToString();
            }
            catch
            {
                return string.Empty;
            }
        }

        public static string GetPropertyDisplayName<T>(Expression<Func<T, object>> propertyExpression)
        {
            var memberInfo = GetPropertyInformation(propertyExpression.Body);
            if (memberInfo == null)
            {
                throw new ArgumentException(
                    "No property reference expression was found.",
                    "propertyExpression");
            }

            var attr = memberInfo.GetAttribute<DisplayNameAttribute>(false);
            if (attr == null)
            {
                return memberInfo.Name;
            }

            return attr.DisplayName;
        }

        public static MemberInfo GetPropertyInformation(Expression propertyExpression)
        {
            //Debug.Assert(propertyExpression != null, "propertyExpression != null");
            var memberExpr = propertyExpression as MemberExpression;
            if (memberExpr == null && propertyExpression is UnaryExpression unaryExpr && unaryExpr.NodeType == ExpressionType.Convert)
            {
                memberExpr = unaryExpr.Operand as MemberExpression;
            }

            if (memberExpr != null && memberExpr.Member.MemberType == MemberTypes.Property)
            {
                return memberExpr.Member;
            }

            return null;
        }

        public static string SubWordInString(object obj, int maxWord, bool removeHTML = false)
        {
            if (obj == null)
            {
                return string.Empty;
            }

            if (removeHTML) obj = RemoveStrHtmlTags(obj);

            var input = Regex.Replace(Convert.ToString(obj), @"\s+", " ");

            var strArray = Regex.Split(input, " ");
            if (strArray.Length <= maxWord)
            {
                return input;
            }
            input = string.Empty;
            for (var i = 0; i < maxWord; i++)
            {
                input = input + strArray[i] + " ";
            }
            return string.Concat(input.Trim(), "...");
        }

        public static string SubWordInDotString(object obj, int maxWord, string extensionEnd = " ...")
        {
            if (obj == null)
            {
                return string.Empty;
            }
            var input = Regex.Replace(Convert.ToString(obj), @"\s+", " ");
            var strArray = Regex.Split(input, " ");
            if (strArray.Length <= maxWord)
            {
                return input;
            }
            input = string.Empty;
            for (var i = 0; i < maxWord; i++)
            {
                input = input + strArray[i] + " ";
            }
            return (input.Trim() + extensionEnd);
        }

        public static string StripHtml(string html)
        {
            return (string.IsNullOrEmpty(html) ? string.Empty : Regex.Replace(html, "<.*?>", string.Empty));
        }

        public static string TrimText(object strIn, int intLength)
        {
            try
            {
                var str = StripHtml(Convert.ToString(strIn));
                if (str.Length > intLength)
                {
                    str = str.Substring(0, intLength - 4);
                    return (str.Substring(0, str.LastIndexOfAny(new char[] { ' ', '.', '?', ',', '!' })) + " ...");
                }
                return str;
            }
            catch (Exception)
            {
                return Convert.ToString(strIn);
            }
        }

        public static string FormatNumber(string sNumber, string sperator = ".")
        {
            var num = 3;
            var num2 = 0;
            for (var i = 1; i <= (sNumber.Length / 3); i++)
            {
                if ((num + num2) < sNumber.Length)
                {
                    sNumber = sNumber.Insert((sNumber.Length - num) - num2, sperator);
                }
                num += 3;
                num2++;
            }
            return sNumber;
        }

        public static string FormatNumberWithComma(string sNumber)
        {
            var num = 3;
            var num2 = 0;
            for (var i = 1; i <= (sNumber.Length / 3); i++)
            {
                if ((num + num2) < sNumber.Length)
                {
                    sNumber = sNumber.Insert((sNumber.Length - num) - num2, ",");
                }
                num += 3;
                num2++;
            }
            return sNumber;
        }

        public static bool IsValidWord(string input, char character)
        {
            if (string.IsNullOrEmpty(input))
            {
                return true;
            }
            var arr = input.Split(character);
            for (var i = 0; i < arr.Length; i++)
            {
                if (arr[i].Length > 30)
                {
                    return false;
                }
            }
            return true;
        }

        public static bool IsValidEmail(string emailaddress)
        {
            try
            {
                var m = new MailAddress(emailaddress);

                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        public static string GetMetaDescription(string format, params object[] args)
        {
            if (string.IsNullOrEmpty(format)) return string.Empty;

            var strDes = format;

            if (args != null && args.Length > 0)
            {
                strDes = string.Format(strDes, args);
            }

            return strDes;
        }

        public static string ConvertNumberToCurrency(double number, string sperator = ".", string currentcy = "")
        {
            if (number <= 0)
            {
                return "0";
            }

            number = Math.Round(number, 0);

            var output = StringUtils.FormatNumber(number.ToString(CultureInfo.CurrentCulture), sperator) + currentcy;

            return output;
        }

        public static string ReplaceCaseInsensitive(string input, string[] search, string[] replacement)
        {
            int lenSearch = search.Length, lenRepalace = replacement.Length;
            var result = string.Empty;
            for (var i = 0; i < lenSearch; i++)
            {
                for (var j = 0; j < lenRepalace; j++)
                {
                    result = Regex.Replace(
                        input,
                        Regex.Escape(search[i]),
                        replacement[j].Replace("$", "$$"),
                        RegexOptions.IgnoreCase
                    ).Trim();
                    input = result;
                }
            }

            return result;
        }

        public static string GetStringTreeview(int level)
        {
            if (level == 0) return string.Empty;

            var strLevel = "";
            for (var i = 0; i < level; i++)
            {
                strLevel = strLevel + "__ ";
            }
            return strLevel;
        }

        public static string TrimTextByLimitCharacters(string strIn, int intLength)
        {
            return strIn.Length > intLength ? strIn.Substring(0, intLength) : strIn;
        }

        #region Unicode Process

        public const string uniChars =
            "àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴÂĂĐÔƠƯ";

        public const string unsignChar =
            "aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAAEEEEEEEEEEEDIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYAADOOU";

        public static string UnicodeToUnsignChar(string s)
        {
            if (string.IsNullOrEmpty(s)) return s;
            var retVal = string.Empty;
            int pos;
            for (var i = 0; i < s.Length; i++)
            {
                pos = uniChars.IndexOf(s[i].ToString());
                if (pos >= 0)
                    retVal += unsignChar[pos];
                else
                    retVal += s[i];
            }
            return retVal;
        }

        public static string UnicodeToUnsignCharAndDash(string s)
        {
            if (string.IsNullOrEmpty(s)) return string.Empty;
            const string strChar = "abcdefghijklmnopqrstxyzuvxw0123456789 -";
            //string retVal = UnicodeToKoDau(s);
            s = UnicodeToUnsignChar(s.ToLower().Trim());
            var sReturn = "";
            for (var i = 0; i < s.Length; i++)
            {
                if (strChar.IndexOf(s[i]) > -1)
                {
                    if (s[i] != ' ')
                        sReturn += s[i];
                    else if (i > 0 && s[i - 1] != ' ' && s[i - 1] != '-')
                        sReturn += "-";
                }
            }
            while (sReturn.IndexOf("--") != -1)
            {
                sReturn = sReturn.Replace("--", "-");
            }
            return sReturn;
        }

        public static string RemoveSpecial(string s)
        {
            //const string REGEX = @"([^\w\dàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴÂĂĐÔƠƯ\.,\-_ ]+)";
            //s = Regex.Replace(s, REGEX, string.Empty, RegexOptions.IgnoreCase);

            return Regex.Replace(s, "[`~!@#$%^&*()_|+-=?;:'\"<>{}[]\\/]", string.Empty); //edited by vinhph
        }

        public static string RemoveSpecial4ModelDetail(string s)
        {
            var result = string.Empty;
            if (!string.IsNullOrEmpty(s))
            {
                result = Regex.Replace(s, "[+*%/^&:]", string.Empty, RegexOptions.IgnoreCase);
            }
            return result;
        }

        public static string ReplaceSpecial4ModelDetail(string s)
        {
            var result = string.Empty;
            result = Regex.Replace(s, "plus", "+", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "star", "*", RegexOptions.IgnoreCase);
            result = Regex.Replace(result, "per", "%", RegexOptions.IgnoreCase);
            return result;
        }

        public static string UnicodeToKoDauAndSpace(string s)
        {
            if (string.IsNullOrEmpty(s)) return string.Empty;
            var retVal = string.Empty;
            int pos;
            for (var i = 0; i < s.Length; i++)
            {
                pos = uniChars.IndexOf(s[i].ToString());
                if (pos >= 0)
                    retVal += unsignChar[pos];
                else
                    retVal += s[i];
            }
            return retVal;
        }

        /// <summary>
        /// loại bỏ các ký tự không phải chữ, số, dấu cách thành ký tự không dấu
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string RemoveSpecialCharToKhongDau(string s)
        {
            var retVal = UnicodeToUnsignChar(s);
            var regex = new Regex(@"[^\d\w]+");
            retVal = regex.Replace(retVal, " ");
            while (retVal.IndexOf("  ") != -1)
            {
                retVal = retVal.Replace("  ", " ");
            }
            return retVal;
        }

        public static string EncodeForRedirect(this string urlOrigin)
        {
            if (!string.IsNullOrWhiteSpace(urlOrigin))
                return string.Join("/", urlOrigin.Split("/").Select(s => System.Net.WebUtility.UrlEncode(s)));
            return urlOrigin;
        }

        #endregion Unicode Process

        public static string CreateSalt512()
        {
            var message = RandomString(512, false);
            return BitConverter.ToString((new SHA512Managed()).ComputeHash(Encoding.ASCII.GetBytes(message))).Replace("-", "");
        }

        public static string RandomString(int size, bool lowerCase)
        {
            var builder = new StringBuilder();
            var random = new Random();
            for (int i = 0; i < size; i++)
            {
                char ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }
            return lowerCase ? builder.ToString().ToLower() : builder.ToString();
        }

        public static string GenerateHMAC(string clearMessage, string secretKeyString)
        {
            var encoder = new ASCIIEncoding();
            var messageBytes = encoder.GetBytes(clearMessage);
            var secretKeyBytes = new byte[secretKeyString.Length / 2];
            for (int index = 0; index < secretKeyBytes.Length; index++)
            {
                string byteValue = secretKeyString.Substring(index * 2, 2);
                secretKeyBytes[index] = byte.Parse(byteValue, NumberStyles.HexNumber, CultureInfo.InvariantCulture);
            }
            var hmacsha512 = new HMACSHA512(secretKeyBytes);
            byte[] hashValue = hmacsha512.ComputeHash(messageBytes);
            string hmac = "";
            foreach (byte x in hashValue)
            {
                hmac += string.Format("{0:x2}", x);
            }
            return hmac.ToUpper();
        }
    }
}
