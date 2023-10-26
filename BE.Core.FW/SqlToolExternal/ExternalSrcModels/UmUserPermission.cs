using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmUserPermission
    {
        public int UmId { get; set; }
        public int UmPermissionId { get; set; }
        public string UmUserName { get; set; } = null!;
        public short UmIsAllowed { get; set; }
        public int UmTenantId { get; set; }

        public virtual UmPermission Um { get; set; } = null!;
    }
}
