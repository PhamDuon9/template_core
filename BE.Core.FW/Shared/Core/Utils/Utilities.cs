using Microsoft.IdentityModel.Tokens;
using System;
using System.IO;
using System.Linq;
using System.Security.AccessControl;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Text.RegularExpressions;

namespace Shared.Core.Utils
{
    public partial class Utilities
    {
        public static string MD5Hash(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                input = "IIG-Util";
            }
            StringBuilder hash = new StringBuilder();
            MD5CryptoServiceProvider md5provider = new MD5CryptoServiceProvider();
            byte[] bytes = md5provider.ComputeHash(new UTF8Encoding().GetBytes(input));

            for (int i = 0; i < bytes.Length; i++)
            {
                hash.Append(bytes[i].ToString("x2"));
            }
            return hash.ToString();
        }
        private static readonly string[] VietnameseSigns = new string[]
        {
        "aAeEoOuUiIdDyY-",
        "áàạảãâấầậẩẫăắằặẳẵ",
        "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
        "éèẹẻẽêếềệểễ",
        "ÉÈẸẺẼÊẾỀỆỂỄ",
        "óòọỏõôốồộổỗơớờợởỡ",
        "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
        "úùụủũưứừựửữ",
        "ÚÙỤỦŨƯỨỪỰỬỮ",
        "íìịỉĩ",
        "ÍÌỊỈĨ",
        "đ",
        "Đ",
        "ýỳỵỷỹ",
        "ÝỲỴỶỸ",
        " "
        };

        public static bool ishaveVietnameseSign(string str)
        {
            for (int i = 1; i < VietnameseSigns.Length - 1; i++)
            {

                for (int j = 0; j < VietnameseSigns[i].Length; j++)
                {
                    if (str.Contains(VietnameseSigns[i][j]))
                    {
                        return true;
                    }
                }

            }
            return false;
        }
        public static string removeVietnameseSign(string str)
        {

            for (int i = 1; i < VietnameseSigns.Length; i++)
            {

                for (int j = 0; j < VietnameseSigns[i].Length; j++)

                    str = str.Replace(VietnameseSigns[i][j], VietnameseSigns[0][i - 1]);

            }

            return str;

        }
        public static string BuildVietnameseSign(string str)
        {

            for (int i = 1; i < VietnameseSigns.Length; i++)
            {

                for (int j = 0; j < VietnameseSigns[i].Length; j++)

                    str = str.Replace(VietnameseSigns[0][i - 1], VietnameseSigns[i][j]);

            }

            return str;

        }
        /// <summary>
        /// Convert url title
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public static string ConvertToUrlTitle(string name)
        {
            string strNewName = name;

            #region Replace unicode chars
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = name.Normalize(NormalizationForm.FormD);
            strNewName = regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
            #endregion

            #region Replace special chars
            string strSpecialString = "~\"“”#%&*:;<>?/\\{|}.+_@$^()[]`,!-'";

            foreach (char c in strSpecialString)
            {
                strNewName = strNewName.Replace(c, ' ');
            }
            #endregion

            #region Replace space

            // Create the Regex.
            var r = new Regex(@"\s+");
            // Strip multiple spaces.
            strNewName = r.Replace(strNewName, @" ").Replace(" ", "-").Trim('-');

            #endregion)

            return strNewName;
        }

