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
  
// Token kontrolü güvenlik
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  fetch("https://localhost:7107/api/Kullanici/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Token geçersiz");
    return res.json();
  })
  .then(kullanici => {
    console.log("Giriş yapan kullanıcı:", kullanici);
    // Burada kullanıcı bilgilerini DOM'a da basabilirsin istersen
  })
  .catch(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "index.html";
  });
}

  document.addEventListener("DOMContentLoaded", () => {
    // MODAL AÇMA / KAPAMA
    const modal = document.getElementById("studentModal");
    const openBtn = document.querySelector(".add-btn");
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
  
    // ✅ FORM GÖNDERİNCE TABLOYA EKLE
    const form = document.getElementById("studentForm");
    const tableBody = document.querySelector(".student-table tbody");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const inputs = form.querySelectorAll("input");
      const name = inputs[0].value;
      const number = inputs[1].value;
      const room = inputs[2].value;
      const phone = inputs[3].value;
  
      // Yeni satır HTML
      const newRow = `
        <tr>
          <td>${name}</td>
          <td>${number}</td>
          <td>${room}</td>
          <td>${phone}</td>
          <td>
            <button class="detail-btn">Detay</button>
            <button class="delete-btn">Sil</button>
          </td>
        </tr>
      `;
  
      tableBody.insertAdjacentHTML("beforeend", newRow);
      modal.style.display = "none";
      form.reset();
    });
  });
// DETAY MODAL AÇMA
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("detail-btn")) {
      const row = e.target.closest("tr");
      const cells = row.querySelectorAll("td");
  
      document.getElementById("detailName").textContent = cells[0].textContent;
      document.getElementById("detailNumber").textContent = cells[1].textContent;
      document.getElementById("detailRoom").textContent = cells[2].textContent;
      document.getElementById("detailPhone").textContent = cells[3].textContent;
  
      document.getElementById("studentDetailModal").style.display = "flex";
    }
  });
  
  // DETAY MODAL KAPATMA
  document.getElementById("closeDetailModal").addEventListener("click", () => {
    document.getElementById("studentDetailModal").style.display = "none";
  });
// SİL BUTONU İŞLEVİ
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const row = e.target.closest("tr");
  
      // Emin misin kontrolü (isteğe bağlı)
      const confirmDelete = confirm("Bu öğrenciyi silmek istediğinizden emin misiniz?");
      if (confirmDelete) {
        row.remove(); // satırı DOM'dan sil
      }
    }
  });
      
  
  
  