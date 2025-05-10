// GÜVENLİK KONTROLÜ – ROL BAZLI
function checkAuth(expectedRoles = []) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Token yoksa giriş sayfasına yönlendir
  if (!token) {
    window.location.href = "../index.html";
    return;
  }

  // Rol varsa ve erişim listesinde değilse engelle
  if (expectedRoles.length > 0 && !expectedRoles.includes(role)) {
    alert("Bu sayfaya erişim yetkiniz yok.");
    window.location.href = "../index.html";
    return;
  }

  // Token geçerli mi diye API'den doğrula (isteğe bağlı)
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
    .then(user => {
      console.log("Doğrulanan kullanıcı:", user);
    })
    .catch(() => {
      localStorage.clear();
      window.location.href = "../index.html";
    });
}

// ÖĞRENCİ DETAY MODALI – İsteğe bağlı olarak kullanılabilir
function showDetails(id, adSoyad, tcNo, oda, sinif, telefon) {
  document.getElementById("detailName").textContent = adSoyad;
  document.getElementById("detailNumber").textContent = tcNo;
  document.getElementById("detailRoom").textContent = oda;
  document.getElementById("detailPhone").textContent = telefon;
  document.getElementById("detailClass").textContent = sinif;
  document.getElementById("studentDetailModal").style.display = "flex";
}

// MODAL VE ÇIKIŞ OLAYLARI – sadece ilgili sayfalarda aktifleşir
document.addEventListener("DOMContentLoaded", () => {
  // Detay modal kapatma
  const closeBtn = document.getElementById("closeDetailModal");
  if (closeBtn) {
    closeBtn.onclick = () => {
      document.getElementById("studentDetailModal").style.display = "none";
    };
  }

  // Navbar'daki çıkış butonu
  const logoutBtn = document.querySelector(".navbar button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "../index.html";
    });
  }
});
