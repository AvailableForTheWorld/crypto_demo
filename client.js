const net = require("net");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = 3000;
const HOST = "127.0.0.1";
let iv;
// tcp客户端
const client = net.createConnection(PORT, HOST);
let clientdh, clientkey;

client.on("connect", function () {
    console.log("laotie")
});

// client.on("data", function (data) {
//    console.log(JSON.parse(JSON.stringify(data)))
// //   if (data.tid === 1) {
// //     clientdh = crypto.createDiffieHellman(data.bigPrime, data.gene);
// //     clientkey = clientdh.generateKeys();
// //     client.write(clientkey);
// //     iv = data.iv;
// //   } else if (data.tid === 2) {
// //     const clientSecret = clientdh.computeSecret(data.serverkey);
// //     const deCipheriv = crypto.createDecipheriv("aes-128-gcm", clientSecret, iv);
// //     const deresult = deCipheriv.update(data.file);
// //     console.log("客户端：收到服务端数据，内容为{" + deresult + "}");
// //   }
// });

// client.on('close', function(data){
//     console.log('客户端：连接断开');
// });
