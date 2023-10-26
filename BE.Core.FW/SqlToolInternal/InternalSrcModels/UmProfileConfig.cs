using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmProfileConfig
    {
        public UmProfileConfig()
        {
            UmClaimBehaviors = new HashSet<UmClaimBehavior>();
        }

        public int UmId { get; set; }
        public int? UmDialectId { get; set; }
        public string? UmProfileName { get; set; }
        public int UmTenantId { get; set; }

        public virtual UmDialect? Um { get; set; }
        public virtual ICollection<UmClaimBehavior> UmClaimBehaviors { get; set; }
    }
}
