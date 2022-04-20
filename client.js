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
let bufArr = [],bufSize=0;
let deCipheriv;

client.on("data", function (data) {
  if(cnt>1){

    if(data&&data.length!==1&&data[0]!==0)
    {
      bufArr.push(data)
    }else {
      console.log("the cnt times: ",cnt)
      console.log("laotie666",data[0])
      const buf = Buffer.concat(bufArr)
      const deresult = deCipheriv.update(buf);
      console.log("final",deresult.length)
        // console.log("客户端：收到服务端数据，内容为{" + deresult + "}");
      fs.writeFileSync('2.md',deresult); 
    }
  }
  else{
    data = JSON.parse(data)
    if (data.tid === 1) {
      clientdh = crypto.createDiffieHellman(new Uint8Array(data.bigPrime.data), data.gene);
      clientkey = clientdh.generateKeys();
      client.write(clientkey);
      iv = data.iv;
    } else if (data.tid === 2) {
      const clientSecret = clientdh.computeSecret(data.serverkey,'base64');
      deCipheriv = crypto.createDecipheriv("aes-128-gcm", clientSecret, Buffer.from(iv));
    }
  }
  ++cnt;
  if(cnt>2){
    // fs.writeFileSync('test.txt',buf)
    
  }
});

