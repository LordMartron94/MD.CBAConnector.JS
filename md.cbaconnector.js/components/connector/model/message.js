const { v4: uuidv4 } = require('uuid');
const {MessagePayload} = require("./message_payload");
const {Argument} = require("./argument");

class Message {
    /**
     * @param {MessagePayload} payload
     */
    constructor(payload) {
        this.sender_id = 'd395d550-c335-4959-9659-158d36210f5e';
        this.time_sent = new Date();
        this.payload = payload;
        this.unique_id = uuidv4();
        this.target_id = null;
    }

    static fromJson(jsonString) {
        try {
            const jsonMessage = JSON.parse(jsonString);

            let args = [];

            for (const arg of jsonMessage.payload.args) {
                args.push(new Argument(arg.type, arg.value));
            }

            const payload = new MessagePayload(jsonMessage.payload.action, args);

            return new Message(
                payload
            );
        } catch (error) {
            console.error("Error parsing JSON string:", error);
            return null;
        }
    }

    toString() {
        const payloadString = this.payload.toString();

        return `Message ID: ${this.unique_id}\nTime Sent: ${this.time_sent}\nSender ID: ${this.sender_id}\nTarget ID: ${this.target_id}\nPayload:\n${payloadString}`;
    }
}

module.exports = {
    Message,
};