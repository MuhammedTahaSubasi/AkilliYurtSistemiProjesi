document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const sidebarElement = document.getElementById("sidebar");

  if (!role || !sidebarElement) return;

  let sidebarHTML = `
    <div class="sidebar">
      <h2>Yurt Paneli</h2>
      <ul>
  `;

  if (role === "Admin") {
    sidebarHTML += `
      <li><a href="Dashboard.html">🏠 Dashboard</a></li>
      <li><a href="Students.html">👨‍🎓 Öğrenciler</a></li>
      <li><a href="Surveys.html">📋 Anketler</a></li>
      <li><a href="Rooms.html">🛏️ Odalar</a></li>
      <li><a href="Classes.html">🏫 Sınıflar</a></li>
      <li><a href="payments.html">💳 Ödeme Takibi</a></li>
      <li><a href="applications.html">📝 Başvurular</a></li>
      <li><a href="entryLogs.html">🚪 Giriş Çıkış</a></li>
    `;
  }

  if (role === "Admin" || role === "Personel") {
    sidebarHTML += `
      <li><a href="maintenance-requests.html">🛠️ Bakım Talepleri</a></li>
      <li><a href="Events.html">🎉 Etkinlikler</a></li>
      <li><a href="cafeteria.html">🍽️ Yemekhane</a></li>
      <li><a href="laundry.html">🧺 Çamaşırhane</a></li>
      <li><a href="library.html">📚 Kütüphane</a></li>
    `;
  }

  sidebarHTML += `<li><a href="Settings.html">⚙️ Ayarlar</a></li></ul></div>`;
  sidebarElement.innerHTML = sidebarHTML;
});
