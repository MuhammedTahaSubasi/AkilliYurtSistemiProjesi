// aktif etkinlikler listele
document.addEventListener("DOMContentLoaded", () => {
    getAktifEtkinlikler();
  });
  
  function getAktifEtkinlikler() {
    const token = localStorage.getItem("token");
    const kullaniciID = localStorage.getItem("kullaniciId");
    const container = document.getElementById("etkinlikContainer");
    container.innerHTML = "";
  
    // Tüm etkinlikleri al
    fetch("https://localhost:7107/api/Etkinlik", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(etkinlikler => {
        const aktifEtkinlikler = etkinlikler.filter(e => e.aktifMi);
  
        // Katılımları da al
        fetch("https://localhost:7107/api/EtkinlikKatilim", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(katilimlar => {
            if (aktifEtkinlikler.length === 0) {
              container.innerHTML = "<p>Aktif etkinlik bulunmamaktadır.</p>";
              return;
            }
  
            aktifEtkinlikler.forEach(etkinlik => {
              const div = document.createElement("div");
              div.className = "anket-kart";
  
              const katilim = katilimlar.find(
                k => k.etkinlikID === etkinlik.etkinlikID && k.kullaniciID === kullaniciID
              );
  
              const tarih = new Date(etkinlik.tarih).toLocaleString();
  
              if (katilim) {
                div.innerHTML = `
                  <h3>${etkinlik.ad}</h3>
                  <p><strong>Tarih:</strong> ${tarih}</p>
                  <p style="color: green;">Katıldınız</p>
                  <button class="delete-btn" onclick="etkinliktenCik('${katilim.katilimID}')">Çık</button>
                `;
              } else {
                div.innerHTML = `
                  <h3>${etkinlik.ad}</h3>
                  <p><strong>Tarih:</strong> ${tarih}</p>
                  <button class="add-btn" onclick="etkinligeKatil('${etkinlik.etkinlikID}')">Katıl</button>
                `;
              }
  
              container.appendChild(div);
            });
          });
      })
      .catch(err => {
        console.error("Etkinlikler alınamadı:", err);
        container.innerHTML = "<p>Etkinlikler yüklenirken hata oluştu.</p>";
      });
  }

// etkinliğe katıl 
  function etkinligeKatil(etkinlikID) {
    const kullaniciID = localStorage.getItem("kullaniciId");
  
    fetch("https://localhost:7107/api/EtkinlikKatilim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        etkinlikID,
        kullaniciID
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Zaten katıldınız veya kontenjan dolu.");
        alert("Etkinliğe katıldınız!");
        getAktifEtkinlikler();
      })
      .catch(err => {
        console.error(err);
        alert("Katılım sırasında hata oluştu: " + err.message);
      });
  }

  // etkinllikten çık
  function etkinliktenCik(katilimID) {
    if (!confirm("Etkinlikten çıkmak istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/EtkinlikKatilim/${katilimID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Çıkış başarısız.");
        alert("Etkinlikten çıkıldı.");
        getAktifEtkinlikler();
      })
      .catch(err => {
        console.error("Çıkış hatası:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }
  
  