namespace YurtYonetimSistemi.API.Models
{
    public class RegisterDto
    {
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public string Email { get; set; }
        public string Sifre { get; set; }
        public Guid RolID { get; set; }
    }
}
