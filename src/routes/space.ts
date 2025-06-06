import { Server, Socket } from "socket.io";

interface Player {
  socketId: string;
  name: string;
  level: number;
  coordinate: {
    x: number;
    y: number;
  };
}

let players: Player[] = [];

export function setupSpaceSocket(io: Server) {
  const spaceNamespace = io.of("/space");

  spaceNamespace.on("connection", (socket: Socket) => {
    console.log(players);
    console.log(`Socket connected to /space: ${socket.id}`);

    socket.on("join", (name: string) => {
      players.push({
        socketId: socket.id,
        name,
        level: 0,
        coordinate: { x: 100, y: 100 },
      });
      console.log(players);
      console.log(`Player joined: ${name} (${socket.id})`);
      io.emit("update", players);
    });

    socket.on("disconnect", () => {
      players = players.filter((player) => player.socketId !== socket.id);
      console.log(players);
      console.log(`Player disconnected: ${socket.id}`);
    });

    socket.on("left_movement", () => {
      const player = players.find((p) => p.socketId === socket.id);
      console.log(players);
      if (player) player.coordinate.x -= 5;
    });

    socket.on("right_movement", () => {
      const player = players.find((p) => p.socketId === socket.id);
      console.log(players);
      if (player) player.coordinate.x += 5;
    });

    socket.on("up_movement", () => {
      const player = players.find((p) => p.socketId === socket.id);
      console.log(players);
      if (player) player.coordinate.y -= 5;
    });

    socket.on("down_movement", () => {
      const player = players.find((p) => p.socketId === socket.id);
      console.log(players);
      if (player) player.coordinate.y += 5;
    });
  });

  setInterval(() => {
    spaceNamespace.emit("update", players);
    // console.log("Emitting update to /space", players,"Date : ",Date());
  }, 15);
}
