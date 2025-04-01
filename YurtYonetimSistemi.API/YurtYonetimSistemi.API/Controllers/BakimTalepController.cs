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
    public class BakimTalepController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BakimTalepController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/BakimTalep
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BakimTalep>>> GetBakimTalepleri()
        {
          if (_context.BakimTalepleri == null)
          {
              return NotFound();
          }
            return await _context.BakimTalepleri.ToListAsync();
        }

        // GET: api/BakimTalep/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BakimTalep>> GetBakimTalep(Guid id)
        {
          if (_context.BakimTalepleri == null)
          {
              return NotFound();
          }
            var bakimTalep = await _context.BakimTalepleri.FindAsync(id);

            if (bakimTalep == null)
            {
                return NotFound();
            }

            return bakimTalep;
        }

        // PUT: api/BakimTalep/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBakimTalep(Guid id, BakimTalep bakimTalep)
        {
            if (id != bakimTalep.TalepID)
            {
                return BadRequest();
            }

            _context.Entry(bakimTalep).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BakimTalepExists(id))
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

        // POST: api/BakimTalep
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<BakimTalep>> PostBakimTalep(BakimTalep bakimTalep)
        {
          if (_context.BakimTalepleri == null)
          {
              return Problem("Entity set 'AppDbContext.BakimTalepleri'  is null.");
          }
            _context.BakimTalepleri.Add(bakimTalep);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBakimTalep", new { id = bakimTalep.TalepID }, bakimTalep);
        }

        // DELETE: api/BakimTalep/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBakimTalep(Guid id)
        {
            if (_context.BakimTalepleri == null)
            {
                return NotFound();
            }
            var bakimTalep = await _context.BakimTalepleri.FindAsync(id);
            if (bakimTalep == null)
            {
                return NotFound();
            }

            _context.BakimTalepleri.Remove(bakimTalep);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BakimTalepExists(Guid id)
        {
            return (_context.BakimTalepleri?.Any(e => e.TalepID == id)).GetValueOrDefault();
        }
    }
}
