//listeleme 
function listelePlanlar() {
    const tbody = document.getElementById("laundryListesi");
    tbody.innerHTML = "";
  
    fetch("https://localhost:7107/api/CamasirhanePlani", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5">Plan bulunamadı.</td></tr>`;
          return;
        }
        const gunSirasi = {
          "Pazartesi": 1,
          "Salı": 2,
          "Çarşamba": 3,
          "Perşembe": 4,
          "Cuma": 5,
          "Cumartesi": 6,
          "Pazar": 7
        };
        data.sort((a, b) => {
          const gunA = gunSirasi[a.gun] || 99;
          const gunB = gunSirasi[b.gun] || 99;
  
          const saatA = a.saatAraligi?.split("-")[0]?.trim() || "";
          const saatB = b.saatAraligi?.split("-")[0]?.trim() || "";
  
          return gunA - gunB || saatA.localeCompare(saatB);
        });
        data.forEach(plan => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${plan.oda?.odaNo || "-"}</td>
            <td>${plan.gun}</td>
            <td>${plan.saatAraligi || "-"}</td>
            <td>${plan.aciklama || "-"}</td>
            <td>
              <button class="detail-btn" onclick="planGuncelleModalAc('${plan.planID}', '${plan.odaID}', '${plan.gun}', '${plan.saatAraligi || ""}', \`${plan.aciklama || ""}\`)">Düzenle</button>
              <button class="delete-btn" onclick="planSil('${plan.planID}')">Sil</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Planlar yüklenemedi:", err);
        tbody.innerHTML = `<tr><td colspan="5">Veriler alınırken hata oluştu.</td></tr>`;
      });
  }  
  
  // ekle 
  function planEkle() {
    const odaID = document.getElementById("odaSelect").value;
    const gun = document.getElementById("gunSelect").value;
    const saatAraligi = document.getElementById("saatAraligiInput").value;
    const aciklama = document.getElementById("aciklamaInput").value;
  
    fetch("https://localhost:7107/api/CamasirhanePlani", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        odaID,
        gun,
        saatAraligi,
        aciklama
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Plan eklenemedi.");
        return res.json();
      })
      .then(() => {
        alert("Çamaşırhane planı eklendi.");
        document.getElementById("laundryForm").reset();
        modalKapat("laundryModal");
        listelePlanlar(); // tabloyu yenile
      })
      .catch(err => {
        console.error("Ekleme hatası:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }
  //sil
  function planSil(planID) {
    if (!confirm("Bu planı silmek istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/CamasirhanePlani/${planID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Silme işlemi başarısız.");
        alert("Plan başarıyla silindi.");
        listelePlanlar(); // listeyi güncelle
      })
      .catch(err => {
        console.error("Silme hatası:", err);
        alert("Silme işlemi sırasında bir hata oluştu: " + err.message);
      });
  }
  
  //güncelle
  function planGuncelle() {
    const planID = document.getElementById("updatePlanForm").dataset.planId;
    const odaID = document.getElementById("updateOda").value;
    const gun = document.getElementById("updateGun").value;
    const saatAraligi = document.getElementById("updateSaatAraligi").value;
    const aciklama = document.getElementById("updateAciklama").value;
  
    fetch(`https://localhost:7107/api/CamasirhanePlani/${planID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        planID,
        odaID,
        gun,
        saatAraligi,
        aciklama
      })
    })
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Güncelleme başarısız.");
        }
  
        if (res.status === 204) return null; // No content
        return res.json();
      })
      .then(() => {
        alert("Plan güncellendi.");
        modalKapat("laundryGuncelleModal");
        listelePlanlar();
      })
      .catch(err => {
        alert("Güncelleme hatası: " + err.message);
        console.error("HATA:", err);
      });
  }
  
  

  // güncelle modal aç
  function planGuncelleModalAc(planID, odaID, gun, saatAraligi, aciklama) {
    modalAc("laundryGuncelleModal");
  
    document.getElementById("updatePlanForm").dataset.planId = planID;
    document.getElementById("updateGun").value = gun;
    document.getElementById("updateSaatAraligi").value = saatAraligi;
    document.getElementById("updateAciklama").value = aciklama;
  
    // Oda dropdown'unu yükle ve seçili olarak işaretle
    fetch("https://localhost:7107/api/Oda", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById("updateOda");
        select.innerHTML = "";
        data.forEach(oda => {
          const option = document.createElement("option");
          option.value = oda.odaID;
          option.textContent = oda.odaNo;
          if (oda.odaID === odaID) {
            option.selected = true;
          }
          select.appendChild(option);
        });
      });
  }
  
  //modal aç kapa
  function modalAc(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
  }
  
  function modalKapat(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
  }
  
//odaları getir 
function loadOdalar() {
    const select = document.getElementById("odaSelect");
    select.innerHTML = "<option value='' disabled selected>Oda seç</option>";
  
    fetch("https://localhost:7107/api/Oda", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        data.forEach(oda => {
          const option = document.createElement("option");
          option.value = oda.odaID;
          option.textContent = oda.odaNo;
          select.appendChild(option);
        });
      })
      .catch(err => {
        console.error("Odalar yüklenemedi:", err);
        select.innerHTML = "<option value=''>Odalar getirilemedi</option>";
      });
  }
  
  //fonksiyonlar
  document.addEventListener("DOMContentLoaded", () => {
    listelePlanlar();
    loadOdalar(); // oda select'i için
  
    document.getElementById("laundryForm").addEventListener("submit", function (e) {
      e.preventDefault();
      planEkle();
    });
  
    document.getElementById("updatePlanForm").addEventListener("submit", function (e) {
      e.preventDefault();
      planGuncelle();
    });
  });
  
  
  
  