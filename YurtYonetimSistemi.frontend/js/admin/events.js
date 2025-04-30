// Etkinlikleri listele
function listeleEtkinlikler() {
  const filtre = document.getElementById("etkinlikFiltre")?.value || "tum";
  const tbody = document.getElementById("etkinlikListesi");
  tbody.innerHTML = "";

  fetch("https://localhost:7107/api/Etkinlik", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      // Güncel tarihi al
      const simdi = new Date();
      
      // Tarihi geçmiş etkinlikleri kontrol et ve güncelle
      data.forEach(etkinlik => {
        const etkinlikTarihi = new Date(etkinlik.tarih);
        
        // Etkinlik tarihi geçmişse ve hala aktifse
        if (etkinlikTarihi < simdi && etkinlik.aktifMi) {
          // Etkinliği pasif hale getir
          etkinligiPasifYap(etkinlik.etkinlikID, etkinlik);
          // Yerel veri kümesinde de güncelle
          etkinlik.aktifMi = false;
        }
      });

      let filtreli = data;

      if (filtre === "aktif") {
        filtreli = data.filter(e => e.aktifMi === true);
      } else if (filtre === "pasif") {
        filtreli = data.filter(e => e.aktifMi === false);
      }

      if (filtreli.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Filtreye uygun etkinlik bulunamadı.</td></tr>`;
        return;
      }

      filtreli.forEach(etkinlik => {
        const tarih = new Date(etkinlik.tarih).toLocaleString();
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${etkinlik.ad}</td>
          <td>${tarih}</td>
          <td>${etkinlik.kontenjan}</td>
          <td>
            <button class="detail-btn" onclick='etkinlikGuncelleModalAc(${JSON.stringify(etkinlik)})'>Düzenle</button>
            <button class="delete-btn" onclick="etkinlikSil('${etkinlik.etkinlikID}')">Sil</button>
            <button onclick="gosterKatilim('${etkinlik.etkinlikID}')">Katılanları Gör</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Etkinlikler yüklenemedi:", err);
      tbody.innerHTML = `<tr><td colspan="4">Hata oluştu.</td></tr>`;
    });
}

// Etkinliği otomatik olarak pasif yapmak için API çağrısı
function etkinligiPasifYap(id, etkinlik) {
  // Etkinlik verilerini kopyala ve aktifMi değerini false yap
  const guncelEtkinlik = {
    etkinlikID: id,
    ad: etkinlik.ad,
    tarih: etkinlik.tarih,
    kontenjan: etkinlik.kontenjan,
    aktifMi: false
  };

  // API'ye güncelleme isteği gönder
  fetch(`https://localhost:7107/api/Etkinlik/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(guncelEtkinlik)
  })
    .then(res => {
      if (!res.ok) throw new Error("Etkinlik otomatik pasif yapılamadı.");
      console.log(`Etkinlik '${etkinlik.ad}' tarihi geçtiği için otomatik pasif yapıldı`);
    })
    .catch(err => {
      console.error("Otomatik pasif yapma hatası:", err);
    });
}

