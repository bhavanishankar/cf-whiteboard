var toolBar = {
    shapeSelected: null,
    currentShape: null,

    addShapes: function () {
        $(".tool-bar-holder").toolbar(
            {
              shapes:shapes,
              dropElement:$('.canvas-div'),
              height:'500px',
              shapeSelected:this.onShapeSelect,
              dropElementClicked:this.onClickDropElement
            }
        );
    },

    onShapeSelect:function(event) {
        toolBar.shapeSelected = true;
    },

    onClickDropElement:function(event) {
        if (toolBar.shapeSelected) {
            var scrollLeft = $('.canvas-bg').scrollLeft();
            var mouseX = event.pageX - canvasObj.canvasOffset.left + scrollLeft; // offset X
            var mouseY = event.pageY - canvasObj.canvasOffset.top; // offset Y
            app.notifyNewShapeEvent({
                x: mouseX,
                y: mouseY
            });
            toolBar.shapeSelected = false;
        }
    }
}