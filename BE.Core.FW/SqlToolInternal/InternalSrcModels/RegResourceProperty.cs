using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class RegResourceProperty
    {
        public int Id { get; set; }
        public int RegPropertyId { get; set; }
        public int? RegVersion { get; set; }
        public int? RegPathId { get; set; }
        public string? RegResourceName { get; set; }
        public int? RegTenantId { get; set; }

        public virtual RegPath? Reg { get; set; }
        public virtual RegProperty? RegNavigation { get; set; }
    }
}
