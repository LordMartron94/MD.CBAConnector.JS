class RequestProcessor {
    constructor(messageHandler) {
        this._messageHandler = messageHandler;
    }

    processIncomingMessage(incomingMessage) {
        // This will obviously never happen in a real-world scenario (because the server routes only back what we ourselves have registered), but it's a placeholder for demonstration purposes.
        this._messageHandler.sendResponse(355, "Unknown request. Can't process this one.", incomingMessage.unique_id);
    }
}

module.exports = { RequestProcessor };