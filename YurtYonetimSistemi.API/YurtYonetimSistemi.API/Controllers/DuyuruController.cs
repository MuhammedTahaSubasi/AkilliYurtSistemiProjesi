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
    public class DuyuruController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DuyuruController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Duyuru
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Duyuru>>> GetDuyurular()
        {
          if (_context.Duyurular == null)
          {
              return NotFound();
          }
            return await _context.Duyurular.ToListAsync();
        }

        // GET: api/Duyuru/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Duyuru>> GetDuyuru(Guid id)
        {
          if (_context.Duyurular == null)
          {
              return NotFound();
          }
            var duyuru = await _context.Duyurular.FindAsync(id);

            if (duyuru == null)
            {
                return NotFound();
            }

            return duyuru;
        }

        // PUT: api/Duyuru/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDuyuru(Guid id, Duyuru duyuru)
        {
            if (id != duyuru.DuyuruID)
            {
                return BadRequest();
            }

            _context.Entry(duyuru).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DuyuruExists(id))
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

        // POST: api/Duyuru
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Duyuru>> PostDuyuru(Duyuru duyuru)
        {
          if (_context.Duyurular == null)
          {
              return Problem("Entity set 'AppDbContext.Duyurular'  is null.");
          }
            duyuru.Tarih = DateTime.Now;
            _context.Duyurular.Add(duyuru);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDuyuru", new { id = duyuru.DuyuruID }, duyuru);
        }

        // DELETE: api/Duyuru/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDuyuru(Guid id)
        {
            if (_context.Duyurular == null)
            {
                return NotFound();
            }
            var duyuru = await _context.Duyurular.FindAsync(id);
            if (duyuru == null)
            {
                return NotFound();
            }

            _context.Duyurular.Remove(duyuru);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DuyuruExists(Guid id)
        {
            return (_context.Duyurular?.Any(e => e.DuyuruID == id)).GetValueOrDefault();
        }
    }
}
