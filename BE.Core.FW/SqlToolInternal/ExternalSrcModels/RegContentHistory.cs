using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class RegContentHistory
    {
        public RegContentHistory()
        {
            RegResourceHistories = new HashSet<RegResourceHistory>();
        }

        public int RegContentId { get; set; }
        public byte[]? RegContentData { get; set; }
        public short? RegDeleted { get; set; }
        public int RegTenantId { get; set; }

        public virtual ICollection<RegResourceHistory> RegResourceHistories { get; set; }
    }
}
