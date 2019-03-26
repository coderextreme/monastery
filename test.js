var metaServer = 'http://localhost:3000';
var Client = require('node-rest-client-patched').Client;
var client = new Client();

var tests = [
{ 'host':'localhost', port:80, players:'1', expected:200},
{ 'host':'localhost', port:80, players:'0', expected:200},
{ 'host':'localhost', port:80, players:'-1', expected:403},
{ 'host':'localhost', port:80, players:'-1.2', expected:403},
{ 'host':'localhost', port:80, players:'1.2', expected:200},
{ 'host':'localhost', port:80, players:'a', expected:403},
{ 'host':'localhost', port:80, players:'', expected:404},
{ 'host':'localhost', port:80, players:'2', expected:200},
{ 'host':'localhost', port:443, players:'1', expected:200},
{ 'host':'localhost', port:443, players:'0', expected:200},
{ 'host':'localhost', port:443, players:'-1', expected:403},
{ 'host':'localhost', port:443, players:'-1.2', expected:403},
{ 'host':'localhost', port:443, players:'1.2', expected:200},
{ 'host':'localhost', port:443, players:'a', expected:403},
{ 'host':'localhost', port:443, players:'', expected:404},
{ 'host':'localhost', port:443, players:'2', expected:200},
{ 'host':'<>', port:80, players:'2', expected:403},
{ 'host':'&', port:80, players:'2', expected:403},
{ 'host':';', port:80, players:'2', expected:403},
{ 'host':'*', port:80, players:'2', expected:200}
];

var success = 0;
var failure = 0;
var promise = new Promise(function (resolve, reject) {
	resolve(-1);
});

function doTheWork(tests, test) {
	return new Promise(function (resolve, reject) {
		try {
			var o = tests[test];
			// console.log('Test', o);
			// console.log('Test', test);
			var args = { path:{"host": o.host, port: o.port, players: o.players}};
			client.get(metaServer+'/api/servers/${host}/${port}/${players}', args, function(data, response){
				// console.log(o, data.toString('utf8'));
				if (o.expected === response.statusCode) {
					success++;
				} else {
					console.log('Failed', o, response.statusCode);
				}
				resolve(success);
			});
		} catch (e) {
			console.error('Failed', o, e);
		}
	});
};

function getResults(tests, max) {
	var results = [];
	for (var i = 0; i < max; i++) {
		results.push(doTheWork(tests, i));
	}
	return Promise.all(results).then(function(output) {
		// console.log(output);
		console.log(success, 'successes');
		console.log(failure, 'failures');
		return 1;
	});
};

getResults(tests, tests.length);
