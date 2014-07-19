var assert = require('assert'),
	STATUS_CODES = require('http').STATUS_CODES,
	MockResponse = require('./index');

var tests = [

	function is_writable_and_readable(done) {
		var res = new MockResponse();
		assert(res.readable);
		assert(res.writable);

		done();
	},

	function can_write_strings_and_buffers(done) {
		var res = new MockResponse();
		res.write('hello');
		res.write(new Buffer('you', 'utf8'));
		res.end();

		done();
	},

	function cannot_write_objects(done) {
		var res = new MockResponse();
		assert.throws(function() {
			res.write({
				some: 'thing'
			});
		});

		done();
	},

	function can_set_get_remove_headers(done) {
		var res = new MockResponse();

		res.setHeader('Type', 'x');
		assert.equal(res.getHeader('Type'), 'x');
		assert.equal(res.getHeader('type'), 'x'); // case insensitive

		res.removeHeader('Type'); // case sensitive???
		assert(!res.getHeader('type'));

		done();
	},

	function can_write_head(done) {
		var res = new MockResponse();

		res.writeHead(401);

		assert.equal(res.statusCode, 401);
		assert.equal(res.statusMessage, STATUS_CODES['401']);

		done();
	},

	function can_write_head_with_reason(done) {
		var res = new MockResponse();

		res.writeHead(401, 'Disauthorized');

		assert.equal(res.statusCode, 401);
		assert.equal(res.statusMessage, 'Disauthorized');

		done();
	},

	function can_write_head_with_headers(done) {
		var res = new MockResponse();

		res.writeHead(404, {Type: 'x', foo: 'bar'});

		assert.equal(res.getHeader('Type'), 'x');
		assert.equal(res.getHeader('type'), 'x');
		assert.equal(res.getHeader('foo'), 'bar');
		assert.equal(res.getHeader('FOO'), 'bar');

		assert.equal(res.statusCode, 404);
		assert.equal(res.statusMessage, STATUS_CODES['404']);

		done();
	},

	function can_write_head_with_reason_and_headers(done) {
		var res = new MockResponse();

		res.writeHead(500, 'something failed', {Type: 'x'});

		assert.equal(res.getHeader('type'), 'x');

		assert.equal(res.statusCode, 500);
		assert.equal(res.statusMessage, 'something failed');

		done();
	},

	function can_write_head_unknown_code(done) {
		var res = new MockResponse();

		res.writeHead(299, {Type: 'x'});

		assert.equal(res.getHeader('type'), 'x');

		assert.equal(res.statusCode, 299);
		assert.equal(res.statusMessage, 'unknown');

		done();
	},

	function reads_string_data(done) {
		var res = new MockResponse();
		res.write('big');
		res.write('DOG');
		res.end();

		assert.equal(res._getString(), 'bigDOG');

		done();
	},

	function reads_JSON_data(done) {
		var res = new MockResponse();
		res.write('{"big":');
		res.write('"DOG"}');
		res.end();

		assert.deepEqual(res._getJSON(), {
			big: 'DOG'
		});

		done();
	},

	function can_read_stream_data(done) {
		var res = new MockResponse();

		// Big number to force chunks
		for (var i = 0; i < 10000; i++)
			res.write('aaaaaaaaaa');

		res.end();

		var sink = '';
		res.on('readable', function() {
			var chunk;
			while (null !== (chunk = this.read())) {
				sink += chunk.toString();
			}
		});

		res.on('end', function() {
			assert.equal(sink.length, 100000);
			assert.equal(sink[0], 'a');
			assert.equal(sink[sink.length - 1], 'a');

			done();
		});
	},

	function can_set_status_code(done) {
		var res = new MockResponse();

		assert.equal(res.statusCode, 200); // default
		res.statusCode = 500;
		assert.equal(res.statusCode, 500);

		done();
	}

];

var doneCount = 0;
tests.forEach(function(test) {
	test(done.bind(null, test.name));
});

function done(name) {
	console.log(name);
	doneCount++;

	if (doneCount === tests.length) {
		console.log('>> All tests passed');
		return process.exit(0);
	}
}