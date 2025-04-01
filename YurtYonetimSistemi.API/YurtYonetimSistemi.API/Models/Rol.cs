namespace YurtYonetimSistemi.API.Models
{
    public class Rol
    {
        public Guid RolID { get; set; }
        public string RolAd { get; set; }

        public ICollection<Kullanici>? Kullanicilar { get; set; }
        public ICollection<RolYetki>? RolYetkiler { get; set; }

    }
}
