import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { MessageInterface } from "./interfaces/MessageInterface";
import express from "express";
import cors from 'cors';
const app = express();

var port = process.env.PORT || 3005;

var messages: MessageInterface[] = [];
var rooms : string[] = [];

app.use(cors())

const httpServer = createServer(app);
const socket = new Server(httpServer, {
  cors: {
    origin: "https://intranet-mercadotica.vercel.app/",
    methods: ["GET,PUT,POST,DELETE"],
    credentials: false,
  }
});

app.get('teste', (req, res) => {
  res.send('Funcionando')
  // teste
})

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
