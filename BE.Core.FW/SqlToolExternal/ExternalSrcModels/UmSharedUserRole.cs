using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmSharedUserRole
    {
        public int Id { get; set; }
        public int UmRoleId { get; set; }
        public int UmUserId { get; set; }
        public int UmUserTenantId { get; set; }
        public int UmRoleTenantId { get; set; }

        public virtual UmRole UmRole { get; set; } = null!;
        public virtual UmUser UmUser { get; set; } = null!;
    }
}
