import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { MessageInterface } from "../interfaces/MessageInterface";

var messages: MessageInterface[] = [];
var rooms : string[] = [];

const httpServer = createServer();
const socket = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
socket.on("connection", (socket) => {

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Sala: ${room} criada por ID: ${socket.id}`);
  });

  socket.on("message", (message: MessageInterface) => {
    messages.push(message);
    socket.to(message.room).emit("receive_message", messages);
    console.log(message);
  });

  socket.on("disconnect", () =>
    console.log(`Usuário desconectado, ID: ${socket.id}`)
  );

  socket.on("error", (error) =>
    console.log(`Falha no socket: ${socket.id}, Erro: ${error}`)
  );
});

httpServer.listen(process.env.PORT || 3002, () => console.log("Servidor ligador"));
