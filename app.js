/* app.js */
(function () {

    function init() {
        var express = require('express');
        var http = require('http');
        var app = express();
	     
		  /* Set static folder*/	
        app.use('/static', express.static(__dirname + '/static'));
        
        /* redirect user to index.html*/
        app.get('/', function (req, res) {
            res.sendfile(__dirname + '/index.html');
        });
        
		  loadConfig(function(dataObj){
		  	   /* Create http server */
        		var server = http.createServer(app);
				server.listen(process.env.VCAP_APP_PORT || dataObj.port);	
				initSockServer(server);	  	
		  });
		  
	};
	
	function loadConfig(callback) {
	  var fs = require('fs');
	  /* load configuration data */
     fs.readFile( __dirname + '/config.json', function(err, data) {
     		callback(JSON.parse(data))
     });
	}
		
	function initSockServer(server){
		var sockJSServer = require('./sockJSServer');
		sockJSServer.initSockJS(server);
	}
	
	init();
})()