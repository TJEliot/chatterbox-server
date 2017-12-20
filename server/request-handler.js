/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'content-type' : 'application/json'
};

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));  
};

var collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    callback(JSON.parse(data));
  });
};

var objectId = 1;
var messages = [
  {
    text: "hello this is sample text",
    username: 'tommo',
    objectId: objectId
  }
];

var actions = {
  'GET': function(request, response) {
    sendResponse(response, {results: messages});
  },
  'POST': function(request, response) {
    collectData(request, function(message){
      messages.unshift(message);
      message.objectId = objectId++;
      sendResponse(response, {objectId: 1});
    });
  },
  'OPTIONS': function(request, response) {
    sendResponse(response, null);
  }
};

module.exports = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
    //some sort of error handling goes here
  }

};