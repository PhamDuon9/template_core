using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmSystemUserRole
    {
        public int UmId { get; set; }
        public string? UmUserName { get; set; }
        public int UmRoleId { get; set; }
        public int UmTenantId { get; set; }

        public virtual UmSystemRole Um { get; set; } = null!;
    }
}
