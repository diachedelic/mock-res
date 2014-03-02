// Mocks http.ServerResponse

module.exports = MockResponse;

var Writable = require('stream').Writable,
	util = require('util');

function MockResponse(finish) {
	Writable.call(this, {
		decodeStrings: false
	});

	this.statusCode = null;

	this._data = [];
	this._headers = {};
	if (typeof finish === 'function')
		this.on('finish', finish);
}

util.inherits(MockResponse, Writable);

MockResponse.prototype.setHeader = function(name, value) {
	this._headers[name] = value;
};

MockResponse.prototype._write = function(chunk, encoding, callback) {
	this._data.push(chunk);
	callback();
};

MockResponse.prototype._getJSON = function() {
	return JSON.parse(this._data.join(''));
};

/* Not implemented:
MockResponse.prototype.writeContinue()
MockResponse.prototype.writeHead(statusCode, [reasonPhrase], [headers])
MockResponse.prototype.setTimeout(msecs, callback)
MockResponse.prototype.statusCode
MockResponse.prototype.headersSent
MockResponse.prototype.sendDate
MockResponse.prototype.getHeader(name)
MockResponse.prototype.removeHeader(name)
MockResponse.prototype.addTrailers(headers)
*/