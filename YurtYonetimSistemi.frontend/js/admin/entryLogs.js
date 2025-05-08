document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("logTarih").value = today;
  });
  
  function filtreleEntryLogs() {
    const tarih = document.getElementById("logTarih").value;
    const arama = document.getElementById("logArama").value.trim();
  
    let url = `https://localhost:7107/api/girisCikis?`;
  
    if (tarih) {
      url += `date=${tarih}`;
    }
    if (arama) {
      url += `${tarih ? "&" : ""}search=${encodeURIComponent(arama)}`;
    }
  
    fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Veri alınamadı");
        }
        return res.json();
      })
      .then(data => {
        const tbody = document.getElementById("entryLogsListesi");
        tbody.innerHTML = "";
  
        if (data.length === 0) {
          const tr = document.createElement("tr");
          const td = document.createElement("td");
          td.colSpan = 4;
          td.textContent = "Kayıt bulunamadı.";
          td.style.textAlign = "center";
          tr.appendChild(td);
          tbody.appendChild(tr);
          return;
        }
  
        data.forEach(log => {
          const tr = document.createElement("tr");
  
          const adTd = document.createElement("td");
          adTd.textContent = log.adSoyad;
          tr.appendChild(adTd);
  
          const tcTd = document.createElement("td");
          tcTd.textContent = log.tcNo;
          tr.appendChild(tcTd);
  
          const zamanTd = document.createElement("td");
          zamanTd.textContent = log.zaman;
          tr.appendChild(zamanTd);
  
          const durumTd = document.createElement("td");
          durumTd.textContent = log.girisMi ? "Giriş" : "Çıkış";
          durumTd.style.color = log.girisMi ? "green" : "red";
          tr.appendChild(durumTd);
  
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        alert("Veriler getirilirken hata oluştu: " + err.message);
      });
  }
  document.getElementById("logArama").addEventListener("input", filtreleEntryLogs);
  document.getElementById("logTarih").addEventListener("input", filtreleEntryLogs);


  