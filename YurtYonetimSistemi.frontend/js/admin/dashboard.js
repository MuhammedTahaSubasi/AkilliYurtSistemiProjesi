// ÖĞRENCİ SAYISI
async function fetchOgrenciSayisi() {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch("https://localhost:7107/api/Kullanici", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await response.json();
  
      const ogrenciSayisi = data.filter(k => k.rol?.rolAd === "Öğrenci").length;
      return ogrenciSayisi;
  
    } catch (error) {
      console.error("Öğrenci sayısı alınamadı:", error);
      return 0;
    }
  }
  
  fetchOgrenciSayisi().then(ogrenciSayisi => {
    const ctx = document.getElementById('ogrenciChart').getContext('2d');
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Toplam Öğrenci'],
        datasets: [{
          label: 'Öğrenci Sayısı',
          data: [ogrenciSayisi],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
            y: {
              beginAtZero: true,
              suggestedMax: Math.ceil((ogrenciSayisi + 1) / 10) * 10
            }
          },
        plugins: {
          legend: { display: false }
        }
      }
    });
  });  

// ODA DOLULUK
async function fetchOdaBazliDolulukVerisi() {
    const token = localStorage.getItem("token");
  
    try {
      const odaRes = await fetch("https://localhost:7107/api/Oda", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const odalar = await odaRes.json();
  
      const kullaniciRes = await fetch("https://localhost:7107/api/Kullanici", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const kullanicilar = await kullaniciRes.json();
  
      // Öğrenci başına odaID sayacı
      const ogrenciOdaSayaci = {};
      kullanicilar.forEach(k => {
        if (k.rol?.rolAd === "Öğrenci" && k.oda?.odaID) {
          const odaID = k.oda.odaID;
          ogrenciOdaSayaci[odaID] = (ogrenciOdaSayaci[odaID] || 0) + 1;
        }
      });
  
      // Oda verilerini grupla
      const odaVerileri = odalar.map(oda => {
        const ogrenciSayisi = ogrenciOdaSayaci[oda.odaID] || 0;
        const bosYatak = oda.kapasite - ogrenciSayisi;
  
        return {
          odaNo: oda.odaNo,
          dolu: ogrenciSayisi,
          bos: bosYatak
        };
      });
  
      // Alfabetik olarak sırala (a1, a2, ... a10 için doğru sıralama)
      odaVerileri.sort((a, b) => a.odaNo.localeCompare(b.odaNo, 'tr', { numeric: true }));
  
      // Grafik için etiket ve veri dizilerini ayır
      const odaAdlari = odaVerileri.map(v => v.odaNo);
      const doluYataklar = odaVerileri.map(v => v.dolu);
      const bosYataklar = odaVerileri.map(v => v.bos);
  
      return { odaAdlari, doluYataklar, bosYataklar };
  
    } catch (error) {
      console.error("Oda bazlı doluluk verisi alınamadı:", error);
      return { odaAdlari: [], doluYataklar: [], bosYataklar: [] };
    }
  }      
  // Grafik oluşturma oda
  fetchOdaBazliDolulukVerisi().then(({ odaAdlari, doluYataklar, bosYataklar }) => {
    const ctx = document.getElementById('odaChart').getContext('2d');
  
    // Maksimum toplam kapasite hesapla (dolu + boş)
    const toplamlar = doluYataklar.map((v, i) => v + bosYataklar[i]);
    const enYuksek = Math.max(...toplamlar);
    const yEkseniMax = Math.ceil((enYuksek + 1) / 5) * 5; // yuvarlayarak üst sınır
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: odaAdlari,
        datasets: [
          {
            label: 'Dolu Yatak',
            data: doluYataklar,
            backgroundColor: '#e74c3c'
          },
          {
            label: 'Boş Yatak',
            data: bosYataklar,
            backgroundColor: '#2ecc71'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0,
            max: yEkseniMax // dinamik olarak belirlenmiş maksimum
          }
        }
      }
    });
  });
  

