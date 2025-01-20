#include <WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";
const char* websocket_server = "your_server_ip";
String id; 

WebSocketsClient webSocket;

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket Disconnected");
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket Connected");
      webSocket.sendTXT("{\"type\": \"esp32\"}");
      break;
    case WStype_TEXT:
      Serial.printf("WebSocket Message: %s\n", payload);
      id = (char*)payload;
      break;
  }
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");

  webSocket.begin(websocket_server, 5000, "/");
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();

  if () {
    String message = "{\"type\": \"esp32Data\", \"id\": id, \"data\": \"Hello from ESP32\"}";
    webSocket.sendTXT(message);
  }

  delay(1000);
}