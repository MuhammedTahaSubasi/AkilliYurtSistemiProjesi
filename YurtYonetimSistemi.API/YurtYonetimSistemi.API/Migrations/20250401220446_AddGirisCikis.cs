using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class AddGirisCikis : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GirisCikislar",
                columns: table => new
                {
                    GirisCikisID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GirisMi = table.Column<bool>(type: "bit", nullable: false),
                    ZamanDamgasi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OgrenciID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GirisCikislar", x => x.GirisCikisID);
                    table.ForeignKey(
                        name: "FK_GirisCikislar_Ogrenciler_OgrenciID",
                        column: x => x.OgrenciID,
                        principalTable: "Ogrenciler",
                        principalColumn: "OgrenciID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GirisCikislar_OgrenciID",
                table: "GirisCikislar",
                column: "OgrenciID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GirisCikislar");
        }
    }
}
