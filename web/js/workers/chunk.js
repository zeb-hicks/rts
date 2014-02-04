this.addEventListener('message', function(message) {

	var data = message.data;

	for (var i = 0; i < data.length; i++) {
		postMessage(data[i]);
	}

	

});