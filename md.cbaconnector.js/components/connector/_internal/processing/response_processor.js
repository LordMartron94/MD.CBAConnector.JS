class ResponseProcessor {
    constructor(messageHandler) {
        this._sentMessagesExpectingAResponseWithSubscriber = new Map();
        messageHandler.subscribeToSendMessage((message, subscriber) => this.addSentMessage(message, subscriber));
    }

    addSentMessage(message, subscriber) {
        this._sentMessagesExpectingAResponseWithSubscriber.set(message, subscriber);
    }

    processIncomingMessage(incomingMessage) {
        const associatedSentMessage = this.findSentMessageForIncomingResponse(incomingMessage);

        if (!associatedSentMessage) {
            console.error("No associated sent message for message: ")
            console.error(incomingMessage.toString());
            return;
        }

        const isServerResponse = incomingMessage.payload.args[incomingMessage.payload.args.length - 1].value === 'false';

        if (isServerResponse) {
            this.handleServerResponse(incomingMessage, associatedSentMessage);
        } else {
            this.handleClientResponse(incomingMessage, associatedSentMessage);
        }
    }

    findSentMessageForIncomingResponse(incomingResponse) {
        for (const [sentMessage, _] of this._sentMessagesExpectingAResponseWithSubscriber) {
            if (sentMessage.unique_id === incomingResponse.target_id) {
                return sentMessage;
            }
        }
        return null;
    }

    handleServerResponse(message, associatedSentMessage) {
        if (message.payload.action === 'error') {
            this.handleServerSendsError(message, associatedSentMessage);
            return;
        }

        const argLength = message.payload.args.length;
        const responseExpected = argLength > 2 && parseInt(message.payload.args[argLength - 2].value) >= 0;

        if (!responseExpected) {
            this._sentMessagesExpectingAResponseWithSubscriber.delete(associatedSentMessage);
        }
    }

    handleServerSendsError(incomingMessage, associatedSentMessage) {
        if (!this._sentMessagesExpectingAResponseWithSubscriber.has(associatedSentMessage)) {
            console.log(`Received unexpected server error: ${JSON.stringify(incomingMessage)}`);
            return;
        } else {
            console.log(`Server sends error: ${JSON.stringify(incomingMessage)}`);
        }

        const onClientResponseReceived = this._sentMessagesExpectingAResponseWithSubscriber.get(associatedSentMessage);
        if (onClientResponseReceived) {
            onClientResponseReceived(incomingMessage);
        }

        this._sentMessagesExpectingAResponseWithSubscriber.delete(associatedSentMessage);
    }

    handleClientResponse(incomingMessage, associatedSentMessage) {
        if (!this._sentMessagesExpectingAResponseWithSubscriber.has(associatedSentMessage)) {
            console.log(`Received unexpected client response: ${JSON.stringify(incomingMessage)}`);
            return;
        }

        const onClientResponseReceived = this._sentMessagesExpectingAResponseWithSubscriber.get(associatedSentMessage);
        if (onClientResponseReceived) {
            onClientResponseReceived(incomingMessage);
        }

        this._sentMessagesExpectingAResponseWithSubscriber.delete(associatedSentMessage);
    }
}

module.exports = { ResponseProcessor };