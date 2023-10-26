using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmOrgRole
    {
        public string UmRoleId { get; set; } = null!;
        public string UmRoleName { get; set; } = null!;
        public string UmOrgId { get; set; } = null!;

        public virtual UmOrg UmOrg { get; set; } = null!;
    }
}
