using System;
using System.Collections.Generic;

namespace SqlTool.Models
{
    public partial class Province
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string NameEn { get; set; } = null!;
        public int Level { get; set; }
        public Guid CreatedByUserId { get; set; }
        public Guid LastModifiedByUserId { get; set; }
        public DateTime LastModifiedOnDate { get; set; }
        public DateTime CreatedOnDate { get; set; }
    }
}
