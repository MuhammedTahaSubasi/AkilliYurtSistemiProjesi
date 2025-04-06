// Durum property’si NotMapped'dir. SQL'de görünmez.
// Swagger/JSON çıktısında kapasiteye göre hesaplanarak gösterilir.

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace YurtYonetimSistemi.API.Models
{
    public class Oda
    {
        [Key]
        public Guid OdaID { get; set; } = Guid.NewGuid();

        [Required]
        public string OdaNo { get; set; }

        public int KatNo { get; set; }

        public int Kapasite { get; set; }

        // İlişki: Hangi sınıfa ait?
        public Guid? SinifID { get; set; }

        [ForeignKey("SinifID")]
        public Sinif? Sinif { get; set; }

        // Oda’da kalan kullanıcılar
        public ICollection<Kullanici>? Kullanicilar { get; set; }

        //kapasite kontrol
        [NotMapped]
        public string Durum
        {
            get
            {
                if (Kullanicilar == null || Kapasite == 0)
                    return "Boş";

                return Kullanicilar.Count >= Kapasite ? "Dolu" : "Boş";

            }
        }



    }
}
