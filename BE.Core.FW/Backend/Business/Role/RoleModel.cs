using System.ComponentModel.DataAnnotations;

namespace Backend.Business.Role
{
    public class RoleModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? AccessDataHeaderQuater { get; set; }
        public string? Description { get; set; } = string.Empty;

        /// <summary>
        /// Id của bản ghi lấy để clone quyền
        /// </summary>
        public Guid? RecordCloneId { get; set; }

        public DateTime LastModifiedOnDate { get; set; }
        public DateTime CreatedOnDate { get; set; }

        /// <summary>
        /// Là vai trò mặc định không cho phép chỉnh sửa
        /// </summary>
        public bool IsDefault { get; set; }
    }
}
