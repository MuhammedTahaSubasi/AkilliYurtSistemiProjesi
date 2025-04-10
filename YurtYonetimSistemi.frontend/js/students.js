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
  
        data
          .filter(k => k.rol?.rolAd === "Öğrenci")
          .forEach(kullanici => {
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
  
    const payload = {
      kullaniciID: id,
      ad,
      soyad,
      email,
      tcNo,
      telefon,
      odaID,
      sinifID,
      rolID
    };
  
    // Eğer şifre girildiyse ekle
    if (sifre.trim() !== "") {
      payload.sifre = sifre;
    }
  
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
        if (!res.ok) throw new Error("Güncelleme başarısız.");
        if (res.status === 204) {
          return {}; // Boş bir obje dön
        }
        return res.json();
      })
      .then(data => {
        alert("Öğrenci güncellendi.");
        document.getElementById("studentDetailModal").style.display = "none";
        listeleOgrenciler(); // Listeyi güncelle
      })
      .catch(err => {
        console.error("Güncelleme hatası:", err);
        alert("Bir hata oluştu.");
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
    loadOdalar("updateOda");
    loadSiniflar("updateSinif");
    loadRoller("updateRol");
  
    // sonra değer ata
    setTimeout(() => {
      document.getElementById("updateOda").value = oda;
      document.getElementById("updateSinif").value = sinif;
      document.getElementById("updateRol").value = rolID;
    }, 200); // küçük bir gecikme dropdown dolmadan value vermemek için
  
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
  
    const [ad, soyad] = adSoyad.trim().split(" ");
  
    fetch("https://localhost:7107/api/Kullanici", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        ad,
        soyad,
        email,
        sifre,
        tcNo,
        telefon,
        odaID,
        sinifID,
        rolID
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Öğrenci eklenemedi");
        return res.json();
      })
      .then(data => {
        alert("Öğrenci başarıyla eklendi!");
      
        const form = document.getElementById("studentForm"); // ✅ Formu seç
        form.reset(); // ✅ Formu temizle
      
        document.getElementById("studentModal").style.display = "none";
        listeleOgrenciler(); // Listeyi güncelle
      })
      .catch(err => {
        console.error("Ekleme hatası:", err);
        alert("Bir hata oluştu.");
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
    loadRoller("inputRol");
    loadOdalar("inputOda");
    loadSiniflar("inputSinif");
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
    fetch("https://localhost:7107/api/Rol", {
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
    fetch("https://localhost:7107/api/Oda", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById(selectId);
        select.innerHTML = "";
        data.forEach(oda => {
          const option = document.createElement("option");
          option.value = oda.odaID;
          option.textContent = oda.odaNo;
          select.appendChild(option);
        });
      });
  }
  
  function loadSiniflar(selectId) {
    fetch("https://localhost:7107/api/Sinif", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById(selectId);
        select.innerHTML = "";
        data.forEach(sinif => {
          const option = document.createElement("option");
          option.value = sinif.sinifID;
          option.textContent = sinif.sinifAd;
          select.appendChild(option);
        });
      });
  }
  
  // Sayfa yüklendiğinde çalıştır
  listeleOgrenciler();

  