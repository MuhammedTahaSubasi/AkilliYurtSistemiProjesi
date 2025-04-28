//Bilgileri al APi gönder
document.getElementById("basvuruForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Ad", document.getElementById("ad").value);
    formData.append("Soyad", document.getElementById("soyad").value);
    formData.append("TcNo", document.getElementById("tcNo").value);
    formData.append("Email", document.getElementById("email").value);
    formData.append("DogumTarihi", document.getElementById("dogumTarihi").value);
    formData.append("Telefon", document.getElementById("telefon").value);
    formData.append("Okul", document.getElementById("okul").value);
    formData.append("Sinif", document.getElementById("sinif").value);
    formData.append("Bolum", document.getElementById("bolum").value);

    const ogrenciBelgesi = document.getElementById("ogrenciBelgesi").files[0];
    if (ogrenciBelgesi) {
        formData.append("OgrenciBelgesi", ogrenciBelgesi);
    }

    const adliSicilBelgesi = document.getElementById("adliSicilBelgesi").files[0];
    if (adliSicilBelgesi) {
        formData.append("AdliSicilBelgesi", adliSicilBelgesi);
    }

    fetch("https://localhost:7107/api/Basvuru", {
        method: "POST",
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error("Başvuru gönderilemedi.");
        return res.json();
    })
    .then(data => {
        alert("✅ Başvurunuz başarıyla alınmıştır!\n\n🔑 Başvuru Kodunuz: " + data.basvuruKodu + "\n\n❗ Lütfen bu kodu kaydedin. Başvurunuzu takip etmek için bu kod gereklidir!");
        document.getElementById("basvuruForm").reset();
        
        // Eğer yüklenen dosya linklerine frontend'den erişmeniz gerekiyorsa
        if (data.ogrenciBelgesiYolu) {
            // Dosya yolunu saklayabilir veya gösterebilirsiniz
            console.log("Öğrenci belgesi: https://localhost:7107" + data.ogrenciBelgesiYolu);
        }
    })    
    .catch(err => {
        console.error("Başvuru gönderilemedi:", err);
        alert("Başvurunuz alınırken bir hata oluştu: " + err.message);
    });
});

//sorgulama kodu gönder
document.getElementById("sorgulaForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const kod = document.getElementById("sorgulaKodu").value;

    fetch(`https://localhost:7107/api/Basvuru/sorgula/${kod}`)
        .then(res => {
            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error("Başvuru bulunamadı.");
                }
                throw new Error("Bir hata oluştu.");
            }
            return res.json();
        })
        .then(data => {
            document.getElementById("sorguSonucu").innerHTML = `
                Başvuru Sahibi: ${data.ad} ${data.soyad}<br>
                Email: ${data.email}<br>
                Başvuru Tarihi: ${data.basvuruTarihi}<br>
                Durum: <b>${data.durum}</b>
            `;
        })
        .catch(err => {
            document.getElementById("sorguSonucu").innerHTML = `<span style="color:red;">${err.message}</span>`;
        });
});
