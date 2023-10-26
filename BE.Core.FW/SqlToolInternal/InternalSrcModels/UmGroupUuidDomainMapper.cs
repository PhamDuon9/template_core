using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmGroupUuidDomainMapper
    {
        public int UmId { get; set; }
        public string UmGroupId { get; set; } = null!;
        public int UmDomainId { get; set; }
        public int? UmTenantId { get; set; }

        public virtual UmDomain? Um { get; set; }
    }
}
