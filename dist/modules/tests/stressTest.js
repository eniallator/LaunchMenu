"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var Registry = require("LM").default.Registry;

require("source-map-support/register");

var _LM = require("LM");

var {
    test2: _LMTest,
    Module: _LMModule
} = Registry.requestModule("test2", "Module");

var _LMTest2 = _interopRequireDefault(_LMTest);

var _LMModule2 = _interopRequireDefault(_LMModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class StressTest extends _LMModule2.default {
    constructor(request) {
        super(request, true);
    }
    $test() {
        if (true) {
            const modules = [];
            const promises = [];
            let count = 100;
            for (var i = 0; i < count; i++) {
                const module = new _LMTest2.default();
                module.__register();
                promises.push(module.__onRegister());
                modules.push(module);
            }

            global.encode = 0;
            global.decode = 0;

            // Load the first instance and window
            _promise2.default.all(promises).then(() => {
                console.time("Done");
                modules.forEach(module => {
                    module.requestHandle({
                        type: "alert"
                    }).then(channel => {
                        if (--count == 0) {
                            console.timeEnd("Done");
                        }
                        // channel.$alert("single alert").then(() => {
                        //     return channel.close();
                        // });
                    });
                    // LM.Registry.requestModule({type: "test2"});
                });
                // console.timeEnd("Done");
            });
        } else {
            const sendTest = n => _LM.IPC.send("Stress.test", "", 0).then(() => {
                if (n - 1 > 0) return sendTest(n - 1);else console.timeEnd("start");
            });

            console.time("start");
            // sendTest(100).then(;
        }
    }
}

exports.default = StressTest;
if (_LM.isMain) {
    _LM.IPC.on("Stress.test", event => {
        return "test";
    });
}
//# sourceMappingURL=stressTest.js.map