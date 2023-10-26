using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmHybridRememberMe
    {
        public int UmId { get; set; }
        public string UmUserName { get; set; } = null!;
        public string? UmCookieValue { get; set; }
        public DateTime? UmCreatedTime { get; set; }
        public int UmTenantId { get; set; }
    }
}
