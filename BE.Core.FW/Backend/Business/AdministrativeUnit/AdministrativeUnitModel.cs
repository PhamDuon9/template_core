namespace Backend.Business.AdministrativeUnit
{
    public class AdministrativeUnitModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public Guid? ParentId { get; set; }
        public string? Description { get; set; }
        public int Level { get; set; }
        public Guid CreatedByUserId { get; set; }
        public Guid LastModifiedByUserId { get; set; }
        public DateTime LastModifiedOnDate { get; set; } = DateTime.Now;
        public DateTime CreatedOnDate { get; set; } = DateTime.Now;
    }
    public class AdministrativeUnitTreeModel
    {
        public string Title { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public Guid? ParentId { get; set; }
        public List<AdministrativeUnitTreeModel> Children { get; set; } = new List<AdministrativeUnitTreeModel>();
    }
    public class AdministrativeUnitFilterModel : AdministrativeUnitModel
    {
        public string textSearch { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
    }
}
