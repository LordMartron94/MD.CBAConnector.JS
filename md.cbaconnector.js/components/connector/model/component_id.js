class ComponentID {
    /**
     * @param {string} title The title of the Component.
     * @param {string} version The version of the Component.
     * @param {Capability[]} capabilities The capabilities of the Component.
     */
    constructor(title, version, capabilities) {
        this.title = title;
        this.version = version;
        this.capabilities = capabilities;
    }
}

module.exports = {
    ComponentID,
}