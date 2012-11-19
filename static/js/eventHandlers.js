var eventHandler = {

    bindEvents: function () {
        $(document).bind('keydown', this.onKeyDown);
        $(window).resize(app.resize);
        $('.canvas-bg').bind('mousedown', this.onCanvasMouseDown);
        this.iconClickHandler();
        this.textAreaHandler();
    },

    onCanvasMouseDown: function (event) {
        if (toolBar.shapeSelected) {
            var scrollLeft = $('.canvas-bg').scrollLeft();
            var mouseX = event.pageX - canvasObj.canvasOffset.left + scrollLeft; // offset X
            var mouseY = event.pageY - canvasObj.canvasOffset.top; // offset Y
            app.notifyNewShapeEvent({
                x: mouseX,
                y: mouseY
            });
            toolBar.shapeSelected = false;
            toolBar.currentShape.removeClass('icon_selected');
            toolBar.currentShape = null;
        }
    },

    onKeyDown: function (e) {
        var evt = (e) ? e : (window.event) ? window.event : null;
        if (evt) {
            var canvas = canvasObj.canvas;
            var key = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
            if (key === 46) { //  DELETE
                canvas.deleteObjects();
            } else if (key === 37) {
                //left arrow
                canvas.moveObject('left');
            } else if (key === 38) {
                // up arrow
                canvas.moveObject('up');
            } else if (key === 39) {
                // right arrow
                canvas.moveObject('right');
            } else if (key === 40) {
                // down arrow
                canvas.moveObject('down');
            }
        }

    },

    iconClickHandler: function () {
        $('.shape_icon').on('click', function () {
            if (toolBar.currentShape) {
                toolBar.currentShape.removeClass('icon_selected');
            }
            $('#freeow').show();
            toolBar.currentShape = $(this);
            toolBar.currentShape.addClass('icon_selected');
            $("#freeow").freeow("", "Now click on canvas to add a new shape", {
                classes: ["gray"],
                prepend: false
            });
            app.shapeToDraw = $(this).attr('id');
            toolBar.shapeSelected = true;
        })
    },

    textAreaHandler: function () {
        $('textarea').keydown(function (event) {
            if (event.keyCode == 13 && event.shiftKey) {
                event.stopPropagation();

            } else if (event.keyCode == 13) {
                chat.onTextSubmit();
                chat.chatInputElement.val('');
                return false;
            }
        });
    },

}