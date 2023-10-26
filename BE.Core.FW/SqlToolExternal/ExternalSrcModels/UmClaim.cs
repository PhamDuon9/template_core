using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmClaim
    {
        public UmClaim()
        {
            UmClaimBehaviors = new HashSet<UmClaimBehavior>();
        }

        public int UmId { get; set; }
        public int? UmDialectId { get; set; }
        public string? UmClaimUri { get; set; }
        public string? UmDisplayTag { get; set; }
        public string? UmDescription { get; set; }
        public string? UmMappedAttributeDomain { get; set; }
        public string? UmMappedAttribute { get; set; }
        public string? UmRegEx { get; set; }
        public short? UmSupported { get; set; }
        public short? UmRequired { get; set; }
        public int? UmDisplayOrder { get; set; }
        public short? UmCheckedAttribute { get; set; }
        public short? UmReadOnly { get; set; }
        public int UmTenantId { get; set; }

        public virtual UmDialect? Um { get; set; }
        public virtual ICollection<UmClaimBehavior> UmClaimBehaviors { get; set; }
    }
}
