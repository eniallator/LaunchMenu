var electron = require('electron');

var proc = require('child_process');

var child = proc.spawn(electron, ["dist/testing/main.js"], {stdio:'inherit'})
child.on('close', function(code){
    process.exit(code);
});
