using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmDialect
    {
        public UmDialect()
        {
            UmClaims = new HashSet<UmClaim>();
            UmProfileConfigs = new HashSet<UmProfileConfig>();
        }

        public int UmId { get; set; }
        public string? UmDialectUri { get; set; }
        public int UmTenantId { get; set; }

        public virtual ICollection<UmClaim> UmClaims { get; set; }
        public virtual ICollection<UmProfileConfig> UmProfileConfigs { get; set; }
    }
}
