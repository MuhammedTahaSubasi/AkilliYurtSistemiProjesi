// Öğrenci Listeleme
function listeleOgrenciler() {
  fetch("https://localhost:7107/api/Kullanici", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("kullaniciListesi");
      tbody.innerHTML = "";

      //  Dropdown'dan seçilen rolü al
      const rolFiltre = document.getElementById("kullaniciFiltre")?.value || "Öğrenci";
      //  Arama kutusundan metni al
      const aramaMetni = document.getElementById("kullaniciArama")?.value?.toLowerCase() || "";
      const listeBasligi = document.getElementById("listeBasligi");

      //  Başlığı değiştir
      listeBasligi.textContent = {
        "Öğrenci": "Öğrenci Listesi",
        "Personel": "Personel Listesi",
        "Admin": "Admin Listesi",
        "all": "Tüm Kullanıcılar"
      }[rolFiltre] || "Kullanıcı Listesi";

      //  Filtre uygulama
      let filtreli = data;
      // 1. Önce rol filtresi uygula
      if (rolFiltre !== "all") {
        filtreli = data.filter(k => k.rol?.rolAd?.toLowerCase() === rolFiltre.toLowerCase());
      }
      
      // 2. Ardından arama filtresi uygula
      if (aramaMetni.trim() !== "") {
        filtreli = filtreli.filter(k => {
          const tamAd = `${k.ad} ${k.soyad}`.toLowerCase();
          const tcNo = k.tcNo?.toLowerCase() || "";
          
          // Ad Soyad veya TC No içinde arama yap
          return tamAd.includes(aramaMetni) || tcNo.includes(aramaMetni);
        });
      }

      // Eğer filtreleme sonucunda hiç sonuç yoksa mesaj göster
      if (filtreli.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">Arama kriterlerine uygun kullanıcı bulunamadı.</td></tr>`;
        return;
      }

      //  Listeleme
      filtreli.forEach(kullanici => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${kullanici.ad} ${kullanici.soyad}</td>
          <td>${kullanici.tcNo || "-"}</td>
          <td>${kullanici.oda?.odaNo || "-"}</td>
          <td>${kullanici.sinif?.sinifAd || "-"}</td>
          <td>${kullanici.telefon || "-"}</td>
          <td>
            <button class="detail-btn" onclick="showDetails(
              '${kullanici.kullaniciID}',
              '${kullanici.ad} ${kullanici.soyad}',
              '${kullanici.email || "-"}',
              '${kullanici.sifre || "-"}',
              '${kullanici.tcNo || "-"}',
              '${kullanici.oda?.odaID || "-"}',
              '${kullanici.sinif?.sinifID || "-"}',
              '${kullanici.telefon || "-"}',
              '${kullanici.rol?.rolID || "-"}'
            )">Detay</button>
            <button class="delete-btn" onclick="deleteKullanici('${kullanici.kullaniciID}')">Sil</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Kullanıcılar yüklenemedi:", err);
    });
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener("DOMContentLoaded", function () {
  try {
    console.log("Sayfa yüklendi, listeleme çalıştırılıyor...");
    listeleOgrenciler();

    //  Dropdown değiştikçe listeyi güncelle
    const filtreSelect = document.getElementById("kullaniciFiltre");
    if (filtreSelect) {
      filtreSelect.addEventListener("change", () => {
        listeleOgrenciler();
      });
    }
    
    //  Arama kutusu için event listener ekle
    const aramaKutusu = document.getElementById("kullaniciArama");
    if (aramaKutusu) {
      aramaKutusu.addEventListener("input", () => {
        // Her karakter girişinde 300ms bekleyerek sürekli istek göndermeyi önle
        clearTimeout(aramaKutusu.timer);
        aramaKutusu.timer = setTimeout(() => {
          listeleOgrenciler();
        }, 300);
      });
    }
  } catch (error) {
    console.error("Sayfa yüklenirken hata:", error);
  }
});

  // Öğrenci güncelleme
  document.getElementById("updateStudentForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const id = e.target.dataset.kullaniciId;
    const adSoyad = document.getElementById("updateAdSoyad").value;
    const [ad, soyad] = adSoyad.trim().split(" ");
    const email = document.getElementById("updateEmail").value;
    const sifre = document.getElementById("updateSifre").value;
    const tcNo = document.getElementById("updateTcNo").value;
    const telefon = document.getElementById("updateTelefon").value;
    const odaID = document.getElementById("updateOda").value;
    const sinifID = document.getElementById("updateSinif").value;
    const rolID = document.getElementById("updateRol").value;
    const rolSelect = document.getElementById("updateRol");
    const selectedRolText = rolSelect.options[rolSelect.selectedIndex]?.text.toLowerCase();
  
    // Payload oluştur
    const payload = {
      kullaniciID: id,
      ad,
      soyad,
      email,
      tcNo,
      telefon,
      rolID
    };
  
    // Eğer şifre girildiyse ekle
    if (sifre.trim() !== "") {
      payload.sifre = sifre;
    }
  
    // Eğer öğrenci ise odaID ve sinifID ekle, değilse ekleme
    if (selectedRolText === "öğrenci") {
      payload.odaID = odaID;
      payload.sinifID = sinifID;
    }
  
    console.log("Güncelleme verisi:", payload);
  
    // Sunucuya PUT isteği gönder
    fetch(`https://localhost:7107/api/Kullanici/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) {
          console.error("API yanıt kodu:", res.status);
          return res.text().then(text => {
            throw new Error(`Güncelleme hatası: ${text}`);
          });
        }
        if (res.status === 204) {
          return {}; // Boş bir obje dön
        }
        return res.json();
      })
      .then(data => {
        alert("Kullanıcı güncellendi.");
        document.getElementById("studentDetailModal").style.display = "none";
        listeleOgrenciler(); // Listeyi güncelle
      })
      .catch(err => {
        console.error("Güncelleme hatası:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  });

  //güncelleme html bağlantısı 
  function showDetails(id, adSoyad,email, sifre, tcNo, oda, sinif, telefon,rolID) {
    document.getElementById("studentDetailModal").style.display = "flex";
  
    const [ad, soyad] = adSoyad.trim().split(" ");
    document.getElementById("updateAdSoyad").value = `${ad} ${soyad}`;
    document.getElementById("updateEmail").value = email;
   document.getElementById("updateSifre").value = "";
    document.getElementById("updateTcNo").value = tcNo;
    document.getElementById("updateTelefon").value = telefon;
  
    // dropdownları önce doldur
    Promise.all([
      loadOdalar("updateOda"),
      loadSiniflar("updateSinif"),
      loadRoller("updateRol")
    ]).then(() => {
      // Ardından değerleri ata
      document.getElementById("updateOda").value = oda;
      document.getElementById("updateSinif").value = sinif;
      document.getElementById("updateRol").value = rolID;
  
      // Rol değişimine göre oda/sınıf alanlarını göster/gizle
      handleRolChange("updateRol", "updateOda", "updateSinif", "updateOdaSinifWrapper");
      // Rol değişikliğini dinle
      document.getElementById("updateRol").addEventListener("change", function() {
        handleRolChange("updateRol", "updateOda", "updateSinif", "updateOdaSinifWrapper");
    });
    });
  
  
    document.getElementById("closeDetailModal").onclick = () => {
      document.getElementById("studentDetailModal").style.display = "none";
    };
  
    document.getElementById("updateStudentForm").dataset.kullaniciId = id;
  }
  
  // Öğrenci Ekleme
document.getElementById("studentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const adSoyad = document.getElementById("inputAdSoyad").value;
  const email = document.getElementById("inputEmail").value;
  const sifre = document.getElementById("inputSifre").value;
  const tcNo = document.getElementById("inputTcNo").value;
  const odaID = document.getElementById("inputOda").value;
  const sinifID = document.getElementById("inputSinif").value;
  const telefon = document.getElementById("inputTelefon").value;
  const rolID = document.getElementById("inputRol").value;
  const rolSelect = document.getElementById("inputRol");
  const selectedRolText = rolSelect.options[rolSelect.selectedIndex]?.text.toLowerCase();

  const [ad, soyad] = adSoyad.trim().split(" ");

  // Payload oluştur
  const payload = {
    ad,
    soyad,
    email,
    sifre,
    tcNo,
    telefon,
    rolID
  };

  // Eğer öğrenci ise odaID ve sinifID ekle, değilse ekleme
  if (selectedRolText === "öğrenci") {
    payload.odaID = odaID;
    payload.sinifID = sinifID;
  }
  // Öğrenci değilse bu alanları hiç gönderme

  console.log("Gönderilen veri:", payload);

  fetch("https://localhost:7107/api/Kullanici", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) {
        console.error("API yanıt kodu:", res.status);
        return res.text().then(text => {
          throw new Error(`Ekleme hatası: ${text}`);
        });
      }
      return res.json();
    })
    .then(data => {
      alert("Kullanıcı başarıyla eklendi!");
    
      const form = document.getElementById("studentForm");
      form.reset();
    
      document.getElementById("studentModal").style.display = "none";
      listeleOgrenciler(); // Listeyi güncelle
    })
    .catch(err => {
      console.error("Ekleme hatası:", err);
      alert("Bir hata oluştu: " + err.message);
    });
});
  
  //  öğrenci silme 
  function deleteKullanici(id) {
    if (!confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/Kullanici/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Silme işlemi başarısız");
        alert("Öğrenci başarıyla silindi.");
        listeleOgrenciler(); // Listeyi güncelle
      })
      .catch(err => {
        console.error("Silme hatası:", err);
        alert("Bir hata oluştu.");
      });
  }

  // Modal Aç / Kapat
  const openBtn = document.querySelector(".add-btn");
  const modal = document.getElementById("studentModal");
  const closeBtn = document.getElementById("closeModal");
  
  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    // Select'leri sırayla doldur
  Promise.all([
    loadRoller("inputRol"),
    loadOdalar("inputOda"),
    loadSiniflar("inputSinif")
  ]).then(() => {
    // Roller yüklendikten sonra kontrolü yap
    handleRolChange("inputRol", "inputOda", "inputSinif", "odaSinifWrapper");
    // Rol değişikliğini dinle
    document.getElementById("inputRol").addEventListener("change", function() {
      handleRolChange("inputRol", "inputOda", "inputSinif", "odaSinifWrapper");
  });
  });
});
  
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
  
  // Select kutularını doldur
  function loadRoller(selectId) {
    return fetch("https://localhost:7107/api/Rol", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById(selectId);
        select.innerHTML = "";
        data.forEach(rol => {
          const option = document.createElement("option");
          option.value = rol.rolID;
          option.textContent = rol.rolAd;
          select.appendChild(option);
        });
      });
  }
  
  function loadOdalar(selectId) {
    return fetch("https://localhost:7107/api/Oda", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById(selectId);
        select.innerHTML = "";
        
        // Boş option ekle
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "Seçilmedi";
        select.appendChild(emptyOption);
        
        data.forEach(oda => {
            const option = document.createElement("option");
            option.value = oda.odaID;
            option.textContent = oda.odaNo;
            select.appendChild(option);
        });
    });
}

function loadSiniflar(selectId) {
    return fetch("https://localhost:7107/api/Sinif", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById(selectId);
        select.innerHTML = "";
        
        // Boş option ekle
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = "Seçilmedi";
        select.appendChild(emptyOption);
        
        data.forEach(sinif => {
            const option = document.createElement("option");
            option.value = sinif.sinifID;
            option.textContent = sinif.sinifAd;
            select.appendChild(option);
        });
    });
}
  // role göre ek dropdawn getir
function handleRolChange(selectId, odaId, sinifId, wrapperId) {
  const rolSelect = document.getElementById(selectId);
  const selectedRolText = rolSelect.options[rolSelect.selectedIndex]?.text.toLowerCase();
  const oda = document.getElementById(odaId);
  const sinif = document.getElementById(sinifId);
  const wrapper = document.getElementById(wrapperId);

  console.log("Seçilen rol:", selectedRolText); 

  if (selectedRolText === "öğrenci") {
      wrapper.style.display = "block";
      oda.required = true;
      sinif.required = true;
  } else {
      wrapper.style.display = "none";
      oda.required = false;
      sinif.required = false;
      
      // Boş option ekleme ve seçme 
      if (!oda.querySelector('option[value=""]')) {
          const emptyOption = document.createElement("option");
          emptyOption.value = "";
          emptyOption.textContent = "Seçilmedi";
          oda.insertBefore(emptyOption, oda.firstChild);
      }
      oda.value = "";
      
      if (!sinif.querySelector('option[value=""]')) {
          const emptyOption = document.createElement("option");
          emptyOption.value = "";
          emptyOption.textContent = "Seçilmedi";
          sinif.insertBefore(emptyOption, sinif.firstChild);
      }
      sinif.value = "";
  }
}
  // Sayfa yüklendiğinde çalıştır
  document.addEventListener("DOMContentLoaded", function () {
    try {
      console.log("Sayfa yüklendi, listeleme çalıştırılıyor...");
      listeleOgrenciler();
  
      // 🔽 Dropdown değiştikçe listeyi güncelle
      const filtreSelect = document.getElementById("kullaniciFiltre");
      if (filtreSelect) {
        filtreSelect.addEventListener("change", () => {
          listeleOgrenciler();
        });
      }
    } catch (error) {
      console.error("Sayfa yüklenirken hata:", error);
    }
  });
  

  