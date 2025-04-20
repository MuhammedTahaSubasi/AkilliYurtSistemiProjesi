document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "../index.html";
      return;
    }
  
    // 1. Önce giriş yapan öğrencinin bilgilerini al
    fetch("https://localhost:7107/api/Kullanici/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(user => {
        const kullaniciOdaId = user.odaID;
        const odaAdi = user.oda;
        document.getElementById("odaBaslik").innerText = `${odaAdi} Odası İçin Planlanan Saatler`;
        if (!kullaniciOdaId) {
          document.getElementById("ogrenciLaundryListesi").innerHTML = `
            <tr><td colspan="3">Odanız sistemde kayıtlı değil.</td></tr>`;
          return;
        }
  
        // 2. Tüm planları çek
        fetch("https://localhost:7107/api/CamasirhanePlani", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(planlar => {
            const tbody = document.getElementById("ogrenciLaundryListesi");
            tbody.innerHTML = "";
  
            // 3. Sadece öğrencinin odasına ait olanlar filtrelenir
            const filtreli = planlar.filter(p => p.odaID === kullaniciOdaId);
  
            if (filtreli.length === 0) {
              tbody.innerHTML = `<tr><td colspan="3">Odanız için planlanan bir saat bulunamadı.</td></tr>`;
              return;
            }
  
            // 4. Gün sırasına göre sırala
            const gunSirasi = {
              "Pazartesi": 1,
              "Salı": 2,
              "Çarşamba": 3,
              "Perşembe": 4,
              "Cuma": 5,
              "Cumartesi": 6,
              "Pazar": 7
            };
  
            filtreli.sort((a, b) => {
              return (gunSirasi[a.gun] || 99) - (gunSirasi[b.gun] || 99);
            });
  
            // 5. Tabloya yazdır
            filtreli.forEach(plan => {
              const tr = document.createElement("tr");
              tr.innerHTML = `
                <td>${plan.gun}</td>
                <td>${plan.saatAraligi || "-"}</td>
                <td>${plan.aciklama || "-"}</td>
              `;
              tbody.appendChild(tr);
            });
          });
      })
      .catch(err => {
        console.error("Planlar yüklenemedi:", err);
        document.getElementById("ogrenciLaundryListesi").innerHTML =
          `<tr><td colspan="3">Veriler alınırken hata oluştu.</td></tr>`;
      });
  });
  