using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmAccountMapping
    {
        public int UmId { get; set; }
        public string UmUserName { get; set; } = null!;
        public int UmTenantId { get; set; }
        public string? UmUserStoreDomain { get; set; }
        public int UmAccLinkId { get; set; }

        public virtual UmTenant UmTenant { get; set; } = null!;
    }
}
