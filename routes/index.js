var str = "\/API\/";
var regexp = new RegExp(".*"+str+".*");
module.exports = function(app)
{
    app.post("/upload",require('./upload').post);
    app.get("/",require('./upload_route').get);
    app.get(regexp,require('./api').get);
}
