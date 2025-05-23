﻿using System;
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
            return await _context.BakimTalepleri
                       .Include(t => t.Kullanici) 
                       .ToListAsync();
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
            var mevcutTalep = await _context.BakimTalepleri.FindAsync(id);
            if (mevcutTalep == null)
                return NotFound();

            // Güncellenecek alanları tek tek set et
            mevcutTalep.Baslik = bakimTalep.Baslik;
            mevcutTalep.Aciklama = bakimTalep.Aciklama;
            mevcutTalep.TalepDurumu = bakimTalep.TalepDurumu;

            await _context.SaveChangesAsync();
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
