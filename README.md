mock-res
========

Mocks node.js http.ServerResponse (a response). See also `mock-req`.

Being a readable/writable stream, you can pipe the response body to and from it.

# Usage
See `test.js` for further usage.

	var MockRes = require('mock-res');

	// Basic usage
	var res = new MockRes();

	// Supply a callback to be called after res.end() is called
	var res = new MockRes(function onEnd() {
		console.log('Response sent');
	});

	// Listen for stream events
	res.on('error', function (err) {
		// If not listened for, the 'error' event will throw,
		// as is true for any stream.
	});
	res.on('finish', function () {
		console.log('Finished writing response');
	});

	// Read status code
	res.statusCode; // 200 by default

	// Read body as string
	res._getString(); // 'I am a chicken';

	// Read body as parsed JSON
	res._getJSON(); // { chicken: true }

	// Pipe body somewhere
	res.pipe(fs.createWriteStream('/tmp/yo'));

## Example test case

	var assert = require('assert');
	var list = require('./list-handler');
	var MockRes = require('mock-res');

	function test(done) {
		/* Arrange */

		// Use `mock-req` for a better mock
		var req = {
			method: 'GET',
			url: '/foos'
		}

		var res = new MockRes(onEnd);

		/* Act */
		list(req, res);

		/* Assert */
		function onEnd() {
			// NOTE `this` === `res`

			assert.equal(this.statusCode, 200);
			assert.equal(this._getString(), '[{"id":0},{"id":1}]');
			assert.deepEqual(this._getJSON(), [{id: 0 }, {id: 1 }]);
			assert.deepEqual(this.getHeader('set-cookie'), ['a=1', 'b=2']);

			res.pipe(process.stdout); // `res` is just a readable stream here

			done(); // this is an async test
		}
	}

## Methods

* All readable/writable stream methods.
* `writeHead(statusCode, [reasonPhrase], [headers])` Sets the response status code, status message, and headers.  See also the [`http.ServerResponse` documentation](http://nodejs.org/api/http.html#http_response_writehead_statuscode_reasonphrase_headers).
* `setHeader()`, `getHeader()`, `getHeaders()`, `removeHeader()`
* `_getString()` Reads the body as a string, from the internal stream buffer.
* `_getJSON()` Reads the body as a parsed JSON object, from the internal stream buffer.
