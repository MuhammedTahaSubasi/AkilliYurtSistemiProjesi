document.addEventListener("DOMContentLoaded", () => {
  // GÜVENLİK KONTROLÜ
  checkAuth();

  // DETAY MODALI KAPATMA
  const closeBtn = document.getElementById("closeDetailModal");
  if (closeBtn) {
    closeBtn.onclick = () => {
      document.getElementById("studentDetailModal").style.display = "none";
    };
  }
});

// FONKSİYONLAR AŞAĞIDA KALSIN — çağrılar yukarıda yapılıyor
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
    })
    .catch(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "index.html";
    });
}

function showDetails(id, adSoyad, tcNo, oda, sinif, telefon) {
  document.getElementById("detailName").textContent = adSoyad;
  document.getElementById("detailNumber").textContent = tcNo;
  document.getElementById("detailRoom").textContent = oda;
  document.getElementById("detailPhone").textContent = telefon;
  document.getElementById("detailClass").textContent = sinif;
  document.getElementById("studentDetailModal").style.display = "flex";
}
//cikis butonu 
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".navbar button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "index.html";
    });
  }
});
