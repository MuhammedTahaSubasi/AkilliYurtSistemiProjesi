using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace YurtYonetimSistemi.API.Migrations
{
    public partial class InitialCreate : Migration
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
                name: "Roller",
                columns: table => new
                {
                    RolID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RolAd = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roller", x => x.RolID);
                });

            migrationBuilder.CreateTable(
                name: "Siniflar",
                columns: table => new
                {
                    SinifID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SinifAd = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KatNo = table.Column<int>(type: "int", nullable: false),
                    Kapasite = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Siniflar", x => x.SinifID);
                });

            migrationBuilder.CreateTable(
                name: "Yetkiler",
                columns: table => new
                {
                    YetkiID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    YetkiAd = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Yetkiler", x => x.YetkiID);
                });

            migrationBuilder.CreateTable(
                name: "Odalar",
                columns: table => new
                {
                    OdaID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OdaNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KatNo = table.Column<int>(type: "int", nullable: false),
                    Kapasite = table.Column<int>(type: "int", nullable: false),
                    SinifID = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Odalar", x => x.OdaID);
                    table.ForeignKey(
                        name: "FK_Odalar_Siniflar_SinifID",
                        column: x => x.SinifID,
                        principalTable: "Siniflar",
                        principalColumn: "SinifID");
                });

            migrationBuilder.CreateTable(
                name: "RolYetkiler",
                columns: table => new
                {
                    RolYetkiID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RolID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    YetkiID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolYetkiler", x => x.RolYetkiID);
                    table.ForeignKey(
                        name: "FK_RolYetkiler_Roller_RolID",
                        column: x => x.RolID,
                        principalTable: "Roller",
                        principalColumn: "RolID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolYetkiler_Yetkiler_YetkiID",
                        column: x => x.YetkiID,
                        principalTable: "Yetkiler",
                        principalColumn: "YetkiID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Kullanicilar",
                columns: table => new
                {
                    KullaniciID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Ad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Soyad = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Sifre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TcNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OdaID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SinifID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    KayitTarihi = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RolID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kullanicilar", x => x.KullaniciID);
                    table.ForeignKey(
                        name: "FK_Kullanicilar_Odalar_OdaID",
                        column: x => x.OdaID,
                        principalTable: "Odalar",
                        principalColumn: "OdaID");
                    table.ForeignKey(
                        name: "FK_Kullanicilar_Roller_RolID",
                        column: x => x.RolID,
                        principalTable: "Roller",
                        principalColumn: "RolID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Kullanicilar_Siniflar_SinifID",
                        column: x => x.SinifID,
                        principalTable: "Siniflar",
                        principalColumn: "SinifID");
                });

            migrationBuilder.CreateTable(
                name: "AnketCevaplar",
                columns: table => new
                {
                    CevapID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnketID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    KullaniciID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
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
                        name: "FK_AnketCevaplar_Kullanicilar_KullaniciID",
                        column: x => x.KullaniciID,
                        principalTable: "Kullanicilar",
                        principalColumn: "KullaniciID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BakimTalepleri",
                columns: table => new
                {
                    TalepID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Baslik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TalepTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TalepDurumu = table.Column<bool>(type: "bit", nullable: false),
                    KullaniciID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BakimTalepleri", x => x.TalepID);
                    table.ForeignKey(
                        name: "FK_BakimTalepleri_Kullanicilar_KullaniciID",
                        column: x => x.KullaniciID,
                        principalTable: "Kullanicilar",
                        principalColumn: "KullaniciID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GirisCikislar",
                columns: table => new
                {
                    GirisCikisID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GirisMi = table.Column<bool>(type: "bit", nullable: false),
                    ZamanDamgasi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    KullaniciID = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GirisCikislar", x => x.GirisCikisID);
                    table.ForeignKey(
                        name: "FK_GirisCikislar_Kullanicilar_KullaniciID",
                        column: x => x.KullaniciID,
                        principalTable: "Kullanicilar",
                        principalColumn: "KullaniciID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnketCevaplar_AnketID",
                table: "AnketCevaplar",
                column: "AnketID");

            migrationBuilder.CreateIndex(
                name: "IX_AnketCevaplar_KullaniciID",
                table: "AnketCevaplar",
                column: "KullaniciID");

            migrationBuilder.CreateIndex(
                name: "IX_BakimTalepleri_KullaniciID",
                table: "BakimTalepleri",
                column: "KullaniciID");

            migrationBuilder.CreateIndex(
                name: "IX_GirisCikislar_KullaniciID",
                table: "GirisCikislar",
                column: "KullaniciID");

            migrationBuilder.CreateIndex(
                name: "IX_Kullanicilar_OdaID",
                table: "Kullanicilar",
                column: "OdaID");

            migrationBuilder.CreateIndex(
                name: "IX_Kullanicilar_RolID",
                table: "Kullanicilar",
                column: "RolID");

            migrationBuilder.CreateIndex(
                name: "IX_Kullanicilar_SinifID",
                table: "Kullanicilar",
                column: "SinifID");

            migrationBuilder.CreateIndex(
                name: "IX_Odalar_SinifID",
                table: "Odalar",
                column: "SinifID");

            migrationBuilder.CreateIndex(
                name: "IX_RolYetkiler_RolID",
                table: "RolYetkiler",
                column: "RolID");

            migrationBuilder.CreateIndex(
                name: "IX_RolYetkiler_YetkiID",
                table: "RolYetkiler",
                column: "YetkiID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnketCevaplar");

            migrationBuilder.DropTable(
                name: "BakimTalepleri");

            migrationBuilder.DropTable(
                name: "GirisCikislar");

            migrationBuilder.DropTable(
                name: "RolYetkiler");

            migrationBuilder.DropTable(
                name: "Anketler");

            migrationBuilder.DropTable(
                name: "Kullanicilar");

            migrationBuilder.DropTable(
                name: "Yetkiler");

            migrationBuilder.DropTable(
                name: "Odalar");

            migrationBuilder.DropTable(
                name: "Roller");

            migrationBuilder.DropTable(
                name: "Siniflar");
        }
    }
}
