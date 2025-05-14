const kullaniciId = localStorage.getItem("kullaniciId");

if (!kullaniciId) {
  alert("Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
  window.location.href = "../index.html";
}

window.addEventListener("DOMContentLoaded", () => {
  loadKutuphaneler();
});
//listele
async function listelePlanlar() {
    const tbody = document.getElementById("planlarTablo");
    tbody.innerHTML = "";
  
    const secilenKutuphaneId = document.getElementById("kutuphaneSec")?.value;
    if (!secilenKutuphaneId) return;
  
    const res = await fetch("https://localhost:7107/api/KutuphanePlani", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  
    const data = await res.json();
  
    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);
    const yediGunSonra = new Date(bugun);
    yediGunSonra.setDate(bugun.getDate() + 6);
  
    const aktifPlanlar = data.filter((plan) => {
      const planTarihi = new Date(plan.tarih);
      planTarihi.setHours(0, 0, 0, 0);
      return (
        plan.aktifMi &&
        String(plan.kutuphaneSubeID) === String(secilenKutuphaneId) &&
        planTarihi >= bugun &&
        planTarihi <= yediGunSonra
      );
    });
  
    if (aktifPlanlar.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4">Bu haftaya ait aktif plan bulunamadı.</td></tr>`;
      return;
    }
  
    // Tarih + saat bazlı sıralama
    aktifPlanlar.sort((a, b) => {
        const tarihA = a.tarih.split("T")[0];
        const tarihB = b.tarih.split("T")[0];
      
        const [yA, mA, dA] = tarihA.split("-").map(Number);
        const [saatA, dakikaA] = a.saatAraligi.split(" - ")[0].trim().split(":").map(Number);
        const dateTimeA = new Date(yA, mA - 1, dA, saatA, dakikaA);
      
        const [yB, mB, dB] = tarihB.split("-").map(Number);
        const [saatB, dakikaB] = b.saatAraligi.split(" - ")[0].trim().split(":").map(Number);
        const dateTimeB = new Date(yB, mB - 1, dB, saatB, dakikaB);
      
        return dateTimeA - dateTimeB;
      });
      
  
    for (const plan of aktifPlanlar) {
      const [katilanRes, subeRes] = await Promise.all([
        fetch(`https://localhost:7107/api/KutuphaneKatilim/KutuphaneGore/${plan.kutuphanePlanID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch(`https://localhost:7107/api/KutuphaneSubesi/${plan.kutuphaneSubeID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
  
      const katilanlar = await katilanRes.json();
      const sube = await subeRes.json();
      const kapasite = sube.kapasite;
  
      const katildiMi = katilanlar.some((k) => k.kullaniciID === kullaniciId);
      const kapasiteDolu = katilanlar.length >= kapasite;
  
      let btnLabel = "";
      let btnClass = "";
      let btnDisabled = false;
      let clickFn = "";
  
      if (kapasiteDolu && !katildiMi) {
        btnLabel = "Dolu";
        btnClass = "disabled-btn";
        btnDisabled = true;
      } else if (katildiMi) {
        btnLabel = "Katılımı İptal Et";
        btnClass = "delete-btn";
        clickFn = `iptalEt('${plan.kutuphanePlanID}')`;
      } else {
        btnLabel = "Katıl";
        btnClass = "add-btn";
        clickFn = `katil('${plan.kutuphanePlanID}')`;
      }
      
  
      const tarihStr = new Date(plan.tarih).toLocaleDateString("tr-TR");
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${tarihStr}</td>
        <td>${plan.gun}</td>
        <td>${plan.saatAraligi}</td>
        <td>
          <button class="${btnClass}" ${btnDisabled ? "disabled" : ""} onclick="${clickFn}">${btnLabel}</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  }

// Seansa katılma
async function katil(planId) {
  try {
    // 1. Seçilen planı çek
    const planRes = await fetch(`https://localhost:7107/api/KutuphanePlani/${planId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!planRes.ok) throw new Error("Plan bilgisi alınamadı");
    const plan = await planRes.json();
    // 2. Kapasite kontrolü
    const subeRes = await fetch(`https://localhost:7107/api/KutuphaneSubesi/${plan.kutuphaneSubeID}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!subeRes.ok) throw new Error("Kütüphane kapasitesi alınamadı");
    const sube = await subeRes.json();
    const kapasite = sube.kapasite;

    const katilimRes = await fetch(`https://localhost:7107/api/KutuphaneKatilim/KutuphaneGore/${planId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!katilimRes.ok) throw new Error("Katılım listesi alınamadı");
    const katilanlar = await katilimRes.json();

    if (katilanlar.length >= kapasite) {
      alert(`Bu seans dolu. Maksimum kapasite (${kapasite}) dolmuş.`);
      return;
    }
    // 3. Tüm katılımları çek (kendi katılımların için çakışma kontrolü)
    const tumKatilimlarRes = await fetch("https://localhost:7107/api/KutuphaneKatilim", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!tumKatilimlarRes.ok) throw new Error("Tüm katılımlar alınamadı");
    const tumKatilimlar = await tumKatilimlarRes.json();

    const kullanicininKatilimlari = tumKatilimlar.filter(k => k.kullaniciID === kullaniciId);

    const secilenTarih = plan.tarih.split("T")[0];
    const secilenSaat = plan.saatAraligi.trim();

    for (const kat of kullanicininKatilimlari) {
      const katPlanRes = await fetch(`https://localhost:7107/api/KutuphanePlani/${kat.kutuphanePlanID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const katPlan = await katPlanRes.json();

      const katTarih = katPlan.tarih.split("T")[0];
      const katSaat = katPlan.saatAraligi.trim();

      if (
        katTarih === secilenTarih &&
        katSaat === secilenSaat &&
        katPlan.kutuphaneSubeID !== plan.kutuphaneSubeID
      ) {
        alert("⚠️ Aynı gün ve saat aralığında başka bir kütüphane planına zaten katıldınız.");
        return;
      }
    }
    // 4. Katılım kaydı oluştur
    const res = await fetch("https://localhost:7107/api/KutuphaneKatilim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ kullaniciID: kullaniciId, kutuphanePlanID: planId }),
    });

    if (!res.ok) throw new Error("Katılım başarısız");
    alert("Seansa başarıyla katıldınız!");
    listelePlanlar();
  } catch (err) {
    console.error("Katılma hatası:", err);
    alert("Bir hata oluştu: " + err.message);
  }
}

//Seansı iptal etme 
function iptalEt(planId) {
    fetch(`https://localhost:7107/api/KutuphaneKatilim/${kullaniciId}/${planId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("İptal başarısız.");
        alert("Katılım başarıyla iptal edildi.");
        listelePlanlar();
      })
      .catch((err) => {
        console.error("İptal hatası:", err);
        alert("Bir hata oluştu: " + err.message);
      });
  }
  //select doldur kütüphane
  function loadKutuphaneler() {
    fetch("https://localhost:7107/api/KutuphaneSubesi", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP hata: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const select = document.getElementById("kutuphaneSec");
        select.innerHTML = ""; // Temizle
  
        data.forEach((k) => {
          const option = document.createElement("option");
          option.value = k.kutuphaneSubeID;
          option.textContent = k.ad;
          select.appendChild(option);
        });
  
        // Otomatik ilk değeri seç
        if (data.length > 0) {
          select.value = data[0].kutuphaneSubeID;
  
          //  Seçim yaptıktan sonra çağır
          listelePlanlar();
        }
  
        // Seçim değişirse tekrar yükle
        select.addEventListener("change", listelePlanlar);
      })
      .catch((err) => {
        console.error("Kütüphane listesi yüklenemedi :", err);
        alert("Kütüphane listesi yüklenemedi ");
      });
  }
  
  
  
  
  