var sockJSClient = {
    sockjs_url: '/echo',
    init: function () {
        whiteboardApp.sockJS = new SockJS(this.sockjs_url);
        whiteboardApp.sockJS.onopen = this.onSocketOpen;
        whiteboardApp.sockJS.onmessage = this.onSocketMessage;
        whiteboardApp.sockJS.onclose = this.onSocketClose;
    },

    onSocketOpen: function () {
        $('#spinner').hide();
        $('#wait').hide();
       // chat.displayMessage('[*] open', whiteboardApp.sockJS.protocol);
        whiteboardApp.chat.data('chatwindow').displayMessage('<b>[*] opened :</b> ', whiteboardApp.sockJS.protocol);
        whiteboardApp.sockJS.send(JSON.stringify({
            action: 'text',
            message: 'Joined',
            userName: whiteboardApp.userName
        }));
    },

    onSocketMessage: function (e) {
        var data = JSON.parse(e.data);
        switch (data.action) {
            case 'text':
                whiteboardApp.textMessage(data);
            break;
            case 'new_shape':
                whiteboardApp.createNewShape(data);
            break;
            case 'modified':
                whiteboardApp.canvasWidget.data('canvas').modifyObject(data);
            break;
            case 'deleted':
                whiteboardApp.canvasWidget.data('canvas').deleteObject(data);
            break;    
        }
    },

    onSocketClose: function () {
        whiteboardApp.chat.data('chatwindow').displayMessage('<b>[ [*] closed ]:</b> ');
        whiteboardApp.sockJS.send(JSON.stringify({
            action: 'text',
            message: 'Left',
            userName: whiteboardApp.userName
        }));
    }

};