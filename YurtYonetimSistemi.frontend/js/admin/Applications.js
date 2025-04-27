const backendBaseUrl = "https://localhost:7107";
// Başvuruları Listele
function listeleBasvurular() {
    const tbody = document.getElementById("basvuruListesi");
    tbody.innerHTML = "";

    const filter = document.getElementById("filterDurum").value;  

    fetch("https://localhost:7107/api/Basvuru", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => res.json())
    .then(data => {
        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="12">Başvuru bulunamadı.</td></tr>`;
            return;
        }

        //  Aktif/Pasif filtreleme:
        const filtrelenmisData = data.filter(basvuru => {
            if (filter === "aktif") {
                return basvuru.durum === "Bekliyor";
            } else if (filter === "pasif") {
                return basvuru.durum === "Onaylandı" || basvuru.durum === "Reddedildi";
            } else {
                return true; // Tüm başvurular
            }
        });

        if (filtrelenmisData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="12">Filtreye uygun başvuru bulunamadı.</td></tr>`;
            return;
        }

        filtrelenmisData.forEach(basvuru => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${basvuru.ad} ${basvuru.soyad}</td>
                <td>${basvuru.tcNo}</td>
                <td>${basvuru.telefon}</td>
                <td>${basvuru.email}</td>
                <td>${basvuru.okul}</td>
                <td>${basvuru.bolum}</td>
                <td>${basvuru.sinif}</td>
                <td>${basvuru.basvuruTarihi ? basvuru.basvuruTarihi.split("T")[0] : "-"}</td>
                <td><b>${basvuru.durum}</b></td>
                <td>${basvuru.ogrenciBelgesiPath ? `<a href="${backendBaseUrl}/${basvuru.ogrenciBelgesiPath}" target="_blank">Göster</a>` : "-"}</td>
                <td>${basvuru.adliSicilBelgesiPath ? `<a href="${backendBaseUrl}/${basvuru.adliSicilBelgesiPath}" target="_blank">Göster</a>` : "-"}</td>
                <td>
                    ${basvuru.durum === "Bekliyor" ? `
                        <button class="add-btn" onclick="onaylaModalAc('${basvuru.basvuruID}', '${basvuru.ad}', '${basvuru.soyad}', '${basvuru.email}', '${basvuru.tcNo}', '${basvuru.telefon}')">Onayla</button>
                        <button class="detail-btn" onclick="basvuruReddet('${basvuru.basvuruID}')">Reddet</button>
                    ` : ""}
                    <button class="delete-btn" onclick="basvuruSil('${basvuru.basvuruID}')">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(err => {
        console.error("Başvurular alınamadı:", err);
        tbody.innerHTML = `<tr><td colspan="12">Hata oluştu.</td></tr>`;
    });
}

// Başvuruyu Onayla
function basvuruOnayla(id) {
    return fetch(`https://localhost:7107/api/Basvuru/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ durum: "Onaylandı" })
    })
    .catch(err => {
        console.error("Onaylama hatası:", err);
        alert("Başvuru onaylanamadı."); 
    });
}

// Başvuruyu Reddet
function basvuruReddet(id) {
    if (!confirm("Bu başvuruyu reddetmek istiyor musunuz?")) return;

    fetch(`https://localhost:7107/api/Basvuru/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ durum: "Reddedildi" })
    })
    .then(() => {
        alert("Başvuru reddedildi.");
        listeleBasvurular();
    })
    .catch(err => {
        console.error("Reddetme hatası:", err);
        alert("Başvuru reddedilemedi.");
    });
}

// Başvuruyu Sil
function basvuruSil(id) {
    if (!confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return;

    fetch(`https://localhost:7107/api/Basvuru/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(() => {
        alert("Başvuru silindi.");
        listeleBasvurular();
    })
    .catch(err => {
        console.error("Silme hatası:", err);
        alert("Başvuru silinemedi.");
    });
}
//odalar ve sınıflar getir
function loadOdalarOnayModal() {
    fetch("https://localhost:7107/api/Oda", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById("inputOda"); 
        select.innerHTML = "";
        data.forEach(oda => {
            const option = document.createElement("option");
            option.value = oda.odaID;
            option.textContent = oda.odaNo;
            select.appendChild(option);
        });
    });
}

function loadSiniflarOnayModal() {
    fetch("https://localhost:7107/api/Sinif", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById("inputSinif"); 
        select.innerHTML = "";
        data.forEach(sinif => {
            const option = document.createElement("option");
            option.value = sinif.sinifID;
            option.textContent = sinif.sinifAd;
            select.appendChild(option);
        });
    });
}
//modal aç kapa
// Add these functions to your main.js if they don't exist
function modalAc(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex"; 
}

function modalKapat(modalId) {
    document.getElementById(modalId).style.display = "none";
}
//modal aç
let seciliBasvuruId = null;

function onaylaModalAc(basvuruId, ad, soyad, email, tcNo, telefon) {
    seciliBasvuruId = basvuruId;

    document.getElementById("inputAd").value = ad || "";
    document.getElementById("inputSoyad").value = soyad || "";
    document.getElementById("inputEmail").value = email;
    document.getElementById("inputTcNo").value = tcNo;
    document.getElementById("inputTelefon").value = telefon;
    document.getElementById("inputSifre").value = "123456"; // sabit şifre

    modalAc('onayModal');
    loadOdalarOnayModal();
    loadSiniflarOnayModal();
}

//ekle kaydet 
document.getElementById("onayForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const odaID = document.getElementById("inputOda").value;
    const sinifID = document.getElementById("inputSinif").value;

    if (!odaID || !sinifID) {
        alert("Lütfen Oda ve Sınıf seçiniz!");
        return;
    }

    fetch(`https://localhost:7107/api/Kullanici`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            ad: document.getElementById("inputAd").value,
            soyad: document.getElementById("inputSoyad").value,
            email: document.getElementById("inputEmail").value,
            sifre: document.getElementById("inputSifre").value,
            tcNo: document.getElementById("inputTcNo").value,
            telefon: document.getElementById("inputTelefon").value,
            rolID: "73E43730-69A2-4D0E-2DEA-08DD75474EC7", // öğrenci rolü
            odaID: odaID,
            sinifID: sinifID
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Kullanıcı oluşturulamadı.");
        return res.json();
    })
    .then(() => {
        return basvuruOnayla(seciliBasvuruId);
    })
    .then(() => {
        alert("Başvuru onaylandı ve kullanıcı oluşturuldu!");
        modalKapat('onayModal');
        listeleBasvurular();
    })
    .catch(err => {
        console.error("Hata oluştu:", err);
        alert("Bir hata oluştu: " + err.message);
    });
});

// Sayfa Yüklenince Başvuruları Listele
listeleBasvurular();
