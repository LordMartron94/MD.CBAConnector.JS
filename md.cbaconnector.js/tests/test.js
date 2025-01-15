const {Communicator} = require("../components/communicator");
const {SettingsContext} = require("../components/connector/model/settings_context");

const communicator = new Communicator();

const settings = new SettingsContext("Test", true,
`{
  "sender_id": "d395d550-c335-4959-9659-158d36210f5e",
  "payload": {
    "action": "register",
    "args": [
      {
        "type": "string",
        "value": "Test.Test.Test"
      },
      {
        "type": "string",
        "value": "0.1.0"
      },
      {
        "type": "list",
        "value": "[]"
      }
    ]
  }
}`)

communicator.initialize(settings);