using Backend.Infrastructure.Utils;

namespace Backend.Model
{
    public class CustomerModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public Guid? CustomerCategoryId { get; set; }
        public string? CustomerCategoryName { get; set; }
        public Guid? CustomerTypeId { get; set; }
        public string? CustomerTypeName { get; set; }
        public Guid? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public Guid? ProvinceId { get; set; }
        public string? ProvinceName { get; set; }
        public Guid? DistrictId { get; set; }
        public string? DistrictName { get; set; }
        public string? TaxCode { get; set; }
        public string? Address { get; set; }
        public Guid CreatedByUserId { get; set; }
        public Guid LastModifiedByUserId { get; set; }
        public DateTime LastModifiedOnDate { get; set; } = DateTime.Now;
        public DateTime CreatedOnDate { get; set; } = DateTime.Now;
        public string? Representative { get; set; }
        public string? Position { get; set; }
        public string? Telephone { get; set; }
        public string? Fax { get; set; }
        public string? BankAccount { get; set; }
        public string? BankBrand { get; set; }
    }
    public class CustomerFilterModel : RequestData
    {
        public Guid? DepartmentId { get; set; }
        public Guid? ProvinceId { get; set; }
        public Guid? DistrictId { get; set; }
    }
}
