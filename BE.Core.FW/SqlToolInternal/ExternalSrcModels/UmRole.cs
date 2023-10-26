using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmRole
    {
        public UmRole()
        {
            UmSharedUserRoles = new HashSet<UmSharedUserRole>();
            UmUserRoles = new HashSet<UmUserRole>();
        }

        public int UmId { get; set; }
        public string UmRoleName { get; set; } = null!;
        public int UmTenantId { get; set; }
        public bool? UmSharedRole { get; set; }

        public virtual ICollection<UmSharedUserRole> UmSharedUserRoles { get; set; }
        public virtual ICollection<UmUserRole> UmUserRoles { get; set; }
    }
}
