const fs = require('fs');
const { spawn } = require('child_process');

const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./out.log', 'a');

const p = spawn('node', ['backend/server.js'], {
    detached: true,
    stdio: ['ignore', out, err]
});

p.unref();
console.log('Spawned server. Check out.log');
