using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmClaimBehavior
    {
        public int UmId { get; set; }
        public int? UmProfileId { get; set; }
        public int? UmClaimId { get; set; }
        public short? UmBehaviour { get; set; }
        public int UmTenantId { get; set; }

        public virtual UmClaim? Um { get; set; }
        public virtual UmProfileConfig? UmNavigation { get; set; }
    }
}
