const { WebSocket, WebSocketServer } = require("ws");
const http = require("http");
const uuidv4 = require("uuid").v4;

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const clients = {};

function broadcastMessage(dataStr) {
  for (let userId in clients) {
    let client = clients[userId];
    if (client.readyState === WebSocket.OPEN) {
      client.send(dataStr);
    }
  }
}

function handleClose(event, userId) {
  console.log(`${userId} disconnected`);
  delete clients[userId];
}

function handleMessage(message, userId) {
  console.log("message", message.toString());
  broadcastMessage(message.toString());
}

wsServer.on("connection", (connection) => {
  const userId = uuidv4();
  clients[userId] = connection;
  console.log(`${userId} connected`);

  connection.on("message", (message) => handleMessage(message, userId));
  connection.on("close", (event) => handleClose(event, userId));
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