// BAŞVURU GRAFİK
async function fetchBasvuruGrafikVerisi(secilenYil) {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch("https://localhost:7107/api/Basvuru", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await response.json();
  
      // Ay bazlı 12'lik dizi başlat (Ocak → Aralık)
      const ayBazliSayilar = new Array(12).fill(0);
  
      data.forEach(b => {
        if (!b.basvuruTarihi) return;
  
        const tarih = new Date(b.basvuruTarihi);
        const yil = tarih.getFullYear();
  
        if (yil == secilenYil) {
          const ay = tarih.getMonth(); // 0 = Ocak
          ayBazliSayilar[ay]++;
        }
      });
  
      return ayBazliSayilar;
  
    } catch (error) {
      console.error("Başvuru verisi alınamadı:", error);
      return new Array(12).fill(0);
    }
  }
  // başvuru grafik çiz
  let basvuruChartInstance = null;

  function cizBasvuruGrafik(ayVerileri) {
    const ctx = document.getElementById('basvuruChart').getContext('2d');
  
    // Daha önce bir grafik çizilmişse, onu sil
    if (basvuruChartInstance) {
      basvuruChartInstance.destroy();
    }
  
    basvuruChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        datasets: [{
          label: 'Başvuru Sayısı',
          data: ayVerileri,
          borderColor: '#f1c40f',
          backgroundColor: 'rgba(241, 196, 15, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0
          }
        }
      }
    });
  }  
  //yılları doldur başvuru
  async function basvuruYillariOlustur() {
    const token = localStorage.getItem("token");
    const dropdown = document.getElementById("yilSecimi");
  
    try {
      const response = await fetch("https://localhost:7107/api/Basvuru", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
  
      const yillar = new Set();
      data.forEach(b => {
        if (b.basvuruTarihi) {
          const yil = new Date(b.basvuruTarihi).getFullYear();
          yillar.add(yil);
        }
      });
  
      const yillarDizi = Array.from(yillar).sort((a, b) => b - a); // Yeni → eski
  
      dropdown.innerHTML = "";
      yillarDizi.forEach(yil => {
        const option = document.createElement("option");
        option.value = yil;
        option.textContent = yil;
        dropdown.appendChild(option);
      });
  
      return yillarDizi[0]; // En güncel yılı döndür
  
    } catch (err) {
      console.error("Yıllar alınamadı:", err);
      return null;
    }
  }
//sayfa açılınca ve yıl değişince güncelle
basvuruYillariOlustur().then(secilenYil => {
    if (secilenYil) {
      fetchBasvuruGrafikVerisi(secilenYil).then(cizBasvuruGrafik);
    }
    // Yıl değişince yeniden çiz
    const yilDropdown = document.getElementById("yilSecimi");
    yilDropdown.addEventListener("change", () => {
      fetchBasvuruGrafikVerisi(yilDropdown.value).then(cizBasvuruGrafik);
    });
  });  

  //ETKİNLİK KATILIM
  async function fetchEtkinlikKatilimGrafikVerisi(secilenYil) {
    const token = localStorage.getItem("token");
  
    try {
      const etkinlikRes = await fetch("https://localhost:7107/api/Etkinlik", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const etkinlikler = await etkinlikRes.json();
  
      const katilimRes = await fetch("https://localhost:7107/api/EtkinlikKatilim", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const katilimlar = await katilimRes.json();
  
      // Etkinlikleri eşle
      const etkinlikMap = {};
      etkinlikler.forEach(e => {
        etkinlikMap[e.etkinlikID] = e;
      });
  
      // Ay adları Türkçe sabit
      const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  
      // Etkinliklere göre ay ay katılım sayısı
      const etkinlikVeri = {}; // { "Kitap Günü": [0,0,0,...] }
  
      katilimlar.forEach(k => {
        const etkinlik = etkinlikMap[k.etkinlikID];
        if (!etkinlik || !etkinlik.tarih) return;
  
        const tarih = new Date(etkinlik.tarih);
        const yil = tarih.getFullYear();
        const ayIndex = tarih.getMonth();
  
        if (yil == secilenYil) {
          const ad = etkinlik.ad;
          if (!etkinlikVeri[ad]) {
            etkinlikVeri[ad] = new Array(12).fill(0);
          }
          etkinlikVeri[ad][ayIndex]++;
        }
      });
  
      // Chart.js için datasets dizisi oluştur
      const datasets = Object.entries(etkinlikVeri).map(([etkinlikAd, sayilar]) => ({
        label: etkinlikAd,
        data: sayilar,
        backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16) // random renk
      }));
  
      return { aylar, datasets };
  
    } catch (err) {
      console.error("Etkinlik katılım verisi alınamadı:", err);
      return { aylar: [], datasets: [] };
    }
  }
//etkinlik katılım grafik
let etkinlikChartInstance = null;

function cizEtkinlikGrafik({ aylar, datasets }) {
  const ctx = document.getElementById('etkinlikChart').getContext('2d');

  if (etkinlikChartInstance) {
    etkinlikChartInstance.destroy();
  }

  etkinlikChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: aylar,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          // ✅ SADECE VERİSİ OLANI GÖSTER
          filter: function (tooltipItem) {
            return tooltipItem.raw > 0;
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          precision: 0
        }
      }
    }
  });
}
//etkinlik yılları çek 
async function etkinlikYillariOlustur() {
    const token = localStorage.getItem("token");
    const dropdown = document.getElementById("etkinlikYilSecimi");
  
    try {
      const response = await fetch("https://localhost:7107/api/Etkinlik", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const etkinlikler = await response.json();
  
      const yillar = new Set();
  
      etkinlikler.forEach(e => {
        if (e.tarih) {
          const yil = new Date(e.tarih).getFullYear();
          yillar.add(yil);
        }
      });
  
      const siraliYillar = Array.from(yillar).sort((a, b) => b - a);
      dropdown.innerHTML = "";
  
      siraliYillar.forEach(yil => {
        const option = document.createElement("option");
        option.value = yil;
        option.textContent = yil;
        dropdown.appendChild(option);
      });
  
      return siraliYillar[0]; // En güncel yıl
  
    } catch (err) {
      console.error("Etkinlik yılları yüklenemedi:", err);
      return null;
    }
  }
//güncelle sayfa açılınca yıl değişince
etkinlikYillariOlustur().then(secilenYil => {
    if (secilenYil) {
      fetchEtkinlikKatilimGrafikVerisi(secilenYil).then(cizEtkinlikGrafik);
    }
  
    document.getElementById("etkinlikYilSecimi").addEventListener("change", () => {
      const yil = document.getElementById("etkinlikYilSecimi").value;
      fetchEtkinlikKatilimGrafikVerisi(yil).then(cizEtkinlikGrafik);
    });
  });
  
  //ANKET VERİLERİ
  async function fetchAnketVerisi(yil) {
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch("https://localhost:7107/api/AnketCevap", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const cevaplar = await res.json();
  
      const grup = {};
  
      cevaplar.forEach(c => {
        const soru = c.anket?.soru;
        const tarih = c.anket?.olusturmaTarihi;
        const puan = c.puan;
  
        if (!soru || !tarih || !puan) return;
  
        const y = new Date(tarih).getFullYear();
        if (y != yil) return;
  
        if (!grup[soru]) {
          grup[soru] = {
            toplamPuan: 0,
            katilim: 0,
            olusturmaTarihi: tarih
          };
        }
  
        grup[soru].katilim++;
        grup[soru].toplamPuan += puan;
      });
  
      // Grupları tarihe göre sırala
      const detaylar = Object.entries(grup).map(([soru, d]) => ({
        soru: `${soru} (${new Date(d.olusturmaTarihi).toLocaleDateString("tr-TR")})`,
        katilim: d.katilim,
        ort: (d.toplamPuan / d.katilim).toFixed(1),
        tarih: d.olusturmaTarihi
      }));
  
      detaylar.sort((a, b) => new Date(a.tarih) - new Date(b.tarih));
  
      const sorular = detaylar.map(d => d.soru);
      const katilimlar = detaylar.map(d => d.katilim);
      const ortalamalar = detaylar.map(d => d.ort);
  
      return { sorular, katilimlar, ortalamalar };
    } catch (err) {
      console.error("Anket verisi alınamadı:", err);
      return { sorular: [], katilimlar: [], ortalamalar: [] };
    }
  }  
//anket çiz
let anketChartInstance = null;

function cizAnketChart({ sorular, katilimlar, ortalamalar }) {
  const ctx = document.getElementById("anketChart").getContext("2d");

  if (anketChartInstance) {
    anketChartInstance.destroy();
  }

  anketChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sorular,
      datasets: [{
        label: "Katılım Sayısı",
        data: katilimlar,
        backgroundColor: "#FFA500"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const index = ctx.dataIndex;
              return [
                `Katılım: ${ctx.raw}`,
                `Ortalama Puan: ${ortalamalar[index]}`
              ];
            }
          }
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: { beginAtZero: true },
        x: { ticks: { autoSkip: false } }
      }
    }
  });
}
//yıl getir 
async function anketYillariOlustur() {
    const token = localStorage.getItem("token");
    const dropdown = document.getElementById("anketYilSecimi");
  
    try {
      const res = await fetch("https://localhost:7107/api/Anket", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const anketler = await res.json();
  
      const yillar = new Set();
      anketler.forEach(a => {
        if (a.olusturmaTarihi) {
          const yil = new Date(a.olusturmaTarihi).getFullYear();
          yillar.add(yil);
        }
      });
  
      const sirali = Array.from(yillar).sort((a, b) => b - a);
      dropdown.innerHTML = "";
  
      sirali.forEach(yil => {
        const opt = document.createElement("option");
        opt.value = yil;
        opt.textContent = yil;
        dropdown.appendChild(opt);
      });
  
      return sirali[0];
    } catch (err) {
      console.error("Anket yılları alınamadı:", err);
      return null;
    }
  }  
  //sayfa yüklenince çalıştır
fetchAnketVerisi().then(cizAnketChart);
anketYillariOlustur().then(yil => {
    if (yil) {
      fetchAnketVerisi(yil).then(cizAnketChart);
    }
  
    document.getElementById("anketYilSecimi").addEventListener("change", () => {
      const y = document.getElementById("anketYilSecimi").value;
      fetchAnketVerisi(y).then(cizAnketChart);
    });
  });
  
  //KÜTÜPHANE KULLANIM VERİSİ
  async function fetchKutuphaneKullanimVerisi(yil) {
    const token = localStorage.getItem("token");
  
    const [planRes, katilimRes, subeRes] = await Promise.all([
      fetch("https://localhost:7107/api/KutuphanePlani", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch("https://localhost:7107/api/KutuphaneKatilim", {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch("https://localhost:7107/api/KutuphaneSubesi", {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);
  
    const planlar = await planRes.json();
    const katilimlar = await katilimRes.json();
    const subeler = await subeRes.json();
  
    // Şube ID → Ad eşlemesi
    const subeMap = {};
    subeler.forEach(s => subeMap[s.kutuphaneSubeID] = s.ad);
  
    // PlanID → { ay, subeAd } eşlemesi
    const planMap = {};
    planlar.forEach(p => {
      const t = new Date(p.tarih);
      if (t.getFullYear() != yil) return;
      const ay = t.getMonth() + 1;
      const subeAd = subeMap[p.kutuphaneSubeID] || "Bilinmeyen";
      planMap[p.kutuphanePlanID] = { ay, subeAd };
    });
  
    // Ay + Şube → Katılım sayısı
    const usageMap = {};
  
    katilimlar.forEach(k => {
      const plan = planMap[k.kutuphanePlanID];
      if (!plan) return;
      const key = `${plan.ay}_${plan.subeAd}`;
      if (!usageMap[key]) usageMap[key] = 0;
      usageMap[key]++;
    });
  
    // Y ekseninde görünmesini istediğimiz tüm şubeler
    const subeListesi = [...new Set(Object.values(planMap).map(p => p.subeAd))];
  
    // Bubble chart için veri formatı
    const data = Object.entries(usageMap).map(([key, count]) => {
      const [ay, subeAd] = key.split("_");
      return {
        x: parseInt(ay),
        y: subeAd,
        r: count + 3 // küçük olanlar da görünsün diye
      };
    });
  
    return { data, subeListesi };
  }
//grafik çiz
let kutuphaneChartInstance = null;

function cizKutuphaneBubbleChart({ data, subeListesi }) {
  const ctx = document.getElementById("kutuphaneChart").getContext("2d");

  if (kutuphaneChartInstance) {
    kutuphaneChartInstance.destroy();
  }

  kutuphaneChartInstance = new Chart(ctx, {
    type: "bubble",
    data: {
      datasets: [{
        label: "Kütüphane Kullanımı",
        data,
        backgroundColor: "rgba(52, 152, 219, 0.5)",
        borderColor: "#2980b9"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "linear",
          min: 1,
          max: 12,
          ticks: {
            stepSize: 1,
            callback: val => ["", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"][val]
          },
          title: { display: true, text: "Ay" }
        },
        y: {
          type: "category",
          labels: subeListesi,
          title: { display: true, text: "Kütüphane Şubesi" }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `Katılım: ${ctx.raw.r}`
          }
        }
      }
    }
  });
}
//yılları doldur
async function kutuphaneYillariOlustur() {
    const token = localStorage.getItem("token");
    const dropdown = document.getElementById("kutuphaneYilSecimi");
  
    try {
      const res = await fetch("https://localhost:7107/api/KutuphanePlani", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const planlar = await res.json();
  
      const yillar = new Set();
      planlar.forEach(p => {
        if (p.tarih) {
          yillar.add(new Date(p.tarih).getFullYear());
        }
      });
  
      const sirali = Array.from(yillar).sort((a, b) => b - a);
      dropdown.innerHTML = "";
      sirali.forEach(yil => {
        const opt = document.createElement("option");
        opt.value = yil;
        opt.textContent = yil;
        dropdown.appendChild(opt);
      });
  
      return sirali[0];
    } catch (err) {
      console.error("Kütüphane yılları yüklenemedi:", err);
      return null;
    }
  }  
//sayfa açılınca başlat
kutuphaneYillariOlustur().then(yil => {
    if (yil) {
      fetchKutuphaneKullanimVerisi(yil).then(cizKutuphaneBubbleChart);
    }
  
    document.getElementById("kutuphaneYilSecimi").addEventListener("change", () => {
      const y = document.getElementById("kutuphaneYilSecimi").value;
      fetchKutuphaneKullanimVerisi(y).then(cizKutuphaneBubbleChart);
    });
  });
  
  


