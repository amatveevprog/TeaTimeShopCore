//отдельная функция на прием файлов
var asyncCore = require('../async_core/index');

var url = require('url');
exports.post = function(req,res,next)
{
    //на входе файл
    asyncCore.uploadFile(req,res,function(err,jsonMethods){
        if(err)
        {
            if(err instanceof UploadError)
            {
                return next(new HttpError(500,err.message));
            }
            else
            {
                return next(err);
            }
        }
        res.end(JSON.stringify(jsonMethods));//jsonMethods = json.stringify....
    });
    //загружаем его асинхронно

    //работаем с res
}