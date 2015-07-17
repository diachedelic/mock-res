// Mocks http.ServerResponse


module.exports = MockServerResponse;

var Transform = require('stream').Transform,
	util = require('util'),
	STATUS_CODES = require('http').STATUS_CODES;

function MockServerResponse(finish) {
	Transform.call(this);

	this.statusCode = 200;
	this.statusMessage = STATUS_CODES[this.statusCode];

	this._header = this._headers = {};
	if (typeof finish === 'function')
		this.on('finish', finish);
}

util.inherits(MockServerResponse, Transform);

MockServerResponse.prototype._transform = function(chunk, encoding, next) {
	this.push(chunk);
	next();
};

MockServerResponse.prototype.setHeader = function(name, value) {
	this._headers[name.toLowerCase()] = value;
};

MockServerResponse.prototype.getHeader = function(name) {
	return this._headers[name.toLowerCase()];
};

MockServerResponse.prototype.removeHeader = function(name) {
	delete this._headers[name.toLowerCase()];
};

MockServerResponse.prototype.writeHead = function(statusCode, reason, headers) {
	if (arguments.length == 2 && typeof arguments[1] !== 'string') {
		headers = reason;
		reason = undefined;
	}
	this.statusCode = statusCode;
	this.statusMessage = reason || STATUS_CODES[statusCode] || 'unknown';
	if (headers) {
		for (var name in headers) {
			this.setHeader(name, headers[name]);
		}
	}
};

MockServerResponse.prototype._getString = function() {
	return Buffer.concat(this._readableState.buffer).toString();
};

MockServerResponse.prototype._getJSON = function() {
	return JSON.parse(this._getString());
};

/* Not implemented:
MockServerResponse.prototype.writeContinue()
MockServerResponse.prototype.setTimeout(msecs, callback)
MockServerResponse.prototype.headersSent
MockServerResponse.prototype.sendDate
MockServerResponse.prototype.addTrailers(headers)
*/