using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmOrgRoleGroup
    {
        public string UmGroupId { get; set; } = null!;
        public string UmRoleId { get; set; } = null!;

        public virtual UmOrgRole UmRole { get; set; } = null!;
    }
}
