// listeleme 
function listeleMenuler() {
    const tbody = document.getElementById("menuListesi");
    tbody.innerHTML = "";
  
    fetch("https://localhost:7107/api/YemekhaneMenusu", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5">Henüz menü eklenmemiş.</td></tr>`;
          return;
        }
        const ogunSirasi = { "Kahvaltı": 1, "Öğle": 2, "Akşam": 3 };
        data.sort((a, b) => {
          const tarihA = new Date(a.tarih);
          const tarihB = new Date(b.tarih);
  
          if (tarihA - tarihB !== 0) {
            return tarihA - tarihB;
          }
  
          return ogunSirasi[a.ogun] - ogunSirasi[b.ogun];
        });
        data.forEach(menu => {
          const tarih = new Date(menu.tarih);
          const gunAdi = tarih.toLocaleDateString("tr-TR", { weekday: "long" });
  
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${tarih.toLocaleDateString("tr-TR")}</td>
            <td>${gunAdi}</td>
            <td>${menu.ogun}</td>
            <td>${menu.yemekler}</td>
            <td>
                <button class="detail-btn" onclick="menuGuncelleModalAc('${menu.menuID}', '${menu.tarih}', '${menu.ogun}', \`${menu.yemekler}\`)">Düzenle</button>
                <button class="delete-btn" onclick="menuSil('${menu.menuID}')">Sil</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => {
        console.error("Menüler alınamadı:", err);
        tbody.innerHTML = `<tr><td colspan="5">Menüler yüklenirken hata oluştu.</td></tr>`;
      });
  }
  
  
  //ekle menü
  function menuEkle() {
    const tarih = document.getElementById("menuTarih").value;
    const ogun = document.getElementById("menuOgun").value;
    const yemekler = document.getElementById("menuYemekler").value;
  
    fetch("https://localhost:7107/api/YemekhaneMenusu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        tarih,
        ogun,
        yemekler
      })
    })
      .then(res => {
        if (!res.ok) throw res; 
        return res.json();
      })
      .then(() => {
        alert("Menü başarıyla eklendi.");
        document.getElementById("menuForm").reset();
        modalKapat("menuModal");
        listeleMenuler(); 
      })
      .catch(async err => {
        let errorMessage = "Menü eklenemedi.";
  
        if (err instanceof Response) {
          const errorText = await err.text(); 
          errorMessage = errorText || errorMessage;
        }
  
        console.error("Menü ekleme hatası:", errorMessage);
        alert("Bir hata oluştu: " + errorMessage);
      });
  }
  
  //menü sil
  function menuSil(id) {
    if (!confirm("Bu menüyü silmek istediğinize emin misiniz?")) return;
  
    fetch(`https://localhost:7107/api/YemekhaneMenusu/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Silme başarısız.");
        alert("Menü başarıyla silindi.");
        listeleMenuler();
      })
      .catch(err => {
        console.error("Menü silme hatası:", err);
        alert("Silme işlemi sırasında bir hata oluştu.");
      });
  }
  
  // menü güncelle 
  function menuGuncelle() {
    const id = document.getElementById("menuGuncelleForm").dataset.menuId;
    const tarih = document.getElementById("updateMenuTarih").value;
    const ogun = document.getElementById("updateMenuOgun").value;
    const yemekler = document.getElementById("updateMenuYemekler").value;
  
    fetch(`https://localhost:7107/api/YemekhaneMenusu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        menuID: id,
        tarih,
        ogun,
        yemekler
      })
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.text();  
      })
      .then(() => {
        alert("Menü başarıyla güncellendi.");
        modalKapat("menuGuncelleModal");
        listeleMenuler();
      })
      .catch(async err => {
        let errorMessage = "Güncelleme başarısız.";
  
        if (err instanceof Response) {
          const errorText = await err.text();
          errorMessage = errorText || errorMessage;
        }
  
        alert("Bir hata oluştu: " + errorMessage);
      });
  }
  
  
  //menü güncelle modal aç
  function menuGuncelleModalAc(id, tarih, ogun, yemekler) {
    modalAc("menuGuncelleModal");
  
    document.getElementById("updateMenuTarih").value = tarih.split("T")[0];
    document.getElementById("updateMenuOgun").value = ogun;
    document.getElementById("updateMenuYemekler").value = yemekler;
  
    // Güncellenecek menü ID’sini formun data attribute'una kaydet
    document.getElementById("menuGuncelleForm").dataset.menuId = id;
  }
  
  //modal aç kapat
  function modalAc(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "flex";
  }
  
  function modalKapat(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
  }
  
  //fonksiyonlar 
  document.addEventListener("DOMContentLoaded", () => {
    listeleMenuler();
  });
  
  document.getElementById("menuForm").addEventListener("submit", function (e) {
    e.preventDefault();
    menuEkle();
  });
  document.getElementById("menuGuncelleForm").addEventListener("submit", function (e) {
    e.preventDefault();
    menuGuncelle();
  });
  
  