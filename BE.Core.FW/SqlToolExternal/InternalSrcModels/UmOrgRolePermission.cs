using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmOrgRolePermission
    {
        public int UmPermissionId { get; set; }
        public string UmRoleId { get; set; } = null!;

        public virtual UmOrgPermission UmPermission { get; set; } = null!;
        public virtual UmOrgRole UmRole { get; set; } = null!;
    }
}
