using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class AddBakimTalep : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           

            migrationBuilder.CreateTable(
                name: "BakimTalepleri",
                columns: table => new
                {
                    TalepID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Baslik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TalepTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TalepDurumu = table.Column<bool>(type: "bit", nullable: false),
                    OgrenciID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BakimTalepleri", x => x.TalepID);
                    table.ForeignKey(
                        name: "FK_BakimTalepleri_Ogrenciler_OgrenciID",
                        column: x => x.OgrenciID,
                        principalTable: "Ogrenciler",
                        principalColumn: "OgrenciID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BakimTalepleri_OgrenciID",
                table: "BakimTalepleri",
                column: "OgrenciID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BakimTalepleri");

            migrationBuilder.AddColumn<string>(
                name: "Durum",
                table: "Odalar",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
