using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class RegProperty
    {
        public RegProperty()
        {
            RegResourceProperties = new HashSet<RegResourceProperty>();
        }

        public int RegId { get; set; }
        public string RegName { get; set; } = null!;
        public string? RegValue { get; set; }
        public int RegTenantId { get; set; }

        public virtual ICollection<RegResourceProperty> RegResourceProperties { get; set; }
    }
}
