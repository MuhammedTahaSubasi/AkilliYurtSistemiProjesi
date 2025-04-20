using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class CamasirhanePlani
    {
        [Key]
        public Guid PlanID { get; set; }

        [Required]
        public Guid OdaID { get; set; }

        [ForeignKey("OdaID")]
        public Oda? Oda { get; set; }

        [Required]
        public string Gun { get; set; }  

        public string? SaatAraligi { get; set; } 

        public string? Aciklama { get; set; } 
    }
}
