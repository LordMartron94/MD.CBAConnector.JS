const { Constants } = require('./Constants')
const {MessageProcessorSelector} = require("./connector/_internal/processing/message_processor_selector");
const {Connector} = require("./connector/_internal/connectivity/connector");
const {MessageHandler} = require("./connector/_internal/message_handler");
const {RegistrationHandler} = require("./connector/_internal/registration_handler");
const {PayloadFactory} = require("./connector/_internal/payload_factory");
const {Message} = require("./connector/model/message");


class Communicator {
    constructor(componentPort = 50185) {
        const messageProcessor = new MessageProcessorSelector();
        this._connector = new Connector(messageProcessor);
        this._socket = this._connector.connectToRemote(Constants.ServerHost, Constants.ServerPort, componentPort);

        if (!this._socket) {
            throw new Error('Failed to connect to server');
        }

        const messageHandler = new MessageHandler(this._connector, this._socket);
        messageProcessor.initialize(messageHandler);
        this._messageHandler = messageHandler;

        this._registrationHandler = new RegistrationHandler(this._connector, this._socket);
        this._context = null;
    }

    /**
     * @param {SettingsContext} context
     */
    initialize(context) {
        this._context = context;
        this._registrationHandler.register(this._context.registrationString);
    }

    shutdown() {
        this.ensureInitialized();

        if (!this._context.keepServerAlive) {
            this.sendShutdownMessage();
        }

        this._registrationHandler.unregister();
        this._connector.shutdown();
        this._socket.destroy();
    }

    sendMessage(action, args, onResponseReceived = null) {
        this.ensureInitialized();
        return this._messageHandler.sendRequest(action, args, onResponseReceived);
    }

    sendResponse(responseCode, responseMessage, targetID) {
        this.ensureInitialized();
        return this._messageHandler.sendResponse(responseCode, responseMessage, targetID);
    }

    sendShutdownMessage() {
        this.ensureInitialized();
        const payload = PayloadFactory.buildPayload({
            action: 'shutdown',
            args: [],
        });

        const message = new Message(payload);
        this._connector.sendMessage(this._socket, message);
    }

    ensureInitialized() {
        if (!this._socket) {
            throw new Error('Socket is not initialized');
        }
    }
}

module.exports = { Communicator };