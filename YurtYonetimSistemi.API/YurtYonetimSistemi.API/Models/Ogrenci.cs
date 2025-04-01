using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace YurtYonetimSistemi.API.Models
{
    public class Ogrenci
    {
        [Key]
        public Guid OgrenciID { get; set; } = Guid.NewGuid();

        [Required]
        public string Ad { get; set; }

        [Required]
        public string Soyad { get; set; }

        [Required]
        public string TcNo { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public DateTime KayitTarihi { get; set; } = DateTime.Now;

     
        public Guid? SinifID { get; set; }  
        public Guid? OdaID { get; set; }    

        // Navigation Properties
        [ForeignKey("SinifID")]
        public Sinif? Sinif { get; set; }

        [ForeignKey("OdaID")]
        public Oda? Oda { get; set; }
    }
}
