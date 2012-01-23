var express = require('express'),
    nowjs   = require('now');

var log = console.log;
var server = express.createServer();

server.use(server.router);
server.use(express.static(__dirname + '/public'));

var everyone = nowjs.initialize(server);

everyone.now.logStuff = function(msg){
  log(msg);
}

server.listen(9002,function() {
    log('Ready');
});
