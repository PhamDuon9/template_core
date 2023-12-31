﻿using System.ComponentModel.DataAnnotations;

namespace Backend.Business
{
    public class BranchModel
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public Guid CreatedByUserId { get; set; }
        public Guid LastModifiedByUserId { get; set; }
        public DateTime LastModifiedOnDate { get; set; } = DateTime.Now;
        public DateTime CreatedOnDate { get; set; } = DateTime.Now;

    }
    public class BranchFilterModel : BranchModel
    {
        public string textSearch { get; set; }
        public int pageNumber { get; set; }
        public int pageSize { get; set; }
    }
}
