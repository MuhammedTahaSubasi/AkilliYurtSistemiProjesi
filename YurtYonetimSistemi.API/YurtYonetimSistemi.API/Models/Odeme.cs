using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class Odeme
    {
        [Key]
        public Guid OdemeID { get; set; }

        [Required]
        public Guid KullaniciID { get; set; }

        [ForeignKey("KullaniciID")]
        public Kullanici? Kullanici { get; set; }

        [Required]
        public decimal Tutar { get; set; }

        [Required]
        public DateTime SonOdemeTarihi { get; set; }

        public bool OdendiMi { get; set; } = false;

        public DateTime? OdemeTarihi { get; set; }
    }
}
