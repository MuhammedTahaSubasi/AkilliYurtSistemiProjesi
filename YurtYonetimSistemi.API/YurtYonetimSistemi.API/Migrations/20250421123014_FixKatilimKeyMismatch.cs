using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class FixKatilimKeyMismatch : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KutuphaneKatilimlar_KutuphanePlanlari_PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar");

            migrationBuilder.DropIndex(
                name: "IX_KutuphaneKatilimlar_PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar");

            migrationBuilder.DropColumn(
                name: "PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar");

            migrationBuilder.CreateIndex(
                name: "IX_KutuphaneKatilimlar_KutuphanePlanID",
                table: "KutuphaneKatilimlar",
                column: "KutuphanePlanID");

            migrationBuilder.AddForeignKey(
                name: "FK_KutuphaneKatilimlar_KutuphanePlanlari_KutuphanePlanID",
                table: "KutuphaneKatilimlar",
                column: "KutuphanePlanID",
                principalTable: "KutuphanePlanlari",
                principalColumn: "KutuphanePlanID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KutuphaneKatilimlar_KutuphanePlanlari_KutuphanePlanID",
                table: "KutuphaneKatilimlar");

            migrationBuilder.DropIndex(
                name: "IX_KutuphaneKatilimlar_KutuphanePlanID",
                table: "KutuphaneKatilimlar");

            migrationBuilder.AddColumn<Guid>(
                name: "PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_KutuphaneKatilimlar_PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar",
                column: "PlanKutuphanePlanID");

            migrationBuilder.AddForeignKey(
                name: "FK_KutuphaneKatilimlar_KutuphanePlanlari_PlanKutuphanePlanID",
                table: "KutuphaneKatilimlar",
                column: "PlanKutuphanePlanID",
                principalTable: "KutuphanePlanlari",
                principalColumn: "KutuphanePlanID");
        }
    }
}
