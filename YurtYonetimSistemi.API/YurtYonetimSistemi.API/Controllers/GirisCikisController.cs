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
    public class GirisCikisController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GirisCikisController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/GirisCikis
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetGirisCikislar([FromQuery] DateTime? date, [FromQuery] string? search)
        {
            if (_context.GirisCikislar == null)
            {
                return NotFound();
            }

            var query = _context.GirisCikislar
                .Include(gc => gc.Kullanici)
                .AsQueryable();

            if (date != null)
            {
                var selectedDate = date.Value.Date;
                query = query.Where(gc => gc.ZamanDamgasi.Date == selectedDate);
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(gc =>
                    gc.Kullanici.Ad.Contains(search) ||
                    gc.Kullanici.Soyad.Contains(search) ||
                    gc.Kullanici.TcNo.Contains(search)
                );
            }

            var result = await query
                .OrderByDescending(gc => gc.ZamanDamgasi)
                .Select(gc => new
                {
                    AdSoyad = gc.Kullanici.Ad + " " + gc.Kullanici.Soyad,
                    TcNo = gc.Kullanici.TcNo,
                    Zaman = gc.ZamanDamgasi.ToString("yyyy-MM-dd HH:mm"),
                    GirisMi = gc.GirisMi
                })
                .ToListAsync();

            return Ok(result);
        }


        // GET: api/GirisCikis/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GirisCikis>> GetGirisCikis(Guid id)
        {
            if (_context.GirisCikislar == null)
            {
                return NotFound();
            }
            var girisCikis = await _context.GirisCikislar
                .Include(gc => gc.Kullanici) // kullanıcı bilgisiyle birlikte getir
                .FirstOrDefaultAsync(gc => gc.GirisCikisID == id);

            if (girisCikis == null)
            {
                return NotFound();
            }

            return girisCikis;
        }

        // POST: api/GirisCikis/kaydet
        [AllowAnonymous]
        [HttpPost("kaydet")]
        public async Task<IActionResult> KaydetFromUID([FromBody] UIDDto data)
        {
            if (string.IsNullOrEmpty(data.Uid))
                return BadRequest("UID boş olamaz.");

            var kullanici = await _context.Kullanicilar
                .FirstOrDefaultAsync(k => k.KartUID == data.Uid);

            if (kullanici == null)
                return NotFound("Kullanıcı bulunamadı.");

            var sonKayit = await _context.GirisCikislar
                .Where(g => g.KullaniciID == kullanici.KullaniciID)
                .OrderByDescending(g => g.ZamanDamgasi)
                .FirstOrDefaultAsync();

            var yeniKayit = new GirisCikis
            {
                KullaniciID = kullanici.KullaniciID,
                GirisMi = (sonKayit == null || !sonKayit.GirisMi),
                ZamanDamgasi = DateTime.Now
            };

            _context.GirisCikislar.Add(yeniKayit);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Mesaj = yeniKayit.GirisMi ? "Giriş kaydedildi" : "Çıkış kaydedildi",
                Tarih = yeniKayit.ZamanDamgasi,
                Kullanici = $"{kullanici.Ad} {kullanici.Soyad}"
            });
        }

        // DELETE: api/GirisCikis/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGirisCikis(Guid id)
        {
            if (_context.GirisCikislar == null)
            {
                return NotFound();
            }
            var girisCikis = await _context.GirisCikislar.FindAsync(id);
            if (girisCikis == null)
            {
                return NotFound();
            }

            _context.GirisCikislar.Remove(girisCikis);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GirisCikisExists(Guid id)
        {
            return (_context.GirisCikislar?.Any(e => e.GirisCikisID == id)).GetValueOrDefault();
        }
        //GET api/girisCikis/durum
        [AllowAnonymous]
        [HttpGet("durum")]
        public async Task<IActionResult> GetSonDurumlar()
        {
            var sonDurumlar = await _context.Kullanicilar
                .Where(k => k.Rol!.RolAd == "Öğrenci")
                .Select(kullanici => new
                {
                    AdSoyad = kullanici.Ad + " " + kullanici.Soyad,
                    Oda = kullanici.Oda != null ? kullanici.Oda.OdaNo : "-",
                    GirisMi = kullanici.KartUID != null
                        ? _context.GirisCikislar
                            .Where(gc => gc.KullaniciID == kullanici.KullaniciID)
                            .OrderByDescending(gc => gc.ZamanDamgasi)
                            .Select(gc => gc.GirisMi)
                            .FirstOrDefault()
                        : false // kart yoksa dışarıda say
                })
                .ToListAsync();

            return Ok(sonDurumlar);
        }

    }
}
