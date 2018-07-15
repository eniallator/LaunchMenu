"use strict";

require("source-map-support/register");

var _electron = require("electron");

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _IPC = require("../core/communication/IPC");

var _IPC2 = _interopRequireDefault(_IPC);

var _registry = require("../core/registry/registry");

var _registry2 = _interopRequireDefault(_registry);

var _channel = require("../core/communication/channel");

var _channel2 = _interopRequireDefault(_channel);

var _requestPath = require("../core/registry/requestPath");

var _requestPath2 = _interopRequireDefault(_requestPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var {app, BrowserWindow} = require('electron');
var mainWindow; //this is merely some test code

_electron.app.on('window-all-closed', function () {
	if (process.platform != 'darwin') {
		_electron.app.quit();
	}
});
_electron.app.on('ready', function () {
	mainWindow = new _electron.BrowserWindow({ width: 1360, height: 800 });
	// mainWindow.loadURL(url.format({
	//   pathname: "www.google.com",
	//   protocol: 'https:',
	//   slashes: true
	// }));
	mainWindow.loadURL(_url2.default.format({
		pathname: _path2.default.join(process.cwd(), "dist", "Test", "index.html"),
		protocol: 'file:',
		slashes: true
	}));
	mainWindow.openDevTools();
	mainWindow.on('closed', function () {
		mainWindow = null;
	});

	// Register window
	_IPC2.default._registerWindow(mainWindow);
});

_IPC2.default.once("loaded", event => {
	// Module registry
	_registry2.default.loadModule("testModule");

	_IPC2.default.on("pong", event => {
		return 3;
	});

	// IPC testing
	_IPC2.default.on("ping", event => {
		console.log("ping", event);
		_IPC2.default.send("pong", { data: 2 }, 1).then(data => {
			console.log("response", data);
		});
		// IPC.send("module", TestModule, 1);
	});
	_IPC2.default.on("moduleInstanceTransfer", event => {
		console.log(event);
	});

	// Channel testing
	var channel = _channel2.default.createReceiver("TestName", {
		doSomething: event => {
			console.log("smth", event);
		},
		doSomethingElse: event => {
			console.log("smthElse", event);
		}
	});
	channel.createSubChannel("getColor", {
		onColor: event => {
			console.log("color", event);
		},
		doSomethingElse: function (event) {
			console.log("smthElse Overwritten", event, event.senderID);
			_channel2.default.createSender(event.senderID, "", this.getID()).then(channel => {
				console.log("establish connection");
				channel.smth("stuff");
			});
		}
	});

	//RequestPath testing
	const rootRequestPath = new _requestPath2.default("root");
	rootRequestPath.augmentPath("test").then(requestPath => {
		console.log(requestPath.toString(true));
		requestPath._attachModuleInstance("shit");
	});
});
//# sourceMappingURL=main.js.map