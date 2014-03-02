// Mocks http.ServerResponse

module.exports = MockRes;

var Transform = require('stream').Transform,
	util = require('util');

function MockRes(finish) {
	Transform.call(this);

	this.statusCode = 200;

	this._data = [];
	this._headers = {};
	if (typeof finish === 'function')
		this.on('finish', finish);
}

util.inherits(MockRes, Transform);

MockRes.prototype._transform = function(chunk, encoding, next) {
	this.push(chunk);
	next();
};

MockRes.prototype.setHeader = function(name, value) {
	this._headers[name.toLowerCase()] = value;
};

MockRes.prototype.getHeader = function(name) {
	return this._headers[name.toLowerCase()];
};

MockRes.prototype.removeHeader = function(name) {
	delete this._headers[name.toLowerCase()];
};

MockRes.prototype._getString = function() {
	return Buffer.concat(this._readableState.buffer).toString();
};

MockRes.prototype._getJSON = function() {
	return JSON.parse(this._getString());
};

/* Not implemented:
MockRes.prototype.writeContinue()
MockRes.prototype.writeHead(statusCode, [reasonPhrase], [headers])
MockRes.prototype.setTimeout(msecs, callback)
MockRes.prototype.statusCode
MockRes.prototype.headersSent
MockRes.prototype.sendDate
MockRes.prototype.addTrailers(headers)
*/