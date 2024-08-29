import { serve } from "@hono/node-server";
import { Hono } from "hono";
import WebSocket from "ws";
import { createNodeWebSocket } from "@hono/node-ws";

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

const adresKacpra = "25.17.43.102:80";
const ws = new WebSocket(`ws://${adresKacpra}/ws`);

app.get(
  "/redirect",
  upgradeWebSocket((c) => {
    ws.send("Hello from server!");
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`);
        ws.send("Hello from server!");
      },
      onClose: () => {
        console.log("Connection closed");
      },
    };
  })
);

const port = 5173;
console.log(`Server is running on port ${port}`);

const server = serve({
  fetch: app.fetch,
  port,
});

injectWebSocket(server);
