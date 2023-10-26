using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;

namespace Backend.Infrastructure.Dapper.Interfaces
{
    public interface IDapperUnitOfWork : IDisposable
    {
        IDapperReposity GetRepository();
    }
}
