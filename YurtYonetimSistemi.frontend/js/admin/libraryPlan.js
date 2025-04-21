// URL'den subeId al
const urlParams = new URLSearchParams(window.location.search);
const subeId = urlParams.get("subeId");

if (!subeId) {
  alert("Geçersiz veya eksik subeId parametresi.");
  window.location.href = "library.html";
}

// Sayfa yüklendiğinde planları listele
window.addEventListener("DOMContentLoaded", () => {
  listelePlanlar();
  
  // Dropdown filtre değişikliğinde yeniden listele
  document.getElementById("planFiltre").addEventListener("change", listelePlanlar);
  
  // Plan formuna tarih kontrolü ekle
  const planTarihInput = document.getElementById("planTarih");
  if (planTarihInput) {
    // Minimum tarih olarak bugünü ayarla
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    planTarihInput.setAttribute("min", todayFormatted);
    planTarihInput.value = todayFormatted;
  }
  
  // Haftalık şablon için gerekli eventListener'ları ekle
  document.getElementById("haftalikSablonEkle").addEventListener("click", haftalikSablonEkle);
  

});

// Plan başlangıç zamanını hesapla (tarih + saat)
function getPlanBaslangicZamani(plan) {
  const [saatStr] = plan.saatAraligi.split(" - ");
  let saatFormatli = saatStr;
  
  // Saat formatını kontrol et (09:00 veya 9:00 olabilir)
  if (!saatStr.includes(":")) {
    saatFormatli = saatStr + ":00";
  } else if (saatStr.split(":")[1].length === 0) {
    saatFormatli = saatStr + "00";
  }
  
  // Tarih formatını düzenle
  let tarihStr = plan.tarih;
  if (typeof tarihStr === 'string' && tarihStr.includes('T')) {
    tarihStr = tarihStr.split('T')[0];
  }
  
  const tarihSaatStr = `${tarihStr}T${saatFormatli}`;
  return new Date(tarihSaatStr);
}

