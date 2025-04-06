using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class Sinif
    {
        [Key]
        public Guid SinifID { get; set; } = Guid.NewGuid();

        [Required]
        public string SinifAd { get; set; }

        public int KatNo { get; set; }

        public int Kapasite { get; set; }

        public ICollection<Kullanici>? Kullanicilar { get; set; }

    }
}
