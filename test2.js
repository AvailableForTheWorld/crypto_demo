const crypto = require("crypto");
const Buffer = require("buffer").Buffer;
const fs = require("fs");
const path = require("path");

let iv =Buffer.from(crypto.randomBytes(16));
const primeLength = 128;
const gene = 13;

const filename = path.resolve(__dirname, "hello.txt");
const file = fs.readFileSync(filename);
const serverdh = crypto.createDiffieHellman(primeLength, gene);
const serverkey = serverdh.generateKeys();
const obj1 = {
    tid:1,
    bigPrime:serverdh.getPrime(),
    gene:gene,
    iv:iv,
}

let data = JSON.parse(JSON.stringify(obj1))
console.log(obj1.bigPrime,new Uint8Array(data.bigPrime.data))
const clientdh = crypto.createDiffieHellman(new Uint8Array(data.bigPrime.data), data.gene);
const clientkey = clientdh.generateKeys();
iv = Buffer.from(data.iv);

const serverSecret = serverdh.computeSecret(clientkey);
const cipheriv = crypto.createCipheriv("aes-128-gcm", serverSecret, iv);
const result = cipheriv.update(file, "utf8");
const obj2 = {
    tid:2,
    file:result,
    serverkey:serverkey.toString('base64'),
}
// data = JSON.parse(JSON.stringify(obj2))

const clientSecret = clientdh.computeSecret(serverkey.toString('base64'),'base64');
const deCipheriv = crypto.createDecipheriv("aes-128-gcm", clientSecret, iv);
const deresult = deCipheriv.update(obj2.file);
console.log("客户端：收到服务端数据，内容为{" + deresult + "}");
