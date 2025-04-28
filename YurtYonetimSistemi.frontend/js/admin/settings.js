// Kullanıcı Bilgilerini Getir
function getUserProfile() {
    const token = localStorage.getItem('token');
    const adInput = document.getElementById('ad');
    const soyadInput = document.getElementById('soyad');
    const emailInput = document.getElementById('email');
    const telefonInput = document.getElementById('telefon');
  
    fetch('https://localhost:7107/api/Kullanici/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Profil bilgileri getirilemedi');
        }
        return res.json();
      })
      .then(data => {
        adInput.value = data.ad || '';
        soyadInput.value = data.soyad || '';
        emailInput.value = data.email || '';
        telefonInput.value = data.telefon || '';
      })
      .catch(err => {
        console.error('Profil bilgileri alınamadı:', err);
      });
  }
  
  // Şifre Değiştirme Formu
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
          // logout yap
           localStorage.removeItem('token');
           window.location.href = '../../index.html';
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
  
  // Sayfa yüklenince bilgiler getirilsin
  getUserProfile();
  