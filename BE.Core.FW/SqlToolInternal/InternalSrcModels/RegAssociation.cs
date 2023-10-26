using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class RegAssociation
    {
        public int RegAssociationId { get; set; }
        public string RegSourcepath { get; set; } = null!;
        public string RegTargetpath { get; set; } = null!;
        public string RegAssociationType { get; set; } = null!;
        public int RegTenantId { get; set; }
    }
}
