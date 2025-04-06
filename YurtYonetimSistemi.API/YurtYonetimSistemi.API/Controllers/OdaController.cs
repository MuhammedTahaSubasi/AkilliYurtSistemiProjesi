using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public class OdaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OdaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Oda
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Oda>>> GetOdalar()
        {
          if (_context.Odalar == null)
          {
              return NotFound();
          }
            return await _context.Odalar
                .Include(o => o.Kullanicilar)
                .ToListAsync();
        }

        // GET: api/Oda/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Oda>> GetOda(Guid id)
        {
          if (_context.Odalar == null)
          {
              return NotFound();
          }
            var oda = await _context.Odalar.FindAsync(id);

            if (oda == null)
            {
                return NotFound();
            }

            return oda;
        }

        // PUT: api/Oda/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOda(Guid id, Oda oda)
        {
            if (id != oda.OdaID)
            {
                return BadRequest();
            }

            _context.Entry(oda).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OdaExists(id))
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

        // POST: api/Oda
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Oda>> PostOda(Oda oda)
        {
          if (_context.Odalar == null)
          {
              return Problem("Entity set 'AppDbContext.Odalar'  is null.");
          }
            _context.Odalar.Add(oda);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOda", new { id = oda.OdaID }, oda);
        }

        // DELETE: api/Oda/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOda(Guid id)
        {
            if (_context.Odalar == null)
            {
                return NotFound();
            }
            var oda = await _context.Odalar.FindAsync(id);
            if (oda == null)
            {
                return NotFound();
            }

            _context.Odalar.Remove(oda);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OdaExists(Guid id)
        {
            return (_context.Odalar?.Any(e => e.OdaID == id)).GetValueOrDefault();
        }
    }
}
