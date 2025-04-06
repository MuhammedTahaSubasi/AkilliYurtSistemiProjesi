using System.ComponentModel.DataAnnotations.Schema;

namespace YurtYonetimSistemi.API.Models
{
    public class Kullanici
    {
        public Guid KullaniciID { get; set; }
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public string Email { get; set; }
        public string Sifre { get; set; }
        public string TcNo { get; set; }
        public Guid? OdaID { get; set; }
        public Guid? SinifID { get; set; }
        public DateTime? KayitTarihi { get; set; } = DateTime.Now;

        public Guid? RolID { get; set; }
        public Rol? Rol { get; set; }

        [ForeignKey("OdaID")]
        public Oda? Oda { get; set; }

        [ForeignKey("SinifID")]
        public Sinif? Sinif { get; set; }

    }
}
