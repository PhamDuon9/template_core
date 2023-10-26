using System;
using System.Collections.Generic;

namespace SqlTool.Models
{
    public partial class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string Fullname { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateTime Dob { get; set; }
        public string Phone { get; set; } = null!;
        public Guid SyncId { get; set; }
        public Guid CreatedByUserId { get; set; }
        public Guid LastModifiedByUserId { get; set; }
        public DateTime LastModifiedOnDate { get; set; }
        public DateTime CreatedOnDate { get; set; }
    }
}
