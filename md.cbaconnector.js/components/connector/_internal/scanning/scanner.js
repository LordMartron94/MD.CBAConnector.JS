const { Message } = require('../../model/Message');

class Scanner {
    constructor(messageProcessor) {
        this._messageProcessor = messageProcessor;
    }

    /**
     * @param {string} message
     * @param {string} endOfMessageToken
     */
    processMessage(message, endOfMessageToken) {
        const json = message.replace(endOfMessageToken, "");
        const processedMessage = Message.fromJson(json);
        this._messageProcessor.processIncomingMessage(processedMessage);
    }
}

module.exports = { Scanner };