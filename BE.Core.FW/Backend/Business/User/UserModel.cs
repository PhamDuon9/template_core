using Backend.Business.Policy;
using System.ComponentModel.DataAnnotations;

namespace Backend.Business.User
{
    public class UserModel
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Fullname { get; set; } = string.Empty;
        public string? Email { get; set; }
        public DateTime? DOB { get; set; }
        public string? Phone { get; set; }

        /// <summary>
        /// Id đồng bộ với account của wsO2
        /// </summary>
        public Guid SyncId { get; set; } = default!;

        /// <summary>
        /// mặc định tài khoản ở trạng thái khóa
        /// </summary>
        public bool IsLocked { get; set; } = default!;


        /// <summary>
        /// id nhóm người dùng
        /// </summary>
        public Guid? RoleId { get; set; }
        public string? RoleName { get; set; }

        /// <summary>
        /// id phòng ban
        /// </summary>
        public Guid? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }

        public string? EmployeeAccessLevels { get; set; }
        public List<Guid>? EmployeeAccessLevelArray { get; set; }

        public bool IsAccessMaxLevel { get; set; } = default!;

        public string? Password { get; set; }
        public List<UserMetadataModel> Metadata { get; set; } = new List<UserMetadataModel>();

        public List<PolicyModel> Permissions { get; set; } = new List<PolicyModel>();

        public DateTime CreatedOnDate { get; set; }
    }

    public class UserMetadataModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid MetadataId { get; set; }
        public string MetadataCode { get; set; } = string.Empty;
        public string MetadataName { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }

    public class UserChangePassword
    {
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }
    }

    public class UserLoginInfo : UserModel
    {
        public List<Guid> AccessDataHeaderQuater { get; set; } = new List<Guid>();
        public string? AccessDataHeaderQuaterString { get; set; }
    }

    public class UserLogin
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    public class UserFilterModel : UserModel
    {
        public string textSearch { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
    }
}
