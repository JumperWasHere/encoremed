// import cluster from "cluster";
const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

// cluster.setupPrimary({
//     exec: __dirname + "./bin/www",
// });
console.log('number of processor -', numCPUs);
cluster.setupPrimary({
    exec: './bin/www',
    args: ['--use', 'http'],
    silent: false,
});
// if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
// } else {
//     // Workers can share any TCP connection
//     // In this case it is an HTTP server
//     http.createServer((req, res) => {
//         res.writeHead(200);
//         res.end('hello world\n');
//     }).listen(8000);

//     console.log(`Worker ${process.pid} started`);
// }
// // import os from "os";
// import { dirname } from "path";
// import { fileURLToPath } from "url";



// const __dirname = dirname(fileURLToPath(import.meta.url));
// const cpuCount = os.cpus().length;

// console.log(`The total number of CPUs is ${cpuCount}`);
// console.log(`Primary pid=${process.pid}`);
// cluster.setupPrimary({
//     exec: __dirname + "./bin/www",
// });
// for (let i = 0; i < cpuCount; i++) {
//     cluster.fork();
// }
// cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} has been killed`);
//     console.log("Starting another worker");
//     cluster.fork();
// });