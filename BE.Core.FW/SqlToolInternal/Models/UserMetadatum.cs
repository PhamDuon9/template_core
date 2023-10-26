using System;
using System.Collections.Generic;

namespace SqlTool.Models
{
    public partial class UserMetadatum
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Key { get; set; } = null!;
        public string Value { get; set; } = null!;
        public Guid CreatedByUserId { get; set; }
        public Guid LastModifiedByUserId { get; set; }
        public DateTime LastModifiedOnDate { get; set; }
        public DateTime CreatedOnDate { get; set; }
    }
}
