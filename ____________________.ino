#include <WiFi.h>
#include <WebServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <PulseSensorPlayground.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

// --- WiFi Credentials ---
const char* ssid = "vivo Y16";
const char* password = "01103099235";

// --- Backend Server Configuration ---
const char* serverUrl = "http://localhost:8000"; // Change this to your backend URL
const char* deviceId = "ESP32_001"; // This should match the device ID in your database

// --- Static IP Configuration ---
IPAddress staticIP(192, 168, 1, 200);  // Static IP address
IPAddress gateway(192, 168, 1, 1);     // Gateway IP
IPAddress subnet(255, 255, 255, 0);    // Subnet mask
IPAddress dns(8, 8, 8, 8);             // DNS server

// --- Pin Definitions ---
#define PULSE_PIN 34
#define LM35_PIN 33
#define DS18B20_PIN 25
#define I2C_SDA 19
#define I2C_SCL 18

// --- Pulse Sensor Object ---
PulseSensorPlayground pulseSensor;

// --- Sensor Objects ---
OneWire oneWire(DS18B20_PIN);
DallasTemperature sensors(&oneWire);
DeviceAddress ds18b20Address;

// --- LCD Setup ---
LiquidCrystal_I2C lcd(0x27, 16, 2);

// --- Web Server Object ---
WebServer server(80);

// --- Variables ---
float lm35TempC = 0.0;
float ds18b20TempC = 0.0;
float currentHR = 0.0;

unsigned long lastSensorReadTime = 0;
unsigned long lastLcdUpdateTime = 0;
unsigned long lastDataSendTime = 0;
const long sensorReadInterval = 2000;
const long lcdUpdateInterval = 1000;
const long dataSendInterval = 5000; // Send data every 5 seconds

void readSensors() {
  if (millis() - lastSensorReadTime >= sensorReadInterval) {
    // LM35
    int adcValue = analogRead(LM35_PIN);
    float voltage = (adcValue / 4095.0) * 3.3;
    lm35TempC = voltage * 100.0;

    // DS18B20
    sensors.requestTemperatures();
    float tempRead = sensors.getTempC(ds18b20Address);
    if (tempRead != DEVICE_DISCONNECTED_C) {
      ds18b20TempC = tempRead;
    }

    lastSensorReadTime = millis();
  }
}

void updateLcd() {
  if (millis() - lastLcdUpdateTime >= lcdUpdateInterval) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("HR:");
    lcd.print((int)currentHR);
    lcd.print("bpm");

    lcd.setCursor(0, 1);
    lcd.print("T1:");
    lcd.print(lm35TempC, 1);
    lcd.print(" T2:");
    if (ds18b20TempC != DEVICE_DISCONNECTED_C) {
      lcd.print(ds18b20TempC, 1);
    } else {
      lcd.print("ERR");
    }

    lastLcdUpdateTime = millis();
  }
}

void sendDataToServer() {
  if (millis() - lastDataSendTime >= dataSendInterval) {
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      
      // Create JSON document
      StaticJsonDocument<200> doc;
      doc["deviceId"] = deviceId;
      doc["heartRate"] = currentHR;
      doc["temperature1"] = lm35TempC;
      doc["temperature2"] = ds18b20TempC;
      
      String jsonString;
      serializeJson(doc, jsonString);
      
      // Send POST request
      http.begin(serverUrl + "/api/device/measurements");
      http.addHeader("Content-Type", "application/json");
      
      int httpResponseCode = http.POST(jsonString);
      
      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("HTTP Response code: " + String(httpResponseCode));
        Serial.println("Response: " + response);
      } else {
        Serial.println("Error sending data: " + String(httpResponseCode));
      }
      
      http.end();
    }
    lastDataSendTime = millis();
  }
}

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><title>ESP32 Sensor Monitor</title>";
  html += "<meta http-equiv='refresh' content='10'>";
  html += "<style>body{font-family:Arial;background:#f4f4f4;margin:40px;}";
  html += ".container{background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);max-width:400px;margin:auto;}";
  html += "h1{text-align:center;} .sensor-data p{font-size:1.2em;margin:10px 0;} .sensor-data span{font-weight:bold;float:right;}</style></head><body>";
  html += "<div class='container'><h1>ESP32 Sensor Monitor</h1><div class='sensor-data'>";
  html += "<p>Device ID: <span>" + String(deviceId) + "</span></p>";
  html += "<p>IP Address: <span>" + WiFi.localIP().toString() + "</span></p>";
  html += "<p>Heart Rate: <span>" + String(currentHR, 1) + " bpm</span></p>";
  html += "<p>Temperature (LM35): <span>" + String(lm35TempC, 1) + " &deg;C</span></p>";
  html += "<p>Temperature (DS18B20): <span>" + String(ds18b20TempC, 1) + " &deg;C</span></p>";
  html += "</div></div></body></html>";

  server.send(200, "text/html", html);
}

void setup() {
  Serial.begin(115200);
  while (!Serial);
  Serial.println("\nESP32 Web+LCD Sensor Monitor");

  // LCD
  Wire.begin(I2C_SDA, I2C_SCL);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Initializing...");
  delay(1000);

  // DS18B20
  sensors.begin();
  if (!sensors.getAddress(ds18b20Address, 0)) {
    Serial.println("Unable to find DS18B20 address!");
    lcd.setCursor(0, 1);
    lcd.print("DS18B20 Fail!");
    delay(1000);
  } else {
    sensors.setResolution(ds18b20Address, 12);
    lcd.setCursor(0, 1);
    lcd.print("DS18B20 OK");
    delay(500);
  }

  // Pulse Sensor
  pulseSensor.analogInput(PULSE_PIN);
  pulseSensor.setThreshold(550);  // اضبطه حسب قوة الإشارة
  if (pulseSensor.begin()) {
    Serial.println("Pulse sensor ready.");
  } else {
    Serial.println("Pulse sensor failed!");
  }

  // WiFi
  lcd.clear();
  lcd.print("Connecting WiFi");
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.config(staticIP, gateway, subnet, dns);
  WiFi.begin(ssid, password);
  
  int wifi_retries = 0;
  while (WiFi.status() != WL_CONNECTED && wifi_retries < 30) {
    delay(500);
    Serial.print(".");
    lcd.setCursor(wifi_retries % 16, 1);
    lcd.print(".");
    wifi_retries++;
  }

  lcd.clear();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("Static IP Address: ");
    Serial.println(WiFi.localIP());
    lcd.setCursor(0, 0);
    lcd.print("WiFi Connected!");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());

    // API Routes
    server.on("/", handleRoot);
    server.begin();
    Serial.println("HTTP server started.");
  } else {
    Serial.println("\nWiFi connection failed!");
    lcd.setCursor(0, 0);
    lcd.print("WiFi Failed!");
  }

  delay(2000);
  lcd.clear();
  readSensors();
  lastSensorReadTime = millis();
  lastDataSendTime = millis();
}

void loop() {
  Serial.println(analogRead(PULSE_PIN));

  // تحديث قراءة النبض
  if (pulseSensor.sawStartOfBeat()) {
    currentHR = pulseSensor.getBeatsPerMinute();
    Serial.print("BPM: ");
    Serial.println(currentHR);
  }

  if (WiFi.status() == WL_CONNECTED) {
    server.handleClient();
    sendDataToServer();
  }

  readSensors();
  updateLcd();
  delay(10);
}
