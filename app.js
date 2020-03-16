var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var Gpio = require("onoff").Gpio;

var LED = new Gpio(4, 'out');
// var blinkInterval = setInterval();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("buttonClick", function(data) {
    console.log(data);
    blinkLED();
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

