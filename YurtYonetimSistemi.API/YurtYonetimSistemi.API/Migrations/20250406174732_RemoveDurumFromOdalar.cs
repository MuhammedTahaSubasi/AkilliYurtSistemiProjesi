using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class RemoveDurumFromOdalar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
        name: "Durum",
        table: "Odalar");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
