using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class GuidFinal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ogrenciler",
                columns: table => new
                {
                    OgrenciID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Soyad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TcNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KayitTarihi = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ogrenciler", x => x.OgrenciID);
                });

            migrationBuilder.CreateTable(
                name: "Roller",
                columns: table => new
                {
                    RolID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RolAd = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roller", x => x.RolID);
                });

            migrationBuilder.CreateTable(
                name: "Yetkiler",
                columns: table => new
                {
                    YetkiID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    YetkiAd = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Yetkiler", x => x.YetkiID);
                });

            migrationBuilder.CreateTable(
                name: "Kullanicilar",
                columns: table => new
                {
                    KullaniciID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Soyad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sifre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RolID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kullanicilar", x => x.KullaniciID);
                    table.ForeignKey(
                        name: "FK_Kullanicilar_Roller_RolID",
                        column: x => x.RolID,
                        principalTable: "Roller",
                        principalColumn: "RolID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RolYetkiler",
                columns: table => new
                {
                    RolYetkiID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RolID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    YetkiID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolYetkiler", x => x.RolYetkiID);
                    table.ForeignKey(
                        name: "FK_RolYetkiler_Roller_RolID",
                        column: x => x.RolID,
                        principalTable: "Roller",
                        principalColumn: "RolID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolYetkiler_Yetkiler_YetkiID",
                        column: x => x.YetkiID,
                        principalTable: "Yetkiler",
                        principalColumn: "YetkiID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Kullanicilar_RolID",
                table: "Kullanicilar",
                column: "RolID");

            migrationBuilder.CreateIndex(
                name: "IX_RolYetkiler_RolID",
                table: "RolYetkiler",
                column: "RolID");

            migrationBuilder.CreateIndex(
                name: "IX_RolYetkiler_YetkiID",
                table: "RolYetkiler",
                column: "YetkiID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Kullanicilar");

            migrationBuilder.DropTable(
                name: "Ogrenciler");

            migrationBuilder.DropTable(
                name: "RolYetkiler");

            migrationBuilder.DropTable(
                name: "Roller");

            migrationBuilder.DropTable(
                name: "Yetkiler");
        }
    }
}
