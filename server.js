const net = require("net");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const buffer = require("buffer");

const PORT = 3000;
const HOST = "127.0.0.1";

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const iv = new buffer.Buffer.from(crypto.randomBytes(16));
const primeLength = 128;
const gene = 13;
// tcp服务端


rl.on("line", (fileName) => {
  console.log("文件名为：", fileName);
  const extname = path.extname(fileName)
  const server = net.createServer();
  const filename = path.resolve(__dirname, fileName);
  const file = fs.readFileSync(filename);
  const serverdh = crypto.createDiffieHellman(primeLength, gene);
  const serverkey = serverdh.generateKeys();

  let flag = true;
  server.on("connection", (socket) => {
    if (flag) {
      const obj1 = {
        tid: 1,
        bigPrime: serverdh.getPrime(),
        gene: gene,
        iv: iv,
        extname:extname
      };
      console.log("大素数为：",obj1.bigPrime.toString('base64'),"初始化向量为: ",iv.toString('base64'))
      socket.write(JSON.stringify(obj1));
    }
    socket.on("data", function (clientkey) {
      const serverSecret = serverdh.computeSecret(clientkey);
      const cipheriv = crypto.createCipheriv("aes-128-gcm", serverSecret, iv);
      const result = cipheriv.update(file);
      const obj2 = {
        tid: 2,
        // file:result,
        serverkey: serverkey.toString("base64"),
      };
      console.log("服务端公钥为：",serverkey.toString('base64'))
      fs.writeFileSync(`中间件${extname}`,result)
      console.log("服务端侧的密钥为：",serverSecret.toString('base64'))
      socket.write(JSON.stringify(obj2), () => {
        socket.write(result, () => {
          setTimeout(() => {
            socket.write("\0");
          }, 10);
        });
      });
    });
  });
  server.on("close", function () {
    console.log("close server");
  });
  server.listen(PORT, HOST, function () {});
  
});

