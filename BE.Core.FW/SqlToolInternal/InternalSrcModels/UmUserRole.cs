using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmUserRole
    {
        public int UmId { get; set; }
        public int UmRoleId { get; set; }
        public int UmUserId { get; set; }
        public int UmTenantId { get; set; }

        public virtual UmRole Um { get; set; } = null!;
        public virtual UmUser UmNavigation { get; set; } = null!;
    }
}
