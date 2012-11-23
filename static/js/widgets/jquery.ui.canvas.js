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
                _canvasArea = $('<canvas>').attr('id', 'canvas_area')
                                        .width(_options.canvasWidth)
                                        .height(_options.canvasHeight);

            _element.addClass('ui-canvas')
                    .append(_canvasArea);
            this.canvasWidth = _options.canvasWidth;
            this.canvasHeight = _options.canvasHeight;
            this.initFabricCanvas(_options.fabric);
        },

        initFabricCanvas: function(_fabric) {
            this.canvas = new _fabric.Canvas('canvas_area');
            this.setCanvasDimensions();
            this.addObservers();
        },

        getCanvasInstance:function() {
             return this.canvas;
        },

        setCanvasDimensions: function () {
            /* Need to set canvas dimensions when window is resized */
            this.canvas.setDimensions({
                width: this.canvasWidth,
                height: this.canvasHeight
            });
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
                        self._trigger("shapeModified", null, object);
                        //whiteboardApp.sockJS.send(whiteboardApp.getModifiedShapeJSON(object, "modified"));
                    });
                    return;
                }
                var obj = e.target;
                if(obj.name === 'line') obj.scaleY = 1;

                /* call notify server method */
                self._trigger("shapeModified", null, obj);
                //whiteboardApp.sockJS.send(whiteboardApp.getModifiedShapeJSON(obj, "modified"));
            });
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
            $.each(['left', 'top', 'scaleX', 'scaleY', 'width', 'height'], function(index, item){
                obj[item] = recvdObj[item];
            });

            obj.setAngle(recvdObj.angle);

            if(obj.name === 'line') {
                obj.scaleY = 1;
            }
        },

        modifyObject: function (data) {
            var obj = this.getObjectById(data.args[0].uid);
            if (obj) {

                this._trigger('applyModify', null, data)
                this.canvas.setActiveObject(obj);
                obj.setCoords(); // without this object selection pointers remain at orginal postion(beofore modified)
            }
            this.canvas.renderAll();
        },

        moveObject: function (direction) {
            var canvas = this.canvas,
                activeObject = canvas.getActiveObject(),
                left, top;

            if (activeObject) {
                left = activeObject.left;
                top = activeObject.top;

                switch (direction) {
                    case 'left':
                        left -= 5;
                        break;
                    case 'up':
                        top -= 5;
                        break;
                    case 'right':
                        left += 5;
                        break;
                    case 'down':
                        top += 5;
                        break;
                }

                activeObject.set('left', left);
                activeObject.set('top', top);

                activeObject.setCoords();
                canvas.renderAll();

                this._trigger("shapeModified", null, activeObject);
            } else {
                canvas.discardActiveGroup();
            }
        },

        onDeletePress: function () {
            var self = this,
                activeObject = self.canvas.getActiveObject(),
                activeGroup, objectsInGroup;

            if (activeObject) {
                self._removeShape(activeObject);
            } else if (activeGroup) {
                activeGroup = self.canvas.getActiveGroup();
                objectsInGroup = activeGroup.getObjects();
                self.canvas.discardActiveGroup();

                objectsInGroup.forEach(function (object) {
                    self._removeShape(object);
                });
            }
        },

        _removeShape: function(object){
            this.canvas.remove(object);
            this._trigger('shapeDeleted', null, object);
        },

        /*TODO need to update with correct statements*/
        destroy:function () {
            this.element.removeClass('ui-toolbar')
                .remove();
        }
    });
})(jQuery);