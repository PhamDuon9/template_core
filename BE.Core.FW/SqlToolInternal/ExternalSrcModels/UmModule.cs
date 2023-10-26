using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmModule
    {
        public UmModule()
        {
            UmModuleActions = new HashSet<UmModuleAction>();
        }

        public int UmId { get; set; }
        public string? UmModuleName { get; set; }

        public virtual ICollection<UmModuleAction> UmModuleActions { get; set; }
    }
}
