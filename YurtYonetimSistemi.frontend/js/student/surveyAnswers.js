//anket listele
document.addEventListener("DOMContentLoaded", () => {
    getAktifAnketler();
  });
  
  function getAktifAnketler() {
    const token = localStorage.getItem("token");
    const kullaniciId = localStorage.getItem("kullaniciId");
  
    const container = document.getElementById("anketContainer");
    container.innerHTML = "";
  
    // 1. Tüm anketleri al
    fetch("https://localhost:7107/api/Anket", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(anketler => {
        // SADECE aktif olan anketleri filtrele
        const aktifAnketler = anketler.filter(a => a.aktifMi);
  
        // 2. Öğrencinin verdiği cevapları al
        fetch("https://localhost:7107/api/AnketCevap", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(cevaplar => {
            if (aktifAnketler.length === 0) {
              container.innerHTML = "<p>Aktif anket bulunmamaktadır.</p>";
              return;
            }
  
            aktifAnketler.forEach(anket => {
              const div = document.createElement("div");
              div.className = "anket-kart";
  
              const cevap = cevaplar.find(
                c => c.anketID === anket.anketID && c.kullaniciID === kullaniciId
              );
  
              if (cevap) {
                div.innerHTML = `
                  <h3>${anket.soru}</h3>
                  <label>Puanınız:</label>
                  <select disabled>
                    <option value="1" ${cevap.puan == 1 ? "selected" : ""}>1</option>
                    <option value="2" ${cevap.puan == 2 ? "selected" : ""}>2</option>
                    <option value="3" ${cevap.puan == 3 ? "selected" : ""}>3</option>
                    <option value="4" ${cevap.puan == 4 ? "selected" : ""}>4</option>
                    <option value="5" ${cevap.puan == 5 ? "selected" : ""}>5</option>
                  </select>
                  <p style="color: green; margin-top: 10px;">Cevapladınız</p>
                `;
              } else {
                div.innerHTML = `
                  <h3>${anket.soru}</h3>
                  <label for="puan-${anket.anketID}">Puanla (1-5):</label>
                  <select id="puan-${anket.anketID}">
                    <option value="" disabled selected>Puan Seç</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <br>
                  <button onclick="anketeCevapVer('${anket.anketID}')">Cevapla</button>
                `;
              }
  
              container.appendChild(div);
            });
          });
      })
      .catch(err => {
        console.error("Anketler getirilemedi:", err);
        alert("Bir hata oluştu.");
      });
  }
  
  //anket cevap ekle
  function anketeCevapVer(anketID) {
    const kullaniciID = localStorage.getItem("kullaniciId"); 
    const puan = parseInt(document.getElementById(`puan-${anketID}`).value);
  
    fetch("https://localhost:7107/api/AnketCevap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        anketID,
        kullaniciID,
        puan,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Cevap gönderilemedi");
        alert("Cevap kaydedildi!");
        getAktifAnketler();
      })
      .catch(err => {
        console.error(err);
        alert("Zaten cevap vermiş olabilirsiniz veya bir hata oluştu.");
      });
  }
  