class Signature {
    /**
     * @param {number} num_of_args The number of arguments.
     * @param {string[]} type_of_args The types associated with each argument.
     */
    constructor(num_of_args, type_of_args) {
        this.num_of_args = num_of_args;
        this.type_of_args = type_of_args;
    }
}

module.exports = {
    Signature,
}