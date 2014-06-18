# socket.io-reqev 

A framework for [socket.io](http://socket.io/) (server and client). 
this version corresponds to socket.io >= ver 1.0
if you want to use socket.io ver 0.9.x, choose socket.io-reqev ver 0.1.4

It is designed to  make pub-sub and GET request easier.
It allows you to write less code and easy to understand.

socket.io-reqev ties a path to an object and ties an event to a room.

# Install

    npm install socket.io-reqev

## How to use

server(node.js)

```js
var events = require('events');

var Sample = function(time){
  setInterval(function(){this.emit("alarm", {time: new Date().toString()})}.bind(this),time);
  this.events = ["alarm"];
}
Sample.prototype = new events.EventEmitter();
Sample.prototype.request = function(req,cb){ return req == "now" ?  cb(null,new Date().toString()) : cb("invalid")}

var IOReqEv = require('socket.io-reqev');
var ioReqEv = new IOReqEv(require('socket.io').listen(50000));

ioReqEv.register("/sample",new Sample(1000));
ioReqEv.register("/sample1",new Sample(10000));

```

client(browser)

```js
//<script src="http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js"></script>
//<script src="https://raw.github.com/takeshy/socket.io-reqev/master/dist/io-reqev-client.js"></script>
sock = new IOReqEvClient("http://localhost:50000/sample", function(obj){console.log(obj)})
sock.watch({requests: ["now"],events: ["alarm"]})
// when no need to use.
// sock.unwatch() 
```

# API

## Node.js

### IOReqEv

  Create a new `IOReqEv` with Socket.IO object. 

```js
var IOReqEv = require('socket.io-reqev')`
var ioReqEv = new IOReqEv(require('socket.io').listen(50000));
```

### register(path:string,service:object)

- path is tied path of socket.io url(SocketIO Host Name + /path) 

- service consists two parts.

  - events

    (optional) it is array and including event names.
    if the object emits an event included this field,socket.io-reqev 
    sends to the subscribers that event.

  - request

    (optional)it is method function(reqest,callback). param request is a request of requests
    from a client. param callback is a function(error,value).
    when this method completes the request, this method shuold call the
    callback with the value and socket.io-recv replies the value to the client.

```js
var events = require('events');

var Sample = function(time){
  setInterval(function(){this.emit("alarm", {time: new Date().toString()})}.bind(this),time);
  this.events = ["alarm"];
}
Sample.prototype = new events.EventEmitter();
Sample.prototype.request = function(req,cb){ return req == "now" ?  cb(null,new Date().toString()) : cb("invalid")}
ioReqEv.register("/sample",new Sample(1000));
```

## Browser

### IOReqEvClient(url:string,callback:function,errorCallback:function)
- url socket.io host + path
- callback it is called when socket.io host  replies successful.
- errorCallback it is called when socket.io host  replies unsuccessful.

### watch(requests:array,events:array)

you call this method whenever you want.

- requests(optional)

An array of request. Each request passes server side object's method named 'request'.
it is similar to HTTP GET but you can include multiple requests at once.

- events(optional)

An array of event name you want to subscribe. 
if you called watch already,socket-io-recv unsubscribes befores events. 
For that reason,if you want to keep subscribe,you should include all events
you want subscribe or if events is not passed or null,socket-io-recv
subscribing befores events.
if you don't subscribe any event anymore,you should set empty array.

```js
sock = new IOReqEvClient("http://localhost:50000/sample", function(obj){console.log(obj)})
sock.watch({requests: ["now"],events: ["alarm"]})
```

### unwatch()
  you don't need any request and event,then you call this method.
```js
var socket.unwatch();
```

# demo

if you don't understand, you can use demo and view demo/app.js and
demo/index.html.

    git clone https://github.com/takeshy/socket.io-reqev.git
    cd socket.io-reqev/demo
    npm install
    node app.js

- browser

  http://localhost:8080


# License

MIT

