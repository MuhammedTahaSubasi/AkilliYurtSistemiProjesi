using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class KutuphaneSubesi
    {
        [Key]
        public Guid KutuphaneSubeID { get; set; } = Guid.NewGuid();

        [Required]
        public string Ad { get; set; }

        [Required]
        public int Kapasite { get; set; }

        public ICollection<KutuphanePlani>? Planlar { get; set; }
    }
}
