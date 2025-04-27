namespace YurtYonetimSistemi.API.Models
{
    public class BasvuruDto
    {
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public string TcNo { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public DateTime DogumTarihi { get; set; }
        public string Okul { get; set; }
        public string Bolum { get; set; }
        public int Sinif { get; set; }

        public IFormFile OgrenciBelgesi { get; set; } 
        public IFormFile AdliSicilBelgesi { get; set; } 
    }
}
