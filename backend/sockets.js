const { Server } = require("socket.io");

const initSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("A user connected");

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
