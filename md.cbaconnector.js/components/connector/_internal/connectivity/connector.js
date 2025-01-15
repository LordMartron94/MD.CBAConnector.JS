const net = require('net');
const { TextEncoder } = require('util');
const { Message } = require('../../model/message');
const { Scanner } = require('../scanning/Scanner');
const { PayloadFactory } = require('../payload_factory');


class Connector {
    constructor(messageProcessor, endOfMessageToken = '<eom>') {
        this._scanner = new Scanner(messageProcessor);
        this._endOfMessageToken = endOfMessageToken;
        this._cancellationTokenSource = { cancelled: false };
        this.textEncoder = new TextEncoder();
    }

    shutdown() {
        this._cancellationTokenSource.cancelled = true;
    }

    connectToRemote(host, port, componentPort = 50185) {
        const socket = new net.Socket();
        socket.setEncoding('utf8');

        socket.on('error', (err) => {
            if (err.code === 'ECONNREFUSED') {
                console.log(`Connection to ${host}:${port} refused.`);
            } else {
                console.error(`Socket Error:`, err);
            }
            this.shutdown();
        });

        socket.on('close', () => {
            console.log(`Connection to ${host}:${port} closed`);
            this.shutdown();
        });

        socket.connect({ host, port, localPort: componentPort }, () => {
            console.log(`Connected to ${host}:${port} from port ${componentPort}`);
            this.readDataLoop(socket, host, port);
            this.startKeepAliveMessageLoop(socket);
        });

        return socket;
    }

    startKeepAliveMessageLoop(socket) {
        this.sendKeepAliveMessage(socket).then();
    }

    async sendKeepAliveMessage(socket) {
        const keepAliveInterval = 30000; // 30 seconds

        await new Promise(resolve => setTimeout(resolve, keepAliveInterval));

        while (!this._cancellationTokenSource.cancelled) {
            const payload = PayloadFactory.buildPayload({
                action: 'keep_alive',
                args: []
            });

            const message = new Message(payload);
            this.sendMessage(socket, message);

            try {
                await new Promise(resolve => setTimeout(resolve, keepAliveInterval));
            } catch(error) {
                return;
            }
        }
    }

    readDataLoop(socket, host, port) {
        const handleData = (data) => {
            try{
                this._scanner.processMessage(data, this._endOfMessageToken)
            }catch(error)
            {
                if (this._cancellationTokenSource.cancelled) {
                    console.log(`Connection to ${host}:${port} closed.`);
                    return;
                }
                console.error(`Error reading data from ${host}:${port}: ${error.message}\nClosing connection.`, error);
                socket.destroy();
            }
        }

        socket.on('data', handleData);
    }

    /**
     * @param {net.Socket} socket
     * @param {Message} message
     */
    sendMessage(socket, message) {
        const messageSerialized = JSON.stringify(message);
        const messageWithToken = messageSerialized + this._endOfMessageToken;

        console.log(messageWithToken)

        const messageBytes = this.textEncoder.encode(messageWithToken);

        socket.write(messageBytes);
    }
}

module.exports = { Connector };