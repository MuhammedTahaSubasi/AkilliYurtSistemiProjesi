/*
  Rui Santos & Sara Santos - Random Nerd Tutorials
  Complete project details at https://RandomNerdTutorials.com/esp32-mfrc522-rfid-reader-arduino/
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.  
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

#include <MFRC522v2.h>
#include <MFRC522DriverSPI.h>
//#include <MFRC522DriverI2C.h>
#include <MFRC522DriverPinSimple.h>
#include <MFRC522Debug.h>
#include <WiFi.h>
#include <HTTPClient.h>



const char* ssid = "AndroidAP20E3";      
const char* password = "taha123456...";
// Learn more about using SPI/I2C or check the pin assigment for your board: https://github.com/OSSLibraries/Arduino_MFRC522v2#pin-layout
MFRC522DriverPinSimple ss_pin(5);

MFRC522DriverSPI driver{ss_pin}; // Create SPI driver
//MFRC522DriverI2C driver{};     // Create I2C driver
MFRC522 mfrc522{driver};         // Create MFRC522 instance

void setup() {
  Serial.begin(115200);  // Initialize serial communication
  while (!Serial);       // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4).
  
  // 📡 Wi-Fi'ye bağlan
  WiFi.begin(ssid, password);
  Serial.print("WiFi'ye bağlanılıyor");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi bağlantısı başarılı!");
  Serial.print("ESP32 IP Adresi: ");
  Serial.println(WiFi.localIP());
  
  mfrc522.PCD_Init();    // Init MFRC522 board.
  MFRC522Debug::PCD_DumpVersionToSerial(mfrc522, Serial);  // Show details of PCD - MFRC522 Card Reader details.
  Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));
}

void loop() {
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards.
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Dump debug info about the card; PICC_HaltA() is automatically called.
 // MFRC522Debug::PICC_DumpToSerial(mfrc522, Serial, &(mfrc522.uid));

// UID'yi string'e çevir
  String uidStr = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uidStr += String(mfrc522.uid.uidByte[i], HEX);
  }
  uidStr.toUpperCase(); // Büyük harf yap (örnek: 04AABB12)

  // Seri monitöre yaz
  Serial.print("Kart UID: ");
  Serial.println(uidStr);

  // API'ye gönder
  sendUID(uidStr);
  delay(2000);
}

void sendUID(String uid) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin("http://192.168.43.173:5000/api/girisCikis/kaydet"); 
    http.addHeader("Content-Type", "application/json");
    
    //  JSON veri oluştur
    String jsonData = "{\"uid\":\"" + uid + "\"}";

    //  POST isteği gönder
    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("API Yanıtı: ");
      Serial.println(response);
    } else {
      Serial.print("HATA: ");
      Serial.println(http.errorToString(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("WiFi bağlı değil!");
  }
}
