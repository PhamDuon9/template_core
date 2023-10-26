using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class RegResource
    {
        public int RegPathId { get; set; }
        public string? RegName { get; set; }
        public int RegVersion { get; set; }
        public string? RegMediaType { get; set; }
        public string RegCreator { get; set; } = null!;
        public DateTime RegCreatedTime { get; set; }
        public string? RegLastUpdator { get; set; }
        public DateTime RegLastUpdatedTime { get; set; }
        public string? RegDescription { get; set; }
        public int? RegContentId { get; set; }
        public int RegTenantId { get; set; }
        public string RegUuid { get; set; } = null!;

        public virtual RegPath Reg { get; set; } = null!;
    }
}
