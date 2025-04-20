using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YurtYonetimSistemi.API.Models;

namespace YurtYonetimSistemi.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class YemekhaneMenusuController : ControllerBase
    {
        private readonly AppDbContext _context;

        public YemekhaneMenusuController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/YemekhaneMenusu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<YemekhaneMenusu>>> GetYemekhaneMenusu()
        {
          if (_context.YemekhaneMenusu == null)
          {
              return NotFound();
          }
            return await _context.YemekhaneMenusu.ToListAsync();
        }

        // GET: api/YemekhaneMenusu/5
        [HttpGet("{id}")]
        public async Task<ActionResult<YemekhaneMenusu>> GetYemekhaneMenusu(Guid id)
        {
          if (_context.YemekhaneMenusu == null)
          {
              return NotFound();
          }
            var yemekhaneMenusu = await _context.YemekhaneMenusu.FindAsync(id);

            if (yemekhaneMenusu == null)
            {
                return NotFound();
            }

            return yemekhaneMenusu;
        }

        // PUT: api/YemekhaneMenusu/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutYemekhaneMenusu(Guid id, YemekhaneMenusu yemekhaneMenusu)
        {
            if (id != yemekhaneMenusu.MenuID)
            {
                return BadRequest("ID uyuşmazlığı.");
            }

            // Aynı günün diğer menülerini çek 
            var ayniGunMenuleri = await _context.YemekhaneMenusu
                .Where(m => m.Tarih.Date == yemekhaneMenusu.Tarih.Date && m.MenuID != id)
                .ToListAsync();

            // Aynı öğün var mı?
            if (ayniGunMenuleri.Any(m => m.Ogun == yemekhaneMenusu.Ogun))
                return BadRequest("Bu gün için bu öğün zaten eklenmiş.");

            _context.Entry(yemekhaneMenusu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.YemekhaneMenusu.Any(e => e.MenuID == id))
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

        // POST: api/YemekhaneMenusu
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<YemekhaneMenusu>> PostYemekhaneMenusu(YemekhaneMenusu yemekhaneMenusu)
        {
            if (_context.YemekhaneMenusu == null)
            {
                return Problem("Entity set 'AppDbContext.YemekhaneMenusu'  is null.");
            }

            // Aynı günün menülerini getir
            var ayniGunMenuleri = await _context.YemekhaneMenusu
                .Where(m => m.Tarih.Date == yemekhaneMenusu.Tarih.Date)
                .ToListAsync();

            // Aynı öğün kontrolü
            if (ayniGunMenuleri.Any(m => m.Ogun == yemekhaneMenusu.Ogun))
                return BadRequest("Bu gün için bu öğün zaten eklenmiş.");

            _context.YemekhaneMenusu.Add(yemekhaneMenusu);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetYemekhaneMenusu", new { id = yemekhaneMenusu.MenuID }, yemekhaneMenusu);
        }

        // DELETE: api/YemekhaneMenusu/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteYemekhaneMenusu(Guid id)
        {
            if (_context.YemekhaneMenusu == null)
            {
                return NotFound();
            }
            var yemekhaneMenusu = await _context.YemekhaneMenusu.FindAsync(id);
            if (yemekhaneMenusu == null)
            {
                return NotFound();
            }

            _context.YemekhaneMenusu.Remove(yemekhaneMenusu);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool YemekhaneMenusuExists(Guid id)
        {
            return (_context.YemekhaneMenusu?.Any(e => e.MenuID == id)).GetValueOrDefault();
        }
    }
}
