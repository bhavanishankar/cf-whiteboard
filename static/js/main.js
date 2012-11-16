/**
 * main.js
 * Developer: Bhavani Shankar
 * About this : This is the main javascipt file to handle adding, editing, deleting all elements on canvas (text, rectangle, circle etc)
 * Uses 'Fabric.js' library for client side
 * Node.js and  Node Package Manager (NPM) for server side - JavaScript environment that uses an asynchronous event-driven model.
 */
var app = {
    sockjs_url: '/echo',
    sockjs: null,
    div: $('#chat-div #chat-text'),
    inp: $('#chat-div textarea'),
    form: $('#chat-div form'),
    user_name: $('.user-name'),
    user_id: null,
    canvas: null,
    currentIcon: null,
    userName: 'Guest',
    canvasWidth: 850,
    canvasHeight: 500,

    init: function () {
        this.initShowPrompt();
        this.sockjs = new SockJS(this.sockjs_url);
        $('#chat-div textarea').focus();
        this.canvas = new fabric.Canvas('canvas_area');
        this.iconClickHandler();
        this.sockjs.onopen = this.onSocketOpen;
        this.sockjs.onmessage = this.onSocketMessage;
        this.sockjs.onclose = this.onSocketClose;
        this.addObservers();
        document.onkeydown = this.keyDown;
        this.textAreaHandler();
        $('.canvas-bg').bind('mousedown', this.mouseDown);
        app.resize();
        window.onresize = app.resize;
    },

    setCanvas: function () {
        /* Need to set canvas dimensions when window is resized */
        app.canvas.setDimensions({
            width: app.canvasWidth,
            height: app.canvasHeight
        });
        app.canvasOffset = $('.canvas-div').offset();
    },

    resize: function () {
        var docHeight = $(window).height();
        var docWidth = $(window).width();
        $('.canvas-div').width(docWidth - 350);
        app.canvas.renderAll();
        app.setCanvas();
    },

    mouseDown: function (event) {
        if (app.iconSelected) {
            var scrollLeft = $('.canvas-bg').scrollLeft();
            var mouseX = event.pageX - app.canvasOffset.left + scrollLeft; // offset X
            var mouseY = event.pageY - app.canvasOffset.top; // offset Y
            app.notifyNewShapeEvent({
                x: mouseX,
                y: mouseY
            });
            app.iconSelected = false;
            app.currentIcon.removeClass('icon_selected');
            app.currentIcon = null;
        }
    },

    onSocketOpen: function () {
        $('#spinner').hide();
        $('#wait').hide();
        app.displayMessage('[*] open', app.sockjs.protocol);

    },

    onSocketMessage: function (e) {
        var data = JSON.parse(e.data);
        switch (data.action) {
            case 'newUser':
                app.userJoined(data);
                break;
            case 'text':
                app.textMessage(data);
                break;
            case 'new_shape':
                app.createNewShape(data);
                break;
            case 'modified':
                app.modifyObject(data);
            default:
                //
                break;
        }
    },

    onSocketClose: function () {
        app.displayMessage('[*] close', '');
    },

    createNewShape: function (data, include) {
        var args = [];
        var argsObj = shapes[data.shape].defaultValues;
        argsObj['left'] = data.position.x;
        argsObj['top'] = data.position.y;
        argsObj['uid'] = data.uid;
        args.push(argsObj)
        shapes[data.shape].toolAction.apply(this, args);
        $("#freeow").hide();
    },

    textMessage: function (data) {
        app.displayMessage('<b>[ ' + data.userName + ' ]:</b> ', data.message);
    },

    userJoined: function (data) {
        if (!app.user_name.hasClass('newUser')) {
            app.user_name.addClass('newUser');
            app.user_name.addClass(data.id);
            $('#username').text(app.userName);
            app.user_id = data.id;
        }
    },

    onFormSubmit: function () {
        app.displayMessage('<b>[' + app.userName + ' ]:</b> ', app.inp.val());
        app.sockjs.send(JSON.stringify({
            action: 'text',
            message: app.inp.val(),
            userName: app.userName
        }));
        app.inp.val('');
        $('#chat-div textarea').focus();

        return false;
    },

    displayMessage: function (m, p) {
        this.div.append(m + ' ' + p);
        this.div.append($("<br>"));
        this.div.scrollTop(this.div.scrollTop() + 10000);
    },

    iconClickHandler: function () {
        $('.shape_icon').on('click', function () {
            if (app.currentIcon) {
                app.currentIcon.removeClass('icon_selected');
            }
            $('#freeow').show();
            app.currentIcon = $(this);
            app.currentIcon.addClass('icon_selected');
            $("#freeow").freeow("", "Now click on canvas to add a new shape", {
                classes: ["gray"],
                prepend: false
            });
            app.shapeToDraw = $(this).attr('id');
            app.iconSelected = true;
        })
    },

    notifyNewShapeEvent: function (posObj) {
        var uniqId = util.uniqid();
        app.sockjs.send(JSON.stringify({
            action: 'new_shape',
            message: 'new',
            position: posObj,
            shape: app.shapeToDraw,
            uid: uniqId
        }));
        var _data = {};
        _data.position = posObj;
        _data.uid = uniqId;
        _data.shape = app.shapeToDraw;
        app.createNewShape(_data, true);
    },

    modifyObject: function (data) {
        var obj = util.getObjectById(data.args[0].uid, canvas);
        if (obj) {
            shapes[data.name].modifyAction.apply(this, data.args);
            app.canvas.setActiveObject(obj);
            obj.setCoords(); // without this object selection pointers remain at orginal postion(beofore modified)
        }
        app.canvas.renderAll();
    },

    addObservers: function () {
        app.canvas.observe('object:modified', function (e) {
        	   var activeGroup = app.canvas.getActiveGroup();
            if (activeGroup) {
            	 app.canvas.discardActiveGroup();
                var objectsInGroup = activeGroup.getObjects();
	             objectsInGroup.forEach(function (object) {
	             	 if(object.name === 'line') object.scaleY = 1;
	                app.sockjs.send(app.getModifiedObject(object));
	            });
               return;
            }
            var obj = e.target;
            if(obj.name === 'line') obj.scaleY = 1;
            app.sockjs.send(app.getModifiedObject(obj));
        })
    }, //end of addObservers

    getModifiedObject: function (obj) {
        var obj = JSON.stringify({
            action: "modified",
            name: obj.name,
            args: [{
                uid: obj.uid,
                object: obj
            }] // When sent only 'object' for some reason object  'uid' is not available to the receiver method.
        })
        return obj;
    },

    deleteObjects: function () {
        var canvas = app.canvas;
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();
        if (activeObject) {
            canvas.remove(activeObject);
            /*matisse.comm.sendDrawMsg({
              action: "delete",
              args: [{
                  uid: activeObject.uid
              }]
          });
          $('#prop').remove();*/
        } else if (activeGroup) {
            var objectsInGroup = activeGroup.getObjects();
            app.canvas.discardActiveGroup();
            objectsInGroup.forEach(function (object) {
                app.canvas.remove(object);
            });
        }
    },

    keyDown: function (e) {
        var evt = (e) ? e : (window.event) ? window.event : null;
        if (evt) {
            var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
            if (key === 46) { // ALT + DELETE
                app.deleteObjects();
            } else if (key === 37) {
                //left arrow
                app.moveObject('left');
            } else if (key === 38) {
                // up arrow
                app.moveObject('up');
            } else if (key === 39) {
                // up arrow
                app.moveObject('right');
            } else if (key === 40) {
                // up arrow
                app.moveObject('down');
            }
        }

    },

    moveObject: function (direction) {
        var canvas = app.canvas;
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();
        if (activeObject) {
            switch (direction) {
                case 'left':
                    var leftX = activeObject.left;
                    activeObject.set('left', leftX - 5);
                    break;
                case 'up':
                    var topY = activeObject.top;
                    activeObject.set('top', topY - 5);
                    break;
                case 'right':
                    var leftX = activeObject.left;
                    activeObject.set('left', leftX + 5);
                    break;
                case 'down':
                    var topY = activeObject.top;
                    activeObject.set('top', topY + 5);
                    break;
            }
            activeObject.setCoords();
            canvas.renderAll();
            app.sockjs.send(app.getModifiedObject(activeObject));
        } else {
            canvas.discardActiveGroup();
        }
    },

    textAreaHandler: function () {
        $('textarea').keydown(function (event) {
            if (event.keyCode == 13 && event.shiftKey) {
                event.stopPropagation();

            } else if (event.keyCode == 13) {
                app.onFormSubmit();
                $('#chat-div textarea').val('');
                return false;
            }
        });
    },

    initShowPrompt: function () {
        window.showPrompt = function () {
            do {
                app.userName = prompt("Please enter your name( 4 to 15 chars)");
            }
            while (app.userName == null || app.userName.length < 4 || app.userName.length > 15);
        }
        showPrompt();
    }


} //end of app				
