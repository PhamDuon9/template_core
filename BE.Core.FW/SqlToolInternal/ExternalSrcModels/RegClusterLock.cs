using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class RegClusterLock
    {
        public string RegLockName { get; set; } = null!;
        public string? RegLockStatus { get; set; }
        public DateTime? RegLockedTime { get; set; }
        public int? RegTenantId { get; set; }
    }
}
