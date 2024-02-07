using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TopielApp.Migrations
{
    /// <inheritdoc />
    public partial class projectImageUpload : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "ImageName",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageName",
                table: "Projects");

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "Cost", "Description", "FinishDate", "Name", "Progress", "Status", "UserRole" },
                values: new object[] { 1, 1000000.99m, "test Description", "2024-12-28", "Test Project", 25, "Active", "Developer" });
        }
    }
}
