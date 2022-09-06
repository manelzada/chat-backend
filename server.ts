import express from "express";
import cors from "cors"
import { createServer } from "http";
import { Server } from "socket.io";
import { MessageInterface } from "./interfaces/MessageInterface";
import morgan from "morgan";

const port = process.env.PORT || 3001;
const app = express();

const server = createServer(app)
const io = new Server(server);

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(morgan("dev"));

app.use((req: any, res: any) => {
  res.status(404).send("Not found");
})

app.get("/", (req, res ) => {
  res.send("Hello world");
});

io.on('connection', (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Sala: ${room} criada por ID: ${socket.id}`);
  });

  socket.on("message", (message: MessageInterface) => {
    socket.to(message.room).emit("receive_message", message);
    console.log(message);
  });

  socket.on("disconnect", () =>
    console.log(`Usuário desconectado, ID: ${socket.id}`)
  );

  socket.on("error", (error) =>
    console.log(`Falha no socket: ${socket.id}, Erro: ${error}`)
  );
})

app.listen(port, () => console.log(`Rodando na porta: ${port}`));
