using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmDomain
    {
        public UmDomain()
        {
            UmGroupUuidDomainMappers = new HashSet<UmGroupUuidDomainMapper>();
            UmHybridGroupRoles = new HashSet<UmHybridGroupRole>();
            UmHybridUserRoles = new HashSet<UmHybridUserRole>();
            UmRolePermissions = new HashSet<UmRolePermission>();
            UmUuidDomainMappers = new HashSet<UmUuidDomainMapper>();
        }

        public int UmDomainId { get; set; }
        public string UmDomainName { get; set; } = null!;
        public int UmTenantId { get; set; }

        public virtual ICollection<UmGroupUuidDomainMapper> UmGroupUuidDomainMappers { get; set; }
        public virtual ICollection<UmHybridGroupRole> UmHybridGroupRoles { get; set; }
        public virtual ICollection<UmHybridUserRole> UmHybridUserRoles { get; set; }
        public virtual ICollection<UmRolePermission> UmRolePermissions { get; set; }
        public virtual ICollection<UmUuidDomainMapper> UmUuidDomainMappers { get; set; }
    }
}
