var eventHandler = {

   
	bindEvents: function() {
	 	 $(document).bind('keydown', this.onKeyDown);
	 	 $(window).resize(app.resize);
	 	 $('.canvas-bg').bind('mousedown', this.onCanvasMouseDown);
	 	 this.iconClickHandler();
	 	 this.textAreaHandler();
	 },
   
    onCanvasMouseDown: function (event) {
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
    
	 onKeyDown: function (e) {
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
                // right arrow
                app.moveObject('right');
            } else if (key === 40) {
                // down arrow
                app.moveObject('down');
            }
        }

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
    
    textAreaHandler: function () {
        $('textarea').keydown(function (event) {
            if (event.keyCode == 13 && event.shiftKey) {
                event.stopPropagation();

            } else if (event.keyCode == 13) {
                app.onTextSubmit();
                chatInputElement.val('');
                return false;
            }
        });
    }, 

}