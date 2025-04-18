function listeleAnketler() {
  const filtre = document.getElementById("anketFiltre")?.value || "tum";
  const tbody = document.getElementById("anketListesi");
  tbody.innerHTML = "";

  fetch("https://localhost:7107/api/Anket", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Sunucudan geçerli yanıt alınamadı.");
      return res.json();
    })
    .then(data => {
      let filtrelenmis = data;

      // 🔍 Filtre uygula
      if (filtre === "aktif") {
        filtrelenmis = data.filter(a => a.aktifMi === true);
      } else if (filtre === "pasif") {
        filtrelenmis = data.filter(a => a.aktifMi === false);
      }

      if (filtrelenmis.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3">Gösterilecek anket bulunamadı.</td></tr>`;
        return;
      }

      // 🧾 Listele
      filtrelenmis.forEach(anket => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${anket.soru}</td>
          <td>${new Date(anket.olusturmaTarihi).toLocaleDateString()}</td>
          <td>
            <button class="delete-btn" onclick="anketSil('${anket.anketID}')">Sil</button>
            <button class="detail-btn" onclick="anketGuncelleModalAc('${anket.anketID}', '${anket.soru}', ${anket.aktifMi})">Düzenle</button>
            <button onclick="gosterCevaplar('${anket.anketID}')">Cevapları Gör</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Anketler yüklenemedi:", err);
      tbody.innerHTML = `<tr><td colspan="3">Anketler yüklenirken bir hata oluştu.</td></tr>`;
    });
}

  // anket ekle
  document.addEventListener("DOMContentLoaded", () => {
    listeleAnketler();
  
    const form = document.getElementById("anketForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const soru = document.getElementById("anketSoru").value;
  
      fetch("https://localhost:7107/api/Anket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ soru })
      })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => {
              throw new Error(`Hata: ${text}`);
            });
          }
          return res.json();
        })
        .then(data => {
          alert("Anket başarıyla oluşturuldu.");
          form.reset();
          listeleAnketler(); // listeyi güncelle
        })
        .catch(err => {
          console.error("Anket eklenemedi:", err);
          alert("Bir hata oluştu: " + err.message);
        });
    });
  });

  // anket sil 
  function anketSil(id) {
    if (!confirm("Bu anketi silmek istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/Anket/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Silme işlemi başarısız");
        }
        alert("Anket başarıyla silindi.");
        listeleAnketler(); // Listeyi güncelle
      })
      .catch(err => {
        console.error("Silme hatası:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }

  //  Anket güncelle
document.getElementById("anketGuncelleForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = e.target.dataset.anketId;
  const soru = document.getElementById("guncelleAnketSoru").value;
  const aktifMi = document.getElementById("guncelleAktifMi").checked;

  fetch(`https://localhost:7107/api/Anket/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ anketID: id, soru, aktifMi })
  })
    .then(res => {
      if (!res.ok) throw new Error("Güncelleme başarısız.");
      alert("Anket güncellendi.");
      modalKapat("anketGuncelleModal");
      listeleAnketler();
    })
    .catch(err => {
      console.error("Güncelleme hatası:", err);
      alert("Bir hata oluştu: " + err.message);
    });
});

//  Anket cevap
function gosterCevaplar(anketID) {
    fetch("https://localhost:7107/api/AnketCevap", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const tbody = document.getElementById("anketCevapListesi");
        tbody.innerHTML = "";
  
        const filtreli = data.filter(c => c.anketID === anketID);
  
        if (filtreli.length === 0) {
          tbody.innerHTML = `<tr><td colspan="3">Henüz cevap yok.</td></tr>`;
          return;
        }
  
        filtreli.forEach(c => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${c.kullanici?.ad || "-"} ${c.kullanici?.soyad || "-"}</td>
            <td>${c.anket?.soru || "-"}</td>
            <td>${c.puan}</td>
          `;
          tbody.appendChild(tr);
        });
  
        modalAc("anketCevapModal");
      })
      .catch(err => {
        console.error("Cevaplar yüklenemedi:", err);
        alert("Cevaplar getirilirken hata oluştu.");
      });
  }
  

  // Modal Aç
function modalAc(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "flex";
  }
  
  // Modal Kapat
  function modalKapat(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
  }
  
  // Modal kapatma butonları
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("closeGuncelleModal").onclick = () => modalKapat("anketGuncelleModal");
    document.getElementById("closeCevapModal").onclick = () => modalKapat("anketCevapModal");
  });
  
  //  Güncelleme modalı aç
  function anketGuncelleModalAc(id, soru, aktifMi) {
    modalAc("anketGuncelleModal");
    document.getElementById("guncelleAnketSoru").value = soru;
    document.getElementById("guncelleAktifMi").checked = aktifMi;
    document.getElementById("anketGuncelleForm").dataset.anketId = id;
  }
  
  
  