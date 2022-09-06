import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { MessageInterface } from "../interfaces/MessageInterface";


var port = process.env.PORT || 3002;

var messages: MessageInterface[] = [];
var rooms : string[] = [];

const httpServer = createServer();
const socket = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// interface ISocket extends Socket {
//   username?: string
// }

// socket.use((socket: ISocket, next) => {
//   const username = socket.handshake.auth.username;
//   if(!username) {
//     return next(new Error("Username inválido"));
//   }
//   socket.username = username;
//   next()
// })

socket.on("connection", (socket) => {
  // const users = [];
  // socket.emit("users", users);

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

httpServer.listen(port, () => console.log(`Rodando na porta: ${port}`));
