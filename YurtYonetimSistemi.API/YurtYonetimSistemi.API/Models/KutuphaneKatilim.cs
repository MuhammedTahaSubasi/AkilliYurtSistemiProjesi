using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace YurtYonetimSistemi.API.Models
{
    public class KutuphaneKatilim
    {
        [Key]
        public Guid KatilimID { get; set; } = Guid.NewGuid();

        [ForeignKey("Plan")]
        public Guid KutuphanePlanID { get; set; }
        public KutuphanePlani? Plan { get; set; }

        [ForeignKey("Kullanici")]
        public Guid KullaniciID { get; set; }
        public Kullanici? Kullanici { get; set; }
    }
}
