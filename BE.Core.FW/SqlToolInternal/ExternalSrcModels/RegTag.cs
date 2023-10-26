using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class RegTag
    {
        public RegTag()
        {
            RegResourceTags = new HashSet<RegResourceTag>();
        }

        public int RegId { get; set; }
        public string RegTagName { get; set; } = null!;
        public string RegUserId { get; set; } = null!;
        public DateTime RegTaggedTime { get; set; }
        public int RegTenantId { get; set; }

        public virtual ICollection<RegResourceTag> RegResourceTags { get; set; }
    }
}
