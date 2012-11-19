var sockJSServer = {
 initSockJS: function(server)  {
        var sockjs = require('sockjs');

        /*List of incomming clients will be maintained in this map*/
        var clients = {};

        /*List of commands place here */
        var clientData = [];

        /* Create sockjs server */
        var sockjs_echo = sockjs.createServer({
            sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js",
            websocket: false
        });

        /*we call installHandlers passing in the app server so we can listen and answer any incoming requests on the echo path.*/
        sockjs_echo.installHandlers(server, {
            prefix: '/echo'
        });

        /*Listens for incoming connect events*/
        sockjs_echo.on('connection', onSockJSConnection);

        /*Is triggered when a new user joins in*/
        function onSockJSConnection(conn) {
            /*Add him to the clients list*/
            clients[conn.id] = conn;
            for (var index in clientData) {
                if (clientData.hasOwnProperty(index)) {
                    conn.write(JSON.stringify(clientData[index]));
                }
            }
            /*Listen for data events on this client*/
            conn.on('data', function (data) {
                onDataHandler(data, conn.id);
                var dataObj = JSON.parse(data);
                clientData.push(dataObj);
            });
        };

        /* Handling data received from client to broadcast */
        function onDataHandler(dataStr, id) {
            var dataObj = JSON.parse(dataStr);
            dataObj.id = id;
            broadcast(dataObj);
        };

        /*To broadcast the data received from one client to all other active clients*/
        function broadcast(message, includeSelf) {
            for (var index in clients) {
                if (clients.hasOwnProperty(index)) {
                    var client = clients[index];
                    if (includeSelf || client.id != message.id) {
                        client.write(JSON.stringify(message));
                    }
                }
            }
        };
    }
};
module.exports = sockJSServer;