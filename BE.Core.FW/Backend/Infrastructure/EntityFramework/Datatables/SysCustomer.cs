namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysCustomer : BaseTable<SysCustomer>
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public Guid? CustomerCategoryId { get; set; }
        public Guid? CustomerTypeId { get; set; }
        public Guid? DepartmentId { get; set; }
        public Guid? ProvinceId { get; set; }
        public Guid? DistrictId { get; set; }
        public string? TaxCode { get; set; }
        public string? Address { get; set; }

        /// <summary>
        /// Người đại diện
        /// </summary>
        public string? Representative { get; set; }

        /// <summary>
        /// Chức vụ
        /// </summary>
        public string? Position { get; set; }

        /// <summary>
        /// Điện thoại
        /// </summary>
        public string? Telephone { get; set; }

        /// <summary>
        /// Fax
        /// </summary>
        public string? Fax { get; set; }

        /// <summary>
        /// Số tài khoản ngân hàng
        /// </summary>
        public string? BankAccount { get; set; }

        /// <summary>
        /// Chi nhánh ngân hàng
        /// </summary>
        public string? BankBrand { get; set; }
    }
}
