using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class AddEtkinlikModulu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Etkinlikler",
                columns: table => new
                {
                    EtkinlikID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Etkinlikler", x => x.EtkinlikID);
                });

            migrationBuilder.CreateTable(
                name: "EtkinlikKatilimlari",
                columns: table => new
                {
                    KatilimID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EtkinlikID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    KullaniciID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EtkinlikKatilimlari", x => x.KatilimID);
                    table.ForeignKey(
                        name: "FK_EtkinlikKatilimlari_Etkinlikler_EtkinlikID",
                        column: x => x.EtkinlikID,
                        principalTable: "Etkinlikler",
                        principalColumn: "EtkinlikID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EtkinlikKatilimlari_Kullanicilar_KullaniciID",
                        column: x => x.KullaniciID,
                        principalTable: "Kullanicilar",
                        principalColumn: "KullaniciID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EtkinlikKatilimlari_EtkinlikID",
                table: "EtkinlikKatilimlari",
                column: "EtkinlikID");

            migrationBuilder.CreateIndex(
                name: "IX_EtkinlikKatilimlari_KullaniciID",
                table: "EtkinlikKatilimlari",
                column: "KullaniciID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EtkinlikKatilimlari");

            migrationBuilder.DropTable(
                name: "Etkinlikler");
        }
    }
}
