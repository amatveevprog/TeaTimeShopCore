var path = require('path');
var util = require('util');
var http = require('http');

//ошибки для выдачи посетителю
function HttpError(status,message) {
    Error.apply(this,arguments);
    Error.captureStackTrace(this,HttpError);

    this.status = status;
    this. message = message || http.STATUS_CODES[status] || "Error";
}

util.inherits(HttpError,Error);
HttpError.prototype.name = 'HttpError';

function UploadError(message) {
    Error.apply(this,arguments);
    Error.captureStackTrace(this,UploadError);

    this.message = "Server Upload Error :\r\n"+message;
}

HttpError.prototype.name = 'UploadError';
exports.HttpError = HttpError;
exports.UploadError = UploadError;