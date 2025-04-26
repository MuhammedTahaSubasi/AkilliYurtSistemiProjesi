//listele
function listeleOgrenciOdemeler() {
    const tbody = document.getElementById("ogrenciOdemeListesi");
    tbody.innerHTML = "";

    const kullaniciId = localStorage.getItem("kullaniciId");
    if (!kullaniciId) {
        alert("Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.");
        window.location.href = "../index.html";
        return;
    }

    fetch(`https://localhost:7107/api/Odeme/ogrenci/listele/${kullaniciId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Ödeme verileri alınamadı.");
        }
        return res.json();
    })
    .then(data => {
        if (!data || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">Ödeme kaydı bulunamadı.</td></tr>`;
            return;
        }

        //  Son ödeme tarihine göre sıralama
        data.sort((a, b) => new Date(a.sonOdemeTarihi) - new Date(b.sonOdemeTarihi));

        //  Dropdown'dan seçilen filtreyi al
        const filtre = document.getElementById("filterOdeme").value;
        const bugun = new Date();

        const filtrelenmisData = data.filter(odeme => {
            const sonTarih = new Date(odeme.sonOdemeTarihi);
            if (filtre === "aktif") {
                return sonTarih >= bugun || (sonTarih < bugun && !odeme.odendiMi);
            } else if (filtre === "gecmis") {
                return sonTarih < bugun && odeme.odendiMi;
            } else {
                return true; // tum
            }
        });

        if (filtrelenmisData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4">Filtreye uygun ödeme bulunamadı.</td></tr>`;
            return;
        }

        filtrelenmisData.forEach(odeme => {
            const sonTarih = new Date(odeme.sonOdemeTarihi);
            const tarihGecmismi = sonTarih < bugun;

            const tr = document.createElement("tr");

            let uyari = "";
            if (tarihGecmismi && !odeme.odendiMi) {
                uyari = `<div style="color: red; font-weight: bold;">⚠️ Son ödeme tarihi geçti, ödeme yapılmadı!</div>`;
            }

            tr.innerHTML = `
                <td>${odeme.tutar} ₺</td>
                <td>${odeme.sonOdemeTarihi ? odeme.sonOdemeTarihi.split("T")[0] : "-"}</td>
                <td>${odeme.odendiMi ? "<span style='color:green'>Ödendi</span>" : "<span style='color:red'>Bekleniyor</span>"}</td>
                <td>${uyari}</td>
            `;

            tbody.appendChild(tr);
        });
    })
    .catch(err => {
        console.error("Ödeme listesi alınamadı:", err);
        tbody.innerHTML = `<tr><td colspan="4">Hata oluştu: ${err.message}</td></tr>`;
    });
}

//  Sayfa yüklenince otomatik çalıştır
window.addEventListener("DOMContentLoaded", listeleOgrenciOdemeler);
