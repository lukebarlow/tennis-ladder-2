// const cluster = require('cluster'),
//   stopSignals = [
//     'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
//     'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
//   ],
//   production = process.env.NODE_ENV == 'production'

// let stopping = false

// cluster.on('disconnect', function (worker) {
//   if (production) {
//     if (!stopping) {
//       cluster.fork()
//     }
//   } else {
//     process.exit(1)
//   }
// })

// if (cluster.isMaster) {
//   // run one socket server in the master thread
//   require('./socket-server')

//   const workerCount = process.env.NODE_CLUSTER_WORKERS || 1
//   console.log(`Starting ${workerCount} workers...`)
//   for (let i = 0; i < workerCount; i++) {
//     cluster.fork()
//   }
//   if (production) {
//     stopSignals.forEach(function (signal) {
//       process.on(signal, function () {
//         console.log(`Got ${signal}, stopping workers...`)
//         stopping = true
//         cluster.disconnect(function () {
//           console.log('All workers stopped, exiting.')
//           process.exit(0)
//         })
//       })
//     })
//   }
// } else {
//   require('./app.js')
// }

var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))

app.use(express.static(__dirname + '/client'))

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//   response.render('pages/index');
// });

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'))
})
