using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class RemoveSinifIDFromOda : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Odalar_Siniflar_SinifID",
                table: "Odalar");

            migrationBuilder.DropIndex(
                name: "IX_Odalar_SinifID",
                table: "Odalar");

            migrationBuilder.DropColumn(
                name: "SinifID",
                table: "Odalar");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SinifID",
                table: "Odalar",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Odalar_SinifID",
                table: "Odalar",
                column: "SinifID");

            migrationBuilder.AddForeignKey(
                name: "FK_Odalar_Siniflar_SinifID",
                table: "Odalar",
                column: "SinifID",
                principalTable: "Siniflar",
                principalColumn: "SinifID");
        }
    }
}
