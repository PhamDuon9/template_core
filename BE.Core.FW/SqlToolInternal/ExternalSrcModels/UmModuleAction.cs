using System;
using System.Collections.Generic;

namespace SqlTool.ExternalSrcModels
{
    public partial class UmModuleAction
    {
        public string UmAction { get; set; } = null!;
        public int UmModuleId { get; set; }

        public virtual UmModule UmModule { get; set; } = null!;
    }
}
