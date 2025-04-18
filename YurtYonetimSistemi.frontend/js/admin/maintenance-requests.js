// Sayfa yüklenince otomatik listele
window.addEventListener("DOMContentLoaded", () => {
    listeleBakimTalepleri();
  });
  
  // Listeleme
  function listeleBakimTalepleri() {
    const filtre = document.getElementById("talepFiltre")?.value || "all";
    const tbody = document.getElementById("talepListesi");
    tbody.innerHTML = "";
  
    fetch("https://localhost:7107/api/BakimTalep", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Veri alınamadı.");
        return res.json();
      })
      .then(data => {
        let filtreli = data;
  
        if (filtre === "active") {
          filtreli = data.filter(t => t.talepDurumu === false);
        } else if (filtre === "completed") {
          filtreli = data.filter(t => t.talepDurumu === true);
        }
  
        if (filtreli.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5">Gösterilecek talep yok.</td></tr>`;
          return;
        }
  
        filtreli.forEach(talep => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${talep.kullanici?.ad || "-"} ${talep.kullanici?.soyad || ""}</td>
            <td>${talep.baslik}</td>
            <td>${talep.aciklama || "-"}</td>
            <td>${new Date(talep.talepTarihi).toLocaleDateString()}</td>
            <td>${talep.talepDurumu ? "Tamamlandı" : "Beklemede"}</td>
            <td>
              <button class="add-btn" onclick="durumDegistir('${talep.talepID}')">
                ${talep.talepDurumu ? "Aktif Yap" : "Tamamla"}
              </button>
              <button class="delete-btn" onclick="bakimTalepSil('${talep.talepID}')">Sil</button>
            </td>
          `;
          tr.dataset.baslik = talep.baslik;
          tr.dataset.aciklama = talep.aciklama;
          tr.dataset.talepid = talep.talepID;
          tr.dataset.talepdurumu = talep.talepDurumu;
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Bakım talepleri alınamadı:", err);
        tbody.innerHTML = `<tr><td colspan="5">Hata oluştu.</td></tr>`;
      });
  }

  // ekleme
document.getElementById("bakimForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const baslik = document.getElementById("bakimBaslik").value;
    const aciklama = document.getElementById("bakimAciklama").value;
    const kullaniciID = localStorage.getItem("kullaniciId"); 
  
    fetch("https://localhost:7107/api/BakimTalep", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ baslik, aciklama, kullaniciID })
    })
      .then(res => {
        if (!res.ok) throw new Error("Talep oluşturulamadı.");
        alert("Bakım talebi oluşturuldu.");
        modalKapat("bakimEkleModal");
        document.getElementById("bakimForm").reset();
        listeleBakimTalepleri();
      })
      .catch(err => {
        console.error("Talep ekleme hatası:", err);
        alert("Hata: " + err.message);
      });
  });
  
  // Durum güncelle 
  function durumDegistir(talepID) {
    const satir = document.querySelector(`[data-talepid='${talepID}']`);
    const mevcutDurum = satir.dataset.talepdurumu === "true";
    const yeniDurum = !mevcutDurum;
    const baslik = satir.dataset.baslik;
    const aciklama = satir.dataset.aciklama;
  
    fetch(`https://localhost:7107/api/BakimTalep/${talepID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        baslik,
        aciklama,
        talepDurumu: yeniDurum
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Güncelleme başarısız.");
        alert("Durum güncellendi.");
        listeleBakimTalepleri();
      })
      .catch(err => {
        console.error("Durum değiştirme hatası:", err);
        alert("Hata: " + err.message);
      });
  }
  
  // Silme
  function bakimTalepSil(talepID) {
    if (!confirm("Bu talebi silmek istiyor musunuz?")) return;
  
    fetch(`https://localhost:7107/api/BakimTalep/${talepID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Silinemedi.");
        alert("Talep silindi.");
        listeleBakimTalepleri();
      })
      .catch(err => {
        console.error("Silme hatası:", err);
        alert("Hata: " + err.message);
      });
  }

  // Modal aç/kapat
function modalAc(id) {
    document.getElementById(id).style.display = "flex";
  }
  function modalKapat(id) {
    document.getElementById(id).style.display = "none";
  }
  
  // Modal kapama X
  document.getElementById("closeEkleModal").onclick = () => modalKapat("bakimEkleModal");
  
  