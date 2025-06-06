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
    socket.on("join", (name: string) => {
      players.push({
        socketId: socket.id,
        name,
        level: 0,
        coordinate: { x: 16, y: 16 },
      });
      io.emit("update", players);
    });

    socket.on("disconnect", () => {
      players = players.filter((player) => player.socketId !== socket.id);
      console.log(`Player disconnected: ${socket.id}`);
    });

    socket.on("left_movement", () => {
      const player = players.find((p) => p.socketId === socket.id);
      if (player){
        player.coordinate.x -= 1;
        if(player.coordinate.x < 16) player.coordinate.x = 16
      }
    });

    socket.on("right_movement", () => {
      const player = players.find((p) => p.socketId === socket.id);
       if (player){
        player.coordinate.x += 1;
        if(player.coordinate.x > 304) player.coordinate.x = 304
      }
      
    });

    socket.on("up_movement", () => {
      const player = players.find((p) => p.socketId === socket.id);
      if (player){
        player.coordinate.y -= 1;
        if(player.coordinate.y < 16 ) player.coordinate.y = 16
      }
    });

    socket.on("down_movement", () => {
      const player = players.find((p) => p.socketId === socket.id);
       if (player){
        player.coordinate.y += 1;
        if(player.coordinate.y > 304) player.coordinate.y = 304
      }
    });
  });

  setInterval(() => {
    spaceNamespace.emit("update", players);
  }, 15);
}
