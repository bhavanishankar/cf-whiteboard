/**
 * main.js
 * About this : This is the main javascript file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */
var whiteboardApp = {
    sockJS: null,
    chatDivElement: null,
    chatInputElement: null,
    currentIcon: null,
    userName: 'Guest',

    init: function () {
        /* Prevent from closing SockJS connection when ESC key is pressed*/
        window.addEventListener('keydown', function(e) { (e.keyCode === 27 && e.preventDefault()) })
        $('#wait').hide();
        $('#spinner').show().center($('.canvas-div'));
        this.initCanvas();
        this.initToolbar();
        this.initChatWindow();
        this.initShowPrompt();
        sockJSClient.init();
        $(document).bind('keydown', this.onKeyDown);
        $(window).resize(whiteboardApp.resize);
    },

    initToolbar: function () {
        var tb = $("#shapesToolbar").toolbar(
            {
                shapes:whiteboardApp.shapes, // shapes object with shape 'name' and 'iconname' ex: shapes = {  rectangle: {  name: 'rectangle', imagesPath:'/static/images/' } }
                dropTarget:$('.canvas-div'),
                title:'Shapes',
                shapeSelected:this.onShapeSelect,  // callback
                dropTargetClicked:this.onClickDropTarget   //callback
            }
        );
        /* syntax for calling public method */
        /* $(".tool-bar-holder").data('toolbar').publicMethod();*/

    },

    initChatWindow: function() {
        whiteboardApp.chat = $(".chat-div").chatwindow(
            {
                title: "Chat",
                textSubmitted:this.onTextSubmit
            } );
    },

    initCanvas:function() {
        whiteboardApp.canvasWidget = $("#canvas-holder").canvas(
            {
                title: "Canvas",
                fabric: fabric,
                shapeModified: this.onShapeModify,
                applyModify: this.onApplyModify,
                shapeDeleted: this.onShapeDelete
            } );
        whiteboardApp.canvas = whiteboardApp.canvasWidget.data('canvas').getCanvasInstance();
    },

    onApplyModify: function(event, data) {
        whiteboardApp.shapes[data.name].modifyAction.apply(this, data.args);
    },

    onShapeSelect:function(event) {
        whiteboardApp.shapeToDraw = event.shapeSelected;
        whiteboardApp.shapeSelected = true;
        $('#freeow').show();
    },

    onClickDropTarget:function(event) {
        if (whiteboardApp.shapeSelected) {
            var scrollLeft = $('.canvas-bg').scrollLeft(),
                mouseX = event.pageX - $('.canvas-div').offset().left + scrollLeft, // offset X
                mouseY = event.pageY - $('.canvas-div').offset().top; // offset Y
            whiteboardApp.notifyNewShapeEvent({
                x: mouseX,
                y: mouseY
            });
            whiteboardApp.shapeSelected = false;
        }
    },

    onTextSubmit: function (event) {
        whiteboardApp.chat.data('chatwindow').displayMessage('<b>[ ' + whiteboardApp.userName + ' ]:</b> ', $(event.currentTarget).val());
        whiteboardApp.sockJS.send(JSON.stringify({
            action: 'text',
            message: $(event.currentTarget).val(),
            userName: whiteboardApp.userName
        }));
        $(event.currentTarget).val('');
        $(event.currentTarget).focus();
        return false;
    },

    createNewShape: function (data) {
        var args = [],
            argsObj = whiteboardApp.shapes[data.shape].defaultValues;
        argsObj.left = data.positionObj.x;
        argsObj.top = data.positionObj.y;
        argsObj.uid = data.args[0].uid;
        args.push(argsObj);
        whiteboardApp.shapes[data.shape].toolAction.apply(this, args);
        $("#freeow").hide();
    },

    textMessage: function (data) {
        whiteboardApp.chat.data('chatwindow').displayMessage('<b>[ ' + data.userName + ' ]:</b> ', data.message);
    },

    notifyNewShapeEvent: function (posObj) {
        var uniqId = util.getUniqId(),
            _data = {};
        whiteboardApp.sockJS.send(JSON.stringify({
            action: 'new_shape',
            positionObj: posObj,
            shape: whiteboardApp.shapeToDraw,
            args: [
                {
            	uid: uniqId
                }
            ]
        }));
        _data.positionObj = posObj;
        _data.args = [{uid : uniqId }];
        _data.shape = whiteboardApp.shapeToDraw;
        whiteboardApp.createNewShape(_data);
    },

    onShapeModify:function(event, data) {
        whiteboardApp.sockJS.send(whiteboardApp.getModifiedShapeJSON(data, "modified"));
    },

    onShapeDelete:function(event, data) {
        whiteboardApp.sockJS.send(whiteboardApp.getModifiedShapeJSON(data, "deleted"));
    },

    getModifiedShapeJSON: function (shape, _action) {
        var _obj = JSON.stringify({
            action: _action,
            name: shape.name,
            args: [{
                uid: shape.uid,
                object: shape
            }] // When sent only 'object' for some reason object 'uid' is not available to the receiver method.
        });
        return _obj;
    },

    initShowPrompt: function () {
        window.showPrompt = function () {
            do {
                whiteboardApp.userName = prompt("Please enter your name( 4 to 15 chars)");
            }
            while (whiteboardApp.userName === null || whiteboardApp.userName.length < 4 || whiteboardApp.userName.length > 15);
            $('#username').text(whiteboardApp.userName);
        };
        window.showPrompt();
    },

    onKeyDown: function (e) {
        var evt = (e) ? e : (window.event) ? window.event : null;
        if (evt) {
            var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
            if (key === 46) { //  DELETE
                whiteboardApp.canvasWidget.data('canvas').onDeletePress();
            } else if (key === 37) {
                //left arrow
                whiteboardApp.canvasWidget.data('canvas').moveObject('left');
            } else if (key === 38) {
                // up arrow
                whiteboardApp.canvasWidget.data('canvas').moveObject('up');
            } else if (key === 39) {
                // right arrow
                whiteboardApp.canvasWidget.data('canvas').moveObject('right');
            } else if (key === 40) {
                // down arrow
                whiteboardApp.canvasWidget.data('canvas').moveObject('down');
            }
        }
    }

}; //end of app