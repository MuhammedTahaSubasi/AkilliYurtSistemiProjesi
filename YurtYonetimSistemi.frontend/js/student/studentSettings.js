// Kullanıcı Bilgilerini Getir
function getUserProfile() {
    const token = localStorage.getItem('token');
  
    fetch('https://localhost:7107/api/Kullanici/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Profil bilgileri getirilemedi.');
        }
        return res.json();
      })
      .then(data => {
        document.getElementById('ad').value = data.ad || '';
        document.getElementById('soyad').value = data.soyad || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('telefon').value = data.telefon || '';
      })
      .catch(err => {
        console.error('Profil bilgileri alınamadı:', err);
      });
  }
  
  // Şifre Değiştirme
  document.getElementById('password-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const mevcutSifre = document.getElementById('mevcutSifre').value.trim();
    const yeniSifre = document.getElementById('yeniSifre').value.trim();
    const yeniSifreTekrar = document.getElementById('yeniSifreTekrar').value.trim();
    const token = localStorage.getItem('token');
  
    if (yeniSifre !== yeniSifreTekrar) {
      alert('Yeni şifreler uyuşmuyor!');
      return;
    }
  
    if (yeniSifre.length < 6) {
      alert('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }
  
    fetch('https://localhost:7107/api/Kullanici/sifre-degistir', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mevcutSifre: mevcutSifre,
        yeniSifre: yeniSifre
      })
    })
      .then(res => {
        if (res.ok) {
          alert('Şifre başarıyla değiştirildi.');
          window.location.href = "../../index.html"; 
        } else {
          return res.text().then(text => {
            throw new Error(text);
          });
        }
      })
      .catch(err => {
        console.error('Şifre değiştirme hatası:', err);
        alert('Hata: ' + err.message);
      });
  });
  
  // Sayfa yüklenince kullanıcı bilgilerini çek
  getUserProfile();
  