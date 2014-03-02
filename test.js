var assert = require('assert'),
	MockResponse = require('./index');

var tests = [

	function is_writable_and_readable() {
		var req = new MockResponse();
		assert(req.readable);
		assert(req.writable);

		next();
	}

];

var ready = true;

function next() {
	ready = true;
}

setInterval(function() {
	if (!ready) return;
	var test = tests.shift();
	if (!test) {
		console.log('All tests passed');
		return process.exit(0);
	}

	ready = false;
	test();
}, 0);