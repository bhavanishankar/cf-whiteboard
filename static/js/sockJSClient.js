var sockJSClient = {
	  sockjs_url: '/echo',
	  init: function() {
	  	app.sockjs = new SockJS(this.sockjs_url);
	  	app.sockjs.onopen = this.onSocketOpen;
        app.sockjs.onmessage = this.onSocketMessage;
        app.sockjs.onclose = this.onSocketClose;
	  },
	  
	  onSocketOpen: function () {
        $('#spinner').hide();
        $('#wait').hide();
        app.displayMessage('[*] open', app.sockjs.protocol);
        app.sockjs.send(JSON.stringify({
	            action: 'text',
	            message: 'Joined',
	            userName: app.userName
	        }));
    },

    onSocketMessage: function (e) {
        var data = JSON.parse(e.data);
        switch (data.action) {
            case 'text':
                app.textMessage(data);
                break;
            case 'new_shape':
                app.createNewShape(data);
                break;
            case 'modified':
                app.modifyObject(data);
				break;
        }
    },

    onSocketClose: function () {
        app.displayMessage('[*] close', '');
        app.sockjs.send(JSON.stringify({
	            action: 'text',
	            message: 'Left',
	            userName: app.userName
	        }));
    }
        
}