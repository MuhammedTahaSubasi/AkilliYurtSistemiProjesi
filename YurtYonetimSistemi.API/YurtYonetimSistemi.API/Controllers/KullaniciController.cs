using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YurtYonetimSistemi.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Text.Json;

namespace YurtYonetimSistemi.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class KullaniciController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KullaniciController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Kullanici
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Kullanici>>> GetKullanicilar()
        {
            return await _context.Kullanicilar
                .Include(k => k.Rol)
                .Include(k => k.Oda)
                .Include(k => k.Sinif)
                .ToListAsync();
        }

        // GET: api/Kullanici/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Kullanici>> GetKullanici(Guid id)
        {
            var kullanici = await _context.Kullanicilar.Include(k => k.Rol)
                .FirstOrDefaultAsync(k => k.KullaniciID == id);

            if (kullanici == null)
            {
                return NotFound();
            }

            return kullanici;
        }

        // POST: api/Kullanici
        [HttpPost]
        public async Task<ActionResult<Kullanici>> PostKullanici(Kullanici kullanici)
        {
            // 1. Oda kapasite kontrolü
            var oda = await _context.Odalar
                .Include(o => o.Kullanicilar)
                .FirstOrDefaultAsync(o => o.OdaID == kullanici.OdaID);

            if (oda != null && oda.Kullanicilar.Count >= oda.Kapasite)
            {
                return BadRequest("Bu oda şu anda dolu. Lütfen başka bir oda seçin.");
            }

            // 2. Sınıf kapasite kontrolü
            var mevcutSayisi = await _context.Kullanicilar
                .CountAsync(k => k.SinifID == kullanici.SinifID);

            var sinif = await _context.Siniflar.FindAsync(kullanici.SinifID);

            if (sinif != null && mevcutSayisi >= sinif.Kapasite)
            {
                return BadRequest("Bu sınıfın kapasitesi dolmuştur. Lütfen başka bir sınıf seçin.");
            }

            // 3. Şifreyi hashle ve kullanıcıyı kaydet
            kullanici.Sifre = BCrypt.Net.BCrypt.HashPassword(kullanici.Sifre);
            _context.Kullanicilar.Add(kullanici);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetKullanici), new { id = kullanici.KullaniciID }, kullanici);
        }



        // PUT: api/Kullanici/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKullanici(Guid id, [FromBody] JsonElement requestBody)
        {
            var mevcutKullanici = await _context.Kullanicilar.FindAsync(id);
            if (mevcutKullanici == null)
                return NotFound();

            // Request'i JSON olarak işle
            try
            {
                // Kullanıcı ID kontrolü
                if (requestBody.TryGetProperty("kullaniciID", out var kullaniciIDElement))
                {
                    var kullaniciID = kullaniciIDElement.GetGuid();
                    if (id != kullaniciID)
                        return BadRequest("ID uyuşmazlığı");
                }

                // Diğer alanları güncelle
                if (requestBody.TryGetProperty("ad", out var adElement))
                    mevcutKullanici.Ad = adElement.GetString();

                if (requestBody.TryGetProperty("soyad", out var soyadElement))
                    mevcutKullanici.Soyad = soyadElement.GetString();

                if (requestBody.TryGetProperty("email", out var emailElement))
                    mevcutKullanici.Email = emailElement.GetString();

                if (requestBody.TryGetProperty("tcNo", out var tcNoElement))
                    mevcutKullanici.TcNo = tcNoElement.GetString();

                if (requestBody.TryGetProperty("telefon", out var telefonElement))
                    mevcutKullanici.Telefon = telefonElement.GetString();

                if (requestBody.TryGetProperty("odaID", out var odaIDElement) && !odaIDElement.ValueKind.Equals(JsonValueKind.Null))
                    mevcutKullanici.OdaID = odaIDElement.TryGetGuid(out var odaGuid) ? odaGuid : (Guid?)null;

                if (requestBody.TryGetProperty("sinifID", out var sinifIDElement) && !sinifIDElement.ValueKind.Equals(JsonValueKind.Null))
                    mevcutKullanici.SinifID = sinifIDElement.TryGetGuid(out var sinifGuid) ? sinifGuid : (Guid?)null;

                if (requestBody.TryGetProperty("rolID", out var rolIDElement) && !rolIDElement.ValueKind.Equals(JsonValueKind.Null))
                    mevcutKullanici.RolID = rolIDElement.TryGetGuid(out var rolGuid) ? rolGuid : (Guid?)null;

                // Şifre alanını özel olarak işle
                if (requestBody.TryGetProperty("sifre", out var sifreElement) &&
                    sifreElement.ValueKind != JsonValueKind.Null &&
                    !string.IsNullOrWhiteSpace(sifreElement.GetString()))
                {
                    mevcutKullanici.Sifre = BCrypt.Net.BCrypt.HashPassword(sifreElement.GetString());
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Güncelleme hatası: {ex.Message}");
            }
        }

        // DELETE: api/Kullanici/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKullanici(Guid id)
        {
            var kullanici = await _context.Kullanicilar.FindAsync(id);
            if (kullanici == null)
            {
                return NotFound();
            }

            _context.Kullanicilar.Remove(kullanici);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KullaniciExists(Guid id)
        {
            return _context.Kullanicilar.Any(e => e.KullaniciID == id);
        }

        //GET ME 
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var kullaniciId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (kullaniciId == null)
                return Unauthorized();

            var kullanici = await _context.Kullanicilar
                .Include(k => k.Rol)
                .FirstOrDefaultAsync(k => k.KullaniciID == Guid.Parse(kullaniciId));

            if (kullanici == null)
                return NotFound();

            return Ok(new
            {
                kullanici.KullaniciID,
                kullanici.Ad,
                kullanici.Soyad,
                kullanici.Email,
                kullanici.TcNo,
                kullanici.KayitTarihi,
                Rol = kullanici.Rol?.RolAd
            });
        }

    }
}
