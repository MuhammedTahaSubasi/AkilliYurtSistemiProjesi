using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class Basvuru
    {
        [Key]
        public Guid BasvuruID { get; set; } // Primary Key (Guid)

        [Required]
        public string BasvuruKodu { get; set; } // Başvuru Takip Kodu

        [Required]
        public string Ad { get; set; }

        [Required]
        public string Soyad { get; set; }

        [Required]
        public string TcNo { get; set; }

        [Required]
        public string Telefon { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public DateTime DogumTarihi { get; set; }

        [Required]
        public string Okul { get; set; }

        [Required]
        public string Bolum { get; set; }

        [Required]
        public int Sinif { get; set; }

        public string OgrenciBelgesiPath { get; set; } 
        public string AdliSicilBelgesiPath { get; set; }

        [Required]
        public DateTime BasvuruTarihi { get; set; }

        [Required]
        public string Durum { get; set; } 
    }
}
