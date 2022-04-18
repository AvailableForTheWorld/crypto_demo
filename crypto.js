const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Buffer = require("buffer").Buffer;

const primeLength = 128;
const gene = 13;

const clientdh = crypto.createDiffieHellman(primeLength,gene);
const clientkey = clientdh.generateKeys();
const clientkey64 = clientkey.toString('base64')

const serverdh = crypto.createDiffieHellman(clientdh.getPrime(),gene);
const serverkey = serverdh.generateKeys();
const clientSecret = clientdh.computeSecret(serverkey)
const serverSecret = serverdh.computeSecret(clientkey64,'base64')
console.log("serverkey",serverkey)

console.log("client & server key: ",clientSecret.toString('hex').length)
console.log("clientkey64",clientkey64)
console.log("serverkey",serverkey.toString('hex'))

const filename = path.resolve(__dirname, "hello.txt");
const file = fs.readFileSync(filename);

const iv = Buffer.from(crypto.randomBytes(16));

const cipheriv = crypto.createCipheriv("aes-128-gcm", clientSecret, iv);
const result = cipheriv.update(file, "utf8");
console.log("加密为：", result.toString('hex'));
const deCipheriv = crypto.createDecipheriv("aes-128-gcm",clientSecret,iv);
const deresult = deCipheriv.update(result);
console.log("解密为：",deresult.toString('utf-8'))