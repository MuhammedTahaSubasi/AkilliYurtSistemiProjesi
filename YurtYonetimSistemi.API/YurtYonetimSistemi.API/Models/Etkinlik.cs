using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class Etkinlik
    {
        [Key]
        public Guid EtkinlikID { get; set; } = Guid.NewGuid();

        [Required]
        public string Ad { get; set; }

        public DateTime Tarih { get; set; }

        [Required]
        public int Kontenjan { get; set; }

        [Required]
        public bool AktifMi { get; set; } = true;

        public ICollection<EtkinlikKatilim>? Katilimlar { get; set; }
    }
}
