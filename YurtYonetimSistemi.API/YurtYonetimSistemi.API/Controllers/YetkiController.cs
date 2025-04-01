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
    public class YetkiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public YetkiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Yetki
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Yetki>>> GetYetkiler()
        {
          if (_context.Yetkiler == null)
          {
              return NotFound();
          }
            return await _context.Yetkiler.ToListAsync();
        }

        // GET: api/Yetki/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Yetki>> GetYetki(Guid id)
        {
          if (_context.Yetkiler == null)
          {
              return NotFound();
          }
            var yetki = await _context.Yetkiler.FindAsync(id);

            if (yetki == null)
            {
                return NotFound();
            }

            return yetki;
        }

        // PUT: api/Yetki/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutYetki(Guid id, Yetki yetki)
        {
            if (id != yetki.YetkiID)
            {
                return BadRequest();
            }

            _context.Entry(yetki).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!YetkiExists(id))
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

        // POST: api/Yetki
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Yetki>> PostYetki(Yetki yetki)
        {
          if (_context.Yetkiler == null)
          {
              return Problem("Entity set 'AppDbContext.Yetkiler'  is null.");
          }
            _context.Yetkiler.Add(yetki);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetYetki", new { id = yetki.YetkiID }, yetki);
        }

        // DELETE: api/Yetki/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteYetki(Guid id)
        {
            if (_context.Yetkiler == null)
            {
                return NotFound();
            }
            var yetki = await _context.Yetkiler.FindAsync(id);
            if (yetki == null)
            {
                return NotFound();
            }

            _context.Yetkiler.Remove(yetki);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool YetkiExists(Guid id)
        {
            return (_context.Yetkiler?.Any(e => e.YetkiID == id)).GetValueOrDefault();
        }
    }
}
