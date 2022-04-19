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

const filename = path.resolve(__dirname, "1.jpg");
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
      socket.write(JSON.stringify(obj1))
  }
  socket.on("data", function (clientkey) {
    console.log("服务端：收到客户端数据，内容为{" + clientkey + "}");
    const serverSecret = serverdh.computeSecret(clientkey);
    console.log("serverSecret: ",serverSecret)
    const cipheriv = crypto.createCipheriv("aes-128-gcm", serverSecret, iv);
    const result = cipheriv.update(file);
    const obj2 = {
        tid:2,
        // file:result,
        serverkey:serverkey.toString('base64'),
    }
    socket.write(JSON.stringify(obj2));
    fs.writeFileSync("predata.txt",JSON.stringify(result))
    socket.write(JSON.stringify(result));
  });
});

server.listen(PORT, HOST, function () {});
