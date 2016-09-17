var core = require('../async_core');
exports.get = function(req,res,next)
{
    core.getAllFunctions(function (err,arr) {
        if(err)
        {
            return next(err);
        }
        else
        {
            res.end(arr);
        }
    })
};