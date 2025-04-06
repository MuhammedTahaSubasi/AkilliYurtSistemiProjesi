using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class BakimTalep
    {
        [Key]
        public Guid TalepID { get; set; } = Guid.NewGuid();

        [Required]
        public string Baslik { get; set; }

        public string? Aciklama { get; set; }

        public DateTime TalepTarihi { get; set; } = DateTime.Now;

        public bool TalepDurumu { get; set; } = false;

        // Kullanıcı ile ilişki
        public Guid KullaniciID { get; set; }

        [ForeignKey("KullaniciID")]
        public Kullanici? Kullanici { get; set; }

    }
}
