using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class AddTelefonToKullanici : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kullanicilar_Roller_RolID",
                table: "Kullanicilar");

            migrationBuilder.AlterColumn<Guid>(
                name: "RolID",
                table: "Kullanicilar",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddColumn<string>(
                name: "Telefon",
                table: "Kullanicilar",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Kullanicilar_Roller_RolID",
                table: "Kullanicilar",
                column: "RolID",
                principalTable: "Roller",
                principalColumn: "RolID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kullanicilar_Roller_RolID",
                table: "Kullanicilar");

            migrationBuilder.DropColumn(
                name: "Telefon",
                table: "Kullanicilar");

            migrationBuilder.AlterColumn<Guid>(
                name: "RolID",
                table: "Kullanicilar",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Kullanicilar_Roller_RolID",
                table: "Kullanicilar",
                column: "RolID",
                principalTable: "Roller",
                principalColumn: "RolID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
