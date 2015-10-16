gameServers = {};

var express = require('express');
var app = express();
var http = require('http').Server(app);
app.use(express.static(__dirname));

// set up a rest server
var router = express.Router();
router.route('/servers')
	.get(function(req, res) {
		res.json(gameServers);
	});

router.route('/servers/:host/:port/:players')
	.get(function(req, res) {
		console.log(req.params.host+":"+req.params.port+" "+req.params.players+" player"+(req.params.players != 1 ? "s." : "."));
		gameServers['http://'+req.params.host+':'+req.params.port] = req.params.players;
	});
app.use('/api', router);

var defaultPort = 3000;
http.listen(process.env.PORT || defaultPort);

console.log('express server started on port %s', process.env.PORT || defaultPort);

http.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.log('Address in use, exiting...');
  }
});
