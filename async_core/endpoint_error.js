var path = require('path');
var util = require('util');
var http = require('http');

//ошибки для выдачи посетителю
function EndpointError(status,message) {
    Error.apply(this,arguments);
    Error.captureStackTrace(this,EndpointError);
    
    this.message = message || "Endpoint Error";
}
util.inherits(EndpointError,Error);
EndpointError.prototype.name = "EndpointError";

exports.EndPointError = EndpointError;
