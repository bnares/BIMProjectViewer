using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TopielApp.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(50)", nullable: false),
                    Description = table.Column<string>(type: "varchar(100)", nullable: false),
                    Status = table.Column<string>(type: "varchar(10)", nullable: false),
                    UserRole = table.Column<string>(type: "varchar(20)", nullable: false),
                    FinishDate = table.Column<string>(type: "varchar(30)", nullable: false),
                    Cost = table.Column<decimal>(type: "decimal(35,2)", nullable: false),
                    Progress = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ToDos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "varchar(100)", nullable: false),
                    Date = table.Column<string>(type: "varchar(30)", nullable: false),
                    Priority = table.Column<string>(type: "varchar(20)", nullable: false),
                    FragmentMap = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false),
                    Camera = table.Column<string>(type: "NVARCHAR(MAX)", nullable: false),
                    ProjectId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ToDos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ToDos_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "Cost", "Description", "FinishDate", "Name", "Progress", "Status", "UserRole" },
                values: new object[] { 1, 1000000.99m, "test Description", "2024-12-28", "Test Project", 25, "Active", "Developer" });

            migrationBuilder.CreateIndex(
                name: "IX_ToDos_ProjectId",
                table: "ToDos",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ToDos");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
