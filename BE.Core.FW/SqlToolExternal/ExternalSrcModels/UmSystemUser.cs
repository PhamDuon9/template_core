using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmSystemUser
    {
        public int UmId { get; set; }
        public string UmUserName { get; set; } = null!;
        public string UmUserPassword { get; set; } = null!;
        public string? UmSaltValue { get; set; }
        public bool? UmRequireChange { get; set; }
        public DateTime UmChangedTime { get; set; }
        public int UmTenantId { get; set; }
    }
}
