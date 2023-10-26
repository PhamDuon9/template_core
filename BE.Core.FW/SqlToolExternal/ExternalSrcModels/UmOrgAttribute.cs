using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmOrgAttribute
    {
        public int UmId { get; set; }
        public string UmOrgId { get; set; } = null!;
        public string UmAttributeKey { get; set; } = null!;
        public string? UmAttributeValue { get; set; }

        public virtual UmOrg UmOrg { get; set; } = null!;
    }
}
