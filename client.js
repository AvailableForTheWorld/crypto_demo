const net = require("net");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Buffer = require('buffer').Buffer;

const PORT = 3000;
const HOST = "127.0.0.1";
let iv;
// tcp客户端
const client = net.createConnection(PORT, HOST);
let clientdh, clientkey;

// client.on("connect", function () {
//     console.log("laotie")
// });


let cnt = 0;
let buf = Buffer.alloc(0)
let deCipheriv;
client.on("data", function (data) {
  if(cnt>1){
    if(data)
    buf = Buffer.concat([buf,data])
    console.log(buf)
    fs.writeFileSync("buffer.txt",buf)
  }
  else{
    fs.writeFileSync('data.txt',data)
    data = JSON.parse(data)
    console.log('the data %d : ',data.tid,data)
    if (data.tid === 1) {
      clientdh = crypto.createDiffieHellman(new Uint8Array(data.bigPrime.data), data.gene);
      clientkey = clientdh.generateKeys();
      console.log("this is clientkey",clientkey.toJSON())
      client.write(clientkey);
      iv = data.iv;
    } else if (data.tid === 2) {
      console.log(data.serverkey)
      const clientSecret = clientdh.computeSecret(data.serverkey,'base64');
      deCipheriv = crypto.createDecipheriv("aes-128-gcm", clientSecret, Buffer.from(iv));
      console.log("the clientSecret",clientSecret)
      // console.log("data.file",data.file)
      
    }
    else{
      console.log("the data is: ",data)
    }
  }
  ++cnt;
  if(cnt>4){
    const deresult = deCipheriv.update(buf);
      // console.log("客户端：收到服务端数据，内容为{" + deresult + "}");
    fs.writeFileSync('2.jpg',deresult.toString()); 
  }
});

// client.on('close', function(data){
//     const deresult = deCipheriv.update(buf);
//       // console.log("客户端：收到服务端数据，内容为{" + deresult + "}");
//     fs.writeFileSync('2.jpg',deresult);
// });
