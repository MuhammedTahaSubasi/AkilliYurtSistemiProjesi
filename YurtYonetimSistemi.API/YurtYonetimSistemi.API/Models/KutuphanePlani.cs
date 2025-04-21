using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class KutuphanePlani
    {
        [Key]
        public Guid KutuphanePlanID { get; set; } = Guid.NewGuid();

        [Required]
        public string Gun { get; set; }

        [Required]
        public string SaatAraligi { get; set; }

        [Required]
        public DateTime Tarih { get; set; }

        public bool AktifMi { get; set; } = true;

        [ForeignKey("KutuphaneSubesi")]
        public Guid KutuphaneSubeID { get; set; }
        public KutuphaneSubesi? KutuphaneSubesi { get; set; }

        public ICollection<KutuphaneKatilim>? Katilimlar { get; set; }
    }
}
