/* app.js */
(function() {
	/* Get the required modules */
	var express = require('express');
	var sockjs = require('sockjs');
	var http = require('http');
	var app = express();
	
	/* Create http server */
	var server = http.createServer(app);
	var clients = {};

	/* Create sockjs server */	
	var sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js", websocket:false};
	var sockjs_echo = sockjs.createServer(sockjs_opts);
	
	app.use('/static', express.static(__dirname + '/static'));
	sockjs_echo.installHandlers(server, {prefix:'/echo'});
	server.listen(process.env.VCAP_APP_PORT || 4000);
	
	app.get('/', function (req, res) {
	    res.sendfile(__dirname + '/index.html');
	});
	
	sockjs_echo.on('connection', onSockjsConnection);

   /* to broadcast the data received from one client to all other active clients*/ 
	function broadcast (message, exclude) {
		for ( var i in clients ) {
			if ( i != exclude ) clients[i].write( JSON.stringify(message) );
		}
	}

   /* Listen to socket connection and data receive events*/
	function onSockjsConnection(conn) {
		clients[conn.id] = conn;
		broadcast({ action: 'newUser' , id: conn.id});
	   conn.on('data', function(data) {
				onDataHandler(data, conn.id)
	   });
	}
	
	/* Handling data received from client to broadcast */
	function onDataHandler(data, id) {
		data = JSON.parse(data);
		data.id = id;
		broadcast(data, id);
	}
	
})()
