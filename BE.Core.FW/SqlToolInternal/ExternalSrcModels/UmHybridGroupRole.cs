using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmHybridGroupRole
    {
        public int UmId { get; set; }
        public string? UmGroupName { get; set; }
        public int UmRoleId { get; set; }
        public int UmTenantId { get; set; }
        public int? UmDomainId { get; set; }

        public virtual UmDomain? Um { get; set; }
        public virtual UmHybridRole UmNavigation { get; set; } = null!;
    }
}
