var chat = {
    chatDivElement: null,
    chatInputElement: null,

    init: function () {
        this.cacheDOMElements();
        this.setChatInputFocus();
    },

    setChatInputFocus: function () {
        this.chatInputElement.focus();


    },

    cacheDOMElements: function () {
        this.chatDivElement = $('#chat-div #chat-text');
        this.chatInputElement = $('#chat-div textarea');
    },

    displayMessage: function (m, p) {
        this.chatDivElement.append(m + ' ' + p);
        this.chatDivElement.append($("<br>"));
        this.chatDivElement.scrollTop(this.chatDivElement.scrollTop() + 10000);
    },

    onTextSubmit: function () {
        this.displayMessage('<b>[' + app.userName + ' ]:</b> ', this.chatInputElement.val());
        app.sockjs.send(JSON.stringify({
            action: 'text',
            message: this.chatInputElement.val(),
            userName: app.userName
        }));
        this.chatInputElement.val('');
        this.setChatInputFocus();
        return false;
    }

}