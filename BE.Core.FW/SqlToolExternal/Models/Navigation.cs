using System;
using System.Collections.Generic;

namespace SqlTool.Models
{
    public partial class Navigation
    {
        public Guid Id { get; set; }
        public Guid? ParentId { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Url { get; set; } = null!;
        public string IconClass { get; set; } = null!;
        public int Order { get; set; }
        public bool HasChild { get; set; }
        public string Resource { get; set; } = null!;
        public Guid CreatedByUserId { get; set; }
        public Guid LastModifiedByUserId { get; set; }
        public DateTime LastModifiedOnDate { get; set; }
        public DateTime CreatedOnDate { get; set; }
    }
}
