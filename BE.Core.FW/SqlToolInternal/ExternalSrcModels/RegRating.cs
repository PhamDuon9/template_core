using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class RegRating
    {
        public RegRating()
        {
            RegResourceRatings = new HashSet<RegResourceRating>();
        }

        public int RegId { get; set; }
        public int RegRating1 { get; set; }
        public string RegUserId { get; set; } = null!;
        public DateTime RegRatedTime { get; set; }
        public int RegTenantId { get; set; }

        public virtual ICollection<RegResourceRating> RegResourceRatings { get; set; }
    }
}
