class Capability {
    /**
     * @param {string} name The name of the capability.
     * @param {Signature} signature The signature of the capability.
     */
    constructor(name, signature) {
        this.name = name;
        this.signature = signature;
    }
}

module.exports = {
    Capability,
}