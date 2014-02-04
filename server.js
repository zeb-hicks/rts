var http = require('http');
var https = require('https');
var express = require('express');
var app = express();
var fs = require('fs');
var sio = require('socket.io');

Math.PI2 = Math.PI * 2;
Math.HPI = Math.PI / 2;

var sessions = {};

var opts = {
	key: fs.readFileSync('ssl.key'),
	cert: fs.readFileSync('ssl.cert')
};

// var server = http.createServer(app);
var server = https.createServer(opts, app);
var io = sio.listen(server);
io.set('log level', 1);
// server.listen(80);
server.listen(443);

app.use(express.cookieParser('frosted potatoes'));

app.get('*', function(req, res) {
	if (!sessions[req.connection.remoteAddress]) {
		// Populate the session for this remote address if it doesn't already exist.
		sessions[req.connection.remoteAddress] = {
			sid: newID()
		};
	} else {
		// Check for session spoofing if remote address has session.
		// TODO
	}

	var web = '/web';

	if (req.url.substr(-1) === '/') {
		req.url += 'index.htm';
	}
	doReq(req, res);
});

function doReq(req, res) {
	var web = '/web';
	fs.stat(__dirname + web + req.url, function(err, stats) {
		if (!err) {
			if (stats.isDirectory()) {
				if (req.url.substr(-1) !== '/') {
					res.redirect(302, req.url + '/');
					return;
				}
			}
			if (req.headers['if-modified-since'] !== undefined) {
				var date = new Date(req.headers['if-modified-since']);
				if (stats.ctime - date === 0) {
					res.setHeader('Access-Control-Allow-Origin', '*');
					res.status(304).send(null);
					return;
				}
			}
			res.sendfile(__dirname + web + req.url);
		} else {
			res.writeHead(404);
			res.write('Error 404: Page could not be found.');
			res.end(null);
		}
	});
}

io.sockets.on('connection', function(socket) {
	socket.on('login', function(data, fn) {
		if (!fn) return;
		switch (data.game) {
			case 'shoot':
				if (data.version == server.version) {
					readJSONFile('data/users.json', function(users) {
						if (!!users[data.user] && users[data.user].pass == data.pass) {
							fn({result: true, detail: 'AUTHOK', you: socket.id});
							bindPlayer(socket, users[data.user]);
						} else {
							fn({result: false, detail: 'NOAUTH'});
						}
					});
				} else {
					fn({result: false, detail: 'OLDVER'});
				}
				break;
			case 'cah':
				bindCardsPlayer(socket);
				fn({result: true});
				break;
			default:
				// What's this app...
		}
	});
});

function bindPlayer(socket, player) {
	var P = gserver.players[socket.id] = new Player(player);
	P.id = socket.id;
	P.socket = socket;
	socket.on('update', function(data, fn) {
		switch (data.type) {
			case 'player':
				for (var a in data.data) {
					if (typeof data.data[a] == 'number' || typeof data.data[a] == 'string') {
						gserver.players[socket.id][a] = data.data[a];
					} else {
						for (var b in data.data[a]) {
							gserver.players[socket.id][a][b] = data.data[a][b];
						}
					}
				}
				break;
			default:
				// wut
		}
	});
	socket.on('disconnect', function() {
		// Inform connected players of disconnection.
		for (var a in gserver.players) {
			if (!!gserver.players[a].socket && gserver.players[a].socket.connected) gserver.players[a].socket.emit('player_disconnected', player.pid);
		}
		delete gserver.players[player.pid];
	});
}

function arrayPop(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val) arr.splice(i--, 1);
	}
}

function newID() {
	var str = '';
	for (var i = 0; i < 16; i++) {
		str += 'abcdefghijklmnopqrstuvwxyz0123456789'.substr((Math.random() * 36) | 0, 1);
	}
	return str;
}

function readJSONFile(f, fn) {
	// var callback = fn;
	f = __dirname + '/' + f;
	fs.stat(f, function(err, stat) {
		if (!err) {
			fs.readFile(f, function(err, data) {
				if (!err) {
					try {
						var out = JSON.parse(data.toString());
						fn(out);
					} catch (e) {}
				} else {
					throw new Error('Error reading file.');
				}
			});
		} else {
			throw new Error('Error reading file.');
		}
	});

	// var data = fs.readFileSync(f);
	// fn(JSON.parse(data));
}

function Player(o) {

	o = o || {};

	this.id = o.id || null;

	this.x = o.x || 0;
	this.y = o.y || 0;
	this.vx = o.vx || 0;
	this.vy = o.vy || 0;

	this.pName = o.pName || 'Player';

	this.input = {

		x: 0, // Move X/Y
		y: 0,
		crouch: false,
		fire: false,
		sprint: false,
		reload: false,
		focus: false,
		ax: 0, // Aim X/Y/Dir
		ay: 0,
		ad: 0

	};

	this.weapon = {

		ammo: 120,
		csize: 20,
		clip: 20,
		reload: 1.6,
		speed: 0.12,
		mvel: 900,
		spread: 0.02,

		loading: 0,
		nextShot: 0

	};

	this.state = {
		frame: 0,
		anim: 'pistol_aim',
		to: 'pistol_aim'
	};

	this.ping = 0;
	this.socket = o.socket || null;
	this.lastUpdate = 0;
	this.todo = [];

}

function dist(a,b,c,d) {
	return Math.sqrt((c-a)*(c-a)+(d-b)*(d-b));
}
function distsq(a,b,c,d) {
	return (c-a)*(c-a)+(d-b)*(d-b);
}
function mdist(a,b,c,d) {
	return Math.abs(c-a)+Math.abs(d-b);
}

function colCircPart(x, y, r, px, py, pvx, pvy) {
	var dst = pvx * pvx + pvy * pvy;
	var msc = Math.max(1, Math.ceil(dst / (r * r)));
	var msx = pvx / msc;
	var msy = pvy / msc;
	for (var ms = 0; ms < msc; ms++) {
		if (dist(x, y, px + (msx * ms), py + (msy * ms)) <= r) {
			return {x: px + (msx * ms), y: py + (msy * ms)};
		}
	}
	return false;
}


var lastTime = process.hrtime();

loop();

function loop() {
	var dt = process.hrtime(lastTime);
	dt = dt[0] + dt[1] / 1e9;
	lastTime = process.hrtime();



	setTimeout(loop, 1);
}

function soundAt(x, y, s, v) {
	if (v === undefined) v = 1;
	for (var b in gserver.players) {
		if (!!gserver.players[b].socket && !gserver.players[b].socket.disconnected) {
			// console.log('Sent to ' + b);
			gserver.players[b].socket.volatile.emit('event', {
				type: 'sound',
				name: s,
				x: x,
				y: y,
				v: v
			});
		}
	}
}