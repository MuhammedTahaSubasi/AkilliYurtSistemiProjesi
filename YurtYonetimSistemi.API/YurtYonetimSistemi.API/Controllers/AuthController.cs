using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YurtYonetimSistemi.API.Models;
using YurtYonetimSistemi.API.Services;

namespace YurtYonetimSistemi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var kullanici = await _context.Kullanicilar
                .Include(k => k.Rol) // Rol bilgisi token için lazım
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (kullanici == null)
                return Unauthorized("Kullanıcı bulunamadı.");

            bool isValid = BCrypt.Net.BCrypt.Verify(dto.Sifre, kullanici.Sifre);
            if (!isValid)
                return Unauthorized("Şifre hatalı");

            var token = _tokenService.CreateToken(kullanici);

            return Ok(new
            {
                message = "Giriş başarılı",
                token = token
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Sifre);

            var kullanici = new Kullanici
            {
                Ad = dto.Ad,
                Soyad = dto.Soyad,
                Email = dto.Email,
                Sifre = hashedPassword,
                RolID = dto.RolID
            };

            _context.Kullanicilar.Add(kullanici);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kayıt başarılı" });
        }

    }
}
