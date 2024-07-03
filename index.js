const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { PORT } = require("./config/server-config.js");
const connectDB = require("./config/db-config.js");
const Chat = require("./models/chat.js");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");

app.get("/chat/:roomId", async (req, res) => {
  const chats = await Chat.find({ roomId: req.params.roomId });
  console.log("chats: ", chats);
  res.render("room", {
    roomId: req.params.roomId,
    chats: chats,
  });
});
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId.roomId);
  });
  socket.on("send_msg", async (data) => {
    const chat = await Chat.create({
      roomId: data.roomId,
      content: data.msg,
      user: data.userName,
    });
    console.log("message: ", chat);
    io.to(data.roomId).emit("msg_rcvd", data);
  });
});

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
