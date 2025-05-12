using Microsoft.EntityFrameworkCore;
using NuGet.ContentModel;

namespace YurtYonetimSistemi.API.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Kullanici> Kullanicilar { get; set; }
        public DbSet<Rol> Roller { get; set; }
        public DbSet<Yetki> Yetkiler { get; set; }
        public DbSet<RolYetki> RolYetkiler { get; set; }
        public DbSet<Sinif> Siniflar { get; set; }
        public DbSet<Oda> Odalar { get; set; }
        public DbSet<BakimTalep> BakimTalepleri { get; set; }
        public DbSet<Anket> Anketler { get; set; }
        public DbSet<AnketCevap> AnketCevaplar { get; set; }
        public DbSet<GirisCikis> GirisCikislar { get; set; }
        public DbSet<Etkinlik> Etkinlikler { get; set; }
        public DbSet<EtkinlikKatilim> EtkinlikKatilimlari { get; set; }
        public DbSet<YemekhaneMenusu> YemekhaneMenusu { get; set; }
        public DbSet<CamasirhanePlani> CamasirhanePlani { get; set; }
        public DbSet<KutuphaneSubesi> KutuphaneSubeleri { get; set; }
        public DbSet<KutuphanePlani> KutuphanePlanlari { get; set; }
        public DbSet<KutuphaneKatilim> KutuphaneKatilimlar { get; set; }
        public DbSet<Odeme> Odemeler { get; set; }
        public DbSet<Basvuru> Basvurular { get; set; }
        public DbSet<Duyuru> Duyurular { get; set; }











        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Kullanici → Rol ilişkisi
            modelBuilder.Entity<Kullanici>()
                .HasOne(k => k.Rol)
                .WithMany(r => r.Kullanicilar)
                .HasForeignKey(k => k.RolID);
            // RolYetki → Rol ilişkisi
            modelBuilder.Entity<RolYetki>()
                .HasOne(ry => ry.Rol)
                .WithMany(r => r.RolYetkiler)
                .HasForeignKey(ry => ry.RolID);
            // RolYetki → Yetki ilişkisi
            modelBuilder.Entity<RolYetki>()
                .HasOne(ry => ry.Yetki)
                .WithMany(y => y.RolYetkiler)
                .HasForeignKey(ry => ry.YetkiID);

        }
    }
}
