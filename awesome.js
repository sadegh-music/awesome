var express  = require('express'),
    request  = require('request'),
    db       = require('./lib/db'),
    rss      = require('./lib/rss'),
    nowjs    = require('now');

var server = express.createServer();
var everyone = nowjs.initialize(server,{socketio: {transports: ['xhr-polling','jsonp-polling','websocket']}});

server.use(server.router);
server.use(express.static(__dirname + '/public'));

server.get('/rss.xml',function(req,res){
  res.send(rss.generate(), {'Content-Type': 'application/rss+xml'});
});

rss.init();

everyone.now.load = function(cursor,callback) {
  var length = 20,
      self   = this;

  db.fetch(cursor*length,length,function(err,items){

    if(err){
      return callback(err.toString());
    }

    self.now.onItem(items);
  });

}

function isUrl(str){

  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(str);

}

everyone.now.share = function(data,cb){
  //TODO validate data.link;
  var self = this;
  
  if(!isUrl(data.link)){
    return cb("Provided Link is not valid.");
  }

  request(data.link, function(err,resp,body){

    if( err || resp.statusCode != 200 ){
      return cb(err);
    }

    var title = body.match(/<title>([^<]*)<\/title>/);
    var desc = body.match(/<meta name="description" content="([^"]*)">/);
    
    if(title){
      data.title = title[1];
    }else{
      data.title = resp.request.host;
    }

    if(desc){
      data.desc = desc[1];
    }else{
      data.desc = '';
    }

    db.create(data,function(err,item){

      cb(err);

      if(!err){
        everyone.now.onItem([item]);
        rss.addItem(item);
      }

    });

  });

}

everyone.now.remove = function(id,callback){
  //TODO validate id
  db.remove(id,function(err){
    if(err){
      callback(err.toString());
    }else{
      callback(null);
    }
    rss.init();
    everyone.now.onRemove(id);
  });
}

server.listen(9002,function() {
  console.log('Listening on 9002');
});
