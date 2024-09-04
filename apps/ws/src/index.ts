import { WebSocketServer } from "ws";
import { UserManager } from "./utils/UserManager";

const wss = new WebSocketServer({ port: 8001 });

wss.on("connection", (ws) => {
  UserManager.getInstance().addUser(ws);
});
