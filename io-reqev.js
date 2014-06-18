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
      if(arg.events != null && service.events){
        var events = arg.events
        if(!Array.isArray(arg.events)){
          events = [arg.events];
        }
        if(!service.events || events.length > service.events.length){
          return;
        }
        var rooms = socket.rooms
        for(var i=0; i<rooms.length;i++){
          if(service.events.indexOf(rooms[i]) != -1 && events.indexOf(rooms[i]) == -1){
            socket.leave(rooms[i]);
          }
        }
        for(var i=0;i<events.length;i++){
          if(service.events.indexOf(events[i]) != -1 && rooms.indexOf(events[i]) == -1){
            socket.join(events[i]);
          }
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
