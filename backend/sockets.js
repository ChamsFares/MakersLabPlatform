const { Server } = require("socket.io");
const WebSocket = require("ws");
const { getRobotById, updateRobotById } = require("./models/robotModel");
let io;
let esp32Socket = null;

const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });
  const wss = new WebSocket.Server({ server });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("getRobotDetails", async (robotId) => {
      try {
        console.log(`Fetching details for robot ID: ${robotId}`);
        const robotDetails = await getRobotById(robotId);
        socket.emit("robotDetails", robotDetails);
        console.log(`Sent details for robot ID: ${robotId}`);
      } catch (error) {
        console.error(`Error fetching robot details for ${robotId}:`, error);
        socket.emit("error", { message: "Error fetching robot details" });
      }
    });

    socket.on("sendToESP32", (message) => {
      if (esp32Socket) {
        esp32Socket.send(JSON.stringify(message));
        console.log("Sent message to ESP32:", message);
      } else {
        console.log("ESP32 is not connected");
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  wss.on("connection", (ws) => {
    console.log("WebSocket connection established");

    ws.on("message", (message) => {
      console.log("Received message:", message);
      const data = JSON.parse(message);

      if (data.type === "esp32") {
        esp32Socket = ws;
      } else if (data.type === "esp32Data") {
        updateRobotById(data.id, data);
        console.log("Data received from ESP32:", data);
        io.emit("esp32Data", data);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
      if (ws === esp32Socket) {
        esp32Socket = null;
      }
    });
  });
};

const emitUpdate = (event, data) => {
  if (io) {
    console.log(`Emitting event: ${event}`);
    io.emit(event, data);
  }
};

module.exports = { initSocket, emitUpdate };
