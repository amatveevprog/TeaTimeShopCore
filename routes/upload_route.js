exports.get = function(req,res,next)
{
    require('../async_core').getContentToSend('./index.html',res,function(err,content){
        if(err)
        {
            return next(err);
        }
        else
        {
            res.end(content);
        }
    });
}