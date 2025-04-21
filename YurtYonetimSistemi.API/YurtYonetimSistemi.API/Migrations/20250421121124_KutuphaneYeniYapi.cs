using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class KutuphaneYeniYapi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KutuphaneKatilimlar_Kutuphaneler_KutuphaneID",
                table: "KutuphaneKatilimlar");

            migrationBuilder.DropTable(
                name: "Kutuphaneler");

            migrationBuilder.DropIndex(
                name: "IX_KutuphaneKatilimlar_KutuphaneID",
                table: "KutuphaneKatilimlar");

            migrationBuilder.RenameColumn(
                name: "KutuphaneID",
                table: "KutuphaneKatilimlar",
                newName: "KutuphanePlanID");

            migrationBuilder.AddColumn<Guid>(
                name: "PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "KutuphaneSubeleri",
                columns: table => new
                {
                    KutuphaneSubeID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kapasite = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KutuphaneSubeleri", x => x.KutuphaneSubeID);
                });

            migrationBuilder.CreateTable(
                name: "KutuphanePlanlari",
                columns: table => new
                {
                    KutuphanePlanID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Gun = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SaatAraligi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AktifMi = table.Column<bool>(type: "bit", nullable: false),
                    KutuphaneSubeID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KutuphanePlanlari", x => x.KutuphanePlanID);
                    table.ForeignKey(
                        name: "FK_KutuphanePlanlari_KutuphaneSubeleri_KutuphaneSubeID",
                        column: x => x.KutuphaneSubeID,
                        principalTable: "KutuphaneSubeleri",
                        principalColumn: "KutuphaneSubeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KutuphaneKatilimlar_PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar",
                column: "PlanKutuphanePlanID");

            migrationBuilder.CreateIndex(
                name: "IX_KutuphanePlanlari_KutuphaneSubeID",
                table: "KutuphanePlanlari",
                column: "KutuphaneSubeID");

            migrationBuilder.AddForeignKey(
                name: "FK_KutuphaneKatilimlar_KutuphanePlanlari_PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar",
                column: "PlanKutuphanePlanID",
                principalTable: "KutuphanePlanlari",
                principalColumn: "KutuphanePlanID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KutuphaneKatilimlar_KutuphanePlanlari_PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar");

            migrationBuilder.DropTable(
                name: "KutuphanePlanlari");

            migrationBuilder.DropTable(
                name: "KutuphaneSubeleri");

            migrationBuilder.DropIndex(
                name: "IX_KutuphaneKatilimlar_PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar");

            migrationBuilder.DropColumn(
                name: "PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar");

            migrationBuilder.RenameColumn(
                name: "KutuphanePlanID",
                table: "KutuphaneKatilimlar",
                newName: "KutuphaneID");

            migrationBuilder.CreateTable(
                name: "Kutuphaneler",
                columns: table => new
                {
                    KutuphaneID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AktifMi = table.Column<bool>(type: "bit", nullable: false),
                    Gun = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Kapasite = table.Column<int>(type: "int", nullable: false),
                    SaatAraligi = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kutuphaneler", x => x.KutuphaneID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KutuphaneKatilimlar_KutuphaneID",
                table: "KutuphaneKatilimlar",
                column: "KutuphaneID");

            migrationBuilder.AddForeignKey(
                name: "FK_KutuphaneKatilimlar_Kutuphaneler_KutuphaneID",
                table: "KutuphaneKatilimlar",
                column: "KutuphaneID",
                principalTable: "Kutuphaneler",
                principalColumn: "KutuphaneID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
