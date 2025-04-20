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
    public class CamasirhanePlaniController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CamasirhanePlaniController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/CamasirhanePlani
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CamasirhanePlani>>> GetCamasirhanePlani()
        {
          if (_context.CamasirhanePlani == null)
          {
              return NotFound();
          }
            return await _context.CamasirhanePlani
                .Include(p => p.Oda)
                .ToListAsync();
        }

        // GET: api/CamasirhanePlani/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CamasirhanePlani>> GetCamasirhanePlani(Guid id)
        {
          if (_context.CamasirhanePlani == null)
          {
              return NotFound();
          }
            var camasirhanePlani = await _context.CamasirhanePlani.FindAsync(id);

            if (camasirhanePlani == null)
            {
                return NotFound();
            }

            return camasirhanePlani;
        }

        // PUT: api/CamasirhanePlani/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCamasirhanePlani(Guid id, CamasirhanePlani camasirhanePlani)
        {
            if (id != camasirhanePlani.PlanID)
            {
                return BadRequest();
            }

            _context.Entry(camasirhanePlani).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CamasirhanePlaniExists(id))
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

        // POST: api/CamasirhanePlani
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CamasirhanePlani>> PostCamasirhanePlani(CamasirhanePlani camasirhanePlani)
        {
          if (_context.CamasirhanePlani == null)
          {
              return Problem("Entity set 'AppDbContext.CamasirhanePlani'  is null.");
          }
            _context.CamasirhanePlani.Add(camasirhanePlani);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCamasirhanePlani", new { id = camasirhanePlani.PlanID }, camasirhanePlani);
        }

        // DELETE: api/CamasirhanePlani/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCamasirhanePlani(Guid id)
        {
            if (_context.CamasirhanePlani == null)
            {
                return NotFound();
            }
            var camasirhanePlani = await _context.CamasirhanePlani.FindAsync(id);
            if (camasirhanePlani == null)
            {
                return NotFound();
            }

            _context.CamasirhanePlani.Remove(camasirhanePlani);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CamasirhanePlaniExists(Guid id)
        {
            return (_context.CamasirhanePlani?.Any(e => e.PlanID == id)).GetValueOrDefault();
        }
    }
}
