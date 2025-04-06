using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YurtYonetimSistemi.API.Models;
using Microsoft.AspNetCore.Authorization;

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
            return await _context.Kullanicilar.Include(k => k.Rol).ToListAsync();
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
            // 1. İlgili odayı çek
            var oda = await _context.Odalar
                .Include(o => o.Kullanicilar)
                .FirstOrDefaultAsync(o => o.OdaID == kullanici.OdaID);

            // 2. Oda doluysa kaydı reddet
            if (oda != null && oda.Kullanicilar.Count >= oda.Kapasite)
            {
                return BadRequest("Bu oda şu anda dolu. Lütfen başka bir oda seçin.");
            }

            // 3. Şifreyi hashle ve kullanıcıyı kaydet
            kullanici.Sifre = BCrypt.Net.BCrypt.HashPassword(kullanici.Sifre);
            _context.Kullanicilar.Add(kullanici);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetKullanici), new { id = kullanici.KullaniciID }, kullanici);
        }


        // PUT: api/Kullanici/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKullanici(Guid id, Kullanici kullanici)
        {
            if (id != kullanici.KullaniciID)
            {
                return BadRequest();
            }

            _context.Entry(kullanici).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KullaniciExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
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

    }
}
