"use strict";

require("source-map-support/register");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _importTest = require("./importTest");

var _importTest2 = _interopRequireDefault(_importTest);

var _channel = require("../core/communication/channel");

var _channel2 = _interopRequireDefault(_channel);

var _ExtendedJSON = require("../core/communication/ExtendedJSON");

var _ExtendedJSON2 = _interopRequireDefault(_ExtendedJSON);

var _IPC = require("../core/communication/IPC");

var _IPC2 = _interopRequireDefault(_IPC);

var _registry = require("../core/registry/registry");

var _registry2 = _interopRequireDefault(_registry);

var _globalData = require("../core/communication/data/globalData");

var _globalData2 = _interopRequireDefault(_globalData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _importTest2.default)();

var el = _react2.default.createElement(
    "div",
    { className: "test" },
    "Click me (though nothing will happen)"
);
console.log(document.getElementById('root'));
_reactDom2.default.render(el, document.getElementById('root'));

// ExtendedJSON testing

var obj = {
    test: 5,
    stuff: "test",
    obj: {
        value: 3
    }
};
obj.obj.n = obj.obj;
console.log(_ExtendedJSON2.default.decode(_ExtendedJSON2.default.encode(obj)), obj);

// IPC testing

_IPC2.default.sendSync("loaded", null);

// IPC.send("ping", {data:1});
_IPC2.default.on("pong", event => {
    console.log("pong", event);
    return 4;
});
_IPC2.default.on("ping", event => {
    console.log("ping", event);
});
_IPC2.default.send("pong", null).then(data => console.log("pong response", data));

// Module registry test

const _module = _registry2.default.requestModule({ type: "test" });

// Module instance transfer test
console.log(_module);
var instance = new _module("itsName");
instance.setSomething("someValue");

_IPC2.default.send("moduleInstanceTransfer", instance, 0);

// Channel test
_channel2.default.createSender("TestName", "getColor", "crap").then(channel => {
    console.log("set up connection");
    channel.doSomething("cheese");
    channel.doSomethingElse("crap");
    channel.onColor("purple");
});
var channel = _channel2.default.createReceiver("crap", {
    smth: event => {
        console.log("smth", event);
    }
});

// GlobalData testing

_globalData2.default.create("test", {}).then(globalData => {
    console.log(globalData, globalData.get());
    globalData.on("someStuff.update", event => {
        console.log(event);
    });
    globalData.change({
        someField: {
            someOtherData: false
        }
    });
    globalData.on("change.update", event => {
        console.log(event);
    });
    globalData.change({
        change: {
            1: "test",
            2: 4
        }
    });
});

// Error message test with source mapping:
console.log(somethingThatDoesntExist.poop());
//# sourceMappingURL=index.js.map