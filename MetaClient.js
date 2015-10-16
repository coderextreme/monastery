$.get('/api/servers/', function(gameServers) {
	    // build table body
	    for (var host in gameServers) {
		var row$ = $('<tr/>');

		var cellValue = host;
		var td = $('<td/>');
		var anchor = $('<a/>');
		anchor.attr('href', cellValue);
		anchor.html(cellValue);
		td.append(anchor);
		row$.append(td);

		var cellValue = gameServers[host];
		row$.append($('<td/>').html(cellValue));

		$("#metaServerTable").append(row$);
	    }
});
