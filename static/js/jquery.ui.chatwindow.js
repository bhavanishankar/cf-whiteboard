
(function ($) {

    $.widget("ui.chatwindow", {

        // set default options
        options:{
            title:"Chat"
        },

        // initialize the plugin
        _create:function () {
            var self = this,
                _options = self.options,
                _element = self.element,
                _textareaForm = $('<textarea placeholder="Type here">'),
                _chatTextDiv = $('<div>').addClass('chat-text'),
                _chatWindowTitle = $('<div>')
                                    .addClass('box-title')
                                    .append(_options.title);

                _element.addClass('ui-chatwindow')
                        .append(_chatWindowTitle)
                        .append(_chatTextDiv)
                        .append(_textareaForm);

            var chatWindowHeight =  _element.height(),
                textAreaHeight =  _element.find('textarea').height(),
                titleHeight = _element.find('.box-title').height(),
                textAreaMargin = parseInt(_element.find('textarea').css('margin-bottom'), 10),
                _chatextHeight = chatWindowHeight - textAreaHeight - titleHeight - textAreaMargin;

            _element.find('.chat-text').css('height', _chatextHeight);
            _element.find('textarea').keydown(function (event) {
                if (event.keyCode == 13 && event.shiftKey) {
                    event.stopPropagation();

                } else if (event.keyCode == 13) {
                    self._trigger("textSubmitted", event);
                    return false;
                }
            });
        },

        displayMessage: function (user, message) {
            var chat_text_element = $(this.element.find('.chat-text'));
            chat_text_element.append(user + ' ' + message)
                             .append($("<br>"))
                             .scrollTop(this.element.scrollTop() + 10000);
        },

        /*TODO need to update with correct statements*/
        destroy:function () {
            this.element.removeClass('ui-chatwindow')
                .remove();
        },

        _setOption:function (option, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
            var el = this.element;
            if (option === "title") {
                $(el).css(option, value);
            }
        }
    });
})(jQuery);