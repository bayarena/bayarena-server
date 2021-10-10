var http = require('http');
var hostname = '127.0.0.1';
var port = 8080;

const server = http.createServer(function(req,res){
    const path = req.url;
    const method = req.method;
    if(path === '/lectures'){
        if(method === 'GET') {
            res.writeHead(200, {'Content-Type': 'application/json'})
            const lectures = JSON.stringify([
                {
                name: "한혜진",
                price: 100000,
            },
        ]);
            res.end(lectures);
        }else if(method === 'POST'){
            res.end("생성되었습니다!");
        }
    }
    res.end("good bye"); 
});

server.listen(port, hostname);

console.log('bayarena server on~!');