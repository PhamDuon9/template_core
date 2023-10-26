using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Linq.Expressions;
using System.Net.Http.Json;
using System.Reflection;
using System.Text.Json.Serialization;
using System.Xml.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Backend.Infrastructure.EntityFramework.Repositories
{
    public class GenericRepository<TEntity> where TEntity : class
    {
        internal CoreFrameworkContext context;
        internal DbSet<TEntity> dbSet;

        public GenericRepository(CoreFrameworkContext context)
        {
            this.context = context;
            this.dbSet = context.Set<TEntity>();
        }

        public virtual IEnumerable<TEntity> Get(
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            string includeProperties = "")
        {
            IQueryable<TEntity> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }
            else
            {
                return query.ToList();
            }
        }

        public virtual TEntity? GetById(object id)
        {
            return dbSet.Find(id);
        }

        public virtual void Insert(TEntity entity)
        {
            dbSet.Add(entity);
        }

        public virtual void InsertOrUpdate<T>(T entity) where T : class
        {
            if (context.Entry(entity).State == EntityState.Detached)
                context.Set<T>().Add(entity);

            context.SaveChanges();
        }

        public virtual void InsertRange(List<TEntity> entities)
        {
            dbSet.AddRange(entities);
        }

        public virtual void Delete(object id)
        {
            TEntity? entityToDelete = dbSet.Find(id);
            if (entityToDelete != null)
                Delete(entityToDelete);
        }

        public virtual void Delete(TEntity entityToDelete)
        {
            if (context.Entry(entityToDelete).State == EntityState.Detached)
            {
                dbSet.Attach(entityToDelete);
            }
            dbSet.Remove(entityToDelete);

            #region Move deleted item to deleted table
            Type t = entityToDelete.GetType();
            PropertyInfo[] props = t.GetProperties();
            var idProp = props.FirstOrDefault(p => p.Name == "Id");
            var id = idProp?.GetValue(entityToDelete)?.ToString();
            if (!string.IsNullOrEmpty(id))
            {
                context?.DeletedItems?.Add(new Datatables.SysDeletedItem()
                {
                    Id = new Guid(id),
                    Type = entityToDelete.ToString()!,
                    Data = JsonConvert.SerializeObject(entityToDelete)
                });
            }
            #endregion
        }

        public virtual void Update(TEntity entityToUpdate)
        {
            dbSet.Attach(entityToUpdate);
            context.Entry(entityToUpdate).State = EntityState.Modified;
        }

        public virtual TEntity? FirstOrDefault(Expression<Func<TEntity, bool>>? filter = null)
        {
            if (filter != null)
            {
                return dbSet.FirstOrDefault(filter);
            }
            return null;
        }

        public virtual int Count(Expression<Func<TEntity, bool>>? filter = null)
        {
            if (filter != null)
            {
                return dbSet.Count(filter);
            }
            return 0;
        }

        /// <summary>
        /// Hàm lấy bản ghi theo điều kiện
        /// </summary>
        /// <param name="predicate">Hàm lamda</param>
        /// <param name="include"></param>
        /// <returns></returns>
        public virtual TEntity FirstQueryable(Expression<Func<TEntity, bool>> predicate, string include = "")
        {
            var query = dbSet.AsQueryable<TEntity>().AsNoTracking();
            //query = BuildIncludeQuery(query, include).AsExpandable();
            query = BuildIncludeQuery(query, include);
            return query.Where(predicate).FirstOrDefault();
        }

        /// <summary>
        /// Hàm lấy về danh sách theo điều kiện
        /// </summary>
        /// <param name="predicate">Hàm lamda</param>
        /// <param name="include"></param>
        /// <returns></returns>
        public virtual IQueryable<TEntity> GetQueryable(Expression<Func<TEntity, bool>> predicate, string include = "")
        {
            var query = dbSet.AsQueryable<TEntity>().AsNoTracking();
            //query = BuildIncludeQuery(query, include).AsExpandable();
            query = BuildIncludeQuery(query, include);
            query = query.Where(predicate);
            return query;
        }

        public IQueryable<TEntity> BuildIncludeQuery(IQueryable<TEntity> query, string include)
        {
            if (string.IsNullOrWhiteSpace(include))
                return query;

            var includeEntities = include.Split(',');
            if (includeEntities == null || !includeEntities.Any())
                return query;

            foreach (var entity in includeEntities)
            {
                query = query.Include(entity);
            }

            return query;
        }

        /// <summary>
        /// Hàm lấy về danh sách dạng IQueryable dùng để join bảng
        /// </summary>
        /// <param name="include"></param>
        /// <returns></returns>
        public virtual IQueryable<TEntity> GetAll(string include = "")
        {
            var query = dbSet.AsQueryable<TEntity>().AsNoTracking();
            //query = BuildIncludeQuery(query, include).AsExpandable();
            query = BuildIncludeQuery(query, include);
            return query;
        }
    }
}
