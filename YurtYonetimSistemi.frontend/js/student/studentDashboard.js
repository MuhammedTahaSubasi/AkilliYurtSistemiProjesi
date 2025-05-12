document.addEventListener("DOMContentLoaded", () => {
  getDuyurular();
});
// listele duyurlar
function getDuyurular() {
  fetch("https://localhost:7107/api/Duyuru", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("duyuruListesi");
      if (data.length === 0) {
        container.innerHTML = "<p>Henüz duyuru yok.</p>";
        return;
      }

      data
        .filter(d => d.aktifMi)
        .sort((a, b) => new Date(b.tarih) - new Date(a.tarih)) // Yeniler üstte
        .forEach(d => {
          const div = document.createElement("div");
          div.style.border = "1px solid #ccc";
          div.style.padding = "10px";
          div.style.borderRadius = "8px";
          div.style.backgroundColor = "#f9f9f9";
          div.innerHTML = `
            <strong>${d.baslik}</strong>
            <p>${d.mesaj}</p>
            <small style="color:gray;">${new Date(d.tarih).toLocaleString("tr-TR")}</small>
          `;
          container.appendChild(div);
        });
    })
    .catch(err => {
      console.error("Duyurular getirilemedi:", err);
    });
}
