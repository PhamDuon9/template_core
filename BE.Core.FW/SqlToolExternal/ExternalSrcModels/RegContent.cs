using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class RegContent
    {
        public int RegContentId { get; set; }
        public byte[]? RegContentData { get; set; }
        public int RegTenantId { get; set; }
    }
}
