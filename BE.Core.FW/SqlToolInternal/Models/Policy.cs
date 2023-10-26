using System;
using System.Collections.Generic;

namespace SqlTool.Models
{
    public partial class Policy
    {
        public Guid Id { get; set; }
        public string Rule { get; set; } = null!;
        public string Resource { get; set; } = null!;
        public string Action { get; set; } = null!;
        public string Description { get; set; } = null!;
        public Guid CreatedByUserId { get; set; }
        public Guid LastModifiedByUserId { get; set; }
        public DateTime LastModifiedOnDate { get; set; }
        public DateTime CreatedOnDate { get; set; }
    }
}
