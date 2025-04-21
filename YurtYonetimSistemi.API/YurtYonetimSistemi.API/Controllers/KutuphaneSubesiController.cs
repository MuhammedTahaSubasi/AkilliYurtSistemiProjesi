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
    public class KutuphaneSubesiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KutuphaneSubesiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/KutuphaneSubesi
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KutuphaneSubesi>>> GetKutuphaneSubeleri()
        {
          if (_context.KutuphaneSubeleri == null)
          {
              return NotFound();
          }
            return await _context.KutuphaneSubeleri.ToListAsync();
        }

        // GET: api/KutuphaneSubesi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<KutuphaneSubesi>> GetKutuphaneSubesi(Guid id)
        {
          if (_context.KutuphaneSubeleri == null)
          {
              return NotFound();
          }
            var kutuphaneSubesi = await _context.KutuphaneSubeleri.FindAsync(id);

            if (kutuphaneSubesi == null)
            {
                return NotFound();
            }

            return kutuphaneSubesi;
        }

        // PUT: api/KutuphaneSubesi/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutKutuphaneSubesi(Guid id, KutuphaneSubesi kutuphaneSubesi)
        {
            if (id != kutuphaneSubesi.KutuphaneSubeID)
            {
                return BadRequest();
            }

            _context.Entry(kutuphaneSubesi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KutuphaneSubesiExists(id))
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

        // POST: api/KutuphaneSubesi
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<KutuphaneSubesi>> PostKutuphaneSubesi(KutuphaneSubesi kutuphaneSubesi)
        {
          if (_context.KutuphaneSubeleri == null)
          {
              return Problem("Entity set 'AppDbContext.KutuphaneSubeleri'  is null.");
          }
            _context.KutuphaneSubeleri.Add(kutuphaneSubesi);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetKutuphaneSubesi", new { id = kutuphaneSubesi.KutuphaneSubeID }, kutuphaneSubesi);
        }

        // DELETE: api/KutuphaneSubesi/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKutuphaneSubesi(Guid id)
        {
            if (_context.KutuphaneSubeleri == null)
            {
                return NotFound();
            }
            var kutuphaneSubesi = await _context.KutuphaneSubeleri.FindAsync(id);
            if (kutuphaneSubesi == null)
            {
                return NotFound();
            }

            _context.KutuphaneSubeleri.Remove(kutuphaneSubesi);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool KutuphaneSubesiExists(Guid id)
        {
            return (_context.KutuphaneSubeleri?.Any(e => e.KutuphaneSubeID == id)).GetValueOrDefault();
        }
    }
}
