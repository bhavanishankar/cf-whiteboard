/** canvas widget **/

(function ($$) {

    $.widget("ui.canvas", {

        // set default options
        options:{
            canvasWidth:850,
            canvasHeight:500
        },

        // initialize the plugin
        _create:function () {
            var self = this,
                _options = self.options,
                _element = self.element,
                _canvasBG = $('<div>').addClass('canvas-bg'),
                _canvasArea = $('<canvas>').attr('id', 'canvas_area')
                                        .width(_options.canvasWidth)
                                        .height(_options.canvasHeight);

                _element.addClass('ui-canvas')
                        .addClass('canvas-div');
                _canvasBG.append(_canvasArea);
                _element.append(_canvasBG);
            this.canvasWidth = _options.canvasWidth;
            this.canvasHeight = _options.canvasHeight;
            this.createFabricCanvas(_options.fabric);
        },

        createFabricCanvas: function(_fabric) {
            this.canvas = new _fabric.Canvas('canvas_area');
            this.resize();
            this.canvas.setDimensions({
                width: this.canvasWidth,
                height: this.canvasHeight
            });
            this.addObservers();
        },

        getCanvasInstance:function() {
             return this.canvas;
        },

        resize: function () {
            var docWidth = $(window).width();
            var chatDivWidth = $('#chat-div').outerWidth();
            var toolBarWidth = $('.left-bar').outerWidth();
            $('.canvas-div').width(docWidth - ( chatDivWidth + toolBarWidth ) - toolBarWidth/2);
            this.canvas.renderAll();
            //this.prepareCanvas();
        },

        addObservers: function () {
            var self = this;
            this.canvas.observe('object:modified', function (e) {
                var activeGroup = self.canvas.getActiveGroup();
                if (activeGroup) {
                    self.canvas.discardActiveGroup();
                    var objectsInGroup = activeGroup.getObjects();
                    objectsInGroup.forEach(function (object) {
                        if(object.name === 'line') object.scaleY = 1;
                        /* call notify server method */
                        //whiteboardApp.sockJS.send(whiteboardApp.getModifiedShapeJSON(object, "modified"));
                    });
                    return;
                }
                var obj = e.target;
                if(obj.name === 'line') obj.scaleY = 1;
                /* call notify server method */
                //whiteboardApp.sockJS.send(whiteboardApp.getModifiedShapeJSON(obj, "modified"));
            })
        }, //end of addObservers

        deleteObject: function(data) {
            var obj = this.getObjectById(data.args[0].uid, this.canvas);
            if (obj) {
                this.canvas.remove(obj);
            }
        },

        getObjectById: function (id) {
            var obj;
            var objs = this.canvas.getObjects();
            objs.forEach(function (object) {
                if (object.uid === id) {
                    obj = object;
                }
            });
            return obj;
        },

        updateProperties: function (obj, recvdObj) {
            obj.left = recvdObj.left;
            obj.top = recvdObj.top;
            obj.scaleX = recvdObj.scaleX;
            obj.scaleY = recvdObj.scaleY;
            obj.width = recvdObj.width;
            obj.height = recvdObj.height;
            obj.setAngle(recvdObj.angle);
            if (recvdObj.fill) {
                obj.set("fill", recvdObj.fill);
            }
            if (recvdObj.stroke) {
                obj.set("stroke", recvdObj.stroke);
            }
            if (obj.text) {
                obj.text = recvdObj.text;
            }
            if(recvdObj.path) {
                obj.path = recvdObj.path;
            }

            if(obj.name === 'line') {
                obj.scaleY = 1;
            }
        },

        modifyObject: function (data) {
            var obj = this.getObjectById(data.args[0].uid);
            if (obj) {
                //whiteboardApp.shapes[data.name].modifyAction.apply(this, data.args);
                this.canvas.setActiveObject(obj);
                obj.setCoords(); // without this object selection pointers remain at orginal postion(beofore modified)
            }
            this.canvas.renderAll();
        },

        moveObject: function (direction) {
            var canvas = this.canvas;
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
                //whiteboardApp.sockJS.send(whiteboardApp.getModifiedShapeJSON(activeObject));
            } else {
                canvas.discardActiveGroup();
            }
        },

        onDeletePress: function () {
            var self = this;
            var activeObject = this.canvas.getActiveObject(),
                activeGroup = this.canvas.getActiveGroup();
            if (activeObject) {
                this.canvas.remove(activeObject);
                //whiteboardApp.sockJS.send(whiteboardApp.getModifiedShapeJSON(activeObject, "deleted"));
            } else if (activeGroup) {
                var objectsInGroup = activeGroup.getObjects();
                this.canvas.discardActiveGroup();
                objectsInGroup.forEach(function (object) {
                    self.canvas.remove(object);
                    //whiteboardApp.sockJS.send(whiteboardApp.getModifiedShapeJSON(object, "deleted"));
                });
            }
        },

        /*TODO need to update with correct statements*/
        destroy:function () {
            this.element.removeClass('ui-toolbar')
                .remove();
        }

        /*_setOption:function (option, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
            var el = this.element;
            if (option === "title") {
                $(el).css(option, value);
            }
        } */
    });
})(jQuery);