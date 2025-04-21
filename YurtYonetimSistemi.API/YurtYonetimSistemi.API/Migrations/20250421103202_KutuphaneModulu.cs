using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class KutuphaneModulu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kutuphaneler",
                columns: table => new
                {
                    KutuphaneID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Gun = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SaatAraligi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kapasite = table.Column<int>(type: "int", nullable: false),
                    AktifMi = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kutuphaneler", x => x.KutuphaneID);
                });

            migrationBuilder.CreateTable(
                name: "KutuphaneKatilimlar",
                columns: table => new
                {
                    KatilimID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    KutuphaneID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    KullaniciID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KutuphaneKatilimlar", x => x.KatilimID);
                    table.ForeignKey(
                        name: "FK_KutuphaneKatilimlar_Kullanicilar_KullaniciID",
                        column: x => x.KullaniciID,
                        principalTable: "Kullanicilar",
                        principalColumn: "KullaniciID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KutuphaneKatilimlar_Kutuphaneler_KutuphaneID",
                        column: x => x.KutuphaneID,
                        principalTable: "Kutuphaneler",
                        principalColumn: "KutuphaneID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KutuphaneKatilimlar_KullaniciID",
                table: "KutuphaneKatilimlar",
                column: "KullaniciID");

            migrationBuilder.CreateIndex(
                name: "IX_KutuphaneKatilimlar_KutuphaneID",
                table: "KutuphaneKatilimlar",
                column: "KutuphaneID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KutuphaneKatilimlar");

            migrationBuilder.DropTable(
                name: "Kutuphaneler");
        }
    }
}
