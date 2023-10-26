using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace SqlTool.InternalSrcModels
{
    public partial class WSO2_USER_DBContext : DbContext
    {
        public WSO2_USER_DBContext()
        {
        }

        public WSO2_USER_DBContext(DbContextOptions<WSO2_USER_DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<RegAssociation> RegAssociations { get; set; } = null!;
        public virtual DbSet<RegClusterLock> RegClusterLocks { get; set; } = null!;
        public virtual DbSet<RegComment> RegComments { get; set; } = null!;
        public virtual DbSet<RegContent> RegContents { get; set; } = null!;
        public virtual DbSet<RegContentHistory> RegContentHistories { get; set; } = null!;
        public virtual DbSet<RegLog> RegLogs { get; set; } = null!;
        public virtual DbSet<RegPath> RegPaths { get; set; } = null!;
        public virtual DbSet<RegProperty> RegProperties { get; set; } = null!;
        public virtual DbSet<RegRating> RegRatings { get; set; } = null!;
        public virtual DbSet<RegResource> RegResources { get; set; } = null!;
        public virtual DbSet<RegResourceComment> RegResourceComments { get; set; } = null!;
        public virtual DbSet<RegResourceHistory> RegResourceHistories { get; set; } = null!;
        public virtual DbSet<RegResourceProperty> RegResourceProperties { get; set; } = null!;
        public virtual DbSet<RegResourceRating> RegResourceRatings { get; set; } = null!;
        public virtual DbSet<RegResourceTag> RegResourceTags { get; set; } = null!;
        public virtual DbSet<RegSnapshot> RegSnapshots { get; set; } = null!;
        public virtual DbSet<RegTag> RegTags { get; set; } = null!;
        public virtual DbSet<UmAccountMapping> UmAccountMappings { get; set; } = null!;
        public virtual DbSet<UmClaim> UmClaims { get; set; } = null!;
        public virtual DbSet<UmClaimBehavior> UmClaimBehaviors { get; set; } = null!;
        public virtual DbSet<UmDialect> UmDialects { get; set; } = null!;
        public virtual DbSet<UmDomain> UmDomains { get; set; } = null!;
        public virtual DbSet<UmGroupUuidDomainMapper> UmGroupUuidDomainMappers { get; set; } = null!;
        public virtual DbSet<UmHybridGroupRole> UmHybridGroupRoles { get; set; } = null!;
        public virtual DbSet<UmHybridRememberMe> UmHybridRememberMes { get; set; } = null!;
        public virtual DbSet<UmHybridRole> UmHybridRoles { get; set; } = null!;
        public virtual DbSet<UmHybridUserRole> UmHybridUserRoles { get; set; } = null!;
        public virtual DbSet<UmModule> UmModules { get; set; } = null!;
        public virtual DbSet<UmModuleAction> UmModuleActions { get; set; } = null!;
        public virtual DbSet<UmOrg> UmOrgs { get; set; } = null!;
        public virtual DbSet<UmOrgAttribute> UmOrgAttributes { get; set; } = null!;
        public virtual DbSet<UmOrgHierarchy> UmOrgHierarchies { get; set; } = null!;
        public virtual DbSet<UmOrgPermission> UmOrgPermissions { get; set; } = null!;
        public virtual DbSet<UmOrgRole> UmOrgRoles { get; set; } = null!;
        public virtual DbSet<UmOrgRoleGroup> UmOrgRoleGroups { get; set; } = null!;
        public virtual DbSet<UmOrgRolePermission> UmOrgRolePermissions { get; set; } = null!;
        public virtual DbSet<UmOrgRoleUser> UmOrgRoleUsers { get; set; } = null!;
        public virtual DbSet<UmPermission> UmPermissions { get; set; } = null!;
        public virtual DbSet<UmProfileConfig> UmProfileConfigs { get; set; } = null!;
        public virtual DbSet<UmRole> UmRoles { get; set; } = null!;
        public virtual DbSet<UmRolePermission> UmRolePermissions { get; set; } = null!;
        public virtual DbSet<UmSharedUserRole> UmSharedUserRoles { get; set; } = null!;
        public virtual DbSet<UmSystemRole> UmSystemRoles { get; set; } = null!;
        public virtual DbSet<UmSystemUser> UmSystemUsers { get; set; } = null!;
        public virtual DbSet<UmSystemUserRole> UmSystemUserRoles { get; set; } = null!;
        public virtual DbSet<UmTenant> UmTenants { get; set; } = null!;
        public virtual DbSet<UmUser> UmUsers { get; set; } = null!;
        public virtual DbSet<UmUserAttribute> UmUserAttributes { get; set; } = null!;
        public virtual DbSet<UmUserPermission> UmUserPermissions { get; set; } = null!;
        public virtual DbSet<UmUserRole> UmUserRoles { get; set; } = null!;
        public virtual DbSet<UmUuidDomainMapper> UmUuidDomainMappers { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=.;Database=WSO2_USER_DB;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RegAssociation>(entity =>
            {
                entity.HasKey(e => new { e.RegAssociationId, e.RegTenantId })
                    .HasName("PK__REG_ASSO__A5DFE4B33F5BB38D");

                entity.ToTable("REG_ASSOCIATION");

                entity.Property(e => e.RegAssociationId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("REG_ASSOCIATION_ID");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegAssociationType)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("REG_ASSOCIATION_TYPE");

                entity.Property(e => e.RegSourcepath)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("REG_SOURCEPATH");

                entity.Property(e => e.RegTargetpath)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("REG_TARGETPATH");
            });

            modelBuilder.Entity<RegClusterLock>(entity =>
            {
                entity.HasKey(e => e.RegLockName)
                    .HasName("PK__REG_CLUS__40BBEC79F8AF88F8");

                entity.ToTable("REG_CLUSTER_LOCK");

                entity.Property(e => e.RegLockName)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("REG_LOCK_NAME");

                entity.Property(e => e.RegLockStatus)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("REG_LOCK_STATUS");

                entity.Property(e => e.RegLockedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("REG_LOCKED_TIME");

                entity.Property(e => e.RegTenantId)
                    .HasColumnName("REG_TENANT_ID")
                    .HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<RegComment>(entity =>
            {
                entity.HasKey(e => new { e.RegId, e.RegTenantId });

                entity.ToTable("REG_COMMENT");

                entity.Property(e => e.RegId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("REG_ID");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegCommentText)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("REG_COMMENT_TEXT");

                entity.Property(e => e.RegCommentedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("REG_COMMENTED_TIME");

                entity.Property(e => e.RegUserId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("REG_USER_ID");
            });

            modelBuilder.Entity<RegContent>(entity =>
            {
                entity.HasKey(e => new { e.RegContentId, e.RegTenantId });

                entity.ToTable("REG_CONTENT");

                entity.Property(e => e.RegContentId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("REG_CONTENT_ID");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegContentData).HasColumnName("REG_CONTENT_DATA");
            });

            modelBuilder.Entity<RegContentHistory>(entity =>
            {
                entity.HasKey(e => new { e.RegContentId, e.RegTenantId });

                entity.ToTable("REG_CONTENT_HISTORY");

                entity.Property(e => e.RegContentId).HasColumnName("REG_CONTENT_ID");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegContentData).HasColumnName("REG_CONTENT_DATA");

                entity.Property(e => e.RegDeleted).HasColumnName("REG_DELETED");
            });

            modelBuilder.Entity<RegLog>(entity =>
            {
                entity.HasKey(e => new { e.RegLogId, e.RegTenantId })
                    .HasName("PK__REG_LOG__A5BD8B07B6DAEB9B");

                entity.ToTable("REG_LOG");

                entity.HasIndex(e => new { e.RegLoggedTime, e.RegTenantId }, "REG_LOG_IND_BY_REG_LOGTIME");

                entity.Property(e => e.RegLogId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("REG_LOG_ID");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegAction).HasColumnName("REG_ACTION");

                entity.Property(e => e.RegActionData)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("REG_ACTION_DATA");

                entity.Property(e => e.RegLoggedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("REG_LOGGED_TIME");

                entity.Property(e => e.RegPath)
                    .HasMaxLength(2000)
                    .IsUnicode(false)
                    .HasColumnName("REG_PATH");

                entity.Property(e => e.RegUserId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("REG_USER_ID");
            });

            modelBuilder.Entity<RegPath>(entity =>
            {
                entity.HasKey(e => new { e.RegPathId, e.RegTenantId });

                entity.ToTable("REG_PATH");

                entity.HasIndex(e => new { e.RegPathParentId, e.RegTenantId }, "REG_PATH_IND_BY_PARENT_ID");

                entity.HasIndex(e => new { e.RegPathValue, e.RegTenantId }, "UNIQUE_REG_PATH_TENANT_ID")
                    .IsUnique();

                entity.Property(e => e.RegPathId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("REG_PATH_ID");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegPathParentId).HasColumnName("REG_PATH_PARENT_ID");

                entity.Property(e => e.RegPathValue)
                    .HasMaxLength(895)
                    .IsUnicode(false)
                    .HasColumnName("REG_PATH_VALUE");
            });

            modelBuilder.Entity<RegProperty>(entity =>
            {
                entity.HasKey(e => new { e.RegId, e.RegTenantId });

                entity.ToTable("REG_PROPERTY");

                entity.Property(e => e.RegId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("REG_ID");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("REG_NAME");

                entity.Property(e => e.RegValue)
                    .HasMaxLength(1000)
                    .IsUnicode(false)
                    .HasColumnName("REG_VALUE");
            });

            modelBuilder.Entity<RegRating>(entity =>
            {
                entity.HasKey(e => new { e.RegId, e.RegTenantId });

                entity.ToTable("REG_RATING");

                entity.Property(e => e.RegId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("REG_ID");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegRatedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("REG_RATED_TIME");

                entity.Property(e => e.RegRating1).HasColumnName("REG_RATING");

                entity.Property(e => e.RegUserId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("REG_USER_ID");
            });

            modelBuilder.Entity<RegResource>(entity =>
            {
                entity.HasKey(e => new { e.RegVersion, e.RegTenantId });

                entity.ToTable("REG_RESOURCE");

                entity.HasIndex(e => new { e.RegName, e.RegTenantId }, "REG_RESOURCE_IND_BY_NAME");

                entity.HasIndex(e => new { e.RegPathId, e.RegName, e.RegTenantId }, "REG_RESOURCE_IND_BY_PATH_ID_NAME");

                entity.HasIndex(e => new { e.RegTenantId, e.RegUuid }, "REG_RESOURCE_IND_BY_TENANT");

                entity.HasIndex(e => new { e.RegTenantId, e.RegMediaType }, "REG_RESOURCE_IND_BY_TYPE");

                entity.HasIndex(e => e.RegUuid, "REG_RESOURCE_IND_BY_UUID");

                entity.Property(e => e.RegVersion)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("REG_VERSION");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegContentId).HasColumnName("REG_CONTENT_ID");

                entity.Property(e => e.RegCreatedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("REG_CREATED_TIME");

                entity.Property(e => e.RegCreator)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("REG_CREATOR");

                entity.Property(e => e.RegDescription)
                    .HasMaxLength(1000)
                    .IsUnicode(false)
                    .HasColumnName("REG_DESCRIPTION");

                entity.Property(e => e.RegLastUpdatedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("REG_LAST_UPDATED_TIME");

                entity.Property(e => e.RegLastUpdator)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("REG_LAST_UPDATOR");

                entity.Property(e => e.RegMediaType)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("REG_MEDIA_TYPE");

                entity.Property(e => e.RegName)
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("REG_NAME");

                entity.Property(e => e.RegPathId).HasColumnName("REG_PATH_ID");

                entity.Property(e => e.RegUuid)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("REG_UUID");

                entity.HasOne(d => d.Reg)
                    .WithMany(p => p.RegResources)
                    .HasForeignKey(d => new { d.RegPathId, d.RegTenantId })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("REG_RESOURCE_FK_BY_PATH_ID");
            });

            modelBuilder.Entity<RegResourceComment>(entity =>
            {
                entity.ToTable("REG_RESOURCE_COMMENT");

                entity.HasIndex(e => new { e.RegPathId, e.RegResourceName, e.RegTenantId }, "REG_RESOURCE_COMMENT_IND_BY_PATH_ID_AND_RESOURCE_NAME");

                entity.HasIndex(e => new { e.RegVersion, e.RegTenantId }, "REG_RESOURCE_COMMENT_IND_BY_VERSION");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.RegCommentId).HasColumnName("REG_COMMENT_ID");

                entity.Property(e => e.RegPathId).HasColumnName("REG_PATH_ID");

                entity.Property(e => e.RegResourceName)
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("REG_RESOURCE_NAME");

                entity.Property(e => e.RegTenantId)
                    .HasColumnName("REG_TENANT_ID")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.RegVersion)
                    .HasColumnName("REG_VERSION")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Reg)
                    .WithMany(p => p.RegResourceComments)
                    .HasForeignKey(d => new { d.RegCommentId, d.RegTenantId })
                    .HasConstraintName("REG_RESOURCE_COMMENT_FK_BY_COMMENT_ID");

                entity.HasOne(d => d.RegNavigation)
                    .WithMany(p => p.RegResourceComments)
                    .HasForeignKey(d => new { d.RegPathId, d.RegTenantId })
                    .HasConstraintName("REG_RESOURCE_COMMENT_FK_BY_PATH_ID");
            });

            modelBuilder.Entity<RegResourceHistory>(entity =>
            {
                entity.HasKey(e => new { e.RegVersion, e.RegTenantId });

                entity.ToTable("REG_RESOURCE_HISTORY");

                entity.HasIndex(e => new { e.RegName, e.RegTenantId }, "REG_RESOURCE_HISTORY_IND_BY_NAME");

                entity.HasIndex(e => new { e.RegPathId, e.RegName, e.RegTenantId }, "REG_RESOURCE_HISTORY_IND_BY_PATH_ID_NAME");

                entity.Property(e => e.RegVersion).HasColumnName("REG_VERSION");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegContentId).HasColumnName("REG_CONTENT_ID");

                entity.Property(e => e.RegCreatedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("REG_CREATED_TIME");

                entity.Property(e => e.RegCreator)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("REG_CREATOR");

                entity.Property(e => e.RegDeleted).HasColumnName("REG_DELETED");

                entity.Property(e => e.RegDescription)
                    .HasMaxLength(1000)
                    .IsUnicode(false)
                    .HasColumnName("REG_DESCRIPTION");

                entity.Property(e => e.RegLastUpdatedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("REG_LAST_UPDATED_TIME");

                entity.Property(e => e.RegLastUpdator)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("REG_LAST_UPDATOR");

                entity.Property(e => e.RegMediaType)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("REG_MEDIA_TYPE");

                entity.Property(e => e.RegName)
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("REG_NAME");

                entity.Property(e => e.RegPathId).HasColumnName("REG_PATH_ID");

                entity.Property(e => e.RegUuid)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("REG_UUID");

                entity.HasOne(d => d.Reg)
                    .WithMany(p => p.RegResourceHistories)
                    .HasForeignKey(d => new { d.RegContentId, d.RegTenantId })
                    .HasConstraintName("REG_RESOURCE_HIST_FK_BY_CONTENT_ID");

                entity.HasOne(d => d.RegNavigation)
                    .WithMany(p => p.RegResourceHistories)
                    .HasForeignKey(d => new { d.RegPathId, d.RegTenantId })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("REG_RESOURCE_HIST_FK_BY_PATHID");
            });

            modelBuilder.Entity<RegResourceProperty>(entity =>
            {
                entity.ToTable("REG_RESOURCE_PROPERTY");

                entity.HasIndex(e => new { e.RegPathId, e.RegResourceName, e.RegTenantId }, "REG_RESOURCE_PROPERTY_IND_BY_PATH_ID_AND_RESOURCE_NAME");

                entity.HasIndex(e => new { e.RegVersion, e.RegTenantId }, "REG_RESOURCE_PROPERTY_IND_BY_VERSION");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.RegPathId).HasColumnName("REG_PATH_ID");

                entity.Property(e => e.RegPropertyId).HasColumnName("REG_PROPERTY_ID");

                entity.Property(e => e.RegResourceName)
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("REG_RESOURCE_NAME");

                entity.Property(e => e.RegTenantId)
                    .HasColumnName("REG_TENANT_ID")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.RegVersion).HasColumnName("REG_VERSION");

                entity.HasOne(d => d.Reg)
                    .WithMany(p => p.RegResourceProperties)
                    .HasForeignKey(d => new { d.RegPathId, d.RegTenantId })
                    .HasConstraintName("REG_RESOURCE_PROPERTY_FK_BY_PATH_ID");

                entity.HasOne(d => d.RegNavigation)
                    .WithMany(p => p.RegResourceProperties)
                    .HasForeignKey(d => new { d.RegPropertyId, d.RegTenantId })
                    .HasConstraintName("REG_RESOURCE_PROPERTY_FK_BY_TAG_ID");
            });

            modelBuilder.Entity<RegResourceRating>(entity =>
            {
                entity.ToTable("REG_RESOURCE_RATING");

                entity.HasIndex(e => new { e.RegPathId, e.RegResourceName, e.RegTenantId }, "REG_RESOURCE_RATING_IND_BY_PATH_ID_AND_RESOURCE_NAME");

                entity.HasIndex(e => new { e.RegVersion, e.RegTenantId }, "REG_RESOURCE_RATING_IND_BY_VERSION");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.RegPathId).HasColumnName("REG_PATH_ID");

                entity.Property(e => e.RegRatingId).HasColumnName("REG_RATING_ID");

                entity.Property(e => e.RegResourceName)
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("REG_RESOURCE_NAME");

                entity.Property(e => e.RegTenantId)
                    .HasColumnName("REG_TENANT_ID")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.RegVersion).HasColumnName("REG_VERSION");

                entity.HasOne(d => d.Reg)
                    .WithMany(p => p.RegResourceRatings)
                    .HasForeignKey(d => new { d.RegPathId, d.RegTenantId })
                    .HasConstraintName("REG_RESOURCE_RATING_FK_BY_PATH_ID");

                entity.HasOne(d => d.RegNavigation)
                    .WithMany(p => p.RegResourceRatings)
                    .HasForeignKey(d => new { d.RegRatingId, d.RegTenantId })
                    .HasConstraintName("REG_RESOURCE_RATING_FK_BY_RATING_ID");
            });

            modelBuilder.Entity<RegResourceTag>(entity =>
            {
                entity.ToTable("REG_RESOURCE_TAG");

                entity.HasIndex(e => new { e.RegPathId, e.RegResourceName, e.RegTenantId }, "REG_RESOURCE_TAG_IND_BY_PATH_ID_AND_RESOURCE_NAME");

                entity.HasIndex(e => new { e.RegVersion, e.RegTenantId }, "REG_RESOURCE_TAG_IND_BY_VERSION");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.RegPathId).HasColumnName("REG_PATH_ID");

                entity.Property(e => e.RegResourceName)
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("REG_RESOURCE_NAME");

                entity.Property(e => e.RegTagId).HasColumnName("REG_TAG_ID");

                entity.Property(e => e.RegTenantId)
                    .HasColumnName("REG_TENANT_ID")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.RegVersion)
                    .HasColumnName("REG_VERSION")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Reg)
                    .WithMany(p => p.RegResourceTags)
                    .HasForeignKey(d => new { d.RegPathId, d.RegTenantId })
                    .HasConstraintName("REG_RESOURCE_TAG_FK_BY_PATH_ID");

                entity.HasOne(d => d.RegT)
                    .WithMany(p => p.RegResourceTags)
                    .HasForeignKey(d => new { d.RegTagId, d.RegTenantId })
                    .HasConstraintName("REG_RESOURCE_TAG_FK_BY_TAG_ID");
            });

            modelBuilder.Entity<RegSnapshot>(entity =>
            {
                entity.HasKey(e => new { e.RegSnapshotId, e.RegTenantId });

                entity.ToTable("REG_SNAPSHOT");

                entity.HasIndex(e => new { e.RegPathId, e.RegResourceName, e.RegTenantId }, "REG_SNAPSHOT_IND_BY_PATH_ID_AND_RESOURCE_NAME");

                entity.Property(e => e.RegSnapshotId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("REG_SNAPSHOT_ID");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegPathId).HasColumnName("REG_PATH_ID");

                entity.Property(e => e.RegResourceName)
                    .HasMaxLength(256)
                    .IsUnicode(false)
                    .HasColumnName("REG_RESOURCE_NAME");

                entity.Property(e => e.RegResourceVids).HasColumnName("REG_RESOURCE_VIDS");

                entity.HasOne(d => d.Reg)
                    .WithMany(p => p.RegSnapshots)
                    .HasForeignKey(d => new { d.RegPathId, d.RegTenantId })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("REG_SNAPSHOT_FK_BY_PATH_ID");
            });

            modelBuilder.Entity<RegTag>(entity =>
            {
                entity.HasKey(e => new { e.RegId, e.RegTenantId });

                entity.ToTable("REG_TAG");

                entity.Property(e => e.RegId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("REG_ID");

                entity.Property(e => e.RegTenantId).HasColumnName("REG_TENANT_ID");

                entity.Property(e => e.RegTagName)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("REG_TAG_NAME");

                entity.Property(e => e.RegTaggedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("REG_TAGGED_TIME");

                entity.Property(e => e.RegUserId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("REG_USER_ID");
            });

            modelBuilder.Entity<UmAccountMapping>(entity =>
            {
                entity.HasKey(e => e.UmId)
                    .HasName("PK__UM_ACCOU__53B61AD1BB8F6581");

                entity.ToTable("UM_ACCOUNT_MAPPING");

                entity.HasIndex(e => new { e.UmUserName, e.UmTenantId, e.UmUserStoreDomain, e.UmAccLinkId }, "UQ__UM_ACCOU__521C8C3336C22075")
                    .IsUnique();

                entity.Property(e => e.UmId).HasColumnName("UM_ID");

                entity.Property(e => e.UmAccLinkId).HasColumnName("UM_ACC_LINK_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmUserName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_NAME");

                entity.Property(e => e.UmUserStoreDomain)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_STORE_DOMAIN");

                entity.HasOne(d => d.UmTenant)
                    .WithMany(p => p.UmAccountMappings)
                    .HasForeignKey(d => d.UmTenantId)
                    .HasConstraintName("FK__UM_ACCOUN__UM_TE__208CD6FA");
            });

            modelBuilder.Entity<UmClaim>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_CLAIM__FD75BEDEB52E2217");

                entity.ToTable("UM_CLAIM");

                entity.HasIndex(e => new { e.UmDialectId, e.UmClaimUri, e.UmTenantId, e.UmMappedAttributeDomain }, "UQ__UM_CLAIM__4854EAC7170279EA")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmCheckedAttribute).HasColumnName("UM_CHECKED_ATTRIBUTE");

                entity.Property(e => e.UmClaimUri)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_CLAIM_URI");

                entity.Property(e => e.UmDescription)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_DESCRIPTION");

                entity.Property(e => e.UmDialectId).HasColumnName("UM_DIALECT_ID");

                entity.Property(e => e.UmDisplayOrder).HasColumnName("UM_DISPLAY_ORDER");

                entity.Property(e => e.UmDisplayTag)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_DISPLAY_TAG");

                entity.Property(e => e.UmMappedAttribute)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_MAPPED_ATTRIBUTE");

                entity.Property(e => e.UmMappedAttributeDomain)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_MAPPED_ATTRIBUTE_DOMAIN");

                entity.Property(e => e.UmReadOnly).HasColumnName("UM_READ_ONLY");

                entity.Property(e => e.UmRegEx)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_REG_EX");

                entity.Property(e => e.UmRequired).HasColumnName("UM_REQUIRED");

                entity.Property(e => e.UmSupported).HasColumnName("UM_SUPPORTED");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmClaims)
                    .HasForeignKey(d => new { d.UmDialectId, d.UmTenantId })
                    .HasConstraintName("FK__UM_CLAIM__29221CFB");
            });

            modelBuilder.Entity<UmClaimBehavior>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_CLAIM__FD75BEDE84DCEC39");

                entity.ToTable("UM_CLAIM_BEHAVIOR");

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmBehaviour).HasColumnName("UM_BEHAVIOUR");

                entity.Property(e => e.UmClaimId).HasColumnName("UM_CLAIM_ID");

                entity.Property(e => e.UmProfileId).HasColumnName("UM_PROFILE_ID");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmClaimBehaviors)
                    .HasForeignKey(d => new { d.UmClaimId, d.UmTenantId })
                    .HasConstraintName("FK__UM_CLAIM_BEHAVIO__31B762FC");

                entity.HasOne(d => d.UmNavigation)
                    .WithMany(p => p.UmClaimBehaviors)
                    .HasForeignKey(d => new { d.UmProfileId, d.UmTenantId })
                    .HasConstraintName("FK__UM_CLAIM_BEHAVIO__30C33EC3");
            });

            modelBuilder.Entity<UmDialect>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_DIALE__FD75BEDE47D2418F");

                entity.ToTable("UM_DIALECT");

                entity.HasIndex(e => new { e.UmDialectUri, e.UmTenantId }, "UQ__UM_DIALE__B64D10074EC718D5")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmDialectUri)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_DIALECT_URI");
            });

            modelBuilder.Entity<UmDomain>(entity =>
            {
                entity.HasKey(e => new { e.UmDomainId, e.UmTenantId })
                    .HasName("PK__UM_DOMAI__95CCC1D482E61374");

                entity.ToTable("UM_DOMAIN");

                entity.HasIndex(e => new { e.UmDomainName, e.UmTenantId }, "UQ__UM_DOMAI__853DC089099AF4E4")
                    .IsUnique();

                entity.Property(e => e.UmDomainId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_DOMAIN_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmDomainName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_DOMAIN_NAME");
            });

            modelBuilder.Entity<UmGroupUuidDomainMapper>(entity =>
            {
                entity.HasKey(e => e.UmId)
                    .HasName("PK__UM_GROUP__53B61AD188102926");

                entity.ToTable("UM_GROUP_UUID_DOMAIN_MAPPER");

                entity.HasIndex(e => new { e.UmGroupId, e.UmTenantId }, "GRP_UUID_DM_GRP_ID_TID");

                entity.HasIndex(e => e.UmGroupId, "UQ__UM_GROUP__45C66A9F64184BAD")
                    .IsUnique();

                entity.Property(e => e.UmId).HasColumnName("UM_ID");

                entity.Property(e => e.UmDomainId).HasColumnName("UM_DOMAIN_ID");

                entity.Property(e => e.UmGroupId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_GROUP_ID");

                entity.Property(e => e.UmTenantId)
                    .HasColumnName("UM_TENANT_ID")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmGroupUuidDomainMappers)
                    .HasForeignKey(d => new { d.UmDomainId, d.UmTenantId })
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__UM_GROUP_UUID_DO__55F4C372");
            });

            modelBuilder.Entity<UmHybridGroupRole>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_HYBRI__FD75BEDEB44F198A");

                entity.ToTable("UM_HYBRID_GROUP_ROLE");

                entity.HasIndex(e => new { e.UmGroupName, e.UmRoleId, e.UmTenantId, e.UmDomainId }, "UQ__UM_HYBRI__3FC1F4DB7AD66A61")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmDomainId).HasColumnName("UM_DOMAIN_ID");

                entity.Property(e => e.UmGroupName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_GROUP_NAME");

                entity.Property(e => e.UmRoleId).HasColumnName("UM_ROLE_ID");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmHybridGroupRoles)
                    .HasForeignKey(d => new { d.UmDomainId, d.UmTenantId })
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__UM_HYBRID_GROUP___40F9A68C");

                entity.HasOne(d => d.UmNavigation)
                    .WithMany(p => p.UmHybridGroupRoles)
                    .HasForeignKey(d => new { d.UmRoleId, d.UmTenantId })
                    .HasConstraintName("FK__UM_HYBRID_GROUP___40058253");
            });

            modelBuilder.Entity<UmHybridRememberMe>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_HYBRI__FD75BEDEB33BF86F");

                entity.ToTable("UM_HYBRID_REMEMBER_ME");

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmCookieValue)
                    .HasMaxLength(1024)
                    .IsUnicode(false)
                    .HasColumnName("UM_COOKIE_VALUE");

                entity.Property(e => e.UmCreatedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("UM_CREATED_TIME");

                entity.Property(e => e.UmUserName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_NAME");
            });

            modelBuilder.Entity<UmHybridRole>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_HYBRI__FD75BEDED3387CBB");

                entity.ToTable("UM_HYBRID_ROLE");

                entity.HasIndex(e => e.UmRoleName, "UM_ROLE_NAME_IND");

                entity.HasIndex(e => new { e.UmRoleName, e.UmTenantId }, "UQ__UM_HYBRI__66544A21B56360DF")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmRoleName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ROLE_NAME");
            });

            modelBuilder.Entity<UmHybridUserRole>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_HYBRI__FD75BEDEDD5A3F9E");

                entity.ToTable("UM_HYBRID_USER_ROLE");

                entity.HasIndex(e => new { e.UmUserName, e.UmRoleId, e.UmTenantId, e.UmDomainId }, "UQ__UM_HYBRI__6F04EF1045700080")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmDomainId).HasColumnName("UM_DOMAIN_ID");

                entity.Property(e => e.UmRoleId).HasColumnName("UM_ROLE_ID");

                entity.Property(e => e.UmUserName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_NAME");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmHybridUserRoles)
                    .HasForeignKey(d => new { d.UmDomainId, d.UmTenantId })
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__UM_HYBRID_USER_R__3B40CD36");

                entity.HasOne(d => d.UmNavigation)
                    .WithMany(p => p.UmHybridUserRoles)
                    .HasForeignKey(d => new { d.UmRoleId, d.UmTenantId })
                    .HasConstraintName("FK__UM_HYBRID_USER_R__3A4CA8FD");
            });

            modelBuilder.Entity<UmModule>(entity =>
            {
                entity.HasKey(e => e.UmId)
                    .HasName("PK__UM_MODUL__53B61AD1BE1361F8");

                entity.ToTable("UM_MODULE");

                entity.HasIndex(e => e.UmModuleName, "UQ__UM_MODUL__1E5604BADC1A2C97")
                    .IsUnique();

                entity.Property(e => e.UmId).HasColumnName("UM_ID");

                entity.Property(e => e.UmModuleName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("UM_MODULE_NAME");
            });

            modelBuilder.Entity<UmModuleAction>(entity =>
            {
                entity.HasKey(e => new { e.UmAction, e.UmModuleId })
                    .HasName("PK__UM_MODUL__712161860C2D2678");

                entity.ToTable("UM_MODULE_ACTIONS");

                entity.Property(e => e.UmAction)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ACTION");

                entity.Property(e => e.UmModuleId).HasColumnName("UM_MODULE_ID");

                entity.HasOne(d => d.UmModule)
                    .WithMany(p => p.UmModuleActions)
                    .HasForeignKey(d => d.UmModuleId)
                    .HasConstraintName("FK__UM_MODULE__UM_MO__02FC7413");
            });

            modelBuilder.Entity<UmOrg>(entity =>
            {
                entity.HasKey(e => e.UmId)
                    .HasName("PK__UM_ORG__53B61AD1B7255AC6");

                entity.ToTable("UM_ORG");

                entity.Property(e => e.UmId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmCreatedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("UM_CREATED_TIME");

                entity.Property(e => e.UmLastModified)
                    .HasColumnType("datetime")
                    .HasColumnName("UM_LAST_MODIFIED");

                entity.Property(e => e.UmOrgDescription)
                    .HasMaxLength(1024)
                    .IsUnicode(false)
                    .HasColumnName("UM_ORG_DESCRIPTION");

                entity.Property(e => e.UmOrgName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ORG_NAME");

                entity.Property(e => e.UmOrgType)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("UM_ORG_TYPE");

                entity.Property(e => e.UmParentId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("UM_PARENT_ID");

                entity.Property(e => e.UmStatus)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_STATUS")
                    .HasDefaultValueSql("('ACTIVE')");

                entity.HasOne(d => d.UmParent)
                    .WithMany(p => p.InverseUmParent)
                    .HasForeignKey(d => d.UmParentId)
                    .HasConstraintName("FK__UM_ORG__UM_PAREN__59C55456");
            });

            modelBuilder.Entity<UmOrgAttribute>(entity =>
            {
                entity.HasKey(e => e.UmId)
                    .HasName("PK__UM_ORG_A__53B61AD193F93759");

                entity.ToTable("UM_ORG_ATTRIBUTE");

                entity.HasIndex(e => new { e.UmOrgId, e.UmAttributeKey }, "UQ__UM_ORG_A__D975BE13AD92A4D9")
                    .IsUnique();

                entity.Property(e => e.UmId).HasColumnName("UM_ID");

                entity.Property(e => e.UmAttributeKey)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ATTRIBUTE_KEY");

                entity.Property(e => e.UmAttributeValue)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("UM_ATTRIBUTE_VALUE");

                entity.Property(e => e.UmOrgId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("UM_ORG_ID");

                entity.HasOne(d => d.UmOrg)
                    .WithMany(p => p.UmOrgAttributes)
                    .HasForeignKey(d => d.UmOrgId)
                    .HasConstraintName("FK__UM_ORG_AT__UM_OR__5D95E53A");
            });

            modelBuilder.Entity<UmOrgHierarchy>(entity =>
            {
                entity.HasKey(e => new { e.UmParentId, e.UmId })
                    .HasName("PK__UM_ORG_H__6F73E2349B9D46C1");

                entity.ToTable("UM_ORG_HIERARCHY");

                entity.Property(e => e.UmParentId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("UM_PARENT_ID");

                entity.Property(e => e.UmId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("UM_ID");

                entity.Property(e => e.Depth).HasColumnName("DEPTH");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmOrgHierarchyUms)
                    .HasForeignKey(d => d.UmId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__UM_ORG_HI__UM_ID__6DCC4D03");

                entity.HasOne(d => d.UmParent)
                    .WithMany(p => p.UmOrgHierarchyUmParents)
                    .HasForeignKey(d => d.UmParentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__UM_ORG_HI__UM_PA__6CD828CA");
            });

            modelBuilder.Entity<UmOrgPermission>(entity =>
            {
                entity.HasKey(e => e.UmId)
                    .HasName("PK__UM_ORG_P__53B61AD1D1D76B52");

                entity.ToTable("UM_ORG_PERMISSION");

                entity.Property(e => e.UmId).HasColumnName("UM_ID");

                entity.Property(e => e.UmAction)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ACTION");

                entity.Property(e => e.UmResourceId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_RESOURCE_ID");

                entity.Property(e => e.UmTenantId)
                    .HasColumnName("UM_TENANT_ID")
                    .HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<UmOrgRole>(entity =>
            {
                entity.HasKey(e => e.UmRoleId)
                    .HasName("PK__UM_ORG_R__305FFC2F38E128A9");

                entity.ToTable("UM_ORG_ROLE");

                entity.Property(e => e.UmRoleId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ROLE_ID");

                entity.Property(e => e.UmOrgId)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("UM_ORG_ID");

                entity.Property(e => e.UmRoleName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ROLE_NAME");

                entity.HasOne(d => d.UmOrg)
                    .WithMany(p => p.UmOrgRoles)
                    .HasForeignKey(d => d.UmOrgId)
                    .HasConstraintName("FK_UM_ORG_ROLE_UM_ORG");
            });

            modelBuilder.Entity<UmOrgRoleGroup>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("UM_ORG_ROLE_GROUP");

                entity.Property(e => e.UmGroupId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_GROUP_ID");

                entity.Property(e => e.UmRoleId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ROLE_ID");

                entity.HasOne(d => d.UmRole)
                    .WithMany()
                    .HasForeignKey(d => d.UmRoleId)
                    .HasConstraintName("FK_UM_ORG_ROLE_GROUP_UM_ORG_ROLE");
            });

            modelBuilder.Entity<UmOrgRolePermission>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("UM_ORG_ROLE_PERMISSION");

                entity.Property(e => e.UmPermissionId).HasColumnName("UM_PERMISSION_ID");

                entity.Property(e => e.UmRoleId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ROLE_ID");

                entity.HasOne(d => d.UmPermission)
                    .WithMany()
                    .HasForeignKey(d => d.UmPermissionId)
                    .HasConstraintName("FK_UM_ORG_ROLE_PERMISSION_UM_ORG_PERMISSION");

                entity.HasOne(d => d.UmRole)
                    .WithMany()
                    .HasForeignKey(d => d.UmRoleId)
                    .HasConstraintName("FK_UM_ORG_ROLE_PERMISSION_UM_ORG_ROLE");
            });

            modelBuilder.Entity<UmOrgRoleUser>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("UM_ORG_ROLE_USER");

                entity.Property(e => e.UmRoleId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ROLE_ID");

                entity.Property(e => e.UmUserId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_ID");

                entity.HasOne(d => d.UmRole)
                    .WithMany()
                    .HasForeignKey(d => d.UmRoleId)
                    .HasConstraintName("FK_UM_ORG_ROLE_USER_UM_ORG_ROLE");
            });

            modelBuilder.Entity<UmPermission>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_PERMI__FD75BEDE85B5CE1D");

                entity.ToTable("UM_PERMISSION");

                entity.HasIndex(e => new { e.UmResourceId, e.UmAction, e.UmTenantId }, "INDEX_UM_PERMISSION_UM_RESOURCE_ID_UM_ACTION");

                entity.HasIndex(e => new { e.UmResourceId, e.UmAction, e.UmTenantId }, "UQ__UM_PERMI__4575E547229C6EB7")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmAction)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ACTION");

                entity.Property(e => e.UmModuleId)
                    .HasColumnName("UM_MODULE_ID")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.UmResourceId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_RESOURCE_ID");
            });

            modelBuilder.Entity<UmProfileConfig>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_PROFI__FD75BEDE605FFFAF");

                entity.ToTable("UM_PROFILE_CONFIG");

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmDialectId).HasColumnName("UM_DIALECT_ID");

                entity.Property(e => e.UmProfileName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_PROFILE_NAME");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmProfileConfigs)
                    .HasForeignKey(d => new { d.UmDialectId, d.UmTenantId })
                    .HasConstraintName("FK__UM_PROFILE_CONFI__2CF2ADDF");
            });

            modelBuilder.Entity<UmRole>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_ROLE__FD75BEDE595372E8");

                entity.ToTable("UM_ROLE");

                entity.HasIndex(e => new { e.UmRoleName, e.UmTenantId }, "UQ__UM_ROLE__66544A21554FFA10")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmRoleName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ROLE_NAME");

                entity.Property(e => e.UmSharedRole)
                    .HasColumnName("UM_SHARED_ROLE")
                    .HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<UmRolePermission>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_ROLE___FD75BEDE4B039902");

                entity.ToTable("UM_ROLE_PERMISSION");

                entity.HasIndex(e => new { e.UmPermissionId, e.UmRoleName, e.UmTenantId, e.UmDomainId }, "UQ__UM_ROLE___7F9CC13122AADFC0")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmDomainId).HasColumnName("UM_DOMAIN_ID");

                entity.Property(e => e.UmIsAllowed).HasColumnName("UM_IS_ALLOWED");

                entity.Property(e => e.UmPermissionId).HasColumnName("UM_PERMISSION_ID");

                entity.Property(e => e.UmRoleName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ROLE_NAME");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmRolePermissions)
                    .HasForeignKey(d => new { d.UmDomainId, d.UmTenantId })
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__UM_ROLE_PERMISSI__0D7A0286");

                entity.HasOne(d => d.UmNavigation)
                    .WithMany(p => p.UmRolePermissions)
                    .HasForeignKey(d => new { d.UmPermissionId, d.UmTenantId })
                    .HasConstraintName("FK__UM_ROLE_PERMISSI__0C85DE4D");
            });

            modelBuilder.Entity<UmSharedUserRole>(entity =>
            {
                entity.ToTable("UM_SHARED_USER_ROLE");

                entity.HasIndex(e => new { e.UmUserId, e.UmRoleId, e.UmUserTenantId, e.UmRoleTenantId }, "UQ__UM_SHARE__E63ED5C767BB17DB")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.UmRoleId).HasColumnName("UM_ROLE_ID");

                entity.Property(e => e.UmRoleTenantId).HasColumnName("UM_ROLE_TENANT_ID");

                entity.Property(e => e.UmUserId).HasColumnName("UM_USER_ID");

                entity.Property(e => e.UmUserTenantId).HasColumnName("UM_USER_TENANT_ID");

                entity.HasOne(d => d.UmRole)
                    .WithMany(p => p.UmSharedUserRoles)
                    .HasForeignKey(d => new { d.UmRoleId, d.UmRoleTenantId })
                    .HasConstraintName("FK__UM_SHARED_USER_R__1BC821DD");

                entity.HasOne(d => d.UmUser)
                    .WithMany(p => p.UmSharedUserRoles)
                    .HasForeignKey(d => new { d.UmUserId, d.UmUserTenantId })
                    .HasConstraintName("FK__UM_SHARED_USER_R__1CBC4616");
            });

            modelBuilder.Entity<UmSystemRole>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_SYSTE__FD75BEDE5991733E");

                entity.ToTable("UM_SYSTEM_ROLE");

                entity.HasIndex(e => new { e.UmRoleName, e.UmTenantId }, "UQ__UM_SYSTE__66544A21A40AEB2A")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmRoleName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ROLE_NAME");
            });

            modelBuilder.Entity<UmSystemUser>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_SYSTE__FD75BEDEC5748366");

                entity.ToTable("UM_SYSTEM_USER");

                entity.HasIndex(e => new { e.UmUserName, e.UmTenantId }, "UQ__UM_SYSTE__858D3E6BE8B09E43")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmChangedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("UM_CHANGED_TIME");

                entity.Property(e => e.UmRequireChange)
                    .HasColumnName("UM_REQUIRE_CHANGE")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.UmSaltValue)
                    .HasMaxLength(31)
                    .IsUnicode(false)
                    .HasColumnName("UM_SALT_VALUE");

                entity.Property(e => e.UmUserName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_NAME");

                entity.Property(e => e.UmUserPassword)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_PASSWORD");
            });

            modelBuilder.Entity<UmSystemUserRole>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_SYSTE__FD75BEDEDC0E69D1");

                entity.ToTable("UM_SYSTEM_USER_ROLE");

                entity.HasIndex(e => new { e.UmUserName, e.UmRoleId, e.UmTenantId }, "UQ__UM_SYSTE__32A75FE6644521E2")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmRoleId).HasColumnName("UM_ROLE_ID");

                entity.Property(e => e.UmUserName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_NAME");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmSystemUserRoles)
                    .HasForeignKey(d => new { d.UmRoleId, d.UmTenantId })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__UM_SYSTEM_USER_R__498EEC8D");
            });

            modelBuilder.Entity<UmTenant>(entity =>
            {
                entity.HasKey(e => e.UmId)
                    .HasName("PK__UM_TENAN__53B61AD107CE644E");

                entity.ToTable("UM_TENANT");

                entity.HasIndex(e => e.UmDomainName, "INDEX_UM_TENANT_UM_DOMAIN_NAME");

                entity.HasIndex(e => e.UmDomainName, "UQ__UM_TENAN__2BFE6486BA7B3842")
                    .IsUnique();

                entity.HasIndex(e => e.UmTenantUuid, "UQ__UM_TENAN__F9540CB549D3C97A")
                    .IsUnique();

                entity.Property(e => e.UmId).HasColumnName("UM_ID");

                entity.Property(e => e.UmActive)
                    .HasColumnName("UM_ACTIVE")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.UmCreatedDate)
                    .HasColumnType("datetime")
                    .HasColumnName("UM_CREATED_DATE");

                entity.Property(e => e.UmDomainName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_DOMAIN_NAME");

                entity.Property(e => e.UmEmail)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_EMAIL");

                entity.Property(e => e.UmOrgUuid)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("UM_ORG_UUID");

                entity.Property(e => e.UmTenantUuid)
                    .HasMaxLength(36)
                    .IsUnicode(false)
                    .HasColumnName("UM_TENANT_UUID");

                entity.Property(e => e.UmUserConfig).HasColumnName("UM_USER_CONFIG");
            });

            modelBuilder.Entity<UmUser>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_USER__FD75BEDED5AF0629");

                entity.ToTable("UM_USER");

                entity.HasIndex(e => new { e.UmUserName, e.UmTenantId }, "INDEX_UM_USERNAME_UM_TENANT_ID")
                    .IsUnique();

                entity.HasIndex(e => new { e.UmUserName, e.UmTenantId }, "UQ__UM_USER__858D3E6B6F937DF1")
                    .IsUnique();

                entity.HasIndex(e => e.UmUserId, "UQ__UM_USER__A25129FCC4BA53AC")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmChangedTime)
                    .HasColumnType("datetime")
                    .HasColumnName("UM_CHANGED_TIME");

                entity.Property(e => e.UmRequireChange)
                    .HasColumnName("UM_REQUIRE_CHANGE")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.UmSaltValue)
                    .HasMaxLength(31)
                    .IsUnicode(false)
                    .HasColumnName("UM_SALT_VALUE");

                entity.Property(e => e.UmUserId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_ID");

                entity.Property(e => e.UmUserName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_NAME");

                entity.Property(e => e.UmUserPassword)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_PASSWORD");
            });

            modelBuilder.Entity<UmUserAttribute>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_USER___FD75BEDE7C0EA5D6");

                entity.ToTable("UM_USER_ATTRIBUTE");

                entity.HasIndex(e => new { e.UmAttrName, e.UmAttrValue }, "UM_ATTR_NAME_VALUE_INDEX");

                entity.HasIndex(e => e.UmUserId, "UM_USER_ID_INDEX");

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmAttrName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_ATTR_NAME");

                entity.Property(e => e.UmAttrValue)
                    .HasMaxLength(1024)
                    .IsUnicode(false)
                    .HasColumnName("UM_ATTR_VALUE");

                entity.Property(e => e.UmProfileId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_PROFILE_ID");

                entity.Property(e => e.UmUserId).HasColumnName("UM_USER_ID");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmUserAttributes)
                    .HasForeignKey(d => new { d.UmUserId, d.UmTenantId })
                    .HasConstraintName("FK__UM_USER_ATTRIBUT__787EE5A0");
            });

            modelBuilder.Entity<UmUserPermission>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_USER___FD75BEDE483CB028");

                entity.ToTable("UM_USER_PERMISSION");

                entity.HasIndex(e => new { e.UmPermissionId, e.UmUserName, e.UmTenantId }, "UQ__UM_USER___8C02E6839BE178D4")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmIsAllowed).HasColumnName("UM_IS_ALLOWED");

                entity.Property(e => e.UmPermissionId).HasColumnName("UM_PERMISSION_ID");

                entity.Property(e => e.UmUserName)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_NAME");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmUserPermissions)
                    .HasForeignKey(d => new { d.UmPermissionId, d.UmTenantId })
                    .HasConstraintName("FK__UM_USER_PERMISSI__123EB7A3");
            });

            modelBuilder.Entity<UmUserRole>(entity =>
            {
                entity.HasKey(e => new { e.UmId, e.UmTenantId })
                    .HasName("PK__UM_USER___FD75BEDE0555FE50");

                entity.ToTable("UM_USER_ROLE");

                entity.HasIndex(e => new { e.UmUserId, e.UmRoleId, e.UmTenantId }, "UQ__UM_USER___BBB8EC7EDDC80B9F")
                    .IsUnique();

                entity.Property(e => e.UmId)
                    .ValueGeneratedOnAdd()
                    .HasColumnName("UM_ID");

                entity.Property(e => e.UmTenantId).HasColumnName("UM_TENANT_ID");

                entity.Property(e => e.UmRoleId).HasColumnName("UM_ROLE_ID");

                entity.Property(e => e.UmUserId).HasColumnName("UM_USER_ID");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmUserRoles)
                    .HasForeignKey(d => new { d.UmRoleId, d.UmTenantId })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__UM_USER_ROLE__17036CC0");

                entity.HasOne(d => d.UmNavigation)
                    .WithMany(p => p.UmUserRoles)
                    .HasForeignKey(d => new { d.UmUserId, d.UmTenantId })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__UM_USER_ROLE__17F790F9");
            });

            modelBuilder.Entity<UmUuidDomainMapper>(entity =>
            {
                entity.HasKey(e => e.UmId)
                    .HasName("PK__UM_UUID___53B61AD1B009C745");

                entity.ToTable("UM_UUID_DOMAIN_MAPPER");

                entity.HasIndex(e => e.UmUserId, "UQ__UM_UUID___A25129FC0FEEA74B")
                    .IsUnique();

                entity.HasIndex(e => new { e.UmUserId, e.UmTenantId }, "UUID_DM_UID_TID");

                entity.Property(e => e.UmId).HasColumnName("UM_ID");

                entity.Property(e => e.UmDomainId).HasColumnName("UM_DOMAIN_ID");

                entity.Property(e => e.UmTenantId)
                    .HasColumnName("UM_TENANT_ID")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.UmUserId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("UM_USER_ID");

                entity.HasOne(d => d.Um)
                    .WithMany(p => p.UmUuidDomainMappers)
                    .HasForeignKey(d => new { d.UmDomainId, d.UmTenantId })
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__UM_UUID_DOMAIN_M__51300E55");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
