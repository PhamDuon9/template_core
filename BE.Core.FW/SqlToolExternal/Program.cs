// See https://aka.ms/new-console-template for more information

using SqlTool.Models;
using TableDependency.SqlClient;
using TableDependency.SqlClient.Base;
using TableDependency.SqlClient.Base.EventArgs;

internal class Program
{
    private static readonly string _internalUserDBConnectionString = "Server=.;Database=WSO2_USER_DB;User Id=sa;Password=1Qaz2wsx";
    private static readonly string _externalUserDBConnectionString = "Server=.;Database=WSO2_SHARED_DB;User Id=sa;Password=1Qaz2wsx";

    private static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");

        #region internal
        var internalMapping = new ModelToTableMapper<SqlTool.InternalSrcModels.UmUser>();
        internalMapping.AddMapping(c => c.UmId, "UM_ID");
        internalMapping.AddMapping(c => c.UmUserId, "UM_USER_ID");
        internalMapping.AddMapping(c => c.UmUserName, "UM_USER_NAME");

        using var interalDB = new SqlTableDependency<SqlTool.InternalSrcModels.UmUser>(_internalUserDBConnectionString, "UM_USER", "dbo", mapper: internalMapping);
        interalDB.OnChanged += InternalChanged;
        interalDB.Start();

        Console.WriteLine("Press a key to exit");
        Console.ReadLine();

        interalDB.Stop();
        #endregion

        #region external
        var externalMapping = new ModelToTableMapper<SqlTool.ExternalSrcModels.UmUser>();
        internalMapping.AddMapping(c => c.UmId, "UM_ID");
        externalMapping.AddMapping(c => c.UmUserId, "UM_USER_ID");
        externalMapping.AddMapping(c => c.UmUserName, "UM_USER_NAME");

        using var externalDB = new SqlTableDependency<SqlTool.ExternalSrcModels.UmUser>(_externalUserDBConnectionString, "UM_USER", "dbo", mapper: externalMapping);
        externalDB.OnChanged += ExternalChanged;
        externalDB.Start();

        Console.WriteLine("Press a key to exit");
        Console.ReadLine();

        externalDB.Stop();
        #endregion
    }

    public static void InternalChanged(object sender, RecordChangedEventArgs<SqlTool.InternalSrcModels.UmUser> e)
    {
        if (e.ChangeType == TableDependency.SqlClient.Base.Enums.ChangeType.Insert)
        {
            var changedEntity = e.Entity;
            CoreFrameworkContext context = new();
            SqlTool.InternalSrcModels.WSO2_USER_DBContext srcContext = new();
            var userAttributes = srcContext.UmUserAttributes.Where(x => x.UmUserId == changedEntity.UmId);
            var existUser = context.Users.FirstOrDefault(x => x.Username == changedEntity.UmUserName);
            if (existUser == null)
            {
                context.Users.Add(new User()
                {
                    Id = Guid.NewGuid(),
                    Username = userAttributes.FirstOrDefault(x => x.UmAttrName == "uid")!.UmAttrValue!,
                    Fullname = string.Format("{0} {1}", userAttributes.FirstOrDefault(x => x.UmAttrName == "givenName")!.UmAttrValue!, userAttributes.FirstOrDefault(x => x.UmAttrName == "sn")!.UmAttrValue!),
                    Email = userAttributes.FirstOrDefault(x => x.UmAttrName == "mail")!.UmAttrValue!,
                    SyncId = Guid.Parse(changedEntity.UmUserId),
                    Phone = userAttributes.FirstOrDefault(x => x.UmAttrName == "telephoneNumber")!.UmAttrValue!,
                });
            }
            context.SaveChanges();
        }
    }

    public static void ExternalChanged(object sender, RecordChangedEventArgs<SqlTool.ExternalSrcModels.UmUser> e)
    {
        if (e.ChangeType == TableDependency.SqlClient.Base.Enums.ChangeType.Insert)
        {
            var changedEntity = e.Entity;
            CoreFrameworkContext context = new();
            SqlTool.ExternalSrcModels.WSO2_USER_DBContext srcContext = new();
            var userAttributes = srcContext.UmUserAttributes.Where(x => x.UmUserId == changedEntity.UmId);
            var existUser = context.Users.FirstOrDefault(x => x.Username == changedEntity.UmUserName);
            if (existUser == null)
            {
                context.Users.Add(new User()
                {
                    Id = Guid.NewGuid(),
                    Username = userAttributes.FirstOrDefault(x => x.UmAttrName == "uid")!.UmAttrValue!,
                    Fullname = string.Format("{0} {1}", userAttributes.FirstOrDefault(x => x.UmAttrName == "givenName")!.UmAttrValue!, userAttributes.FirstOrDefault(x => x.UmAttrName == "sn")!.UmAttrValue!),
                    Email = userAttributes.FirstOrDefault(x => x.UmAttrName == "mail")!.UmAttrValue!,
                    SyncId = Guid.Parse(changedEntity.UmUserId),
                    Phone = userAttributes.FirstOrDefault(x => x.UmAttrName == "telephoneNumber")!.UmAttrValue!,
                });
            }
            context.SaveChanges();
        }
    }
}