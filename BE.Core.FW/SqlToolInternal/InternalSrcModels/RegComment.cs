using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class RegComment
    {
        public RegComment()
        {
            RegResourceComments = new HashSet<RegResourceComment>();
        }

        public int RegId { get; set; }
        public string RegCommentText { get; set; } = null!;
        public string RegUserId { get; set; } = null!;
        public DateTime RegCommentedTime { get; set; }
        public int RegTenantId { get; set; }

        public virtual ICollection<RegResourceComment> RegResourceComments { get; set; }
    }
}
