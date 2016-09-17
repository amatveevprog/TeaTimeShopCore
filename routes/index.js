var config = require('../config');
var regexp = new RegExp(".*"+config.get('api_api_prefix')+".*");
module.exports = function(app)
{
    app.post("/upload",require('./upload').post);
    app.get("/",require('./upload_route').get);
    app.get(regexp,require('./api').get);
    app.get("/functions",require('./functions').get);
    app.get("/somepage",require('./somepage').get);
}
