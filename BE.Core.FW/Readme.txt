Migration
1. cd .\Backend
2. dotnet ef migrations add "[Name]"
3. (opt) dotnet ef migrations remove
4. dotnet ef database update

Scaffold-DbContext
1. cd .\Backend
2. dotnet ef dbcontext scaffold "Server=.;Database=Core.Framework;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer -o Models