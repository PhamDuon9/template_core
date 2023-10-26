using Backend.Infrastructure.EntityFramework.Datatables;

namespace Backend.Infrastructure.EntityFramework.Repositories
{
    public class UnitOfWork : IDisposable
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly CoreFrameworkContext context = new();

        public GenericRepository<TEntity> Repository<TEntity>() where TEntity : class
        {
            return new GenericRepository<TEntity>(context);
        }

        public UnitOfWork(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public void Save()
        {
            context.ChangeTracker.DetectChanges();
            var shortView = context.ChangeTracker.DebugView.ShortView;
            // var longView = context.ChangeTracker.DebugView.LongView.Split("\r\n").ToList();
            // var data = shortView.Split("\r\n").Where(x => x.Contains("Added") || x.Contains("Modified") || x.Contains("Deleted"));
            var longView = context.ChangeTracker.DebugView.LongView.Split("\n").ToList();
            var data = shortView.Split("\n").Where(x => x.Contains("Added") || x.Contains("Modified") || x.Contains("Deleted"));
            foreach (var item in data)
            {
                if (item.Split('{').First().Trim() == "SysDeletedItem")
                    continue;
                var index = longView.IndexOf(item);
                var name = "Backend.Infrastructure.EntityFramework.Datatables." + item.Split('{').First().Trim();
                var type = Type.GetType(name);
                var length = type?.GetProperties().Length;

                SysHistory history = new()
                {
                    ActionDate = DateTime.Now,
                    Id = Guid.NewGuid(),
                    Ip = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString(),
                    Type = name,
                    Username = !string.IsNullOrEmpty(_httpContextAccessor.HttpContext?.User.Identity?.Name) ? _httpContextAccessor.HttpContext?.User.Identity?.Name : "",
                    ObjectId = new Guid(item.Split(':').Last().Split('}').First().Trim())
                };
                if (item.Contains("Added"))
                {
                    history.Action = "Added";
                    for (int i = index + 1; i < index + length + 1; i++)
                    {
                        history.Detail += longView[i].Trim() + "\r\n";
                    }
                    context?.Histories?.Add(history);
                }
                if (item.Contains("Modified"))
                {
                    history.Action = "Modified";
                    for (int i = index + 1; i < index + length + 1; i++)
                    {
                        if (longView[i].Contains("Modified Originally"))
                            history.Detail += longView[i].Trim() + "\r\n";
                    }
                    context?.Histories?.Add(history);
                }
                if (item.Contains("Deleted"))
                {
                    history.Action = "Deleted";
                    context?.Histories?.Add(history);
                }
            }
            context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
