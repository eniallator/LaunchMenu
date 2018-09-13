"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

require("source-map-support/register");

var _IPC = require("../../IPC");

var _IPC2 = _interopRequireDefault(_IPC);

var _globalData = require("../globalData/globalData");

var _globalData2 = _interopRequireDefault(_globalData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Settings extends _globalData2.default {
    /**
     * Create a new globalData object allowing you to share data between different modules
     * @constructs Settings
     * @hideconstructor
     * @param {string} ID - The ID of the settings to synchronise with
     * @param {string} fileName - The file name in which to save the settings
     * @extends GlobalData
     */
    constructor(ID, fileName) {
        super(ID);
        this.fileName = fileName;
    }

    /**
     * Gets rid of all connected data such that the object is safely removed and saves the data in the file
     * @param {boolean} dontSave - Whether to not save the file when disposing
     * @returns {undefined}
     * @public
     */
    dispose(dontSave) {
        // By default save the data on exit
        if (!dontSave) this.save();

        return super.dispose();
    }

    /**
     * Saves the data in the specified file
     * @returns {undefined}
     * @async
     * @public
     */
    save() {
        // Send a request to the Settings Handler to save this data
        return _IPC2.default.send("Settings.save", {
            ID: this.ID,
            fileName: this.fileName
        });
    }

    /**
     * Reloads the data from the specified file
     * @returns {undefined}
     * @async
     * @public
     */
    reload() {
        // Send a request to the Settings Handler to reload this data
        return _IPC2.default.send("Settings.reload", {
            ID: this.ID,
            fileName: this.fileName
        });
    }
}
exports.default = Settings;
//# sourceMappingURL=settings.js.map