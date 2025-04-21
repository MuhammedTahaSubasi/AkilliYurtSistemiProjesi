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
    public class KutuphaneKatilimController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KutuphaneKatilimController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/KutuphaneKatilim
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KutuphaneKatilim>>> GetKutuphaneKatilimlar()
        {
          if (_context.KutuphaneKatilimlar == null)
          {
              return NotFound();
          }
            return await _context.KutuphaneKatilimlar.ToListAsync();
        }

        // GET: api/KutuphaneKatilim/5
        [HttpGet("{id}")]
        public async Task<ActionResult<KutuphaneKatilim>> GetKutuphaneKatilim(Guid id)
        {
          if (_context.KutuphaneKatilimlar == null)
          {
              return NotFound();
          }
            var kutuphaneKatilim = await _context.KutuphaneKatilimlar.FindAsync(id);

            if (kutuphaneKatilim == null)
            {
                return NotFound();
            }

            return kutuphaneKatilim;
        }

        // GET: api/KutuphaneKatilim/KutuphaneGore/{planId}
        [HttpGet("KutuphaneGore/{planId}")]
        public async Task<IActionResult> KatilanlariGetir(Guid planId)
        {
            var katilanlar = await _context.KutuphaneKatilimlar
                .Where(k => k.KutuphanePlanID == planId)
                .Include(k => k.Kullanici)
                .Select(k => new
                {
                    k.KullaniciID,
                    k.Kullanici.Ad,
                    k.Kullanici.Soyad,
                    k.Kullanici.Email
                })
                .ToListAsync();

            return Ok(katilanlar);
        }

        // PUT: api/KutuphaneKatilim/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKutuphaneKatilim(Guid id, KutuphaneKatilim kutuphaneKatilim)
        {
            if (id != kutuphaneKatilim.KatilimID)
            {
                return BadRequest();
            }

            _context.Entry(kutuphaneKatilim).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KutuphaneKatilimExists(id))
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

        // POST: api/KutuphaneKatilim
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<KutuphaneKatilim>> PostKutuphaneKatilim(KutuphaneKatilim kutuphaneKatilim)
        {
          if (_context.KutuphaneKatilimlar == null)
          {
              return Problem("Entity set 'AppDbContext.KutuphaneKatilimlar'  is null.");
          }
            _context.KutuphaneKatilimlar.Add(kutuphaneKatilim);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetKutuphaneKatilim", new { id = kutuphaneKatilim.KatilimID }, kutuphaneKatilim);
        }
        // delete 
        [HttpDelete("{kullaniciId}/{planId}")]
        public async Task<IActionResult> KatilimiIptalEt(Guid kullaniciId, Guid planId)
        {
            var kayit = await _context.KutuphaneKatilimlar
                .FirstOrDefaultAsync(k => k.KullaniciID == kullaniciId && k.KutuphanePlanID == planId);

            if (kayit == null)
                return NotFound();

            _context.KutuphaneKatilimlar.Remove(kayit);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/KutuphaneKatilim/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKutuphaneKatilim(Guid id)
        {
            if (_context.KutuphaneKatilimlar == null)
            {
                return NotFound();
            }
            var kutuphaneKatilim = await _context.KutuphaneKatilimlar.FindAsync(id);
            if (kutuphaneKatilim == null)
            {
                return NotFound();
            }

            _context.KutuphaneKatilimlar.Remove(kutuphaneKatilim);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KutuphaneKatilimExists(Guid id)
        {
            return (_context.KutuphaneKatilimlar?.Any(e => e.KatilimID == id)).GetValueOrDefault();
        }
    }
}
