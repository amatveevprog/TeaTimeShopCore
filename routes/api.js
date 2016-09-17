var asyncRouter = require('../async_core');
//лучше использовать не asyncRouter, а индекс внутри async.core!
var HttpError = require('../errors').HttpError;
exports.get = function(req,res,next){
    //проверка на корректный урл
    asyncRouter.executeFunction(req.url,function(err,result){
       if(err)
       {
           return next(err);
       }
       else
       {
           res.end("result: "+JSON.stringify(result));
       }
    });
    //console.log(req.url);
    //res.end(JSON.stringify(req.url));
}