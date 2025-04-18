// TALEP EKLE 
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bakimTalepForm");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const baslik = document.getElementById("bakimBaslik").value;
      const aciklama = document.getElementById("bakimAciklama").value;
      const kullaniciID = localStorage.getItem("kullaniciId");
  
      fetch("https://localhost:7107/api/BakimTalep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          baslik,
          aciklama,
          kullaniciID
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Talep gönderilemedi.");
          }
          return res.json();
        })
        .then(() => {
          alert("Bakım talebiniz başarıyla gönderildi.");
          form.reset(); // formu temizle
        })
        .catch(err => {
          console.error("Hata:", err);
          alert("Bir hata oluştu: " + err.message);
        });
    });
  });
  