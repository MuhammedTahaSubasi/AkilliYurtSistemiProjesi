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
                  '${kullanici.tcNo || "-"}',
                  '${kullanici.oda?.odaNo || "-"}',
                  '${kullanici.sinif?.sinifAd || "-"}',
                  '${kullanici.telefon || "-"}'
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
  function loadRoller() {
    fetch("https://localhost:7107/api/Rol", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById("inputRol");
        select.innerHTML = "";
        data.forEach(rol => {
          const option = document.createElement("option");
          option.value = rol.rolID;
          option.textContent = rol.rolAd;
          select.appendChild(option);
        });
      });
  }
  
  function loadOdalar() {
    fetch("https://localhost:7107/api/Oda", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById("inputOda");
        select.innerHTML = "";
        data.forEach(oda => {
          const option = document.createElement("option");
          option.value = oda.odaID;
          option.textContent = oda.odaNo;
          select.appendChild(option);
        });
      });
  }
  
  function loadSiniflar() {
    fetch("https://localhost:7107/api/Sinif", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById("inputSinif");
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
  loadRoller();
  loadOdalar();
  loadSiniflar();
  