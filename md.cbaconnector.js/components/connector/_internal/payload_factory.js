const {MessagePayload} = require("../model/message_payload");
const {Argument} = require("../model/argument");

class PayloadFactory {
    /**
     * Builds a payload object from the given action and arguments.
     * @param {string} action The action to be performed.
     * @param {Array<[string, string]>} args The arguments for the action.
     * @returns {MessagePayload} A payload object with action and arguments.
     */
    static buildPayload({ action, args }) {
        const argumentsArray = args.map(([type, value]) => ({
            type,
            value,
        }));

        let argsToUse = [];

        for (const [type, value] of argumentsArray) {
            argsToUse.push(new Argument(type, value));
        }

        return new MessagePayload(action, argsToUse);
    }
}

module.exports = { PayloadFactory };