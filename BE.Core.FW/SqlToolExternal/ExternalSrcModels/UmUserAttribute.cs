using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmUserAttribute
    {
        public int UmId { get; set; }
        public string UmAttrName { get; set; } = null!;
        public string? UmAttrValue { get; set; }
        public string? UmProfileId { get; set; }
        public int? UmUserId { get; set; }
        public int UmTenantId { get; set; }

        public virtual UmUser? Um { get; set; }
    }
}
