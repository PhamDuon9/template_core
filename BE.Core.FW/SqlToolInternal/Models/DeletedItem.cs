using System;
using System.Collections.Generic;

namespace SqlTool.Models
{
    public partial class DeletedItem
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = null!;
        public string Data { get; set; } = null!;
    }
}
