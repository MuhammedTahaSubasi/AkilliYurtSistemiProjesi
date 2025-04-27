using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YurtYonetimSistemi.API.Models;

namespace YurtYonetimSistemi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BasvuruController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BasvuruController(AppDbContext context)
        {
            _context = context;
        }
        private string TemizleDosyaAdi(string dosyaAdi)
        {
            return dosyaAdi
                .Replace("ı", "i")
                .Replace("ş", "s")
                .Replace("ü", "u")
                .Replace("ö", "o")
                .Replace("ç", "c")
                .Replace("ğ", "g")
                .Replace("İ", "I")
                .Replace("Ş", "S")
                .Replace("Ü", "U")
                .Replace("Ö", "O")
                .Replace("Ç", "C")
                .Replace("Ğ", "G")
                .Replace(" ", "_"); // Boşlukları da _ yapıyoruz
        }

        //POST
        [HttpPost]
        public async Task<IActionResult> BasvuruEkle([FromForm] BasvuruDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            //  1. Dosya yolları için upload klasörü
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            //  2. Öğrenci Belgesi Yükleme
            string ogrenciBelgesiPath = null;
            if (dto.OgrenciBelgesi != null)
            {
                var ogrenciBelgesiFileName = TemizleDosyaAdi($"{dto.Ad}_{dto.Soyad}_{dto.TcNo}_OgrenciBelgesi{Path.GetExtension(dto.OgrenciBelgesi.FileName)}");
                var ogrenciBelgesiFullPath = Path.Combine(uploadsFolder, ogrenciBelgesiFileName);
                using (var stream = new FileStream(ogrenciBelgesiFullPath, FileMode.Create))
                {
                    await dto.OgrenciBelgesi.CopyToAsync(stream);
                }
                ogrenciBelgesiPath = $"uploads/{ogrenciBelgesiFileName}";
            }

            //  3. Adli Sicil Belgesi Yükleme
            string adliSicilBelgesiPath = null;
            if (dto.AdliSicilBelgesi != null)
            {
                var adliSicilBelgesiFileName = TemizleDosyaAdi($"{dto.Ad}_{dto.Soyad}_{dto.TcNo}_AdliSicilBelgesi{Path.GetExtension(dto.AdliSicilBelgesi.FileName)}");
                var adliSicilBelgesiFullPath = Path.Combine(uploadsFolder, adliSicilBelgesiFileName);
                using (var stream = new FileStream(adliSicilBelgesiFullPath, FileMode.Create))
                {
                    await dto.AdliSicilBelgesi.CopyToAsync(stream);
                }
                adliSicilBelgesiPath = $"uploads/{adliSicilBelgesiFileName}";
            }

            //  4. Başvuru Kodu Üretimi
            var random = new Random();
            var basvuruKodu = $"BASV-{random.Next(100000, 999999)}";

            //  5. Başvuru Nesnesi Oluşturma
            var basvuru = new Basvuru
            {
                BasvuruID = Guid.NewGuid(),
                BasvuruKodu = basvuruKodu,
                Ad = dto.Ad,
                Soyad = dto.Soyad,
                TcNo = dto.TcNo,
                Telefon = dto.Telefon,
                Email = dto.Email,
                DogumTarihi = dto.DogumTarihi,
                Okul = dto.Okul,
                Bolum = dto.Bolum,
                Sinif = dto.Sinif,
                OgrenciBelgesiPath = ogrenciBelgesiPath,
                AdliSicilBelgesiPath = adliSicilBelgesiPath,
                BasvuruTarihi = DateTime.Now,
                Durum = "Bekliyor"
            };

            //  6. Veritabanına Kaydetme
            _context.Basvurular.Add(basvuru);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Başvuru başarıyla oluşturuldu.",
                basvuruKodu = basvuru.BasvuruKodu
            });
        }
        //GET
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Basvuru>>> GetBasvurular()
        {
            var basvurular = await _context.Basvurular
                .OrderByDescending(b => b.BasvuruTarihi)
                .ToListAsync();

            return Ok(basvurular);
        }
        // PUT
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> BasvuruDurumGuncelle(Guid id, [FromBody] BasvuruDurumGuncelleDto dto)
        {
            var basvuru = await _context.Basvurular.FindAsync(id);

            if (basvuru == null)
                return NotFound("Başvuru bulunamadı.");

            // Sadece Durum alanını güncelliyoruz
            basvuru.Durum = dto.Durum;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest($"Başvuru güncelleme sırasında hata oluştu: {ex.Message}");
            }

            return Ok(new { message = "Başvuru durumu güncellendi.", yeniDurum = basvuru.Durum });
        }

        //DELETE
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBasvuru(Guid id)
        {
            var basvuru = await _context.Basvurular.FindAsync(id);

            if (basvuru == null)
                return NotFound("Başvuru bulunamadı.");

            // Dosyaları Silme
            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

            if (!string.IsNullOrEmpty(basvuru.OgrenciBelgesiPath))
            {
                var ogrenciDosyaYolu = Path.Combine(uploadsRoot, basvuru.OgrenciBelgesiPath.Replace("/", "\\"));
                if (System.IO.File.Exists(ogrenciDosyaYolu))
                {
                    System.IO.File.Delete(ogrenciDosyaYolu);
                }
            }

            if (!string.IsNullOrEmpty(basvuru.AdliSicilBelgesiPath))
            {
                var sicilDosyaYolu = Path.Combine(uploadsRoot, basvuru.AdliSicilBelgesiPath.Replace("/", "\\"));
                if (System.IO.File.Exists(sicilDosyaYolu))
                {
                    System.IO.File.Delete(sicilDosyaYolu);
                }
            }

            // Veritabanı Kaydını Silme
            _context.Basvurular.Remove(basvuru);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest($"Başvuru silinirken hata oluştu: {ex.Message}");
            }

            return Ok(new { message = "Başvuru ve ilgili dosyalar başarıyla silindi." });
        }

        //GET SORGULAMA TAKİP
        [HttpGet("sorgula/{basvuruKodu}")]
        public async Task<IActionResult> BasvuruDurumSorgula(string basvuruKodu)
        {
            var basvuru = await _context.Basvurular
                .FirstOrDefaultAsync(b => b.BasvuruKodu == basvuruKodu);

            if (basvuru == null)
                return NotFound("Başvuru bulunamadı. Lütfen Başvuru Kodunuzu kontrol edin.");

            return Ok(new
            {
                ad = basvuru.Ad,
                soyad = basvuru.Soyad,
                email = basvuru.Email,
                durum = basvuru.Durum,
                basvuruTarihi = basvuru.BasvuruTarihi.ToString("yyyy-MM-dd HH:mm")
            });
        }


    }
}
