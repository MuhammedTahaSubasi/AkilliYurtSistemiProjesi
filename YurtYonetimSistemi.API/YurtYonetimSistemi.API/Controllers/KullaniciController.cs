using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YurtYonetimSistemi.API.Models;

namespace YurtYonetimSistemi.API.Controllers
{
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
        public async Task<ActionResult<Kullanici>> GetKullanici(int id)
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
            _context.Kullanicilar.Add(kullanici);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetKullanici), new { id = kullanici.KullaniciID }, kullanici);
        }

        // PUT: api/Kullanici/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKullanici(int id, Kullanici kullanici)
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
        public async Task<IActionResult> DeleteKullanici(int id)
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

        private bool KullaniciExists(int id)
        {
            return _context.Kullanicilar.Any(e => e.KullaniciID == id);
        }

    }
}
