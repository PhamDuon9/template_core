using System;
using System.Collections.Generic;

namespace SqlTool.Models
{
    public partial class History
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = null!;
        public string Ip { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Action { get; set; } = null!;
        public DateTime ActionDate { get; set; }
        public Guid ObjectId { get; set; }
        public string Detail { get; set; } = null!;
    }
}
