class SettingsContext {
    /**
     * @param {string} rootModuleSeparator The root module separator.
     * @param {boolean} keepServerAlive Whether to keep the server alive upon shutting down or not.
     * @param {Object} registrationObject The registration object.
     */
    constructor(rootModuleSeparator, keepServerAlive, registrationObject) {
        this.rootModuleSeparator = rootModuleSeparator;
        this.keepServerAlive = keepServerAlive;
        this.registrationString = registrationObject;
    }
}

module.exports = {
    SettingsContext,
}