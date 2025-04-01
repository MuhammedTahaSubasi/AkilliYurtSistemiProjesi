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
    public class OgrenciController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OgrenciController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Ogrenci
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ogrenci>>> GetOgrenciler()
        {
          if (_context.Ogrenciler == null)
          {
              return NotFound();
          }
            return await _context.Ogrenciler.ToListAsync();
        }

        // GET: api/Ogrenci/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ogrenci>> GetOgrenci(int id)
        {
          if (_context.Ogrenciler == null)
          {
              return NotFound();
          }
            var ogrenci = await _context.Ogrenciler.FindAsync(id);

            if (ogrenci == null)
            {
                return NotFound();
            }

            return ogrenci;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOgrenci(Guid id, Ogrenci ogrenci)
        {
            if (id != ogrenci.OgrenciID)
            {
                return BadRequest();
            }

            // Güncellenen öğrenciyi veri tabanından alalım
            var mevcutOgrenci = await _context.Ogrenciler.AsNoTracking()
                .FirstOrDefaultAsync(x => x.OgrenciID == id);

            if (mevcutOgrenci == null)
            {
                return NotFound();
            }

            // Eğer oda değiştiyse → kapasite kontrolü yap
            if (ogrenci.OdaID != null && ogrenci.OdaID != mevcutOgrenci.OdaID)
            {
                var oda = await _context.Odalar.FindAsync(ogrenci.OdaID);
                if (oda == null)
                {
                    return BadRequest("Geçersiz Oda ID");
                }

                var mevcutOgrenciSayisi = await _context.Ogrenciler
                    .CountAsync(o => o.OdaID == ogrenci.OdaID);

                if (mevcutOgrenciSayisi >= oda.Kapasite)
                {
                    return BadRequest("Bu oda kapasite sınırına ulaşmıştır.");
                }
            }

            _context.Entry(ogrenci).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OgrenciExists(id))
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


        // POST: api/Ogrenci
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Ogrenci>> PostOgrenci(Ogrenci ogrenci)
        {
          if (_context.Ogrenciler == null)
          {
              return Problem("Entity set 'AppDbContext.Ogrenciler'  is null.");
          }
            // Eğer OdaID null değilse, kapasite kontrolü yap
            if (ogrenci.OdaID != null)
            {
                var oda = await _context.Odalar.FindAsync(ogrenci.OdaID);
                if (oda == null)
                {
                    return BadRequest("Geçersiz Oda ID");
                }

                var mevcutOgrenciSayisi = await _context.Ogrenciler
                    .CountAsync(o => o.OdaID == ogrenci.OdaID);

                if (mevcutOgrenciSayisi >= oda.Kapasite)
                {
                    return BadRequest("Bu oda kapasite sınırına ulaşmıştır.");
                }
            }
            _context.Ogrenciler.Add(ogrenci);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOgrenci", new { id = ogrenci.OgrenciID }, ogrenci);
        }

        // DELETE: api/Ogrenci/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOgrenci(int id)
        {
            if (_context.Ogrenciler == null)
            {
                return NotFound();
            }
            var ogrenci = await _context.Ogrenciler.FindAsync(id);
            if (ogrenci == null)
            {
                return NotFound();
            }

            _context.Ogrenciler.Remove(ogrenci);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OgrenciExists(Guid id)
        {
            return (_context.Ogrenciler?.Any(e => e.OgrenciID == id)).GetValueOrDefault();
        }
    }
}
