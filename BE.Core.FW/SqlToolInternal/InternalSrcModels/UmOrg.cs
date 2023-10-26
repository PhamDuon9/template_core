using System;
using System.Collections.Generic;

namespace SqlTool.InternalSrcModels
{
    public partial class UmOrg
    {
        public UmOrg()
        {
            InverseUmParent = new HashSet<UmOrg>();
            UmOrgAttributes = new HashSet<UmOrgAttribute>();
            UmOrgHierarchyUmParents = new HashSet<UmOrgHierarchy>();
            UmOrgHierarchyUms = new HashSet<UmOrgHierarchy>();
            UmOrgRoles = new HashSet<UmOrgRole>();
        }

        public string UmId { get; set; } = null!;
        public string UmOrgName { get; set; } = null!;
        public string? UmOrgDescription { get; set; }
        public DateTime UmCreatedTime { get; set; }
        public DateTime UmLastModified { get; set; }
        public string UmStatus { get; set; } = null!;
        public string? UmParentId { get; set; }
        public string UmOrgType { get; set; } = null!;

        public virtual UmOrg? UmParent { get; set; }
        public virtual ICollection<UmOrg> InverseUmParent { get; set; }
        public virtual ICollection<UmOrgAttribute> UmOrgAttributes { get; set; }
        public virtual ICollection<UmOrgHierarchy> UmOrgHierarchyUmParents { get; set; }
        public virtual ICollection<UmOrgHierarchy> UmOrgHierarchyUms { get; set; }
        public virtual ICollection<UmOrgRole> UmOrgRoles { get; set; }
    }
}
