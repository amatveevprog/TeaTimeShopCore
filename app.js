var express1 = require('express');
var http = require('http');
var path = require('path');
var app = express1();

//var log = require('libs/log')(module);
//var errorHandler = require('errorhandler');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
var static1 = require('serve-static');
//var ejs = require('ejs');
//var HttpError = require('error').HttpError;
//var expressSession = require('express-session');
//var mongoose = require('libs/mongoose');

require('./routes/index')(app);
app.use(static1(path.join(__dirname,'public')));
app.use(function(err,req,res,next){
    if(typeof err == 'number')
    {
        res.end(404);
    }
    res.end("Error!");
});
var server = http.createServer(app).listen(1000,function()
{
    //log.info('Express server listening on port '+ 1000);
    //logger('Express server listening on port '+ 1000);
    
    console.log("Server started. Listening on port 1000");
    //при старте сервера мониторим папку uploads и загружаем все модули из нее
    require('./async_core').lookupAndMakeEndpoints("./upload",function (err,resultArr) {
        if(err)
        {
            throw err;
        }
        else
        {
            console.log(resultArr.length);
            resultArr.forEach(function (cur,index) {
                console.log(cur);
            })
        }
    });
});