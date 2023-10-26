using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmOrgPermission
    {
        public int UmId { get; set; }
        public string UmResourceId { get; set; } = null!;
        public string UmAction { get; set; } = null!;
        public int? UmTenantId { get; set; }
    }
}
