class MessagePayload {
    /**
     * @param {string} action The action to request from the router.
     * @param {Argument[]} args The associated arguments.
     */
    constructor(action, args) {
        this.action = action;
        this.args = args;
    }

    toString() {
        const argsString = this.args.reduce((current, arg) => current + `${arg.toString()}, `, "");
        return `Action: ${this.action}, Args: ${argsString}`;
    }
}

module.exports = {
    MessagePayload,
}