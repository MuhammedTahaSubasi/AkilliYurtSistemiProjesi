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
    public class SinifController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SinifController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Sinif
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sinif>>> GetSiniflar()
        {
          if (_context.Siniflar == null)
          {
              return NotFound();
          }
            return await _context.Siniflar.ToListAsync();
        }

        // GET: api/Sinif/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sinif>> GetSinif(Guid id)
        {
          if (_context.Siniflar == null)
          {
              return NotFound();
          }
            var sinif = await _context.Siniflar.FindAsync(id);

            if (sinif == null)
            {
                return NotFound();
            }

            return sinif;
        }

        // PUT: api/Sinif/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSinif(Guid id, Sinif sinif)
        {
            if (id != sinif.SinifID)
            {
                return BadRequest();
            }

            _context.Entry(sinif).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SinifExists(id))
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

        // POST: api/Sinif
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Sinif>> PostSinif(Sinif sinif)
        {
          if (_context.Siniflar == null)
          {
              return Problem("Entity set 'AppDbContext.Siniflar'  is null.");
          }
            _context.Siniflar.Add(sinif);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSinif", new { id = sinif.SinifID }, sinif);
        }

        // DELETE: api/Sinif/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSinif(Guid id)
        {
            if (_context.Siniflar == null)
            {
                return NotFound();
            }
            var sinif = await _context.Siniflar.FindAsync(id);
            if (sinif == null)
            {
                return NotFound();
            }

            _context.Siniflar.Remove(sinif);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SinifExists(Guid id)
        {
            return (_context.Siniflar?.Any(e => e.SinifID == id)).GetValueOrDefault();
        }
    }
}