        /// <summary>
        /// Check if a string is a guid or not
        /// </summary>
        /// <param name="inputString"></param>
        /// <returns></returns>
        public static bool IsGuid(string inputString)
        {
            try
            {
                var guid = new Guid(inputString);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public static bool IsNumber(string inputString)
        {
            try
            {
                var guid = int.Parse(inputString);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static string GeneratePageUrl(string pageTitle)
        {
            var result = removeVietnameseSign(pageTitle);

            // Replace spaces
            result = result.Replace(" ", "-");

            // Replace double spaces
            result = result.Replace("--", "-");

            // Remove triple spaces
            result = result.Replace("---", "-");

            return result;

        }

        public static string GetPublishTime(DateTime? publishOnDate, string siteLanguage, string format)
        {
            try
            {
                if (publishOnDate.HasValue)
                {
                    // Init result default
                    string result = publishOnDate.Value.ToString(format);

                    var dateTimeNow = DateTime.Now;
                    //Check today
                    if (DateTime.Compare(new DateTime(dateTimeNow.Year, dateTimeNow.Month, dateTimeNow.Day), new DateTime(publishOnDate.Value.Year, publishOnDate.Value.Month, publishOnDate.Value.Day)) == 0)
                    {
                        //Caculator time ago
                        TimeSpan tp = dateTimeNow - publishOnDate.Value;
                        if (tp.Hours > 0)
                        {
                            if (tp.Hours == 1) result = siteLanguage == "vn" ? "1 giờ trước" : "1 hour ago";
                            else result = siteLanguage == "vn" ? tp.Hours.ToString() + " giờ trước" : tp.Hours.ToString() + " hours ago";
                        }
                        else
                        {
                            if (tp.Minutes < 2) result = siteLanguage == "vn" ? "1 phút trước" : "1 minute ago";
                            else result = siteLanguage == "vn" ? tp.Minutes.ToString() + " phút trước" : tp.Minutes.ToString() + " minutes ago";
                        }
                    }
                    return result;
                }
                else return null;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
    public class TokenInfo
    {
        public int Type { get; set; }
        public Guid ObjectId { get; set; }
        public int Level { get; set; }
        public long Tick { get; set; }
        public DateTime DateTimeExpired { get; set; }
    }
    public static class TokenHelpers
    {
        #region basic token

        /// <summary>
        /// Tạo token theo key
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string CreateBasicToken(string key)
        {
            try
            {
                string token = string.Empty;

                byte[] keyData = Encoding.UTF8.GetBytes(key);

                // Token chứa mã đối tượng tải về
                if (keyData != null) token = Convert.ToBase64String(keyData.ToArray());
                //Safe URl
                token = Base64UrlEncoder.Encode(token);
                return token;
            }
            catch (Exception)
            {
                throw;
            }

        }

        /// <summary>
        /// Lấy key theo token
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public static string GetKeyFromBasicToken(string token)
        {
            try
            {
                //Safe URl
                token = Base64UrlEncoder.Decode(token);
                string key = string.Empty;

                if (IsBase64(token))
                {
                    byte[] dataToken = Convert.FromBase64String(token);

                    if (dataToken != null) key = Encoding.UTF8.GetString(dataToken);
                }
                return key;
            }
            catch (Exception)
            {

                throw;
            }
        }
        #endregion

        #region token download

        /// <summary>
        /// Tạo token chứa mã đối tượng, thời gian hiệu lực
        /// </summary>
        /// <param name="objectId">mã đối tượng</param>
        /// <param name="ticks">thời gian hiệu lực</param>
        /// <param name="keyEncrypt">khóa mã hóa</param>
        /// <returns></returns>
        public static string CreateUniqueTokenDownload(string objectId, long ticks, string keyEncrypt)
        {
            try
            {
                string token = string.Empty;

                byte[] key = Encoding.UTF8.GetBytes(objectId);
                byte[] time = Encoding.UTF8.GetBytes(ticks.ToString());

                // Token chứa thông tin thời gian hết hạn và mã đối tượng tải về
                if (time.Concat(key) != null) token = Convert.ToBase64String(key.Concat(time).ToArray());

                // Mã hóa token
                if (!string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(keyEncrypt)) token = Encrypt.EncryptText(token, keyEncrypt);
                //Safe URl
                token = Base64UrlEncoder.Encode(token);
                return token;
            }
            catch (Exception)
            {
                throw;
            }

        }

        /// <summary>
        /// Lấy thời gian hết hạn theo token
        /// </summary>
        /// <param name="token">mã đối tượng</param>
        /// <param name="keyEncrypt">khóa mã hóa</param>
        /// <returns></returns>
        public static DateTime GetDateTimeExpiredDownload(string token, string keyEncrypt)
        {
            try
            {
                //Safe URl
                token = Base64UrlEncoder.Decode(token);
                // Giải mã chuỗi token nếu dùng mã hóa
                if (!string.IsNullOrEmpty(token))
                {
                    if (!string.IsNullOrEmpty(keyEncrypt))
                        token = Encrypt.DecryptText(token, keyEncrypt);
                    token = token.Replace("\0", string.Empty);
                }

                DateTime unixYear0 = new DateTime(1970, 1, 1, 0, 0, 1);
                DateTime dateTimeExpired = DateTime.Now;

                string timeTicksExpiredString = string.Empty;

                if (IsBase64(token))
                {
                    byte[] dataToken = Convert.FromBase64String(token);
                    if (dataToken != null)
                    {
                        byte[] dataTick = new byte[dataToken.Length - 36];

                        Array.Copy(dataToken, 36, dataTick, 0, dataToken.Length - 36);
                        if (dataTick != null) timeTicksExpiredString = Encoding.UTF8.GetString(dataTick);
                        if (!string.IsNullOrEmpty(timeTicksExpiredString))
                        {
                            long ticks = long.Parse(timeTicksExpiredString);
                            dateTimeExpired = new DateTime(unixYear0.Ticks + ticks);
                        }
                    }
                }

                return dateTimeExpired;
            }
            catch (Exception)
            {

                throw;
            }

        }
        /// <summary>
        /// Lấy mã đối tượng theo token
        /// </summary>
        /// <param name="token">mã đối tượng</param>
        /// <param name="keyEncrypt">khóa mã hóa</param>
        /// <returns></returns>
        public static Guid GetObjectIdDownload(string token, string keyEncrypt)
        {
            try
            {
                //Safe URl
                token = Base64UrlEncoder.Decode(token);
                // Giải mã chuỗi token nếu sử dụng mã hóa
                if (!string.IsNullOrEmpty(token))
                {
                    if (!string.IsNullOrEmpty(keyEncrypt))
                        token = Encrypt.DecryptText(token, keyEncrypt);
                    token = token.Replace("\0", string.Empty);
                }

                Guid objectId = Guid.Empty;

                if (IsBase64(token))
                {
                    string objectStringId = string.Empty;
                    byte[] dataToken = Convert.FromBase64String(token);
                    byte[] dataGuid = new byte[36];
                    Array.Copy(dataToken, 0, dataGuid, 0, 36);
                    if (dataGuid != null) objectStringId = Encoding.UTF8.GetString(dataGuid);

                    if (!string.IsNullOrEmpty(objectStringId) && Utilities.IsGuid(objectStringId))
                    {
                        objectId = new Guid(objectStringId);
                    }
                }


                return objectId;
            }
            catch (Exception)
            {

                throw;
            }

        }
        #endregion
        #region token tokenInfo
        /// <summary>
        /// Tạo token
        /// </summary>
        /// <param name="tokenInfo"></param>
        /// <param name="keyEncrypt"></param>
        /// <returns></returns>
        public static string CreateToken(TokenInfo tokenInfo, string keyEncrypt)
        {
            try
            {
                string token = string.Empty;

                byte[] objectId = Encoding.UTF8.GetBytes(tokenInfo.ObjectId.ToString());
                byte[] level = Encoding.UTF8.GetBytes(tokenInfo.Level.ToString());
                byte[] tick = Encoding.UTF8.GetBytes(tokenInfo.Tick.ToString());

                // Token chứa thông tin thời gian hết hạn và mã đối tượng tải về
                if (level.Concat(objectId).Concat(tick) != null) token = Convert.ToBase64String(level.Concat(objectId).Concat(tick).ToArray());
                // Mã hóa token
                if (!string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(keyEncrypt)) token = Encrypt.EncryptText(token, keyEncrypt);
                //Safe URl
                token = Base64UrlEncoder.Encode(token);
                return token;
            }
            catch (Exception)
            {
                throw;
            }

        }
        /// <summary>
        /// Lấy token
        /// </summary>
        /// <param name="token"></param>
        /// <param name="keyEncrypt"></param>
        /// <returns></returns>
        public static TokenInfo GetToken(string token, string keyEncrypt)
        {
            try
            {
                //Safe URl
                token = Base64UrlEncoder.Decode(token);
                // Giải mã chuỗi token nếu dùng mã hóa
                if (!string.IsNullOrEmpty(token))
                {
                    if (!string.IsNullOrEmpty(keyEncrypt))
                        token = Encrypt.DecryptText(token, keyEncrypt);
                    token = token.Replace("\0", string.Empty);
                }

                if (IsBase64(token))
                {
                    byte[] dataToken = Convert.FromBase64String(token);
                    if (dataToken != null)
                    {
                        var result = new TokenInfo();
                        byte[] dataLevel = new byte[1];
                        Array.Copy(dataToken, 0, dataLevel, 0, 1);
                        byte[] dataGuid = new byte[36];
                        Array.Copy(dataToken, 1, dataGuid, 0, 36);
                        byte[] dataTick = new byte[dataToken.Length - 37];
                        Array.Copy(dataToken, 37, dataTick, 0, dataToken.Length - 37);
                        if (dataLevel != null && dataGuid != null && dataTick != null)
                        {
                            result.ObjectId = new Guid(Encoding.UTF8.GetString(dataGuid));
                            result.Level = Convert.ToInt16(Encoding.UTF8.GetString(dataLevel));
                            result.Tick = long.Parse(Encoding.UTF8.GetString(dataTick));
                            DateTime unixYear0 = new DateTime(1970, 1, 1, 0, 0, 1);
                            DateTime dateTimeExpired = DateTime.Now;
                            string timeTicksExpiredString = string.Empty;
                            dateTimeExpired = new DateTime(unixYear0.Ticks + result.Tick);
                            result.DateTimeExpired = dateTimeExpired;
                        }
                        return result;
                    }
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }

        }
        #endregion
        public static bool IsBase64(this string base64String)
        {
            if (base64String == null || base64String.Length == 0 || base64String.Length % 4 != 0
               || base64String.Contains(" ") || base64String.Contains("\t") || base64String.Contains("\r") || base64String.Contains("\n"))
                return false;

            try
            {
                Convert.FromBase64String(base64String);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

    }
    public static class Encrypt
    {
        #region Encrypt Function

        public static byte[] AES_Decrypt(byte[] bytesToBeDecrypted, byte[] passwordBytes)
        {
            byte[] decryptedBytes = null;

            // Set your salt here, change it to meet your flavor:
            // The salt bytes must be at least 8 bytes.
            byte[] saltBytes = new byte[] { 1, 2, 3, 4, 5, 6, 7, 8 };

            using (MemoryStream ms = new MemoryStream())
            {
                using (RijndaelManaged AES = new RijndaelManaged())
                {
                    AES.KeySize = 256;
                    AES.BlockSize = 128;

                    var key = new Rfc2898DeriveBytes(passwordBytes, saltBytes, 1000);
                    AES.Key = key.GetBytes(AES.KeySize / 8);
                    AES.IV = key.GetBytes(AES.BlockSize / 8);

                    AES.Mode = CipherMode.CBC;
                    AES.Padding = PaddingMode.Zeros;

                    using (var cs = new CryptoStream(ms, AES.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(bytesToBeDecrypted, 0, bytesToBeDecrypted.Length);
                        cs.Close();
                    }
                    decryptedBytes = ms.ToArray();
                }
            }

            return decryptedBytes;
        }
        public static byte[] AES_Encrypt(byte[] bytesToBeEncrypted, byte[] passwordBytes)
        {
            byte[] encryptedBytes = null;

            // Set your salt here, change it to meet your flavor:
            // The salt bytes must be at least 8 bytes.
            byte[] saltBytes = new byte[] { 1, 2, 3, 4, 5, 6, 7, 8 };

            using (MemoryStream ms = new MemoryStream())
            {
                using (RijndaelManaged AES = new RijndaelManaged())
                {
                    AES.KeySize = 256;
                    AES.BlockSize = 128;

                    var key = new Rfc2898DeriveBytes(passwordBytes, saltBytes, 1000);
                    AES.Key = key.GetBytes(AES.KeySize / 8);
                    AES.IV = key.GetBytes(AES.BlockSize / 8);

                    AES.Mode = CipherMode.CBC;
                    AES.Padding = PaddingMode.Zeros;

                    using (var cs = new CryptoStream(ms, AES.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(bytesToBeEncrypted, 0, bytesToBeEncrypted.Length);
                        cs.Close();
                    }
                    encryptedBytes = ms.ToArray();
                }
            }

            return encryptedBytes;
        }
        public static string DecryptText(string input, string password)
        {
            // Get the bytes of the string
            byte[] bytesToBeDecrypted = Convert.FromBase64String(input);
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
            passwordBytes = SHA256.Create().ComputeHash(passwordBytes);

            byte[] bytesDecrypted = AES_Decrypt(bytesToBeDecrypted, passwordBytes);

            string result = Encoding.UTF8.GetString(bytesDecrypted);

            return result;
        }
        public static string EncryptText(string input, string password)
        {
            // Get the bytes of the string
            byte[] bytesToBeEncrypted = Encoding.UTF8.GetBytes(input);
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);

            // Hash the password with SHA256
            passwordBytes = SHA256.Create().ComputeHash(passwordBytes);

            byte[] bytesEncrypted = AES_Encrypt(bytesToBeEncrypted, passwordBytes);

            string result = Convert.ToBase64String(bytesEncrypted);

            return result;
        }

        #endregion
    }
    public static class Security
    {
        #region Check sum
        public static class Algorithms
        {
            public static readonly HashAlgorithm MD5 = new MD5CryptoServiceProvider();
            public static readonly HashAlgorithm SHA1 = new SHA1Managed();
            public static readonly HashAlgorithm SHA256 = new SHA256Managed();
            public static readonly HashAlgorithm SHA384 = new SHA384Managed();
            public static readonly HashAlgorithm SHA512 = new SHA512Managed();
            //public static readonly HashAlgorithm RIPEMD160 = new System.Security.Cryptography.RIPEMD160Managed();
        }
        public static string GetHashFromFile(string fileName, HashAlgorithm algorithm)
        {
            using (var stream = new BufferedStream(File.OpenRead(fileName), 100000))
            {
                return BitConverter.ToString(algorithm.ComputeHash(stream)).Replace("-", string.Empty);
            }
        }
        public static bool VerifyHashFromFile(string fileName, HashAlgorithm algorithm, string hashInput)
        {
            bool verify = false;
            string hashResult = "";

            using (var stream = new BufferedStream(File.OpenRead(fileName), 100000))
            {
                hashResult = BitConverter.ToString(algorithm.ComputeHash(stream)).Replace("-", string.Empty);
                if (hashResult.SequenceEqual(hashInput)) verify = true;
            }

            return verify;
        }
        #endregion

        #region CheckIOPermission
        public static bool HasAccess(DirectoryInfo directory, FileSystemRights right, WindowsIdentity _currentUser, WindowsPrincipal _currentPrincipal)
        {
            // Get the collection of authorization rules that apply to the directory.
            AuthorizationRuleCollection acl = directory.GetAccessControl()
                .GetAccessRules(true, true, typeof(SecurityIdentifier));
            return HasFileOrDirectoryAccess(right, acl, _currentUser, _currentPrincipal);
        }

        public static bool HasAccess(FileInfo file, FileSystemRights right, WindowsIdentity _currentUser, WindowsPrincipal _currentPrincipal)
        {
            // Get the collection of authorization rules that apply to the file.
            AuthorizationRuleCollection acl = file.GetAccessControl()
                .GetAccessRules(true, true, typeof(SecurityIdentifier));
            return HasFileOrDirectoryAccess(right, acl, _currentUser, _currentPrincipal);
        }

        private static bool HasFileOrDirectoryAccess(FileSystemRights right,
                                              AuthorizationRuleCollection acl, WindowsIdentity _currentUser, WindowsPrincipal _currentPrincipal)
        {
            bool allow = false;
            bool inheritedAllow = false;
            bool inheritedDeny = false;

            for (int i = 0; i < acl.Count; i++)
            {
                FileSystemAccessRule currentRule = (FileSystemAccessRule)acl[i];
                // If the current rule applies to the current user.
                if (_currentUser.User.Equals(currentRule.IdentityReference) ||
                    _currentPrincipal.IsInRole(
                                    (SecurityIdentifier)currentRule.IdentityReference))
                {

                    if (currentRule.AccessControlType.Equals(AccessControlType.Deny))
                    {
                        if ((currentRule.FileSystemRights & right) == right)
                        {
                            if (currentRule.IsInherited)
                            {
                                inheritedDeny = true;
                            }
                            else
                            { // Non inherited "deny" takes overall precedence.
                                return false;
                            }
                        }
                    }
                    else if (currentRule.AccessControlType
                                                    .Equals(AccessControlType.Allow))
                    {
                        if ((currentRule.FileSystemRights & right) == right)
                        {
                            if (currentRule.IsInherited)
                            {
                                inheritedAllow = true;
                            }
                            else
                            {
                                allow = true;
                            }
                        }
                    }
                }
            }

            if (allow)
            { // Non inherited "allow" takes precedence over inherited rules.
                return true;
            }
            return inheritedAllow && !inheritedDeny;
        }
        #endregion
    }
    public static class Enums
    {
        #region API
        public static class APIs
        {

            #region Upload
            public const string apiUploadFileBase64Physical = "api/v1/core/nodes/upload/physical/base64";
            public const string apiUploadFileBase64 = "api/v1/core/nodes/upload/base64";
            public const string apiUploadFilePhysical = "api/v1/core/nodes/upload/physical";
            public const string apiUploadFile = "api/v1/core/nodes/upload";
            #endregion
            #region Download
            public const string apiGetDownloadInfo = "api/v1/core/nodes/download/{token}/info";
            public const string apiDownloadByToken = "api/v1/core/nodes/download/{token}";
            public const string apiDownloadByNodeId = "api/v1/core/nodes/{nodeId}/download";
            #endregion
            #region View
            public const string apiGetFileBase64 = "api/v1/core/nodes/{nodeId}/view/base64";
            public const string apiViewFileById = "api/v1/core/nodes/{nodeId}/view";
            public const string apiViewFileByToken = "api/v1/core/nodes/view/{token}";
            #endregion

            #region Thumbnail
            public const string apiGetThumbnail = "api/v1/core/nodes/{nodeId}/thumbnail";
            public const string apiViewThumbnail = "api/v1/core/nodes/{nodeId}/thumbnail/view";
            #endregion
            #region Get
            public const string apiGetFilter = "api/v1/core/nodes";
            public const string apiGetNodeById = "api/v1/core/nodes/{nodeId}";
            public const string apiGetNodeByIdWithPermission = "api/v1/core/nodes/{nodeId}";
            #endregion
            #region create
            public const string apiCreateNode = "api/v1/core/nodes";
            public const string apiCreateNodeByPath = "api/v1/core/nodes/bypath";
            public const string apiCreateNodeMany = "api/v1/core/nodes/many";
            public const string apiCreateFolderByPath = "api/v1/core/nodes/many/bypath";
            #endregion

            #region update
            public const string apiUpdateNode = "api/v1/core/nodes/{nodeId}";
            public const string apiChangeNodeStatusMany = "api/v1/core/nodes/status";
            #endregion

            #region Moving node
            public const string apiMoveNodePhysical = "api/v1/core/nodes/{nodeId}/move/physical";
            public const string apiMoveManyNodePhysical = "api/v1/core/nodes/move/physical";

            public const string apiMoveNode = "api/v1/core/nodes/{nodeId}/move";
            public const string apiMoveManyNode = "api/v1/core/nodes/move";
            #endregion


            #region recycle/restore/delete
            public const string apiRecycleManyNode = "api/v1/core/nodes/recycle";
            public const string apiRecycleNode = "api/v1/core/nodes/{nodeId}/recycle";
            public const string apiRestoreManyNode = "api/v1/core/nodes/restore";
            public const string apiRestoreNode = "api/v1/core/nodes/{nodeId}/restore";
            public const string apiDeleteManyPermanently = "api/v1/core/nodes";
            public const string apiDeletePermanently = "api/v1/core/nodes/{nodeId}";
            #endregion
            #region other
            public const string apiCheckNodeName = "api/v1/core/nodes/check/name";
            #endregion

            #region Metadata
            public const string apiGetAllPartition = "api/v1/core/partitions";
            public const string apiGetFilterPartition = "api/v1/core/partitions";
            public const string apiCreatePartition = "api/v1/core/partitions";
            public const string apiUpdatePartition = "api/v1/core/partitions/{partitionId}";
            public const string apiGetDefaultPartitionByAppId = "api/v1/core/partitions/default";
            public const string apiGetDefaultPartitionByPriority = "api/v1/core/partitions/custom";
            public const string apiPartitionAssignApplication = "api/v1/core/partitions/assign";
            public const string apiGetAllPartitionAssignApplication = "api/v1/core/partitions/assign/all";
            public const string apiDeleteManyPartition = "api/v1/core/partitions";
            public const string apiDeletePartitionById = "api/v1/core/partitions/{partitionId}";
            #endregion
            #region Partition
            public const string apiGetAllNodeMetadataByNodeId = "api/v1/core/nodes/{nodeId}/metadata";
            public const string apiCreateNodeMetadata = "api/v1/core/nodes/{nodeId}/metadata";
            public const string apiUpdateNodeMetadata = "api/v1/core/nodes/{nodeId}/Metadata";
            #endregion

            #region Token
            public const string apiGenDownloadTokenWithExpiredTime = "api/v1/core/nodes/download/genexpiredtoken";
            public const string apiGenDownloadTokenWithOutExpiredTime = "api/v1/core/nodes/download/genbasictoken";
            #endregion


        }
        #endregion

        #region Status
        public static class Status
        {
            public const string Success = "SUCCESS";
            public const string Error = "ERROR";
            public const string Schedule = "SCHEDULE";
        }
        #endregion
    }

    public static class ExtensionMethods
    {
        public static bool IsNumeric(this string theValue)
        {
            long retNum;
            return long.TryParse(theValue, System.Globalization.NumberStyles.Integer, System.Globalization.NumberFormatInfo.InvariantInfo, out retNum);
        }
    }
}