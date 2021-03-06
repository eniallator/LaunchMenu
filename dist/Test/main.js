"use strict";

var Registry = require("LM").default.Registry; //this is merely some test code

// import url from "url";
// import path from "path";
// import IPC from "../core/communication/IPC";
// import Registry from "../core/registry/registry";
// import RequestPath from "../core/registry/requestPath";
// import SettingsHandler from "../core/communication/data/settings/settingsHandler";
// import WindowHandler from "../core/window/windowHandler";


require("source-map-support/register");

var _electron = require("electron");

var _LM = require("LM");

var _LM2 = _interopRequireDefault(_LM);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var {app, BrowserWindow} = require('electron');
// var mainWindow;
// app.on('window-all-closed', function() {
//   	if (process.platform != 'darwin') {
//     	app.quit();
//   	}
// });
// app.on('ready', function() {
// 	mainWindow = new BrowserWindow({width: 1360, height: 800});
// 	// mainWindow.loadURL(url.format({
// 	//   pathname: "www.google.com",
// 	//   protocol: 'https:',
// 	//   slashes: true
// 	// }));
// 	mainWindow.loadURL(url.format({
// 		pathname: path.join(process.cwd(), "dist", "Test", "index.html"),
// 		protocol: 'file:',
// 		slashes: true
// 	}))
// 	mainWindow.openDevTools();
// 	mainWindow.on('closed', function() {
// 		mainWindow = null;
// 	});
//
// 	// Register window
// 	IPC._registerWindow(mainWindow);
// });

// Module registry
// Registry._loadModule("alerts.config");
// Registry._loadModule("multiAlert");
// Registry._loadModule("testModule2.config");

// Open a window
// console.log(LM);
_electron.app.on("ready", function () {
    _LM2.default.Registry._loadAllConfigs().then(data => {
        // Request a module to have a start point
        const TestModule2 = _LM2.default.Registry.requestModule({ type: "test2" });
        const testModule2instance = new TestModule2();
        const testModule2instance2 = new TestModule2();

        // testModule2instance
        //     .requestHandle({
        //         type: "multiAlert",
        //     })
        //     .then(channel => {
        //         channel
        //             .$alert("poooopy pants")
        //             .then(() => {
        //                 return channel.$alert("Nuts");
        //             })
        //             .then(() => {
        //                 return channel.close();
        //             });
        //     });
        // testModule2instance2
        //     .requestHandle({
        //         type: "multiAlert",
        //     })
        //     .then(channel => {
        //         channel.$alert("testing").then(() => {
        //             return channel.close();
        //         });
        //     });
        // testModule2instance2
        //     .requestHandle({
        //         type: "alert",
        //     })
        //     .then(channel => {
        //         channel.$alert("single alert").then(() => {
        //             return channel.close();
        //         });
        //     });

        testModule2instance.requestHandle({
            type: "testElement",
            data: {
                repeat: true
            }
        }).then(channel => {
            // Just as an example, change the name after 2 seconds
            setTimeout(() => {
                channel.$setName("A new name");
            }, 2000);
        }).catch(e => console.error(e));

        // testModule2instance
        //     .requestHandle({type: "stress"})
        //     .then(channel => {
        //         channel.test();
        //     });

        // WindowHandler.open(1).then(data=>{
        //     console.log("Window opened", data);
        //     Registry.requestHandle({
        //         type: "test",
        //         source: testModule2,
        //     }).then(result=>{
        //         console.log(result);
        //     });
        // }).catch(err=>{
        //     console.error(err);
        // });
    }).catch(e => {
        console.error(e);
    });
});
//# sourceMappingURL=main.js.map