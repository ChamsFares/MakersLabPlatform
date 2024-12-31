const { Server } = require("socket.io");
const { getRobotDetailsById } = require("./models/robotModel");
let io;

const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("getRobotDetails", async (robotId) => {
      try {
        const robotDetails = await getRobotDetailsById(robotId);
        socket.emit("robotDetails", robotDetails);
      } catch (error) {
        console.error(`Error fetching robot details for ${robotId}:`, error);
        socket.emit("error", { message: "Error fetching robot details" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

const emitUpdate = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = { initSocket, emitUpdate };
