using Backend.Infrastructure.Utils;

namespace Backend.Model
{
    public class ProductModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public Guid? ProductCategoryId { get; set; }
        public string? ProductCategoryName { get; set; }
        public Guid? ProductTypeId { get; set; }
        public string? ProductTypeName { get; set; }
        public int Price { get; set; }
        public float Tax { get; set; }
        public Guid CreatedByUserId { get; set; }
        public Guid LastModifiedByUserId { get; set; }
        public DateTime LastModifiedOnDate { get; set; } = DateTime.Now;
        public DateTime CreatedOnDate { get; set; } = DateTime.Now;
    }

    public class ProductFilterModel : RequestData
    {
        public Guid? ProductTypeId { get; set; }
        public Guid? ProductCategoryId { get; set; }
    }
}
