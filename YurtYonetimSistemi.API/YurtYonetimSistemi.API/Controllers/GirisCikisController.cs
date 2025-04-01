using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YurtYonetimSistemi.API.Models;

namespace YurtYonetimSistemi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GirisCikisController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GirisCikisController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/GirisCikis
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GirisCikis>>> GetGirisCikislar()
        {
            if (_context.GirisCikislar == null)
            {
                return NotFound();
            }
            return await _context.GirisCikislar
                .Include(gc => gc.Ogrenci) // Öğrenci bilgisiyle birlikte getir
                .ToListAsync();
        }

        // GET: api/GirisCikis/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GirisCikis>> GetGirisCikis(Guid id)
        {
            if (_context.GirisCikislar == null)
            {
                return NotFound();
            }
            var girisCikis = await _context.GirisCikislar
                .Include(gc => gc.Ogrenci) // Öğrenci bilgisiyle birlikte getir
                .FirstOrDefaultAsync(gc => gc.GirisCikisID == id);

            if (girisCikis == null)
            {
                return NotFound();
            }

            return girisCikis;
        }

        // PUT: api/GirisCikis/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGirisCikis(Guid id, GirisCikis girisCikis)
        {
            if (id != girisCikis.GirisCikisID)
            {
                return BadRequest();
            }

            _context.Entry(girisCikis).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GirisCikisExists(id))
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

        // POST: api/GirisCikis
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GirisCikis>> PostGirisCikis(GirisCikis girisCikis)
        {
            if (_context.GirisCikislar == null)
            {
                return Problem("Entity set 'AppDbContext.GirisCikislar'  is null.");
            }

            // Öğrencinin son kaydını bul
            var sonKayit = await _context.GirisCikislar
                .Where(g => g.OgrenciID == girisCikis.OgrenciID)
                .OrderByDescending(g => g.ZamanDamgasi)
                .FirstOrDefaultAsync();

            // Eğer daha önce hiç kayıt yoksa veya en son çıkış yapmışsa → GİRİŞ
            // Eğer en son giriş yapmışsa → ÇIKIŞ
            girisCikis.GirisMi = (sonKayit == null || !sonKayit.GirisMi);

            girisCikis.ZamanDamgasi = DateTime.Now;
            _context.GirisCikislar.Add(girisCikis);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGirisCikis", new { id = girisCikis.GirisCikisID }, girisCikis);
        }

        // DELETE: api/GirisCikis/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGirisCikis(Guid id)
        {
            if (_context.GirisCikislar == null)
            {
                return NotFound();
            }
            var girisCikis = await _context.GirisCikislar.FindAsync(id);
            if (girisCikis == null)
            {
                return NotFound();
            }

            _context.GirisCikislar.Remove(girisCikis);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GirisCikisExists(Guid id)
        {
            return (_context.GirisCikislar?.Any(e => e.GirisCikisID == id)).GetValueOrDefault();
        }
    }
}
