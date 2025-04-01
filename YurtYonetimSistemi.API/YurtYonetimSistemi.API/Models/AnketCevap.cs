using NuGet.ContentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class AnketCevap
    {
        [Key]
        public Guid CevapID { get; set; } = Guid.NewGuid();

        [Required]
        public Guid AnketID { get; set; }

        [ForeignKey("AnketID")]
        public Anket? Anket { get; set; }

        [Required]
        public Guid OgrenciID { get; set; }

        [ForeignKey("OgrenciID")]
        public Ogrenci? Ogrenci { get; set; }

        [Range(1, 5)]
        public int Puan { get; set; }
    }
}