// etkinlik ekleme 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("etkinlikForm");
  
  // Etkinlik eklerken geçmiş tarih seçilmesini engellemek için min değeri ayarla
  const bugun = new Date();
  const yil = bugun.getFullYear();
  const ay = String(bugun.getMonth() + 1).padStart(2, '0');
  const gun = String(bugun.getDate()).padStart(2, '0');
  const saat = String(bugun.getHours()).padStart(2, '0');
  const dakika = String(bugun.getMinutes()).padStart(2, '0');
  
  const minDatetime = `${yil}-${ay}-${gun}T${saat}:${dakika}`;
  
  // Minimum tarihi ayarla
  document.getElementById("etkinlikTarih").min = minDatetime;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const ad = document.getElementById("etkinlikAd").value;
    const tarih = document.getElementById("etkinlikTarih").value;
    const kontenjan = parseInt(document.getElementById("kontenjan").value);
    
    // Tarih kontrolü - geçmiş tarih kontrolü
    const etkinlikTarihi = new Date(tarih);
    const simdi = new Date();
    
    if (etkinlikTarihi < simdi) {
      alert("Geçmiş bir tarih için etkinlik eklenemez. Lütfen ileri bir tarih seçin.");
      return; // İşlemi durdur
    }

    fetch("https://localhost:7107/api/Etkinlik", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ ad, tarih, kontenjan })
    })
      .then(res => {
        if (!res.ok) throw new Error("Etkinlik eklenemedi.");
        return res.json();
      })
      .then(() => {
        alert("Etkinlik başarıyla eklendi!");
        form.reset();
        listeleEtkinlikler(); // tabloyu güncelle
      })
      .catch(err => {
        console.error("Hata:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  });

  listeleEtkinlikler(); // sayfa açılınca etkinlikleri listele
  
  // Her 5 dakikada bir etkinlikleri kontrol et
  setInterval(listeleEtkinlikler, 5 * 60 * 1000);
});

// ETKİNLİK SİL 
function etkinlikSil(id) {
  if (!confirm("Bu etkinliği silmek istediğinize emin misiniz?")) return;

  fetch(`https://localhost:7107/api/Etkinlik/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Etkinlik silinemedi.");
      alert("Etkinlik silindi.");
      listeleEtkinlikler();
    })
    .catch(err => {
      console.error("Silme hatası:", err);
      alert("Silme sırasında bir hata oluştu.");
    });
}

// katılımcıları göster
function gosterKatilim(etkinlikID) {
  const tbody = document.getElementById("katilimListesi");
  tbody.innerHTML = "";

  fetch(`https://localhost:7107/api/EtkinlikKatilim/EtkinligeGore/${etkinlikID}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        tbody.innerHTML = `<tr><td>Henüz katılım yok.</td></tr>`;
        return;
      }

      data.forEach(k => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${k.kullanici?.ad || "-"} ${k.kullanici?.soyad || "-"}</td>`;
        tbody.appendChild(tr);
      });

      modalAc("katilimModal");
    })
    .catch(err => {
      console.error("Katılım bilgileri alınamadı:", err);
      alert("Katılımcılar yüklenemedi.");
    });
}

//güncelleme 
document.getElementById("etkinlikGuncelleForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = e.target.dataset.etkinlikId;
  const ad = document.getElementById("guncelleEtkinlikAd").value;
  const tarih = document.getElementById("guncelleEtkinlikTarih").value;
  const kontenjan = parseInt(document.getElementById("guncelleKontenjan").value);
  let aktifMi = document.getElementById("guncelleAktifMi").checked;
  
  // Tarih kontrolü - eğer tarih geçmişse otomatik pasif yap
  const etkinlikTarihi = new Date(tarih);
  const simdi = new Date();
  
  if (etkinlikTarihi < simdi) {
    // Tarihi geçmiş etkinlik otomatik pasif yapılır
    aktifMi = false;
    
    // Checkbox'ı da güncelle
    document.getElementById("guncelleAktifMi").checked = false;
    
    // Kullanıcıya bilgi ver
    alert("Seçtiğiniz tarih geçmiş olduğu için etkinlik otomatik olarak pasif yapılacaktır.");
  }

  // Kontenjan kontrolü için önce mevcut katılımcı sayısını kontrol edelim
  fetch(`https://localhost:7107/api/EtkinlikKatilim/EtkinligeGore/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(katilimcilar => {
      const katilimciSayisi = katilimcilar.length;
      
      // Eğer yeni kontenjan, mevcut katılımcı sayısından düşükse
      if (kontenjan < katilimciSayisi) {
        alert(`Bu etkinlikte şu anda ${katilimciSayisi} kişi kayıtlı. Kontenjanı kayıtlı kişi sayısından daha düşük yapamazsınız.`);
        // Kontenjanı eski haline geri al (mevcut katılımcı sayısına eşitle veya daha yüksek yap)
        document.getElementById("guncelleKontenjan").value = katilimciSayisi;
        return; // Güncelleme işlemini durdur
      }
      
      // Kontroller geçildi, güncelleme işlemine devam et
      fetch(`https://localhost:7107/api/Etkinlik/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ etkinlikID: id, ad, tarih, kontenjan, aktifMi })
      })
        .then(res => {
          if (!res.ok) throw new Error("Güncelleme başarısız.");
          alert("Etkinlik güncellendi.");
          modalKapat("etkinlikGuncelleModal");
          listeleEtkinlikler();
        })
        .catch(err => {
          console.error("Güncelleme hatası:", err);
          alert("Hata: " + err.message);
        });
    })
    .catch(err => {
      console.error("Katılımcı bilgileri alınamadı:", err);
      alert("Katılımcı bilgileri kontrol edilemedi. Lütfen tekrar deneyin.");
    });
});  

function etkinlikGuncelleModalAc(etkinlik) {
  // Modalı aç
  modalAc("etkinlikGuncelleModal");

  // Etkinlik güncellemeden önce tarihi kontrol et
  const etkinlikTarihi = new Date(etkinlik.tarih);
  const simdi = new Date();
  
  // Modalda tarihi geçmiş etkinliğin aktiflik durumunu otomatik kapat
  if (etkinlikTarihi < simdi && etkinlik.aktifMi) {
    etkinlik.aktifMi = false;
    alert("Bu etkinliğin tarihi geçmiş olduğu için pasif duruma getirildi.");
    
    // Ayrıca backend'de de güncelleyelim
    etkinligiPasifYap(etkinlik.etkinlikID, etkinlik);
  }

  // Alanları doldur
  document.getElementById("guncelleEtkinlikAd").value = etkinlik.ad;
  document.getElementById("guncelleEtkinlikTarih").value = etkinlik.tarih.substring(0, 16); // "2025-04-25T10:00"
  document.getElementById("guncelleKontenjan").value = etkinlik.kontenjan;
  document.getElementById("guncelleAktifMi").checked = etkinlik.aktifMi;

  // Güncellenecek ID'yi form dataset'e koy
  document.getElementById("etkinlikGuncelleForm").dataset.etkinlikId = etkinlik.etkinlikID;
  
  // Etkinliğin mevcut katılımcı sayısını kontrol et ve minimum kontenjan değerini ayarla
  fetch(`https://localhost:7107/api/EtkinlikKatilim/EtkinligeGore/${etkinlik.etkinlikID}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(katilimcilar => {
      const katilimciSayisi = katilimcilar.length;
      
      // Eğer katılımcı varsa, minimum kontenjan değerini ayarla
      if (katilimciSayisi > 0) {
        document.getElementById("guncelleKontenjan").min = katilimciSayisi;
        
        // Ayrıca kontenjan alanı için bilgi ipucu ekleyebiliriz
        document.getElementById("guncelleKontenjan").title = 
          `Minimum ${katilimciSayisi} olabilir (mevcut katılımcı sayısı)`;
      }
    })
    .catch(err => {
      console.error("Katılımcı bilgileri alınamadı:", err);
    });
}

//Modal AÇ / KAPAT 
function modalAc(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "flex";
}

function modalKapat(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// Modal kapatma butonu
document.getElementById("closeGuncelleModal").onclick = () => modalKapat("etkinlikGuncelleModal");
document.getElementById("closeKatilimModal").onclick = () => modalKapat("katilimModal");