from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Yapay Zeka destekli genel analiz servisi çalışıyor!"

@app.route("/api/ozet", methods=["POST"])
def genel_analiz():
    try:
        data = request.get_json()
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        openai.api_key = os.getenv("OPENAI_API_KEY")

        prompt = f"""
Aşağıda bir öğrenci yurdu sisteminden alınan veriler yer almaktadır. Bu veriler anketler, etkinlikler, başvurular, kütüphane kullanımı (sadece son 7 günü kapsayan veriler), bakım talepleri gibi modüllerden toplanmıştır.

Lütfen bu verileri detaylı bir şekilde analiz et. Her modül için:

1. Öne çıkan genel eğilimleri belirt (örneğin yüksek/düşük memnuniyet, yetersiz katılım, belirli şubelere yoğunlaşma vs.).
2. Sayısal verilerle destekli kısa ama kapsamlı bir analiz oluştur.
3. Yurt yönetimi için net, uygulanabilir öneriler sun.
4. Eğer bakım talepleri içinde hâlâ bekleyen (aktif) talepler varsa, bu taleplerin başlık ve açıklamalarını maddeler halinde belirt.
5. Kütüphane verileri, yalnızca son 7 güne ait planlı kullanım kayıtlarını içermektedir. Her kayıtta kütüphane adı, tarih, saat aralığı ve katılımcı sayısı yer almaktadır. Bu verilere dayanarak:

- Hangi şubeler daha yoğun kullanılmış?
- Katılım günlere göre düzenli mi?
- Saat aralıklarında dikkat çeken yoğunluklar var mı?

şeklinde analiz yaparak, durumu özetle ve iyileştirme önerileri sun.

Tüm çıktıyı açık ve anlaşılır, rapor formatında üret.

Veriler:
{data}

Çıktı:
- Genel Durum Özeti
- Sayısal Bulgular
- İyileştirme ve Tavsiye Önerileri (maksimum 5 madde)
"""

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                { "role": "system", "content": "Sen bir yapay zeka destekli yurt yönetimi danışmanısın." },
                { "role": "user", "content": prompt }
            ],
            temperature=0.7,
            max_tokens=800,
        )

        analiz = response.choices[0].message.content
        return jsonify({ "mesaj": analiz })

    except Exception as e:
        return jsonify({ "hata": str(e) }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
