using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmOrgRoleUser
    {
        public string UmUserId { get; set; } = null!;
        public string UmRoleId { get; set; } = null!;

        public virtual UmOrgRole UmRole { get; set; } = null!;
    }
}
