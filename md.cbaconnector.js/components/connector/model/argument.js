class Argument {
    /**
     * @param {string} type The type of the argument.
     * @param {string} value The value of the argument.
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    /**
     * Returns a formatted string representing the argument.
     * @returns {string} A string in the format "type: value".
     */
    toString() {
        return `${this.type}: ${this.value}`;
    }
}

module.exports = {
    Argument,
}