// Sayfa yüklenince şubeleri listele
document.addEventListener("DOMContentLoaded", () => {
    listeleSubeler();
  
    // Şubeleri listele
  function listeleSubeler() {
    const tbody = document.getElementById("subeListesi");
    tbody.innerHTML = "";
  
    fetch("https://localhost:7107/api/KutuphaneSubesi", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="3">Şube bulunamadı.</td></tr>`;
          return;
        }
  
        data.forEach(sube => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${sube.ad}</td>
            <td>${sube.kapasite}</td>
            <td>
              <button  class="detail-btn" onclick='acGuncelleModal(${JSON.stringify(sube)})'>Düzenle</button>
              <button  class="delete-btn" onclick='silSube("${sube.kutuphaneSubeID}")'>Sil</button>
              <button onclick='window.location.href="libraryPlan.html?subeId=${sube.kutuphaneSubeID}"'>Planları Gör</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Şubeler yüklenemedi:", err);
        tbody.innerHTML = `<tr><td colspan="3">Hata oluştu.</td></tr>`;
      });
  }

    // Yeni şube ekleme
    document.getElementById("subeForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const ad = document.getElementById("subeAd").value;
      const kapasite = parseInt(document.getElementById("subeKapasite").value);
  
      fetch("https://localhost:7107/api/KutuphaneSubesi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ ad, kapasite })
      })
        .then(res => {
          if (!res.ok) throw new Error("Şube eklenemedi");
          alert("Yeni şube başarıyla eklendi.");
          modalKapat("subeModal");
          document.getElementById("subeForm").reset();
          listeleSubeler();
        })
        .catch(err => {
          console.error("Hata:", err);
          alert("Hata oluştu: " + err.message);
        });
    });
  
// Şube güncelleme
document.getElementById("subeGuncelleForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const id = e.target.dataset.subeId;
  const ad = document.getElementById("guncelleAd").value;
  const kapasite = parseInt(document.getElementById("guncelleKapasite").value);

  try {
    // 1. Bu şubeye ait planları getir
    const planRes = await fetch("https://localhost:7107/api/KutuphanePlani", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    const tumPlanlar = await planRes.json();
    const subePlanlar = tumPlanlar.filter(p => p.kutuphaneSubeID === id);

    // 2. Her plan için katılımcı sayısını al
    let enYuksekKatilim = 0;
    for (const plan of subePlanlar) {
      const katilimRes = await fetch(`https://localhost:7107/api/KutuphaneKatilim/KutuphaneGore/${plan.kutuphanePlanID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const katilanlar = await katilimRes.json();
      if (katilanlar.length > enYuksekKatilim) {
        enYuksekKatilim = katilanlar.length;
      }
    }

    // 3. Kapasite sınır kontrolü
    if (kapasite < enYuksekKatilim) {
      alert(`Bu şubeye ait bazı seanslarda ${enYuksekKatilim} kişi katılmış. Kapasite bu sayıdan az olamaz!`);
      return;
    }

    // 4. Güncelleme işlemi
    const res = await fetch(`https://localhost:7107/api/KutuphaneSubesi/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ kutuphaneSubeID: id, ad, kapasite })
    });

    if (!res.ok) throw new Error("Şube güncellenemedi");

    alert("Şube başarıyla güncellendi.");
    modalKapat("subeGuncelleModal");
    listeleSubeler();

  } catch (err) {
    console.error("Güncelleme hatası:", err);
    alert("Hata oluştu: " + err.message);
  }
});
  });
  
  
  
  // Şube sil
  function silSube(id) {
    if (!confirm("Bu şubeyi silmek istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/KutuphaneSubesi/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (res.status === 204 || res.ok) {
          alert("Şube silindi.");
  
          const row = document.querySelector(`button[onclick*="${id}"]`)?.closest("tr");
          if (row) row.remove();
        } else {
          throw new Error("Silme başarısız");
        }
      })
      .catch(err => {
        console.error("Silme hatası:", err);
        alert("Şube silinirken hata oluştu");
      });
  }
  
  
  // Güncelle modalı aç
  function acGuncelleModal(sube) {
    modalAc("subeGuncelleModal");
    document.getElementById("guncelleAd").value = sube.ad;
    document.getElementById("guncelleKapasite").value = sube.kapasite;
    document.getElementById("subeGuncelleForm").dataset.subeId = sube.kutuphaneSubeID;
  }
  
  // Modal Aç/Kapat
  function modalAc(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
  }
  
  function modalKapat(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
  } 
  