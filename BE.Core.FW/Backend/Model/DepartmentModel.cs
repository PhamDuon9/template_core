using Backend.Infrastructure.Utils;

namespace Backend.Model
{
    public class DepartmentModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public int Level { get; set; }
        public Guid? ParentId { get; set; }
        public string? ParentName { get; set; }
        public Guid? BranchId { get; set; }
        public string? BranchName { get; set; }
        public Guid? Manager { get; set; }
        public string? ManagerName { get; set; }
        public bool IsCom { get; set; }
        public Guid CreatedByUserId { get; set; }
        public Guid LastModifiedByUserId { get; set; }
        public DateTime LastModifiedOnDate { get; set; } = DateTime.Now;
        public DateTime CreatedOnDate { get; set; } = DateTime.Now;
        // public List<DepartmentModel> Children { get; set; } = new List<DepartmentModel>();
    }

    public class DepartmentTreeModel
    {
        public string Title { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public Guid? ParentId { get; set; }
        public List<DepartmentTreeModel> Children { get; set; } = new List<DepartmentTreeModel>();
    }
    public class DepartmentFilterModel : RequestData
    {
        public Guid? BranchId { get; set; }
    }

}
