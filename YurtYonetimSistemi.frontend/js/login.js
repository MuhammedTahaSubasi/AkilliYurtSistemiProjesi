//login
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // sayfanın yenilenmesini engeller
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      fetch("https://localhost:7107/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          Sifre: password
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Giriş başarısız.");
        }
        return response.json();
      })
      .then(data => {
        console.log("Gelen token:", data.token);
        console.log("Gelen rol:", data.role);
      
        // 1. localStorage'a token ve rol kaydet
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
      
        // 2. Kullanıcı bilgilerini çek ve kullanıcıID'yi kaydet
        fetch("https://localhost:7107/api/Kullanici/me", {
          headers: {
            Authorization: `Bearer ${data.token}`
          }
        })
        .then(res => res.json())
        .then(user => {
          console.log("Giriş yapan kullanıcı:", user);
          localStorage.setItem("kullaniciId", user.kullaniciID); // ✅ Önemli kısım
      
          // 3. Yönlendirme
          // 3. Rol bazlı yönlendirme
          if (data.role === "Öğrenci") {
            window.location.href = "student/StudentDashboard.html";
          } else if (data.role === "Admin") {
            window.location.href = "admin/Dashboard.html";
          } else if (data.role === "Personel") {
            window.location.href = "admin/Settings.html"; 
          } else {
            alert("Yetkisiz rol. Giriş reddedildi.");
            localStorage.clear();
          }

        })
        .catch(err => {
          console.error("Kullanıcı bilgileri alınamadı:", err);
          alert("Kullanıcı bilgileri alınırken bir hata oluştu.");
        });
      })
      .catch(error => {
        console.error("Login hatası:", error);
        alert("Giriş yapılamadı: " + error.message);
      });
      
  
    });
  });