//listele
document.addEventListener("DOMContentLoaded", () => {
    listeleMenuler();
  });
  
  function listeleMenuler() {
    const tbody = document.getElementById("ogrenciMenuListesi");
    tbody.innerHTML = "";
  
    fetch("https://localhost:7107/api/YemekhaneMenusu", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="4">Menü bulunmamaktadır.</td></tr>`;
          return;
        }
  
        // Öğün sırası → Kahvaltı → Öğle → Akşam
        const ogunSirasi = { "Kahvaltı": 1, "Öğle": 2, "Akşam": 3 };
  
        // Tarih ve öğün sırasına göre sırala
        data.sort((a, b) => {
          const tarihA = new Date(a.tarih);
          const tarihB = new Date(b.tarih);
  
          if (tarihA - tarihB !== 0) return tarihA - tarihB;
          return ogunSirasi[a.ogun] - ogunSirasi[b.ogun];
        });
  
        data.forEach(menu => {
          const tarih = new Date(menu.tarih);
          const gun = tarih.toLocaleDateString("tr-TR", { weekday: "long" });
  
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${tarih.toLocaleDateString("tr-TR")}</td>
            <td>${gun}</td>
            <td>${menu.ogun}</td>
            <td>${menu.yemekler}</td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Menüler alınamadı:", err);
        tbody.innerHTML = `<tr><td colspan="4">Menüler yüklenirken hata oluştu.</td></tr>`;
      });
  }
  