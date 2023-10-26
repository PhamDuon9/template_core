using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class RegResourceRating
    {
        public int Id { get; set; }
        public int RegRatingId { get; set; }
        public int? RegVersion { get; set; }
        public int? RegPathId { get; set; }
        public string? RegResourceName { get; set; }
        public int? RegTenantId { get; set; }

        public virtual RegPath? Reg { get; set; }
        public virtual RegRating? RegNavigation { get; set; }
    }
}
