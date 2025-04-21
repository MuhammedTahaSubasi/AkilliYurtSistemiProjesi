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
    public class KutuphanePlaniController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KutuphanePlaniController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/KutuphanePlani
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KutuphanePlani>>> GetKutuphanePlanlari()
        {
          if (_context.KutuphanePlanlari == null)
          {
              return NotFound();
          }
            return await _context.KutuphanePlanlari.ToListAsync();
        }

        // GET: api/KutuphanePlani/5
        [HttpGet("{id}")]
        public async Task<ActionResult<KutuphanePlani>> GetKutuphanePlani(Guid id)
        {
          if (_context.KutuphanePlanlari == null)
          {
              return NotFound();
          }
            var kutuphanePlani = await _context.KutuphanePlanlari.FindAsync(id);

            if (kutuphanePlani == null)
            {
                return NotFound();
            }

            return kutuphanePlani;
        }

        // PUT: api/KutuphanePlani/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKutuphanePlani(Guid id, KutuphanePlani kutuphanePlani)
        {
            if (id != kutuphanePlani.KutuphanePlanID)
            {
                return BadRequest();
            }

            _context.Entry(kutuphanePlani).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KutuphanePlaniExists(id))
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

        // POST: api/KutuphanePlani
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<KutuphanePlani>> PostKutuphanePlani(KutuphanePlani kutuphanePlani)
        {
          if (_context.KutuphanePlanlari == null)
          {
              return Problem("Entity set 'AppDbContext.KutuphanePlanlari'  is null.");
          }
            _context.KutuphanePlanlari.Add(kutuphanePlani);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetKutuphanePlani", new { id = kutuphanePlani.KutuphanePlanID }, kutuphanePlani);
        }

        // DELETE: api/KutuphanePlani/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKutuphanePlani(Guid id)
        {
            if (_context.KutuphanePlanlari == null)
            {
                return NotFound();
            }
            var kutuphanePlani = await _context.KutuphanePlanlari.FindAsync(id);
            if (kutuphanePlani == null)
            {
                return NotFound();
            }

            _context.KutuphanePlanlari.Remove(kutuphanePlani);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KutuphanePlaniExists(Guid id)
        {
            return (_context.KutuphanePlanlari?.Any(e => e.KutuphanePlanID == id)).GetValueOrDefault();
        }
    }
}
