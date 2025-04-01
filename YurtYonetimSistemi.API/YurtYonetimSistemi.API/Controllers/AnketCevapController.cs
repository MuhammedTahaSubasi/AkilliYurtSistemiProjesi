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
    public class AnketCevapController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnketCevapController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/AnketCevap
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnketCevap>>> GetAnketCevaplar()
        {
          if (_context.AnketCevaplar == null)
          {
              return NotFound();
          }
            return await _context.AnketCevaplar.ToListAsync();
        }

        // GET: api/AnketCevap/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AnketCevap>> GetAnketCevap(Guid id)
        {
          if (_context.AnketCevaplar == null)
          {
              return NotFound();
          }
            var anketCevap = await _context.AnketCevaplar.FindAsync(id);

            if (anketCevap == null)
            {
                return NotFound();
            }

            return anketCevap;
        }

        // PUT: api/AnketCevap/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnketCevap(Guid id, AnketCevap anketCevap)
        {
            if (id != anketCevap.CevapID)
            {
                return BadRequest();
            }

            _context.Entry(anketCevap).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnketCevapExists(id))
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

        // POST: api/AnketCevap
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AnketCevap>> PostAnketCevap(AnketCevap anketCevap)
        {
          if (_context.AnketCevaplar == null)
          {
              return Problem("Entity set 'AppDbContext.AnketCevaplar'  is null.");
          }
            // Öğrenci aynı ankete daha önce cevap vermiş mi kontrolü
            var alreadyExists = await _context.AnketCevaplar
      .AnyAsync(a => a.AnketID == anketCevap.AnketID && a.OgrenciID == anketCevap.OgrenciID);

            if (alreadyExists)
            {
                return BadRequest("Bu öğrenci bu ankete zaten katılmış.");
            }

            _context.AnketCevaplar.Add(anketCevap);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAnketCevap", new { id = anketCevap.CevapID }, anketCevap);
        }

        // DELETE: api/AnketCevap/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnketCevap(Guid id)
        {
            if (_context.AnketCevaplar == null)
            {
                return NotFound();
            }
            var anketCevap = await _context.AnketCevaplar.FindAsync(id);
            if (anketCevap == null)
            {
                return NotFound();
            }

            _context.AnketCevaplar.Remove(anketCevap);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AnketCevapExists(Guid id)
        {
            return (_context.AnketCevaplar?.Any(e => e.CevapID == id)).GetValueOrDefault();
        }
    }
}
