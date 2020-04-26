var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var Gpio = require("onoff").Gpio;

var LED1 = new Gpio(4, 'out');
var LED2 = new Gpio(17, 'out');
var LED3 = new Gpio(22, 'out');

app.use(require("express").static('public'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/circuit", function(req, res) {
  res.sendFile(__dirname + "/breaker_switches.html");
});

/*
// Establish Server Socket connection
// Listen for client to connect
// Listen for circuit switch toggles
*/
io.on("connection", function(socket) {
  console.log("A user connected");

  // create object to store status of circuits
  var circuitStatus = {
    livingRoom: "",
    guestRoom: "",
    masterRoom: ""
  };

  updateCircuitStatus(circuitStatus);
  socket.emit("CircuitStatus", JSON.stringify(circuitStatus));
  
  // Client toggles Living room circuit, toggle LED1 and update circuit status
  socket.on("Living Room Click", (livingRmStatus) => {
    console.log(livingRmStatus);
    blinkLED1();
    updateCircuitStatus(circuitStatus);
    socket.emit("CircuitStatus", JSON.stringify(circuitStatus));
  })

  // Client toggles Guest bedroom circuit, toggle LED2 and update circuit status
  socket.on("Guest Room Click", (gstBedrmStatus) => {
    console.log(gstBedrmStatus);
    blinkLED2();
    updateCircuitStatus(circuitStatus);
    socket.emit("CircuitStatus", JSON.stringify(circuitStatus));
  })

  // Client toggles Master bedroom circuit, toggle LED3 and update circuit status
  socket.on("Master Room Click", (mstrBrdmStatus) => {
    console.log(mstrBrdmStatus);
    blinkLED3();
    updateCircuitStatus(circuitStatus);
    socket.emit("CircuitStatus", JSON.stringify(circuitStatus));
  })

  // Client disconnects, indicate to the console
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

/*
// Establish server connection on PORT 3000
*/
server.listen(3000, function() {
  console.log("Server listening on PORT 3000");
});


/*
// Set of functions used to toggled LED's 1,2 & 3
*/
function blinkLED1() {          //function to start blinking
  if (LED1.readSync() === 0) {  //check the pin state, if the state is 0 (or off)
    LED1.writeSync(1);          //set pin state to 1 (turn LED on)
  } else {
    LED1.writeSync(0);          //set pin state to 0 (turn LED off)
  }
}

function blinkLED2() { 
  if (LED2.readSync() === 0) { 
    LED2.writeSync(1);
  } else {
    LED2.writeSync(0);
  }
}

function blinkLED3() { 
  if (LED3.readSync() === 0) { 
    LED3.writeSync(1);
  } else {
    LED3.writeSync(0);
  }
}


/*
// Function Updates circuit status object
*/
function updateCircuitStatus(statusObj) {

  // check status of living room
  if (LED1.readSync() === 0) {
    statusObj.livingRoom = "off"
  } else {
    statusObj.livingRoom = "on"
  }

  // check status of guest bedroom
  if (LED2.readSync() === 0) {
    statusObj.guestRoom = "off"
  } else {
    statusObj.guestRoom = "on"
  }

  // check status of master bedrrom
  if (LED3.readSync() === 0) {
    statusObj.masterRoom = "off"
  } else {
    statusObj.masterRoom = "on"
  }

  // print circuit status to console
  console.log(statusObj);
}



