const net = require("net");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const buffer = require("buffer")

const PORT = 3000;
const HOST = "127.0.0.1";
const iv = new buffer.Buffer.from(crypto.randomBytes(16));
const primeLength = 128;
const gene = 13;
// tcp服务端
const server = net.createServer();

const filename = path.resolve(__dirname, "hello.txt");
const file = fs.readFileSync(filename);
const serverdh = crypto.createDiffieHellman(primeLength, gene);
const serverkey = serverdh.generateKeys();

let flag = true

server.on("connection", (socket) => {
  if(flag){
      const obj1 = {
          tid:1,
          bigPrime:serverdh.getPrime(),
          gene:gene,
          iv:iv,
      }
      socket.write(obj1)
  }
  socket.on("data", function (clientkey) {
    console.log("服务端：收到客户端数据，内容为{" + clientkey + "}");
    const serverSecret = serverdh.computeSecret(clientkey);
    const cipheriv = crypto.createCipheriv("aes-128-gcm", serverSecret, iv);
    const result = cipheriv.update(file, "utf8");
    const obj2 = {
        tid:2,
        file:result,
        serverkey:serverkey,
    }
    socket.write(obj2);
  });
});

server.listen(PORT, HOST, function () {});
