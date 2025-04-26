// Ödeme Listeleme
function listeleOdemeler() {
    const tbody = document.getElementById("odemeListesi");
    tbody.innerHTML = "";

    fetch("https://localhost:7107/api/Odeme", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Ödeme verileri alınamadı.");
      }
      return res.json();
    })
    .then(data => {
      if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Kayıtlı ödeme bulunamadı.</td></tr>`;
        return;
      }

      // 📢 Son ödeme tarihine göre sıralama
      data.sort((a, b) => new Date(a.sonOdemeTarihi) - new Date(b.sonOdemeTarihi));

      // 📢 Dropdown'dan seçilen filtreyi al
      const filtre = document.getElementById("filterOdeme").value;
      const bugun = new Date();

      const filtrelenmisData = data.filter(odeme => {
        const sonTarih = new Date(odeme.sonOdemeTarihi);

        if (filtre === "aktif") {
          // Aktif: Tarihi geçmemiş veya tarihi geçmiş ama ödenmemiş
          return sonTarih >= bugun || (sonTarih < bugun && !odeme.odendiMi);
        } else if (filtre === "pasif") {
          // Pasif: Tarihi geçmiş ve ödenmiş olanlar
          return sonTarih < bugun && odeme.odendiMi;
        } else {
          // Tüm ödemeler
          return true;
        }
      });

      if (filtrelenmisData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Filtreye uygun ödeme bulunamadı.</td></tr>`;
        return;
      }

      filtrelenmisData.forEach(odeme => {
        const sonTarih = new Date(odeme.sonOdemeTarihi);
        const tarihGecmismi = sonTarih < bugun;

        const tr = document.createElement("tr");

        let uyari = "";
        // 📢 Tarih geçmiş ve hala ödenmediyse uyarı ver
        if (tarihGecmismi && !odeme.odendiMi) {
          uyari = `<div style="color: red; font-weight: bold;">⚠️ Tarih geçti, ödeme yapılmadı!</div>`;
        }

        tr.innerHTML = `
          <td>${odeme.kullanici ? odeme.kullanici.ad + " " + odeme.kullanici.soyad : "-"}</td>
          <td>${odeme.tutar} ₺</td>
          <td>${odeme.sonOdemeTarihi ? odeme.sonOdemeTarihi.split("T")[0] : "-"}</td>
          <td>${odeme.odendiMi ? "<span style='color:green'>Ödendi</span>" : "<span style='color:red'>Bekleniyor</span>"}</td>
          <td>
            ${odeme.odendiMi 
              ? `<button class="detail-btn" onclick="odemeGeriAl('${odeme.odemeID}', ${odeme.tutar}, '${odeme.sonOdemeTarihi}')">Geri Al</button>` 
              : `<button class="add-btn" onclick="odemeYap('${odeme.odemeID}', ${odeme.tutar}, '${odeme.sonOdemeTarihi}')">Ödendi Yap</button>`
            }
            <button class="delete-btn" onclick="odemeSil('${odeme.odemeID}')">Sil</button>
            <button class="detail-btn" onclick="odemeGuncelleModalAc('${odeme.odemeID}', ${odeme.tutar}, '${odeme.sonOdemeTarihi}')">Güncelle</button>
            ${uyari}
          </td>
        `;

        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Ödeme listesi alınamadı:", err);
      tbody.innerHTML = `<tr><td colspan="5">Hata oluştu: ${err.message}</td></tr>`;
    });
}

  // Ödeme Ödendi Yap
  function odemeYap(id, tutar, sonOdemeTarihi) {
    if (!confirm("Bu ödemeyi ödendi olarak işaretlemek istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/Odeme/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        odemeID: id,
        tutar: tutar,
        sonOdemeTarihi: sonOdemeTarihi,
        odendiMi: true
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Ödeme güncellenemedi.");
        alert("Ödeme başarıyla ödendi olarak işaretlendi.");
        listeleOdemeler();
      })
      .catch(err => {
        console.error("Ödeme güncelleme hatası:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }

  //ödendi geri al 
  function odemeGeriAl(id, tutar, sonOdemeTarihi) {
    if (!confirm("Bu ödemeyi Geri Almak (Bekleniyor yapmak) istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/Odeme/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        odemeID: id,
        tutar: tutar,
        sonOdemeTarihi: sonOdemeTarihi,
        odendiMi: false // ❗ Geri alma işlemi: ödendiMi false yapıyoruz
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Ödeme durumu geri alınamadı.");
        alert("Ödeme başarıyla Bekleniyor durumuna geri alındı.");
        listeleOdemeler(); // listeyi yenile
      })
      .catch(err => {
        console.error("Geri alma hatası:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }
  
  //sil
  function odemeSil(id) {
    if (!confirm("Bu ödeme kaydını silmek istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/Odeme/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Ödeme kaydı silinemedi.");
        alert("Ödeme kaydı başarıyla silindi.");
        listeleOdemeler(); // listeyi yenile
      })
      .catch(err => {
        console.error("Ödeme silme hatası:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }
  
  // Yeni Ödeme Planı Ekle
function yeniOdemeEkle(e) {
    e.preventDefault();
  
    const tutar = parseFloat(document.getElementById("tutar").value);
    const sonOdemeTarihi = document.getElementById("sonOdemeTarihi").value;
  
    const bugun = new Date();
    const girilenTarih = new Date(sonOdemeTarihi);
  
    // 📢 Geçmiş tarih kontrolü
    if (girilenTarih < bugun.setHours(0, 0, 0, 0)) {
      alert("Geçmiş bir tarihe ödeme planı oluşturulamaz!");
      return;
    }
  
    fetch("https://localhost:7107/api/Odeme/toplu-ekle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        tutar: tutar,
        sonOdemeTarihi: sonOdemeTarihi
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Toplu ödeme planı eklenemedi.");
        alert("Yeni ödeme planı başarıyla oluşturuldu!");
        document.getElementById("odemeForm").reset();
        modalKapat("odemeModal");
        listeleOdemeler(); // listeyi güncelle
      })
      .catch(err => {
        console.error("Toplu ödeme planı eklenemedi:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }  

  //güncelle
  document.getElementById("odemeGuncelleForm").addEventListener("submit", function(e) {
    e.preventDefault();
    odemeGuncelle();
  });
  
  function odemeGuncelle() {
    const id = document.getElementById("odemeGuncelleForm").dataset.odemeId;
    const tutar = parseFloat(document.getElementById("guncelleTutar").value);
    const sonOdemeTarihi = document.getElementById("guncelleSonOdemeTarihi").value;
  
    fetch(`https://localhost:7107/api/Odeme/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        odemeID: id,
        tutar: tutar,
        sonOdemeTarihi: sonOdemeTarihi,
        odendiMi: false // güncellerken ödendiMi değişmiyor
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Ödeme güncellenemedi.");
        alert("Ödeme başarıyla güncellendi.");
        modalKapat('odemeGuncelleModal');
        listeleOdemeler();
      })
      .catch(err => {
        console.error("Güncelleme hatası:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }
  //güncelle modal aç
  function odemeGuncelleModalAc(id, tutar, sonOdemeTarihi) {
    modalAc('odemeGuncelleModal');
  
    document.getElementById("guncelleTutar").value = tutar;
    document.getElementById("guncelleSonOdemeTarihi").value = sonOdemeTarihi.split("T")[0];
    
    // ID'yi sakla
    document.getElementById("odemeGuncelleForm").dataset.odemeId = id;
  }
  
  // Modal Aç-Kapat
  function modalAc(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
  }
  
  function modalKapat(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
  }
  
  // Sayfa Açılınca
  listeleOdemeler();
  
  // Form Submit
  document.getElementById("odemeForm").addEventListener("submit", yeniOdemeEkle);
  