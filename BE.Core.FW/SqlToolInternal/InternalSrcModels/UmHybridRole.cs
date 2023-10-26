using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmHybridRole
    {
        public UmHybridRole()
        {
            UmHybridGroupRoles = new HashSet<UmHybridGroupRole>();
            UmHybridUserRoles = new HashSet<UmHybridUserRole>();
        }

        public int UmId { get; set; }
        public string UmRoleName { get; set; } = null!;
        public int UmTenantId { get; set; }

        public virtual ICollection<UmHybridGroupRole> UmHybridGroupRoles { get; set; }
        public virtual ICollection<UmHybridUserRole> UmHybridUserRoles { get; set; }
    }
}
