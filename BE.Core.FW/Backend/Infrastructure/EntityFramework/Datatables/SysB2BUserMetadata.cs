﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Infrastructure.EntityFramework.Datatables
{
    public class SysB2BUserMetadata
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid MetadataId { get; set; }
        [Required]
        public string Value { get; set; } = string.Empty;
    }
}
