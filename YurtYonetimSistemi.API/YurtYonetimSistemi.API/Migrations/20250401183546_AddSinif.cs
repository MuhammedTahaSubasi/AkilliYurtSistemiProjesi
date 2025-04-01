using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class AddSinif : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SinifID",
                table: "Ogrenciler",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Siniflar",
                columns: table => new
                {
                    SinifID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SinifAd = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KatNo = table.Column<int>(type: "int", nullable: false),
                    Kapasite = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Siniflar", x => x.SinifID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ogrenciler_SinifID",
                table: "Ogrenciler",
                column: "SinifID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ogrenciler_Siniflar_SinifID",
                table: "Ogrenciler",
                column: "SinifID",
                principalTable: "Siniflar",
                principalColumn: "SinifID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ogrenciler_Siniflar_SinifID",
                table: "Ogrenciler");

            migrationBuilder.DropTable(
                name: "Siniflar");

            migrationBuilder.DropIndex(
                name: "IX_Ogrenciler_SinifID",
                table: "Ogrenciler");

            migrationBuilder.DropColumn(
                name: "SinifID",
                table: "Ogrenciler");
        }
    }
}
