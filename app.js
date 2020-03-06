const http = require("http"); // require http module
const fs = require("fs"); // require file system module
const port = 3000;

const server = http.createServer(handler);

// handler function creates server
function handler(req, res) {
  fs.readFile("./index.html", function(err, data) {
    // read file index.html
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("404 not found");
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(data);
    res.end();
  });
}

server.listen(port, function(error) {
  if (error) {
    console.log("Something went Wrong", error);
  } else {
    console.log("Server is listening on port " + port);
  }
});
