using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmSystemRole
    {
        public UmSystemRole()
        {
            UmSystemUserRoles = new HashSet<UmSystemUserRole>();
        }

        public int UmId { get; set; }
        public string UmRoleName { get; set; } = null!;
        public int UmTenantId { get; set; }

        public virtual ICollection<UmSystemUserRole> UmSystemUserRoles { get; set; }
    }
}
