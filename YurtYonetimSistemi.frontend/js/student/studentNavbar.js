const kullaniciId = localStorage.getItem("kullaniciId");

document.getElementById("navbar").innerHTML = `
  <div class="navbar">
    <h1>Hoş geldiniz...</h1>
    <button onclick="logout()" class="blue-btn">Çıkış Yap</button>
  </div>
`;

async function getKullaniciBilgisi() {
  try {
    const response = await fetch(`https://localhost:7107/api/Kullanici/${kullaniciId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Kullanıcı bilgisi alınamadı");

    const data = await response.json();
    document.querySelector("#navbar h1").innerText = `Hoş geldiniz, ${data.ad} ${data.soyad}`;
  } catch (error) {
    console.error("Navbar yüklenemedi:", error);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}

getKullaniciBilgisi();