// Planları listele
function listelePlanlar() {
  const tbody = document.getElementById("planListesi");
  tbody.innerHTML = "";
  const filtre = document.getElementById("planFiltre").value;

  fetch("https://localhost:7107/api/KutuphanePlani", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      let planlar = data.filter(p => p.kutuphaneSubeID === subeId);
      const now = new Date();

      // Otomatik olarak geçmiş planları pasif yap
      planlar.forEach(plan => {
        const planZamani = getPlanBaslangicZamani(plan);
        if (planZamani < now && plan.aktifMi) {
          // Sunucuda güncelle
          plan.aktifMi = false;
          fetch(`https://localhost:7107/api/KutuphanePlani/${plan.kutuphanePlanID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(plan)
          }).catch(err => console.error("Plan pasifleştirilemedi:", err));
        }
      });

      // Filtreleme işlemi
      if (filtre === "aktif") {
        planlar = planlar.filter(p => {
          const planZamani = getPlanBaslangicZamani(p);
          return p.aktifMi && planZamani >= now;
        });
      } else if (filtre === "pasif") {
        planlar = planlar.filter(p => {
          const planZamani = getPlanBaslangicZamani(p);
          return planZamani < now || !p.aktifMi;
        });
      }

      // Tarihe ve sonra saate göre sırala
      planlar.sort((a, b) => {
        const dateA = new Date(a.tarih);
        const dateB = new Date(b.tarih);
        
        // Önce tarihe göre sırala
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        
        // Tarihler aynıysa saate göre sırala
        const timeA = a.saatAraligi.split(" - ")[0];
        const timeB = b.saatAraligi.split(" - ")[0];
        
        // Saat formatını düzenle ve karşılaştır
        const timePartsA = timeA.split(":");
        const timePartsB = timeB.split(":");
        
        const hourA = parseInt(timePartsA[0]);
        const hourB = parseInt(timePartsB[0]);
        
        if (hourA < hourB) return -1;
        if (hourA > hourB) return 1;
        
        const minuteA = timePartsA.length > 1 ? parseInt(timePartsA[1]) : 0;
        const minuteB = timePartsB.length > 1 ? parseInt(timePartsB[1]) : 0;
        
        return minuteA - minuteB;
      });

      if (planlar.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Gösterilecek plan bulunamadı.</td></tr>`;
        return;
      }

      planlar.forEach(plan => {
        const tarihStr = new Date(plan.tarih).toLocaleDateString("tr-TR");
        const tr = document.createElement("tr");
        const planZamani = getPlanBaslangicZamani(plan);
        
        // Görsel için sınıf ekle
        let statusClass = "pasif-plan";
        if (plan.aktifMi && planZamani >= new Date()) {
          statusClass = "aktif-plan";
        }
        
        tr.className = statusClass;
        tr.innerHTML = `
          <td>${tarihStr}</td>
          <td>${plan.gun}</td>
          <td>${plan.saatAraligi}</td>
          <td>
            <button onclick='acGuncelleModal(${JSON.stringify(plan).replace(/"/g, "&quot;")})'>Düzenle</button>
            <button onclick='gosterKatilanlar("${plan.kutuphanePlanID}")'>Katılanları Gör</button>
            <button onclick='silPlan("${plan.kutuphanePlanID}")'>Sil</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      

    })
    .catch(err => {
      console.error("Planlar yüklenemedi:", err);
      tbody.innerHTML = `<tr><td colspan="4">Bir hata oluştu.</td></tr>`;
    });
}

// Plan ekleme
document.getElementById("planForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const tarihStr = document.getElementById("planTarih").value;
  const saatAraligi = document.getElementById("planSaat").value;

  // Geçmiş tarih kontrolü
  const secilenTarih = new Date(tarihStr);
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);

  if (secilenTarih < bugun) {
    alert("Geçmiş tarihe plan eklenemez!");
    return;
  }

  //  Aynı tarih + saat çakışmasını kontrol et
  const res = await fetch("https://localhost:7107/api/KutuphanePlani", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  const plans = await res.json();
  const ayniGunAyniSaatteVar = plans.some(p =>
    p.kutuphaneSubeID === subeId &&
    p.tarih.split("T")[0] === tarihStr &&
    p.saatAraligi.trim() === saatAraligi.trim()
  );

  if (ayniGunAyniSaatteVar) {
    alert("Bu gün ve saat aralığında zaten bir plan var!");
    return;
  }

  const tarih = new Date(tarihStr);
  const gunler = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const gun = gunler[tarih.getDay()];

  fetch("https://localhost:7107/api/KutuphanePlani", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ gun, saatAraligi, aktifMi: true, kutuphaneSubeID: subeId, tarih: tarihStr })
  })
    .then(res => {
      if (!res.ok) throw new Error("Plan eklenemedi");
      alert("Plan başarıyla eklendi.");
      modalKapat("planModal");
      document.getElementById("planForm").reset();
      document.getElementById("planTarih").value = new Date().toISOString().split('T')[0];
      listelePlanlar();
    })
    .catch(err => {
      console.error("Hata:", err);
      alert("Hata oluştu: " + err.message);
    });
});

// Haftalık şablon ekleme
async function haftalikSablonEkle() {
  const baslangicTarihStr = document.getElementById("sablonBaslangic").value;
  const hafta = parseInt(document.getElementById("sablonHafta").value);
  const saatAraligi = document.getElementById("sablonSaat").value;

  if (!baslangicTarihStr || isNaN(hafta) || !saatAraligi) {
    alert("Lütfen tüm alanları doldurun!");
    return;
  }

  const baslangicTarih = new Date(baslangicTarihStr);
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);

  if (baslangicTarih < bugun) {
    alert("Geçmiş tarihe plan eklenemez!");
    return;
  }

  const gunler = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const secilenGunler = Array.from(document.querySelectorAll('#sablonGunler input:checked')).map(cb => cb.value);

  if (secilenGunler.length === 0) {
    alert("En az bir gün seçmelisiniz!");
    return;
  }

  const mevcutPlanlar = await fetch("https://localhost:7107/api/KutuphanePlani", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }).then(r => r.json());

  const planlar = [];
  const baslangic = new Date(baslangicTarih);

  for (let h = 0; h < hafta; h++) {
    for (let i = 0; i < 7; i++) {
      const gunTarihi = new Date(baslangic);
      gunTarihi.setDate(baslangic.getDate() + (h * 7) + i);
      const gunAdi = gunler[gunTarihi.getDay()];
      const tarihStr = gunTarihi.toISOString().split("T")[0];

      const cakisanVar = mevcutPlanlar.some(p =>
        p.kutuphaneSubeID === subeId &&
        p.tarih.split("T")[0] === tarihStr &&
        p.saatAraligi.trim() === saatAraligi.trim()
      );

      if (secilenGunler.includes(gunAdi) && !cakisanVar) {
        planlar.push({
          gun: gunAdi,
          saatAraligi: saatAraligi,
          aktifMi: true,
          kutuphaneSubeID: subeId,
          tarih: tarihStr
        });
      }
    }
  }

  let basariliEklenen = 0;
  let hataAlinan = 0;

  const eklemePromises = planlar.map(plan => 
    fetch("https://localhost:7107/api/KutuphanePlani", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(plan)
    })
    .then(res => {
      if (res.ok) basariliEklenen++;
      else hataAlinan++;
      return res;
    })
    .catch(() => {
      hataAlinan++;
    })
  );

  Promise.all(eklemePromises).then(() => {
    if (basariliEklenen === 0 && hataAlinan === 0) {
      alert("Tüm planlar zaman çakışması nedeniyle eklenemedi.");
    } else {
      alert(`${basariliEklenen} plan başarıyla eklendi. ${hataAlinan} plan zaman çakışması nedeniyle eklenemedi.`);
    }
  
    modalKapat("sablonModal");
    document.getElementById("sablonForm").reset();
    document.getElementById("sablonBaslangic").value = new Date().toISOString().split('T')[0];
  
    setTimeout(() => {
      listelePlanlar();
      window.scrollTo(0, 0);
    }, 500);
  });  
}


// Plan güncelleme
document.getElementById("planGuncelleForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = e.target.dataset.planId;
  const tarihStr = document.getElementById("guncelleTarih").value;
  const saatAraligi = document.getElementById("guncelleSaat").value;
  const aktifMi = document.getElementById("guncelleAktifMi").checked;
  
  // Geçmiş tarih kontrolü
  const secilenTarih = new Date(tarihStr);
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  
  let sonAktifMi = aktifMi;
  
  if (secilenTarih < bugun && aktifMi) {
    if (!confirm("Geçmiş tarihe aktif plan atanamaz. Plan pasif olarak güncellenecek. Devam etmek istiyor musunuz?")) {
      return;
    }
    // Geçmiş tarihler için otomatik pasif yap
    sonAktifMi = false;
  }
  
  const tarih = new Date(tarihStr);
  const gunler = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const gun = gunler[tarih.getDay()];

  fetch(`https://localhost:7107/api/KutuphanePlani/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ 
      kutuphanePlanID: id, 
      gun, 
      saatAraligi, 
      aktifMi: sonAktifMi, 
      kutuphaneSubeID: subeId, 
      tarih: tarihStr 
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Güncelleme başarısız");
      alert("Plan güncellendi.");
      modalKapat("planGuncelleModal");
      listelePlanlar();
    })
    .catch(err => {
      console.error("Güncelleme hatası:", err);
      alert("Hata: " + err.message);
    });
});

// Katılanları göster
function gosterKatilanlar(planId) {
  const tbody = document.getElementById("katilimListesi");
  tbody.innerHTML = "";

  fetch(`https://localhost:7107/api/KutuphaneKatilim/KutuphaneGore/${planId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2">Henüz katılım yok.</td></tr>`;
        return;
      }

      data.forEach(k => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${k.ad || "-"} ${k.soyad || ""}</td>
        `;
        tbody.appendChild(tr);
      });
      modalAc("katilimModal");
    })
    .catch(err => {
      console.error("Katılımcılar yüklenemedi:", err);
      alert("Katılımcı listesi alınamadı.");
    });
}

// Plan silme
function silPlan(id) {
  if (!confirm("Bu planı silmek istediğinizden emin misiniz?")) return;

  fetch(`https://localhost:7107/api/KutuphanePlani/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => {
      if (res.status === 204 || res.ok) {
        alert("Plan silindi.");
        // Silinen planı DOM'dan kaldır
        const btn = document.querySelector(`button[onclick*="${id}"]`);
        const row = btn?.closest("tr");
        if (row) row.remove();
        // Veya küçük bir gecikmeyle listeyi yenile
        setTimeout(() => {
          listelePlanlar();
        }, 100);
      } else {
        throw new Error(`Yanıt durumu: ${res.status}`);
      }
    })
    .catch(err => {
      console.error("Silme hatası:", err);
      alert("Silme sırasında bir hata oluştu.");
    });
}

// Güncelleme modalı aç
function acGuncelleModal(plan) {
  modalAc("planGuncelleModal");
  
  // Tarih formatı: "2023-04-21" şeklinde olmalı
  let tarihStr = plan.tarih;
  if (tarihStr.includes('T')) {
    tarihStr = tarihStr.split('T')[0];
  }
  
  document.getElementById("guncelleTarih").value = tarihStr;
  document.getElementById("guncelleSaat").value = plan.saatAraligi;
  document.getElementById("guncelleAktifMi").checked = plan.aktifMi;
  document.getElementById("planGuncelleForm").dataset.planId = plan.kutuphanePlanID;
  
  // Geçmiş tarih kontrolü
  const secilenTarih = new Date(tarihStr);
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  
  if (secilenTarih < bugun) {
    document.getElementById("guncelleAktifMi").disabled = true;
    document.getElementById("guncelleAktifMiUyari").style.display = "block";
  } else {
    document.getElementById("guncelleAktifMi").disabled = false;
    document.getElementById("guncelleAktifMiUyari").style.display = "none";
  }
}

// Modal aç/kapat
function modalAc(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "flex";
  
}

function modalKapat(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}



// Event listeners
document.getElementById("closeKatilimModal").onclick = () => modalKapat("katilimModal");
document.getElementById("closeGuncelleModal").onclick = () => modalKapat("planGuncelleModal");
document.getElementById("closePlanModal").onclick = () => modalKapat("planModal");
document.getElementById("closeSablonModal").onclick = () => modalKapat("sablonModal");
document.getElementById("btnSablonGoster").onclick = () => modalAc("sablonModal");