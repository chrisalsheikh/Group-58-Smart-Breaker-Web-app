var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
//var path = require("path");
var Gpio = require("onoff").Gpio;

var LED = new Gpio(4, 'out');

app.use(require("express").static('public'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/circuit", function(req, res) {
  res.sendFile(__dirname + "/breaker_switches.html");
});

io.on("connection", function(socket) {
  console.log("A user connected");
  socket.on("buttonClick", function(data) {
    console.log(data);
    blinkLED();
  });
  socket.on("Living Room Click", (livingRmStatus) => {
    console.log(livingRmStatus);
    blinkLED();
  })
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

server.listen(3000, function() {
  console.log("Server listening on PORT 3000");
});

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
  }
}

