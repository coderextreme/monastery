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
		var port = parseInt(req.params.port);
		var players = parseInt(req.params.players);
		if (isNaN(port)) {
			console.error("failed port not a number");
			res.sendStatus(403);
		} else if (isNaN(players)) {
			console.error("failed players not a number");
			res.sendStatus(403);
		} else if (req.params.host.indexOf('<') === -1
			&& req.params.host.indexOf('>') === -1
			&& req.params.host.indexOf('&') === -1
			&& req.params.host.indexOf(';') === -1
			&& port >= 0 && players >= 0) {
			if (port === 443) {
				gameServers['https://'+req.params.host] = players;
				res.sendStatus(200);
			} else if (port === 80) {
				gameServers['http://'+req.params.host] = players;
				res.sendStatus(200);
			} else {
				gameServers['http://'+req.params.host+":"+port] = players;
				res.sendStatus(200);
			}
		} else {
			console.error("failed host bad or bad number of players or port illegal");
			res.sendStatus(403);
		}
	});
app.use('/api', router);

var defaultPort = 3000;
http.listen(process.env.PORT || defaultPort);

console.log('express server started on port http://localhost:%s', process.env.PORT || defaultPort);

http.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.error('Address in use, exiting...');
  }
});
