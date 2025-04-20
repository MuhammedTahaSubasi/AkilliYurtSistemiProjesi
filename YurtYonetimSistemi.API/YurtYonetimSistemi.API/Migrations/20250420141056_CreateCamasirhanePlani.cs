using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class CreateCamasirhanePlani : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CamasirhanePlani",
                columns: table => new
                {
                    PlanID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OdaID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Gun = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SaatAraligi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Aciklama = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CamasirhanePlani", x => x.PlanID);
                    table.ForeignKey(
                        name: "FK_CamasirhanePlani_Odalar_OdaID",
                        column: x => x.OdaID,
                        principalTable: "Odalar",
                        principalColumn: "OdaID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CamasirhanePlani_OdaID",
                table: "CamasirhanePlani",
                column: "OdaID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CamasirhanePlani");
        }
    }
}
