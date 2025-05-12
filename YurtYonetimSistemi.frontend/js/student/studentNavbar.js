document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const kullaniciId = localStorage.getItem("kullaniciId");

  if (!token || !kullaniciId) return;

  getKullaniciBilgisi(token, kullaniciId);
});

async function getKullaniciBilgisi(token, kullaniciId) {
  try {
    const response = await fetch(`https://localhost:7107/api/Kullanici/${kullaniciId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Kullanıcı bilgisi alınamadı");

    const data = await response.json();

    const navbarEl = document.getElementById("navbar");
    if (!navbarEl) return;

    navbarEl.innerHTML = `
      <div class="navbar">
        <h1>Hoş geldiniz, ${data.ad} ${data.soyad}</h1>
        <button onclick="logout()" class="blue-btn">Çıkış Yap</button>
      </div>
    `;
  } catch (error) {
    console.error("Navbar yüklenemedi:", error);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}
