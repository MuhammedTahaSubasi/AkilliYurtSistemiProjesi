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
    public class AnketController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnketController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Anket
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Anket>>> GetAnketler()
        {
          if (_context.Anketler == null)
          {
              return NotFound();
          }
            return await _context.Anketler.ToListAsync();
        }

        // GET: api/Anket/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Anket>> GetAnket(Guid id)
        {
          if (_context.Anketler == null)
          {
              return NotFound();
          }
            var anket = await _context.Anketler.FindAsync(id);

            if (anket == null)
            {
                return NotFound();
            }

            return anket;
        }

        // PUT: api/Anket/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAnket(Guid id, Anket anket)
        {
            if (id != anket.AnketID)
            {
                return BadRequest();
            }

            _context.Entry(anket).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AnketExists(id))
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

        // POST: api/Anket
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Anket>> PostAnket(Anket anket)
        {
          if (_context.Anketler == null)
          {
              return Problem("Entity set 'AppDbContext.Anketler'  is null.");
          }
            _context.Anketler.Add(anket);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAnket", new { id = anket.AnketID }, anket);
        }

        // DELETE: api/Anket/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnket(Guid id)
        {
            if (_context.Anketler == null)
            {
                return NotFound();
            }
            var anket = await _context.Anketler.FindAsync(id);
            if (anket == null)
            {
                return NotFound();
            }

            _context.Anketler.Remove(anket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AnketExists(Guid id)
        {
            return (_context.Anketler?.Any(e => e.AnketID == id)).GetValueOrDefault();
        }
    }
}
