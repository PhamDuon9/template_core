using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmRolePermission
    {
        public int UmId { get; set; }
        public int UmPermissionId { get; set; }
        public string UmRoleName { get; set; } = null!;
        public short UmIsAllowed { get; set; }
        public int UmTenantId { get; set; }
        public int? UmDomainId { get; set; }

        public virtual UmDomain? Um { get; set; }
        public virtual UmPermission UmNavigation { get; set; } = null!;
    }
}
