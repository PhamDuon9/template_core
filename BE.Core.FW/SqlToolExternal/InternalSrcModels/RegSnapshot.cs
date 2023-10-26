using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class RegSnapshot
    {
        public int RegSnapshotId { get; set; }
        public int RegPathId { get; set; }
        public string? RegResourceName { get; set; }
        public byte[] RegResourceVids { get; set; } = null!;
        public int RegTenantId { get; set; }

        public virtual RegPath Reg { get; set; } = null!;
    }
}
