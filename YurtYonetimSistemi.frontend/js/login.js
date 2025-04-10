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
      
        // 1. localStorage'a kaydet
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
      
        // 2. yönlendir
        if (data.role === "Öğrenci") {
          window.location.href = "StudentDashboard.html"; // öğrenci paneli
        } else {
          window.location.href = "Dashboard.html"; // yönetici paneli
        }
      })
      .catch(error => {
        alert("Giriş yapılamadı: " + error.message);
      });
  
    });
  });