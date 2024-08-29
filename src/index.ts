import { serve } from "@hono/node-server";
import { Hono } from "hono";
import WebSocket from "ws";

const app = new Hono();

const adresKacpra = "25.17.43.102";
const ws = new WebSocket(`ws://${adresKacpra}/ws`);

app.get("/redirect", (c) => {
  ws.send("Hello N!");

  return c.text("Hello Hono!");
});

const port = 5173;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
