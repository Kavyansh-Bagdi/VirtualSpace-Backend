import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import authRouter from "./routes/auth";
import { setupSpaceSocket } from "./routes/space"; 

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use("/auth", authRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

setupSpaceSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
