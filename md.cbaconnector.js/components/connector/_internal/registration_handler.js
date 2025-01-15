const {PayloadFactory} = require("./payload_factory");
const {Message} = require("../model/message");

class RegistrationHandler {
    constructor(connector, socket) {
        this._connector = connector;
        this._socket = socket;
    }

    /**
     * @param {string} message The Registration JSON String
     */
    register(message) {
        const messageConverted = Message.fromJson(message);

        this._connector.sendMessage(this._socket, messageConverted);
        this._connector.startKeepAliveMessageLoop(this._socket);
    }

    unregister() {
        const payload = PayloadFactory.buildPayload({
            action: 'unregister',
            args: [],
        });
        const message = new Message(payload);
        this._connector.sendMessage(this._socket, message);
    }
}

module.exports = { RegistrationHandler };