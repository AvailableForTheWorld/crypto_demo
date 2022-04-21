const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const primeLength = 128;
const gene = 13;

const clientdh = crypto.createDiffieHellman(primeLength,gene);
const clientkey = clientdh.generateKeys();
// const clientkey64 = clientkey.toString('base64')

const serverdh = crypto.createDiffieHellman(clientdh.getPrime(),gene);
const serverkey = serverdh.generateKeys();
const clientSecret = clientdh.computeSecret(serverkey)


const filename = path.resolve(__dirname, "hello.txt");
const file = fs.readFileSync(filename);

const iv = Buffer.from(crypto.randomBytes(16));

const cipheriv = crypto.createCipheriv("aes-128-gcm", clientSecret, iv);
const result = cipheriv.update(file, "utf8");
// console.log("加密为：", result.toString('hex'));
console.log(result)
const deCipheriv = crypto.createDecipheriv("aes-128-gcm",clientSecret,iv);
const deresult = deCipheriv.update(result);
fs.writeFileSync("test.txt",deresult.toString())