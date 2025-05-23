﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YurtYonetimSistemi.API.Models
{
    public class GirisCikis
    {
        [Key]
        public Guid GirisCikisID { get; set; } = Guid.NewGuid();

        public bool GirisMi { get; set; }  // true = giriş, false = çıkış

        public DateTime ZamanDamgasi { get; set; } = DateTime.Now;

        // İlişki
        public Guid KullaniciID { get; set; }

        [ForeignKey("KullaniciID")]
        public Kullanici? Kullanici { get; set; }
    }
}
