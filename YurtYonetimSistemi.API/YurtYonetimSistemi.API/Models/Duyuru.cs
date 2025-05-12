using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class Duyuru
    {
        [Key]
        public Guid DuyuruID { get; set; }

        [Required]
        public string Baslik { get; set; }

        [Required]
        public string Mesaj { get; set; }

        public DateTime Tarih { get; set; } = DateTime.Now;

        public bool AktifMi { get; set; } = true;
    }
}
