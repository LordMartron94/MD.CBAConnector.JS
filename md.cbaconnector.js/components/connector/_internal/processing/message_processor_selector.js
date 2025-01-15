const { ResponseProcessor } = require('./response_processor');
const { RequestProcessor } = require('./request_processor');


class MessageProcessorSelector {
    constructor() {
        this._responseProcessor = null;
        this._requestProcessor = null;
        this._initialized = false;
    }

    initialize(messageHandler) {
        this._responseProcessor = new ResponseProcessor(messageHandler);
        this._requestProcessor = new RequestProcessor(messageHandler);
        this._initialized = true;
    }

    processIncomingMessage(incomingMessage) {
        if (!this._initialized) {
            throw new Error('Message processor selector is not initialized');
        }

        switch (incomingMessage.payload.action) {
            case 'response':
            case 'error':
                this._responseProcessor.processIncomingMessage(incomingMessage);
                break;
            default:
                this._requestProcessor.processIncomingMessage(incomingMessage);
                break;
        }
    }
}

module.exports = { MessageProcessorSelector };