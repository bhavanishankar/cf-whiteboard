(function($) {

    $.widget("ui.toolbar", {
        options: {
            color: "#fff",
            backgroundColor: "#000"
        },

        _create: function() {
            var self = this,
                o = self.options,
                el = self.element,
                toolbar = $(el).append('<div class="tool-bar"><div class="box-title">Tools</div>' + this.getShapesMarkup(o.imagesPath,o.shapes) + '</div>');

            $('.shape_icon').live('click', function(event) {
                if (toolbar.currentShape) {
                    toolbar.currentShape.removeClass('icon_selected');
                }
                $('#freeow').show();
                toolbar.currentShape = $(this);
                toolbar.currentShape.addClass('icon_selected');
                event.shapeSelected =  $(this).attr('id');
                self._trigger('shapeSelected', event);

            });
            o.dropElement.click(function (e) {
               if (toolbar.currentShape) {
                   self._trigger('dropElementClicked', e);
                   toolbar.currentShape.removeClass('icon_selected');
               }
            });
            this.option( this.options );
        },

        getShapesMarkup:function(imagesPath, shapes) {
            var toolbarShapesMarkup = '';
            for (var index in shapes) {
                if (shapes.hasOwnProperty(index)) {
                    var _shape = shapes[index].name;
                    var _shapeSource =  imagesPath + shapes[index].iconName;
                    toolbarShapesMarkup += '<div class="shape_icon" id="' + _shape + '"><a href="#" rel="tooltip" title="' + _shape + '"><img alt="' + _shape + '" class="image_style"  src="' + _shapeSource + '" /></a></div><hr />';
                }
            }
            return toolbarShapesMarkup;
        },

        removeShapeSelection: function() {
            toolbar.currentShape.removeClass('icon_selected');
        },

        destroy: function() {
            this.element.next().remove();
        },

        _setOption: function(option, value) {
            $.Widget.prototype._setOption.apply( this, arguments );
            var el = this.element;
         }
    });
})(jQuery);