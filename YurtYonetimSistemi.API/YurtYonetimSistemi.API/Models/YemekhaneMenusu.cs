using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class YemekhaneMenusu
    {
        [Key]
        public Guid MenuID { get; set; }

        [Required]
        public DateTime Tarih { get; set; }

        [Required]
        public string Ogun { get; set; }

        [Required]
        public string Yemekler { get; set; }

        public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;
    }
}
