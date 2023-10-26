using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class RegPath
    {
        public RegPath()
        {
            RegResourceComments = new HashSet<RegResourceComment>();
            RegResourceHistories = new HashSet<RegResourceHistory>();
            RegResourceProperties = new HashSet<RegResourceProperty>();
            RegResourceRatings = new HashSet<RegResourceRating>();
            RegResourceTags = new HashSet<RegResourceTag>();
            RegResources = new HashSet<RegResource>();
            RegSnapshots = new HashSet<RegSnapshot>();
        }

        public int RegPathId { get; set; }
        public string RegPathValue { get; set; } = null!;
        public int? RegPathParentId { get; set; }
        public int RegTenantId { get; set; }

        public virtual ICollection<RegResourceComment> RegResourceComments { get; set; }
        public virtual ICollection<RegResourceHistory> RegResourceHistories { get; set; }
        public virtual ICollection<RegResourceProperty> RegResourceProperties { get; set; }
        public virtual ICollection<RegResourceRating> RegResourceRatings { get; set; }
        public virtual ICollection<RegResourceTag> RegResourceTags { get; set; }
        public virtual ICollection<RegResource> RegResources { get; set; }
        public virtual ICollection<RegSnapshot> RegSnapshots { get; set; }
    }
}
