async function genelAnalizYap() {

  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    document.getElementById("loadingOverlay").style.display = "flex";
    // Tüm verileri çek
    const [
      anketlerRes,
      anketCevapRes,
      etkinliklerRes,
      etkinlikKatilimRes,
      basvurularRes,
      kutuphaneSubeRes,
      kutuphanePlanRes,
      kutuphaneKatilimRes,
      bakimRes
    ] = await Promise.all([
      fetch("https://localhost:7107/api/Anket", { headers }),
      fetch("https://localhost:7107/api/AnketCevap", { headers }),
      fetch("https://localhost:7107/api/Etkinlik", { headers }),
      fetch("https://localhost:7107/api/EtkinlikKatilim", { headers }),
      fetch("https://localhost:7107/api/Basvuru", { headers }),
      fetch("https://localhost:7107/api/KutuphaneSubesi", { headers }),
      fetch("https://localhost:7107/api/KutuphanePlani", { headers }),
      fetch("https://localhost:7107/api/KutuphaneKatilim", { headers }),
      fetch("https://localhost:7107/api/BakimTalep", { headers })
    ]);

    const [anketler, anketCevaplar, etkinlikler, etkinlikKatilimlar, basvurular,kutuphaneSubeler, kutuphanePlanlari, kutuphaneKatilimlar, bakimlar] = await Promise.all([
      anketlerRes.json(),
      anketCevapRes.json(),
      etkinliklerRes.json(),
      etkinlikKatilimRes.json(),
      basvurularRes.json(),
      kutuphaneSubeRes.json(),
      kutuphanePlanRes.json(),
      kutuphaneKatilimRes.json(),
      bakimRes.json()
    ]);

    // 1. Anket Özeti
    const anketOzet = anketler.map(anket => {
      const cevaplar = anketCevaplar.filter(c => c.anketID === anket.anketID);
      const ortPuan = cevaplar.length > 0 ? (cevaplar.reduce((sum, c) => sum + c.puan, 0) / cevaplar.length).toFixed(1) : "Yok";
      return {
        soru: anket.soru,
        cevapSayisi: cevaplar.length,
        ortalamaPuan: ortPuan
      };
    });

    // 2. Etkinlik Özeti
    const etkinlikOzet = etkinlikler
    .filter(e => e.aktifMi)
    .map(etkinlik => {
      const katilanlar = etkinlikKatilimlar.filter(k => k.etkinlikID === etkinlik.etkinlikID);
      const oran = etkinlik.kontenjan > 0
        ? ((katilanlar.length / etkinlik.kontenjan) * 100).toFixed(1)
        : "0";

      let yorum = "Katılım düşük.";
      if (oran >= 75) yorum = "Katılım çok yüksek.";
      else if (oran >= 40) yorum = "Katılım orta düzeyde.";

      return {
        ad: etkinlik.ad,
        kontenjan: etkinlik.kontenjan,
        katilan: katilanlar.length,
        oran: `${oran}%`,
        yorum
      };
    });

    // 3. Başvuru Özeti
    const aktifBasvurular = basvurular.filter(b => b.durum === "Bekliyor");
    const pasifBasvurular = basvurular.filter(b => b.durum === "Onaylandı" || b.durum === "Reddedildi");

    const basvuruOzet = {
      toplam: basvurular.length,
      aktif: aktifBasvurular.length,
      pasif: pasifBasvurular.length
    };

    // 4. Kütüphane Özeti (sadece son 7 gün)
    const yediGunOnce = new Date();
    yediGunOnce.setDate(yediGunOnce.getDate() - 7);

    const sonHaftaPlanlari = kutuphanePlanlari.filter(p => {
      const planTarih = new Date(p.tarih);
      return planTarih >= yediGunOnce && p.aktifMi;
    });
    
    const kutuphaneOzet = sonHaftaPlanlari.map(plan => {
      const katilanlar = kutuphaneKatilimlar.filter(k => k.kutuphanePlanID === plan.kutuphanePlanID);
      const sube = kutuphaneSubeler.find(s => s.kutuphaneSubeID === plan.kutuphaneSubeID);
    
      return {
        kutuphaneAdi: sube?.ad || "Bilinmiyor",
        tarih: plan.tarih.split("T")[0],
        saatAraligi: plan.saatAraligi,
        katilanSayisi: katilanlar.length
      };
    });

    // 5. Bakım Talebi Özeti
const aktifBakimlar = bakimlar.filter(b => b.talepDurumu === false);
const pasifBakimlar = bakimlar.filter(b => b.talepDurumu === true);

const bakimOzet = {
  toplam: bakimlar.length,
  aktif: aktifBakimlar.length,
  pasif: pasifBakimlar.length,
  aktifDetaylar: aktifBakimlar.map(b => `- ${b.baslik}: ${b.aciklama}`)
};

    // PAYLOAD
    const payload = {
      anketler: anketOzet,
      etkinlikler: etkinlikOzet,
      basvurular: basvuruOzet,
      kutuphane: kutuphaneOzet,
      bakimTalepleri: bakimOzet
    };

    // Flask AI servisine POST at
    const aiRes = await fetch("http://127.0.0.1:5000/api/ozet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const aiJson = await aiRes.json();

    if (aiJson.hata) {
      document.getElementById("loadingOverlay").style.display = "none";
      alert("AI analiz hatası: " + aiJson.hata);
      return;
    }

    // Modalda göster
    document.getElementById("aiAnalizMesaji").textContent = aiJson.mesaj;
    document.getElementById("aiAnalizModal").style.display = "block";


  } catch (err) {
    document.getElementById("loadingOverlay").style.display = "none";
    console.error("Genel analiz hatası:", err);
    alert("Genel analiz sırasında bir hata oluştu.");
  }
}

// Modal kontrolü
document.getElementById("closeAiModal").onclick = () => {
  document.getElementById("aiAnalizModal").style.display = "none";
  document.getElementById("loadingOverlay").style.display = "none";
};

window.onclick = function (event) {
  const modal = document.getElementById("aiAnalizModal");
  if (event.target === modal) {
    modal.style.display = "none";
    document.getElementById("loadingOverlay").style.display = "none";
  }
};
