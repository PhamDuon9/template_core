using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmUuidDomainMapper
    {
        public int UmId { get; set; }
        public string UmUserId { get; set; } = null!;
        public int UmDomainId { get; set; }
        public int? UmTenantId { get; set; }

        public virtual UmDomain? Um { get; set; }
    }
}
