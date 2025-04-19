//listele 
function listeleOdalar() {
    const tbody = document.getElementById("odaListesi");
    tbody.innerHTML = "";
  
    fetch("https://localhost:7107/api/Oda", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5">Kayıtlı oda bulunamadı.</td></tr>`;
          return;
        }
  
        data.forEach(oda => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${oda.odaNo}</td>
            <td>${oda.katNo}</td>
            <td>${oda.kapasite}</td>
            <td>${oda.durum || "-"}</td>
            <td>
              <button class="detail-btn" onclick="odaGuncelleModalAc('${oda.odaID}', '${oda.odaNo}', ${oda.katNo}, ${oda.kapasite})">Düzenle</button>
              <button class="delete-btn" onclick="odaSil('${oda.odaID}')">Sil</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Oda listesi alınamadı:", err);
        tbody.innerHTML = `<tr><td colspan="5">Hata oluştu.</td></tr>`;
      });
  }
  // oda ekle 
  function odaEkle() {
    const odaNo = document.getElementById("odaNo").value;
    const katNo = parseInt(document.getElementById("katNo").value);
    const kapasite = parseInt(document.getElementById("kapasite").value);
  
    fetch("https://localhost:7107/api/Oda", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        odaNo,
        katNo,
        kapasite
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Ekleme başarısız.");
        return res.json();
      })
      .then(() => {
        alert("Oda başarıyla eklendi.");
        document.getElementById("odaForm").reset();
        modalKapat("odaModal");
        listeleOdalar(); // liste güncellensin
      })
      .catch(err => {
        console.error("Oda eklenemedi:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }
  //oda sil
  function odaSil(id) {
    if (!confirm("Bu odayı silmek istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/Oda/${id}`, {
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
        alert("Oda başarıyla silindi.");
        listeleOdalar();
      })
      .catch(err => {
        console.error("Silme hatası:", err);
        const msg = err.message.includes("REFERENCE constraint")
          ? "Bu odaya bağlı öğrenciler bulunduğu için silinemez."
          : "Bir hata oluştu: " + err.message;
  
        alert(msg);
      });
  }
  
  //güncelleme 
  function odaGuncelle() {
    const id = document.getElementById("odaGuncelleForm").dataset.odaId;
    const odaNo = document.getElementById("updateOdaNo").value;
    const katNo = parseInt(document.getElementById("updateKatNo").value);
    const kapasite = parseInt(document.getElementById("updateKapasite").value);
  
    fetch(`https://localhost:7107/api/Oda/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        odaID: id,
        odaNo,
        katNo,
        kapasite
      })
    })
      .then(res => {
        if (!res.ok) throw res; 
        return res.text();      
      })
      .then(msg => {
        alert("Oda güncellendi.");
        listeleOdalar();
        modalKapat("odaGuncelleModal");
      })
      .catch(async err => {
        let errorMessage = "Güncelleme başarısız.";
  
        if (err instanceof Response) {
          const errorText = await err.text();
          errorMessage = errorText || errorMessage;
        }
  
        alert("Bir hata oluştu: " + errorMessage);
      });
  }
  
  // güncelle modal aç
  function odaGuncelleModalAc(id, odaNo, katNo, kapasite) {
    modalAc("odaGuncelleModal");
  
    document.getElementById("updateOdaNo").value = odaNo;
    document.getElementById("updateKatNo").value = katNo;
    document.getElementById("updateKapasite").value = kapasite;
  
    // ID'yi formda dataset olarak sakla
    document.getElementById("odaGuncelleForm").dataset.odaId = id;
  }
  
  
  // modal aç kapat
  function modalAc(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
  }
  
  function modalKapat(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
  }
  
  // fonsiyon
  listeleOdalar();

  document.getElementById("odaForm").addEventListener("submit", function (e) {
    e.preventDefault();
    odaEkle();
  });

  document.getElementById("odaGuncelleForm").addEventListener("submit", function (e) {
    e.preventDefault();
    odaGuncelle();
  });
  
  
