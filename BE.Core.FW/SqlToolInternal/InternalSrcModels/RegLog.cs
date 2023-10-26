using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class RegLog
    {
        public int RegLogId { get; set; }
        public string? RegPath { get; set; }
        public string RegUserId { get; set; } = null!;
        public DateTime RegLoggedTime { get; set; }
        public int RegAction { get; set; }
        public string? RegActionData { get; set; }
        public int RegTenantId { get; set; }
    }
}
