using Microsoft.EntityFrameworkCore;

namespace TopielApp.Entities
{
    public class BIMAppContext : DbContext
    {
        public BIMAppContext(DbContextOptions<BIMAppContext> options) : base(options) 
        {

        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<ToDo> ToDos { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Project>(item =>
            {
                
                item.Property(x => x.Cost).HasColumnType("decimal(35,2)");
                item.Property(x => x.Name).HasColumnType("varchar(50)").IsRequired();
                item.Property(x => x.Description).HasColumnType("varchar(100)").IsRequired();
                item.Property(x => x.Status).HasColumnType("varchar(10)").IsRequired();
                item.Property(x => x.UserRole).HasColumnType("varchar(20)").IsRequired();
                item.Property(x => x.FinishDate).HasColumnType("varchar(30)");
                item.HasMany(x=>x.ToDos).WithOne().OnDelete(DeleteBehavior.Cascade);
                item.HasData(new Project() { Name = "Test Project", Description = "test Description", Cost = 1000000.99M, Status = "Active", UserRole = "Developer", FinishDate = "2024-12-28", Id=1, Progress=25 });
            });

            builder.Entity<ToDo>(item => {
                item.Property(x => x.Description).HasColumnType("varchar(100)");
                item.Property(x => x.Priority).HasColumnType("varchar(20)");
                item.Property(x => x.Date).HasColumnType("varchar(30)");
                item.Property(x => x.FragmentMap).HasColumnType("NVARCHAR(MAX)");
                item.Property(x => x.Camera).HasColumnType("NVARCHAR(MAX)");
                item.HasOne(x=>x.Project).WithMany(x=>x.ToDos).HasForeignKey(x=>x.ProjectId).OnDelete(DeleteBehavior.NoAction);
            
            });


        }
    }
}
