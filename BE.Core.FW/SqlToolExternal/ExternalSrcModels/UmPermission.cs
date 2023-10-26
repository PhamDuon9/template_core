using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmPermission
    {
        public UmPermission()
        {
            UmRolePermissions = new HashSet<UmRolePermission>();
            UmUserPermissions = new HashSet<UmUserPermission>();
        }

        public int UmId { get; set; }
        public string UmResourceId { get; set; } = null!;
        public string UmAction { get; set; } = null!;
        public int UmTenantId { get; set; }
        public int? UmModuleId { get; set; }

        public virtual ICollection<UmRolePermission> UmRolePermissions { get; set; }
        public virtual ICollection<UmUserPermission> UmUserPermissions { get; set; }
    }
}
