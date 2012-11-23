var sockJSClient = {
    sockjs_url: '/echo',
    init: function () {
        whiteboardApp.sockJS = new SockJS(this.sockjs_url);
        whiteboardApp.sockJS.onopen = this.onSocketOpen;
        whiteboardApp.sockJS.onmessage = this.onSocketMessage;
        whiteboardApp.sockJS.onclose = this.onSocketClose;
    },

    onSocketOpen: function (conn) {
        $('#spinner').hide();
        $('#wait').hide();
        whiteboardApp.chatWidget.chatwindow('displayMessage' ," <b>[ Opened ]:</b>  ", whiteboardApp.sockJS.protocol);
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
                whiteboardApp.canvasWidgetInstance.canvas('modifyObject', data);
            break;
            case 'deleted':
                whiteboardApp.canvasWidgetInstance.canvas('deleteObject', data);
            break;
        }
    },

    onSocketClose: function (conn) {
        whiteboardApp.chatWidget.chatwindow('displayMessage' ," <b>[ closed ]</b>", "");
        whiteboardApp.sockJS.send(JSON.stringify({
            action: 'text',
            message: 'Left',
            userName: whiteboardApp.userName
        }));
    }
};