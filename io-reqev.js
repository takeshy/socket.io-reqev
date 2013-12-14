var IOReqEv = function(io){
  this.io = io;
  return;
}
IOReqEv.prototype.register = function register(path,service){
  var that = this;
  if(service.events){
    for(var i=0; i < service.events.length;i++){
      var type = service.events[i];
      service.on(type,function(t){
        return function(data){ that.io.of(path).in(t).emit("reply",data); }
      }(type));
    }
  }
  that.io.of(path)
  .on('connection',function(socket){
    socket.on("message", function (arg) {
      if(arg.events != null){
        var rooms = that.io.of(path).manager.roomClients[socket.id];
        for(var key in rooms){
          var room = key.split(path);
          if(room[1]){
            socket.leave(room[1].substr(1));
          }
        }
        var events = arg.events
        if(!Array.isArray(arg.events)){
          events = [arg.events];
        }
        for(var i=0;i<events.length;i++){
          socket.join(events[i]);
        }
      }
      if(arg.requests){
        var requests = arg.requests;
        if(!Array.isArray(requests)){
          requests = [requests];
        }
        for(var i=0;i<requests.length;i++){
          service.request(requests[i],function(err,data){
            if(err){
              socket.emit("error",err);
            }else{
              socket.emit("reply",data);
            }
          });
        }
      }
    });
  });
}
module.exports = IOReqEv
