var net = require('net');
const fs = require('fs')
const file = fs.readFileSync('1.jpg')
var PORT = 3000;
var HOST = '127.0.0.1';

// tcp服务端
var server = net.createServer(function(socket){
    console.log('服务端：收到来自客户端的请求');

    socket.on('data', function(data){
        console.log('服务端：收到客户端数据，内容为{'+ data +'}');

        // 给客户端返回数据
        socket.write(file);
        socket.on('drain',()=>{
            console.log("DRAIN in DATA")
        })
    });
    socket.on('drain',()=>{
        socket.write("\0")
        console.log('log log log')
    })
    socket.on('close', function(){
         console.log('服务端：客户端连接断开');
    });
});
server.listen(PORT, HOST, function(){
    console.log('服务端：开始监听来自客户端的请求');
});