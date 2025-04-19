using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YurtYonetimSistemi.API.Models
{
    public class EtkinlikKatilim
    {
        [Key]
        public Guid KatilimID { get; set; } = Guid.NewGuid();

        [ForeignKey("EtkinlikID")]
        public Guid EtkinlikID { get; set; }
        public Etkinlik? Etkinlik { get; set; }

        [ForeignKey("KullaniciID")]
        public Guid KullaniciID { get; set; }
        public Kullanici? Kullanici { get; set; }
    }
}
