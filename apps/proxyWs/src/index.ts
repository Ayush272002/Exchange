import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: Number(PORT) });

wss.on("connection", (ws) => {
  console.log("Client connected");

  const targetWs = new WebSocket(process.env.WS_BASE_URL as string);

  let messageQueue: any = [];
  let isTargetWsOpen = false;

  targetWs.on("open", () => {
    console.log("Connected to the WebSocket server");
    isTargetWsOpen = true;
    messageQueue.forEach((message: any) => targetWs.send(message));
    messageQueue = [];
  });

  targetWs.on("error", (error) => {
    console.error("Error with target WebSocket:", error);
  });

  targetWs.on("message", (data) => {
    // console.log('Message received from server:', data.toString());
    try {
      ws.send(data.toString());
    } catch (err) {
      console.error("Error sending data to client WebSocket:", err);
    }
  });

  ws.on("message", (data) => {
    // console.log('Message received from client:', data.toString());
    if (isTargetWsOpen) {
      targetWs.send(data.toString());
    } else {
      messageQueue.push(data.toString());
    }
  });

  ws.on("error", (error) => {
    console.error("Error with client WebSocket:", error);
  });

  ws.on("close", (code, reason) => {
    console.log(
      `Client WebSocket closed with code: ${code}, reason: ${reason}`,
    );
    targetWs.close();
  });

  targetWs.on("close", (code, reason) => {
    console.log(
      `Target WebSocket closed with code: ${code}, reason: ${reason}`,
    );
    ws.close();
  });
});
