// listele
  function listeleSiniflar() {
    const tbody = document.getElementById("sinifListesi");
    tbody.innerHTML = "";
  
    fetch("https://localhost:7107/api/Sinif", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="2">Kayıtlı sınıf bulunamadı.</td></tr>`;
          return;
        }
  
        data.forEach(sinif => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
          <td>${sinif.sinifAd}</td>
          <td>${sinif.katNo}</td>
          <td>${sinif.kapasite}</td>
          <td>
              <button class="detail-btn" onclick="sinifGuncelleModalAc('${sinif.sinifID}', '${sinif.sinifAd}', ${sinif.katNo}, ${sinif.kapasite})">Düzenle</button>
              <button class="delete-btn" onclick="sinifSil('${sinif.sinifID}')">Sil</button>
         </td>
         `;

          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Sınıf listesi alınamadı:", err);
        tbody.innerHTML = `<tr><td colspan="2">Hata oluştu.</td></tr>`;
      });
  }
  // sınıf ekle 
  function sinifEkle() {
    const ad = document.getElementById("sinifAd").value;
    const katNo = parseInt(document.getElementById("katNo").value);
    const kapasite = parseInt(document.getElementById("kapasite").value);
  
    fetch("https://localhost:7107/api/Sinif", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        sinifAd: ad,
        katNo: katNo,
        kapasite: kapasite
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Ekleme başarısız");
        return res.json();
      })
      .then(() => {
        alert("Sınıf başarıyla eklendi.");
        document.getElementById("sinifForm").reset();
        listeleSiniflar(); // Listeyi güncelle
        modalKapat("sinifModal");
      })
      .catch(err => {
        console.error("Sınıf eklenemedi:", err);
        alert("Bir hata oluştu.");
      });
  }
  // sınıf sil
  function sinifSil(id) {
    if (!confirm("Bu sınıfı silmek istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/Sinif/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(errText => {
            throw new Error(errText);
          });
        }
        alert("Sınıf silindi.");
        listeleSiniflar();
      })
      .catch(err => {
        console.error("Silme hatası:", err);
        const msg = err.message.includes("REFERENCE constraint")
          ? "Bu sınıfa bağlı öğrenciler olduğu için silinemez."
          : "Bir hata oluştu: " + err.message;
  
        alert(msg);
      });
  }
  // güncelle
  function sinifGuncelle() {
    const id = document.getElementById("sinifGuncelleForm").dataset.sinifId;
    const sinifAd = document.getElementById("updateSinifAd").value;
    const katNo = parseInt(document.getElementById("updateKatNo").value);
    const kapasite = parseInt(document.getElementById("updateKapasite").value);
  
    fetch(`https://localhost:7107/api/Sinif/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        sinifID: id,
        sinifAd,
        katNo,
        kapasite
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Güncelleme başarısız.");
        alert("Sınıf güncellendi.");
        listeleSiniflar();
        modalKapat("sinifGuncelleModal");
      })
      .catch(err => {
        console.error("Güncelleme hatası:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }
    
  
  // modal aç kapa
  function modalAc(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
  }
  
  function modalKapat(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
  }
  
  // güncelle modal aç
  function sinifGuncelleModalAc(id, sinifAd, katNo, kapasite) {
    modalAc("sinifGuncelleModal");
  
    document.getElementById("updateSinifAd").value = sinifAd;
    document.getElementById("updateKatNo").value = katNo;
    document.getElementById("updateKapasite").value = kapasite;
  
    // Güncellenecek sınıf ID'sini form dataset'ine kaydediyoruz
    document.getElementById("sinifGuncelleForm").dataset.sinifId = id;
  }
  
  // fonksiyonlar
  listeleSiniflar();

  document.getElementById("sinifForm").addEventListener("submit", function (e) {
    e.preventDefault();
    sinifEkle();
  });
  
  document.getElementById("sinifGuncelleForm").addEventListener("submit", function (e) {
    e.preventDefault();
    sinifGuncelle();
  });
  