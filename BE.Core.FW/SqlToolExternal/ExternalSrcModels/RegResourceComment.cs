using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class RegResourceComment
    {
        public int Id { get; set; }
        public int RegCommentId { get; set; }
        public int? RegVersion { get; set; }
        public int? RegPathId { get; set; }
        public string? RegResourceName { get; set; }
        public int? RegTenantId { get; set; }

        public virtual RegComment? Reg { get; set; }
        public virtual RegPath? RegNavigation { get; set; }
    }
}
