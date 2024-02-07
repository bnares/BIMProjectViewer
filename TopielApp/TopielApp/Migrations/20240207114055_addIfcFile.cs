using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TopielApp.Migrations
{
    /// <inheritdoc />
    public partial class addIfcFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IfcName",
                table: "Projects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IfcName",
                table: "Projects");
        }
    }
}
