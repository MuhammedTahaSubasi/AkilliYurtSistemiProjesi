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
        public DbSet<Ogrenci> Ogrenciler { get; set; }
        public DbSet<Sinif> Siniflar { get; set; }
        public DbSet<Oda> Odalar { get; set; }
        public DbSet<BakimTalep> BakimTalepleri { get; set; }
        public DbSet<Anket> Anketler { get; set; }
        public DbSet<AnketCevap> AnketCevaplar { get; set; }
        public DbSet<GirisCikis> GirisCikislar { get; set; }





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
