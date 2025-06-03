import http from "http";
import express from "express";
import { Server } from "socket.io";
import authentication from "../middlewares/authenticated";
import { Request, Response, NextFunction } from "express";
import { Socket } from "dgram";

const spaceRouter = express.Router();

spaceRouter.use(
  authentication as (req: Request, res: Response, next: NextFunction) => void
);
const app = express();
const server = http.createServer(app);
const io = new Server(server);

spaceRouter.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      message: "User is authenticated and has access to the space route.",
    });
});

io.on("connection", (socket) => {
  console.log(`New Connection ! , ${socket}`);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
export default spaceRouter;
