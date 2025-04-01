using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class Yetki
    {
        [Key]
        public Guid YetkiID { get; set; }

        [Required]
        public string YetkiAd { get; set; }
        public ICollection<RolYetki>? RolYetkiler { get; set; }

    }
}
