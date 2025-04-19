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
    public class EtkinlikKatilimController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EtkinlikKatilimController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/EtkinlikKatilim
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EtkinlikKatilim>>> GetEtkinlikKatilimlari()
        {
          if (_context.EtkinlikKatilimlari == null)
          {
              return NotFound();
          }
            return await _context.EtkinlikKatilimlari.ToListAsync();
        }

        // GET: api/EtkinlikKatilim/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EtkinlikKatilim>> GetEtkinlikKatilim(Guid id)
        {
          if (_context.EtkinlikKatilimlari == null)
          {
              return NotFound();
          }
            var etkinlikKatilim = await _context.EtkinlikKatilimlari.FindAsync(id);

            if (etkinlikKatilim == null)
            {
                return NotFound();
            }

            return etkinlikKatilim;
        }

        // GET: api/EtkinlikKatilim/EtkinligeGore/{etkinlikId}
        [HttpGet("EtkinligeGore/{etkinlikId}")]
        public async Task<ActionResult<IEnumerable<EtkinlikKatilim>>> GetKatilimlarByEtkinlik(Guid etkinlikId)
        {
            if (_context.EtkinlikKatilimlari == null)
            {
                return NotFound();
            }

            var katilimlar = await _context.EtkinlikKatilimlari
                .Where(k => k.EtkinlikID == etkinlikId)
                .Include(k => k.Kullanici) // Ad Soyad için
                .ToListAsync();

            return katilimlar;
        }

        // PUT: api/EtkinlikKatilim/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEtkinlikKatilim(Guid id, EtkinlikKatilim etkinlikKatilim)
        {
            if (id != etkinlikKatilim.KatilimID)
            {
                return BadRequest();
            }

            _context.Entry(etkinlikKatilim).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtkinlikKatilimExists(id))
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

        // POST: api/EtkinlikKatilim
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<EtkinlikKatilim>> PostEtkinlikKatilim(EtkinlikKatilim etkinlikKatilim)
        {
          if (_context.EtkinlikKatilimlari == null)
          {
              return Problem("Entity set 'AppDbContext.EtkinlikKatilimlari'  is null.");
          }
            //  Aynı etkinliğe aynı kullanıcı daha önce katıldı mı
            var mevcut = await _context.EtkinlikKatilimlari
                .FirstOrDefaultAsync(x => x.EtkinlikID == etkinlikKatilim.EtkinlikID && x.KullaniciID == etkinlikKatilim.KullaniciID);

            if (mevcut != null)
            {
                return BadRequest("Bu kullanıcı zaten bu etkinliğe katıldı.");
            }
            //  Katılım sayısı kontenjanı geçti mi?
            var katilimSayisi = await _context.EtkinlikKatilimlari
                .CountAsync(x => x.EtkinlikID == etkinlikKatilim.EtkinlikID);

            var kontenjan = await _context.Etkinlikler
                .Where(e => e.EtkinlikID == etkinlikKatilim.EtkinlikID)
                .Select(e => e.Kontenjan)
                .FirstOrDefaultAsync();

            if (katilimSayisi >= kontenjan)
                return BadRequest("Etkinlik kontenjanı dolmuştur.");
            _context.EtkinlikKatilimlari.Add(etkinlikKatilim);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEtkinlikKatilim", new { id = etkinlikKatilim.KatilimID }, etkinlikKatilim);
        }

        // DELETE: api/EtkinlikKatilim/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEtkinlikKatilim(Guid id)
        {
            if (_context.EtkinlikKatilimlari == null)
            {
                return NotFound();
            }
            var etkinlikKatilim = await _context.EtkinlikKatilimlari.FindAsync(id);
            if (etkinlikKatilim == null)
            {
                return NotFound();
            }

            _context.EtkinlikKatilimlari.Remove(etkinlikKatilim);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EtkinlikKatilimExists(Guid id)
        {
            return (_context.EtkinlikKatilimlari?.Any(e => e.KatilimID == id)).GetValueOrDefault();
        }
    }
}
