/* app.js */
(function() {
	
	function initServer(){
		var express = require('express');
		var http = require('http');
		var config = require('./config');
		var app = express();

		/* Create http server */
		var server = http.createServer(app);
		
		app.use('/static', express.static(__dirname + '/static'));
		server.listen(config.port);
		app.get('/', function (req, res) {
		    res.sendfile(__dirname + '/index.html');
		});
		
		return server;
	};

	function initSockJS(server) {
		var sockjs = require('sockjs');
		
		/*List of incomming clients will be maintained in this map*/
		var clients = {};

		/* Create sockjs server */	
		var sockjs_echo = sockjs.createServer({
			sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js", 
			websocket: false
		});
	
		/*we call installHandlers passing in the app server so we can listen and answer any incoming requests on the echo path.*/
		sockjs_echo.installHandlers(server, {
			prefix: '/echo'
		});

		/*Listens for incomming connect events*/
		sockjs_echo.on('connection', onSockJSConnection);
		
		/*Is triggered when a new user joins in*/
		function onSockJSConnection(conn) {
			/*Add him to the clients list*/
			clients[conn.id] = conn;
			
			/*Listen for data events on this client*/
		   conn.on('data', function(data) {
				onDataHandler(data, conn.id)
		   });
		};

		/* Handling data received from client to broadcast */
		function onDataHandler(dataStr, id) {
			var dataObj = JSON.parse(dataStr);
			dataObj.id = id;
			broadcast(dataObj);
		};

		/*To broadcast the data received from one client to all other active clients*/ 
		function broadcast (message, includeSelf) {
			for ( var index in clients ) {
				if(clients.hasOwnProperty(index)) {
					var client = clients[index];
					if (includeSelf || client.id != message.id){
						client.write(JSON.stringify(message));
					} 
				}
			}
		};
	};
	
	initSockJS(initServer());
})()

