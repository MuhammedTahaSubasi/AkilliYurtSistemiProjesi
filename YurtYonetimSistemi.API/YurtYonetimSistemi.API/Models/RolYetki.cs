using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models

{
    public class RolYetki
    {
        [Key]
        public Guid RolYetkiID { get; set; }

        [Required]
        public Guid RolID { get; set; }

        [Required]
        public Guid YetkiID { get; set; }

        // Navigation Properties
        [ForeignKey("RolID")]
        public Rol? Rol { get; set; }

        [ForeignKey("YetkiID")]
        public Yetki? Yetki { get; set; }
    }
}
