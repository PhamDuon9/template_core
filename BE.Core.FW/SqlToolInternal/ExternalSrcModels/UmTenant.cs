using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmTenant
    {
        public UmTenant()
        {
            UmAccountMappings = new HashSet<UmAccountMapping>();
        }

        public int UmId { get; set; }
        public string UmTenantUuid { get; set; } = null!;
        public string UmDomainName { get; set; } = null!;
        public string? UmEmail { get; set; }
        public bool? UmActive { get; set; }
        public DateTime UmCreatedDate { get; set; }
        public byte[]? UmUserConfig { get; set; }
        public string? UmOrgUuid { get; set; }

        public virtual ICollection<UmAccountMapping> UmAccountMappings { get; set; }
    }
}
