using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmUser
    {
        public UmUser()
        {
            UmSharedUserRoles = new HashSet<UmSharedUserRole>();
            UmUserAttributes = new HashSet<UmUserAttribute>();
            UmUserRoles = new HashSet<UmUserRole>();
        }

        public int UmId { get; set; }
        public string UmUserId { get; set; } = null!;
        public string UmUserName { get; set; } = null!;
        public string UmUserPassword { get; set; } = null!;
        public string? UmSaltValue { get; set; }
        public bool? UmRequireChange { get; set; }
        public DateTime UmChangedTime { get; set; }
        public int UmTenantId { get; set; }

        public virtual ICollection<UmSharedUserRole> UmSharedUserRoles { get; set; }
        public virtual ICollection<UmUserAttribute> UmUserAttributes { get; set; }
        public virtual ICollection<UmUserRole> UmUserRoles { get; set; }
    }
}
