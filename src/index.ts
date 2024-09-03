import { serve } from "@hono/node-server";
import { Hono } from "hono";
import WebSocket from "ws";
import { createNodeWebSocket } from "@hono/node-ws";

const app = new Hono();

const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

const adresKacpra = "25.17.43.102:80";
// const adresKacpra = "localhost:80";
const wsServer = new WebSocket(`ws://${adresKacpra}/api/updateInfo/1`);

app.get(
  "/redirect",
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        wsServer.send(event.data);
        wsServer.on("message", (data) => {
          const message = data.toString();

          ws.send(message);
        });
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
