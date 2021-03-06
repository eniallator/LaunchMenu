import IPC from "../IPC";
import Registry from "../../registry/registry";

export default class ChannelSender {
    /**
     * Create a new channel sender, allowing to send messages to the channel
     * @param {string} ID - The unique identifier for the channel
     * @param {string} subChannelID - The subChannelID that will be used to access special subchannel methods
     * @param {string} senderID - An ID that the reciever of this channel can respond to (can be left out)
     * @constructs ChannelSender
     * @hideconstructor
     */
    constructor(ID, subChannelID, senderID) {
        // Store data in a seperate object such that it isn't confused with channel methods
        this.__data = {
            ID: ID,
            subChannelID: subChannelID,
            senderID: senderID,
        };

        // Check if there is a module in the window with this channel ID
        const module = Registry._getModuleInstance(ID);
        if (module) {
            // If there is a module, make direct connection for faster communication
            this.__data.channelReceiver = module.core.channelReceiver;
        }

        // Listen for the available message types being send
        this.__setupChannelMessageTypeListener();
    }

    /**
     * Either requests methods to be set up according to the available message types,
     * Or sets up the actual methods according to the passed data
     * @param  {Object} [types] - The available message types to set
     * @returns {undefined}
     * @protected
     * @async
     */
    _setupMethods(types) {
        // Check if this call is initiating the setup, or actually setting up the data
        if (!types) {
            // The call is initiating the setup
            // Check if the channel hasn't been set up already
            if (this.__data.initialised) {
                return new Promise.resolve(this);
            } else {
                // Broadcast a request for all message types of this channel
                IPC.send("channel.requestMessageTypes:" + this.__data.ID);

                // Returned a promise that will be resolved once this method is called with the methods provided as an argument (will happen automatically)
                return new Promise((resolve, reject) => {
                    this.__data.finishSetup = resolve;
                });
            }
        } else {
            // Call is actually setting up the data
            // Gather the relevant message types
            let messageTypes = types.globalListeners;
            const subChannelMessageTypes =
                types.subChannelListeners[this.__data.subChannelID];
            if (subChannelMessageTypes)
                messageTypes = messageTypes.concat(subChannelMessageTypes);

            // Setup the methods
            for (let key of messageTypes)
                this[key] = function() {
                    return this.__sendMessage(key, Array.from(arguments));
                };

            // Notify that the channel is ready
            this.__data.initialised = true;
            if (this.__data.finishSetup) this.__data.finishSetup(this);
        }
    }
    /**
     * Get the channel ID
     * @returns {string} The channel ID
     * @protected
     */
    _getID() {
        return this.__data.ID;
    }
    /**
     * Get the subchannel ID
     * @returns {string} The subchannel ID
     * @protected
     */
    _getSubChannelID() {
        return this.__data.subChannelID;
    }

    /**
     * Starts listening for the channel receiver to send its available message types
     * @returns {undefined}
     * @private
     */
    __setupChannelMessageTypeListener() {
        IPC.once("channel.sendMessageTypes:" + this.__data.ID, event => {
            // Check if all the subchannel methods have already been defined
            const containsSubchannel =
                !this.__data.subChannelID ||
                event.data.subChannelListeners[this.__data.subChannelID];
            if (containsSubchannel) {
                // Store the location to send the messages to
                this.__data.destProcessID = event.sourceID;

                // Setup the methods of this object
                this._setupMethods(event.data);
            } else {
                // Continue listening for message types if the subchannel hadn't been set up yet
                this.__setupChannelMessageTypeListener();
            }
        });
    }

    /**
     * Send a message to the channel receiver
     * @param  {string} message - The message type
     * @param  {Object[]} args - The data to send as an argument array
     * @returns {undefined}
     * @async
     * @private
     */
    async __sendMessage(message, args) {
        // Check whether to make an IPC call or direct message to a module
        if (this.__data.channelReceiver) {
            // Emit an event on the channel sender directly
            let response = this.__data.channelReceiver._emitEvent(
                message,
                {
                    senderID: this.__data.senderID,
                    data: args,
                },
                this.__data.subChannelID
            );

            // Normalize the response to a promise
            if (!(response instanceof Promise))
                response = Promise.resolve(response);

            // Return the result
            return response;
        } else {
            // Send the message and relevant data to the process/window that contains the channel receiver
            const responses = await IPC.send(
                "channel.message:" + this.__data.ID,
                {
                    message: message,
                    subChannelID: this.__data.subChannelID,
                    senderID: this.__data.senderID,
                    data: args,
                },
                this.__data.destProcessID
            );

            // We should only get a response from a single receiver, so return that
            return responses[0];
        }
    }
}
