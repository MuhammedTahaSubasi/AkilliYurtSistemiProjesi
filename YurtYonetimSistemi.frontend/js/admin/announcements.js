// Sayfa yüklenince duyuruları listele
window.addEventListener("DOMContentLoaded", () => {
  listeleDuyurular();

  // Form olayları
  document.getElementById("announcementForm").addEventListener("submit", duyuruEkle);
  document.getElementById("announcementGuncelleForm").addEventListener("submit", duyuruGuncelle);
  document.getElementById("closeEkleModal").onclick = () => modalKapat("duyuruEkleModal");
  document.getElementById("closeGuncelleModal").onclick = () => modalKapat("duyuruGuncelleModal");
});

// Duyuru Listele
function listeleDuyurular() {
  const filtre = document.getElementById("duyuruFiltre").value;
  const tbody = document.getElementById("announcementListesi");
  tbody.innerHTML = "";

  fetch("https://localhost:7107/api/Duyuru", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      let duyurular = data;

      // Filtre uygula
      if (filtre === "active") {
        duyurular = data.filter(d => d.aktifMi);
      } else if (filtre === "passive") {
        duyurular = data.filter(d => !d.aktifMi);
      }

      if (duyurular.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Gösterilecek duyuru bulunamadı.</td></tr>`;
        return;
      }

      // Satırları ekle
      duyurular.forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${d.baslik}</td>
          <td>${d.mesaj}</td>
          <td>${formatTarih(d.tarih)}</td>
          <td>
            <button class="delete-btn" onclick="duyuruSil('${d.duyuruID}')">Sil</button>
            <button class="detail-btn" onclick="guncelleModalAc('${d.duyuruID}', '${d.baslik}', \
            \`${d.mesaj}\`, ${d.aktifMi})">Düzenle</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Duyurular getirilemedi:", err);
      tbody.innerHTML = `<tr><td colspan="4">Hata oluştu.</td></tr>`;
    });
}
//tarihi düzenle
function formatTarih(tarihStr) {
  const tarih = new Date(tarihStr);
  const gun = tarih.getDate().toString().padStart(2, '0');
  const ay = (tarih.getMonth() + 1).toString().padStart(2, '0');
  const yil = tarih.getFullYear();
  const saat = tarih.getHours().toString().padStart(2, '0');
  const dakika = tarih.getMinutes().toString().padStart(2, '0');

  return `${gun}.${ay}.${yil} - ${saat}:${dakika}`;
}

// Duyuru Ekle
function duyuruEkle(e) {
  e.preventDefault();
  const baslik = document.getElementById("baslik").value;
  const mesaj = document.getElementById("mesaj").value;

  fetch("https://localhost:7107/api/Duyuru", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ baslik, mesaj, aktifMi: true })
  })
    .then(res => {
      if (!res.ok) throw new Error("Duyuru eklenemedi");
      alert("Duyuru başarıyla oluşturuldu");
      modalKapat("duyuruEkleModal");
      e.target.reset();
      listeleDuyurular();
    })
    .catch(err => alert(err.message));
}

// Duyuru Sil
function duyuruSil(id) {
  if (!confirm("Bu duyuruyu silmek istiyor musunuz?")) return;

  fetch(`https://localhost:7107/api/Duyuru/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Silme işlemi başarısız");
      listeleDuyurular();
    })
    .catch(err => alert(err.message));
}

// Modal Aç
function modalAc(id) {
  document.getElementById(id).style.display = "flex";
}

// Modal Kapat
function modalKapat(id) {
  document.getElementById(id).style.display = "none";
}

// Güncelleme Modalını Aç
function guncelleModalAc(id, baslik, mesaj, aktifMi) {
  modalAc("duyuruGuncelleModal");
  document.getElementById("guncelleBaslik").value = baslik;
  document.getElementById("guncelleMesaj").value = mesaj;
  document.getElementById("guncelleAktifMi").checked = aktifMi;
  document.getElementById("announcementGuncelleForm").dataset.duyuruId = id;
}

// Duyuru Güncelle
function duyuruGuncelle(e) {
  e.preventDefault();
  const id = e.target.dataset.duyuruId;
  const baslik = document.getElementById("guncelleBaslik").value;
  const mesaj = document.getElementById("guncelleMesaj").value;
  const aktifMi = document.getElementById("guncelleAktifMi").checked;

  fetch(`https://localhost:7107/api/Duyuru/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ duyuruID: id, baslik, mesaj, aktifMi })
  })
    .then(res => {
      if (!res.ok) throw new Error("Güncelleme başarısız");
      alert("Duyuru güncellendi");
      modalKapat("duyuruGuncelleModal");
      listeleDuyurular();
    })
    .catch(err => alert(err.message));
}
