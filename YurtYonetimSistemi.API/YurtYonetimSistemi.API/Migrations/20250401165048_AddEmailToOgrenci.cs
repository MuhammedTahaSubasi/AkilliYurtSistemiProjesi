using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class AddEmailToOgrenci : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Ogrenciler",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Ogrenciler");
        }
    }
}
