//listele 
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
  
// etkinlik ekleme 
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("etkinlikForm");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const ad = document.getElementById("etkinlikAd").value;
      const tarih = document.getElementById("etkinlikTarih").value;
      const kontenjan = parseInt(document.getElementById("kontenjan").value);
  
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
    const aktifMi = document.getElementById("guncelleAktifMi").checked;
  
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
  });  

  // etkinlik güncelleme modal 
  function etkinlikGuncelleModalAc(etkinlik) {
    // Modalı aç
    modalAc("etkinlikGuncelleModal");
  
    // Alanları doldur
    document.getElementById("guncelleEtkinlikAd").value = etkinlik.ad;
    document.getElementById("guncelleEtkinlikTarih").value = etkinlik.tarih.substring(0, 16); // "2025-04-25T10:00"
    document.getElementById("guncelleKontenjan").value = etkinlik.kontenjan;
    document.getElementById("guncelleAktifMi").checked = etkinlik.aktifMi;
  
    // Güncellenecek ID'yi form dataset'e koy
    document.getElementById("etkinlikGuncelleForm").dataset.etkinlikId = etkinlik.etkinlikID;
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

  