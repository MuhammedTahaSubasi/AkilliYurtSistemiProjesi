using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class Anket
    {
        [Key]
        public Guid AnketID { get; set; } = Guid.NewGuid();

        [Required]
        public string Soru { get; set; }

        public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;

        public bool AktifMi { get; set; } = true;

        public ICollection<AnketCevap>? Cevaplar { get; set; }
    }
}
