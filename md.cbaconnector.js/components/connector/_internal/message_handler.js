const {PayloadFactory} = require("./payload_factory");
const {Message} = require("../model/message");

class MessageHandler {
    constructor(connector, socket) {
        this._connector = connector;
        this._socket = socket;
        this._sendMessageActions = [];
    }

    subscribeToSendMessage(sendMessageAction) {
        if (this._sendMessageActions.includes(sendMessageAction)) {
            return;
        }
        this._sendMessageActions.push(sendMessageAction);
    }

    unsubscribeFromSendMessage(sendMessageAction) {
        const index = this._sendMessageActions.indexOf(sendMessageAction);
        if (index > -1) {
            this._sendMessageActions.splice(index, 1);
        }
    }

    sendRequest(action, args, onResponseReceived = null) {

        const payload = PayloadFactory.buildPayload({ action, args });
        const message = new Message(payload);

        this._connector.sendMessage(this._socket, message);

        this.informSubscriptions(message, onResponseReceived);
        return message.unique_id;
    }

    sendResponse(responseCode, responseMessage, targetID) {

        const payload = PayloadFactory.buildPayload({
            action: 'response',
            args: [
                ['string', responseMessage],
                ['int', String(responseCode)],
            ],
        });
        const message = new Message(payload, targetID);
        this._connector.sendMessage(this._socket, message);
        return message.unique_id;
    }

    informSubscriptions(message, onResponseReceived = null) {
        this._sendMessageActions.forEach((sendMessageAction) => {
            sendMessageAction(message, onResponseReceived)
        });
    }
}

module.exports = { MessageHandler };