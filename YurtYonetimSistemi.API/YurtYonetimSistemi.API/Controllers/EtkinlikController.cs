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
    public class EtkinlikController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EtkinlikController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Etkinlik
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Etkinlik>>> GetEtkinlikler()
        {
          if (_context.Etkinlikler == null)
          {
              return NotFound();
          }
            return await _context.Etkinlikler.ToListAsync();
        }

        // GET: api/Etkinlik/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Etkinlik>> GetEtkinlik(Guid id)
        {
          if (_context.Etkinlikler == null)
          {
              return NotFound();
          }
            var etkinlik = await _context.Etkinlikler.FindAsync(id);

            if (etkinlik == null)
            {
                return NotFound();
            }

            return etkinlik;
        }

        // PUT: api/Etkinlik/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEtkinlik(Guid id, Etkinlik etkinlik)
        {
            if (id != etkinlik.EtkinlikID)
            {
                return BadRequest();
            }

            _context.Entry(etkinlik).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EtkinlikExists(id))
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

        // POST: api/Etkinlik
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Etkinlik>> PostEtkinlik(Etkinlik etkinlik)
        {
          if (_context.Etkinlikler == null)
          {
              return Problem("Entity set 'AppDbContext.Etkinlikler'  is null.");
          }
            _context.Etkinlikler.Add(etkinlik);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEtkinlik", new { id = etkinlik.EtkinlikID }, etkinlik);
        }

        // DELETE: api/Etkinlik/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEtkinlik(Guid id)
        {
            if (_context.Etkinlikler == null)
            {
                return NotFound();
            }
            var etkinlik = await _context.Etkinlikler.FindAsync(id);
            if (etkinlik == null)
            {
                return NotFound();
            }

            _context.Etkinlikler.Remove(etkinlik);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EtkinlikExists(Guid id)
        {
            return (_context.Etkinlikler?.Any(e => e.EtkinlikID == id)).GetValueOrDefault();
        }
    }
}
