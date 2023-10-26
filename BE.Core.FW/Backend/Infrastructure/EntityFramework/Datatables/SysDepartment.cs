using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysDepartment : BaseTable<SysDepartment>
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; }= default!;
        public string? Description { get; set; }
        public Guid? BranchId { get; set; }
        public int Level { get; set; }
        public Guid? ParentId { get; set; }
        public Guid? Manager { get; set; }
        public string? ManagerName { get; set; }
        public bool IsCom { get; set; }
    }
}
