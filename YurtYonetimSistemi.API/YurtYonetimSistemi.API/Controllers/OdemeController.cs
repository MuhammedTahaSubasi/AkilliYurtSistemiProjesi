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
    public class OdemeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OdemeController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Odeme
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Odeme>>> GetOdemeler()
        {
          if (_context.Odemeler == null)
          {
              return NotFound();
          }
            return await _context.Odemeler
                .Include(o => o.Kullanici)
                .ThenInclude(k => k.Oda)
                .Include(o => o.Kullanici)
                .ThenInclude(k => k.Sinif)
                .ToListAsync();
        }

        // GET: api/Odeme/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Odeme>> GetOdeme(Guid id)
        {
          if (_context.Odemeler == null)
          {
              return NotFound();
          }
            var odeme = await _context.Odemeler.FindAsync(id);

            if (odeme == null)
            {
                return NotFound();
            }

            return odeme;
        }
        // GET: api/Odeme/ogrenci/listele/{kullaniciId}
        [HttpGet("ogrenci/listele/{kullaniciId}")]
        public async Task<ActionResult<IEnumerable<Odeme>>> OgrenciOdemeleri(Guid kullaniciId)
        {
            if (_context.Odemeler == null)
            {
                return NotFound();
            }

            var odemeler = await _context.Odemeler
                .Where(o => o.KullaniciID == kullaniciId)
                .OrderByDescending(o => o.SonOdemeTarihi)
                .ToListAsync();

            if (odemeler == null || !odemeler.Any())
            {
                return NotFound("Öğrencinin ödeme kaydı bulunamadı.");
            }

            return odemeler;
        }

        // PUT: api/Odeme/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOdeme(Guid id, Odeme odeme)
        {
            if (id != odeme.OdemeID)
            {
                return BadRequest();
            }

            var mevcutOdeme = await _context.Odemeler.FindAsync(id);
            if (mevcutOdeme == null)
            {
                return NotFound();
            }

            // Güncellenecek alanlar:
            mevcutOdeme.Tutar = odeme.Tutar;
            mevcutOdeme.SonOdemeTarihi = odeme.SonOdemeTarihi;
            mevcutOdeme.OdendiMi = odeme.OdendiMi;

            if (odeme.OdendiMi)
            {
                mevcutOdeme.OdemeTarihi = DateTime.Now;
            }
            else
            {
                mevcutOdeme.OdemeTarihi = null;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OdemeExists(id))
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

        // POST: api/Odeme
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Odeme>> PostOdeme(Odeme odeme)
        {
          if (_context.Odemeler == null)
          {
              return Problem("Entity set 'AppDbContext.Odemeler'  is null.");
          }
            _context.Odemeler.Add(odeme);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOdeme", new { id = odeme.OdemeID }, odeme);
        }
        // POST: api/Odeme/toplu-ekle
        [HttpPost("toplu-ekle")]
        public async Task<IActionResult> TopluOdemeEkle(OdemePlanDto odemePlan)
        {
            // Öğrenci rolüne sahip kullanıcıları bulacağız
            var ogrenciler = await _context.Kullanicilar
                .Where(x => x.RolID == Guid.Parse("73E43730-69A2-4D0E-2DEA-08DD75474EC7")) 
                .ToListAsync();

            if (ogrenciler == null || !ogrenciler.Any())
                return NotFound("Öğrenci bulunamadı.");

            foreach (var ogrenci in ogrenciler)
            {
                var yeniOdeme = new Odeme
                {
                    KullaniciID = ogrenci.KullaniciID,
                    Tutar = odemePlan.Tutar,
                    SonOdemeTarihi = odemePlan.SonOdemeTarihi,
                    OdendiMi = false,
                    OdemeTarihi = null
                };

                _context.Odemeler.Add(yeniOdeme);
            }

            await _context.SaveChangesAsync();

            return Ok("Toplu ödeme planı başarıyla oluşturuldu.");
        }

        // DELETE: api/Odeme/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOdeme(Guid id)
        {
            if (_context.Odemeler == null)
            {
                return NotFound();
            }
            var odeme = await _context.Odemeler.FindAsync(id);
            if (odeme == null)
            {
                return NotFound();
            }

            _context.Odemeler.Remove(odeme);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OdemeExists(Guid id)
        {
            return (_context.Odemeler?.Any(e => e.OdemeID == id)).GetValueOrDefault();
        }
    }
}
