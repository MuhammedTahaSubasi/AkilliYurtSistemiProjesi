using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class OgrenciOdaSinifIliski : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "OdaID",
                table: "Ogrenciler",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Odalar",
                columns: table => new
                {
                    OdaID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OdaNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KatNo = table.Column<int>(type: "int", nullable: false),
                    Kapasite = table.Column<int>(type: "int", nullable: false),
                    Durum = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SinifID = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odalar", x => x.OdaID);
                    table.ForeignKey(
                        name: "FK_Odalar_Siniflar_SinifID",
                        column: x => x.SinifID,
                        principalTable: "Siniflar",
                        principalColumn: "SinifID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ogrenciler_OdaID",
                table: "Ogrenciler",
                column: "OdaID");

            migrationBuilder.CreateIndex(
                name: "IX_Odalar_SinifID",
                table: "Odalar",
                column: "SinifID");

            migrationBuilder.AddForeignKey(
                name: "FK_Ogrenciler_Odalar_OdaID",
                table: "Ogrenciler",
                column: "OdaID",
                principalTable: "Odalar",
                principalColumn: "OdaID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ogrenciler_Odalar_OdaID",
                table: "Ogrenciler");

            migrationBuilder.DropTable(
                name: "Odalar");

            migrationBuilder.DropIndex(
                name: "IX_Ogrenciler_OdaID",
                table: "Ogrenciler");

            migrationBuilder.DropColumn(
                name: "OdaID",
                table: "Ogrenciler");
        }
    }
}
