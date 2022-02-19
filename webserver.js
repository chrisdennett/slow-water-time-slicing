const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + "/app/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/app/index.html");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

// const Gpio = require("onoff").Gpio;
// const button = new Gpio(4, "in", "rising");
// const button2 = new Gpio(24, "in", "rising");

// const nodaryEncoder = require("nodary-encoder");
// const myEncoder = nodaryEncoder(18, 17); // Using GPIO17 & GPIO18
// const myEncoder2 = nodaryEncoder(25, 23);

// let prevValue = null;

// button.watch((err, value) => io.emit("isReflected", { value: value }));
// button2.watch((err, value) => io.emit("doReset", { value: value }));

// myEncoder.on("rotation", (direction, value) => {
//   if (value !== prevValue) {
//     io.emit("sliceSizeChange", { value: direction });
//     prevValue = value;
//   }
// });

// myEncoder2.on("rotation", (direction, value) => {
//   if (value !== prevValue) {
//     io.emit("webcamPositionChange", { value: direction });
//     prevValue = value;
//   }
// });
