using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmOrgHierarchy
    {
        public string UmParentId { get; set; } = null!;
        public string UmId { get; set; } = null!;
        public int? Depth { get; set; }

        public virtual UmOrg Um { get; set; } = null!;
        public virtual UmOrg UmParent { get; set; } = null!;
    }
}
