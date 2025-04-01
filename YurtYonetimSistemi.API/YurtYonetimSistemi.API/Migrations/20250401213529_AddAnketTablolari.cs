using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class AddAnketTablolari : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Anketler",
                columns: table => new
                {
                    AnketID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Soru = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OlusturmaTarihi = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Anketler", x => x.AnketID);
                });

            migrationBuilder.CreateTable(
                name: "AnketCevaplar",
                columns: table => new
                {
                    CevapID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnketID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OgrenciID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Puan = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnketCevaplar", x => x.CevapID);
                    table.ForeignKey(
                        name: "FK_AnketCevaplar_Anketler_AnketID",
                        column: x => x.AnketID,
                        principalTable: "Anketler",
                        principalColumn: "AnketID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnketCevaplar_Ogrenciler_OgrenciID",
                        column: x => x.OgrenciID,
                        principalTable: "Ogrenciler",
                        principalColumn: "OgrenciID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnketCevaplar_AnketID",
                table: "AnketCevaplar",
                column: "AnketID");

            migrationBuilder.CreateIndex(
                name: "IX_AnketCevaplar_OgrenciID",
                table: "AnketCevaplar",
                column: "OgrenciID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnketCevaplar");

            migrationBuilder.DropTable(
                name: "Anketler");
        }
    }
}
