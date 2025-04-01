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
    public class RolYetkiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolYetkiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/RolYetki
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolYetki>>> GetRolYetkiler()
        {
          if (_context.RolYetkiler == null)
          {
              return NotFound();
          }
            return await _context.RolYetkiler.ToListAsync();
        }

        // GET: api/RolYetki/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RolYetki>> GetRolYetki(Guid id)
        {
          if (_context.RolYetkiler == null)
          {
              return NotFound();
          }
            var rolYetki = await _context.RolYetkiler.FindAsync(id);

            if (rolYetki == null)
            {
                return NotFound();
            }

            return rolYetki;
        }

        // PUT: api/RolYetki/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRolYetki(Guid id, RolYetki rolYetki)
        {
            if (id != rolYetki.RolYetkiID)
            {
                return BadRequest();
            }

            _context.Entry(rolYetki).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RolYetkiExists(id))
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

        // POST: api/RolYetki
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RolYetki>> PostRolYetki(RolYetki rolYetki)
        {
          if (_context.RolYetkiler == null)
          {
              return Problem("Entity set 'AppDbContext.RolYetkiler'  is null.");
          }
            _context.RolYetkiler.Add(rolYetki);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRolYetki", new { id = rolYetki.RolYetkiID }, rolYetki);
        }

        // DELETE: api/RolYetki/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRolYetki(Guid id)
        {
            if (_context.RolYetkiler == null)
            {
                return NotFound();
            }
            var rolYetki = await _context.RolYetkiler.FindAsync(id);
            if (rolYetki == null)
            {
                return NotFound();
            }

            _context.RolYetkiler.Remove(rolYetki);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RolYetkiExists(Guid id)
        {
            return (_context.RolYetkiler?.Any(e => e.RolYetkiID == id)).GetValueOrDefault();
        }
    }
}
