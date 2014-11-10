IOReqEvClient = function(url,callback,errorCb){
 this.url = url;
 this.callback = callback;
 this.errorCb = errorCb;
 this.requestPool = [];
 this.eventPool = [];
};
//params: {
//  events: [],
//  requests: []
//}
IOReqEvClient.prototype.watch = function(params){
  var that = this;
  if(!this.socket || !this.socket.connected){
    if(params.requests){
      if(Object.prototype.toString.call(params.requests) === "[object Array]"){
        this.requestPool = this.requestPool.concat(params.requests);
      }else{
        this.requestPool.push(params.requests) ;
      }
    }
    if(params.events){
      if(Object.prototype.toString.call(params.events) === "[object Array]"){
        if(params.events.length == 0){
          this.eventPool = [];
        }else{
          this.eventPool = this.eventPool.concat(params.events);
        }
      }else{
        this.eventPool.push(params.events) ;
      }
    }
    if(this.socket){
      return;
    }
  }
  if(!this.socket){
    if((/android/i.test(navigator.userAgent) || /linux/i.test(navigator.userAgent)) && ! /chrom/i.test(navigator.userAgent)){
      if("WebSocket" in window) {
        this.socket = io.connect(this.url,{forceJSONP: true});
      }else{
        this.socket = io.connect(this.url,{transports: ["websocket"]});
      }
    }else{
      this.socket = io.connect(this.url);
    }
    this.socket.on("reply", function(obj){that.callback(obj)});
    if(this.errorCb){
      this.socket.on("error", function(obj){that.errorCb(obj)});
    }
  }
  if(this.socket.connected){
    this.socket.emit("message",params);
  }else{
    this.socket.on('connect', function(){
      that.socket.emit("message",{requests:that.requestPool,events: that.eventPool});
      that.requestPool = [];
      that.eventPool = [];
    });
  }
}
IOReqEvClient.prototype.unwatch = function(){
  this.watch({events: []});
  this.socket.removeAllListeners("connect")
  this.socket.removeAllListeners("reply")
  this.requestPool = [];
  this.eventPool = [];
  this.socket = null;
}
