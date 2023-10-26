using System;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Shared.Core.Utils
{
    public static class ConfigType
    {
        public static int QuarterFromMonth(int month)
        {
            return (month - 1) / 3 + 1;
        }
        public static DateTime ConvertDateTime(DateTime inputDate)
        {
            var dateOutput = DateTime.Now;
            if (inputDate.Minute < 30)
            {
                dateOutput = new DateTime(dateOutput.Year, dateOutput.Month, dateOutput.Day, inputDate.Hour, 0, 0);
            }
            else if (inputDate.Minute >= 30)
            {
                dateOutput = new DateTime(dateOutput.Year, dateOutput.Month, dateOutput.Day, inputDate.Hour + 1, 0, 0);
            }
            return dateOutput;
        }
        public static string PassowrdRandomString(int size, bool lowerCase)
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
        public static string PassowrdCreateSalt512()
        {
            var message = PassowrdRandomString(512, false);
            return BitConverter.ToString((new SHA512Managed()).ComputeHash(Encoding.ASCII.GetBytes(message))).Replace("-", "");
        }

        //get random password
        public static string RandomPassword(int numericLength, int lCaseLength, int uCaseLength, int specialLength)
        {
            Random random = new Random();

            //char set random
            string PASSWORD_CHARS_LCASE = "abcdefgijkmnopqrstwxyz";
            string PASSWORD_CHARS_UCASE = "ABCDEFGHJKLMNPQRSTWXYZ";
            string PASSWORD_CHARS_NUMERIC = "1234567890";
            string PASSWORD_CHARS_SPECIAL = "!@#$%^&*()-+<>?";
            if ((numericLength + lCaseLength + uCaseLength + specialLength) < 8)
                return string.Empty;
            else
            {
                //get char
                var strNumeric = new string(Enumerable.Repeat(PASSWORD_CHARS_NUMERIC, numericLength)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                var strUper = new string(Enumerable.Repeat(PASSWORD_CHARS_UCASE, uCaseLength)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                var strSpecial = new string(Enumerable.Repeat(PASSWORD_CHARS_SPECIAL, specialLength)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                var strLower = new string(Enumerable.Repeat(PASSWORD_CHARS_LCASE, lCaseLength)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                //result : ký tự số + chữ hoa + chữ thường + các ký tự đặc biệt > 8
                var strResult = strNumeric + strUper + strSpecial + strLower;
                return strResult;
            }
        }
        public static string PasswordGenerateHMAC(string clearMessage, string secretKeyString)
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
                hmac += String.Format("{0:x2}", x);
            }
            return hmac.ToUpper();
        }
    }

}
