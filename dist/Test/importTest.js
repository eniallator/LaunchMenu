"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Registry = require("LM").default.Registry;

exports.default = function () {
    console.log("test");
};

require("source-map-support/register");

console.log("This correctly imported");
//# sourceMappingURL=importTest.js.map