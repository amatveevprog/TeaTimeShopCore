//var querystring = require('querystring');
var http = require('http');
var Url = require('url');
var fs = require('fs');
var path = require('path');
var async = require('async');
var router = require('./asyncRouter');
var HttpError = require('../errors').HttpError;
var UploadError = require('../errors').UploadError;
var EndpointError = require('./endpoint_error');


//получить массив параметров из запроса
//returns the array of params
var parseQuery = function (queryString)
{
    //param1=1&param2=2... на входе
    var arr = [];
    if(queryString.includes("&")) {
        var strArray = queryString.split("&");
        var numOfParams = strArray.length;
        strArray.forEach(function (curr, index) {
            var strToAdd = curr.split("=")[1];
            arr.push(strToAdd);
        });
    }
    else
    {
        arr.push(queryString.split("=")[1]);
    }
    return arr;
};
/*var hasApiUrl = function(url,callback)
{
    if (router.hasUrl(url))
    {
        callback(null,true);
    }
    callback(new EndpointError("Api Url Not Found"));
}*/
//execute enpoint API in backend
// params:
//urlParsed = url.parse(req.url)
//function enpoint = urlParsed.pathname
//parameters query(raw, needs to be parsed to array of params) for the function: urlParsed.query
exports.executeFunction = function(url,callback)
{
    //1 - проверяем, есть ли данный метод
    //2 - проверяем строку параметров(м.б. null)
    //3 - выполняем функцию на сервере, вызываем коллбэк
    async.waterfall([function(callback){
        var urlParsed = Url.parse(url);
        var endpoint = urlParsed.pathname;
        if(router.hasUrl(endpoint))
        {
            callback(null,urlParsed,endpoint);
        }
        else
        {
            callback(new EndpointError("No such Endpoint!"));
        }
    },function (urlParsed,endpoint,callback) {
        if(urlParsed.query==null)
        {
            //вызов с параметром null
            router.executeOnUrl(endpoint,null,callback);
        }
        else
        {
            //нормальный вызов
            var arr = parseQuery(urlParsed.query);
            router.executeOnUrl(endpoint,arr,callback);
        }
    }],callback);
};
//сформировать файл(контент) для отправки на клиент
//result: callback(null,content) containing content ready to be sent - just call res.end(content)
exports.getContentToSend = function (filePath,res,callback) {
    fs.readFile(filePath,function(err,content)
    {
        if(err) callback(new HttpError(404,"Не удалось найти файл по указанному адресу"));
        var mime = require('mime').lookup(filePath);
        //console.log("mime-type: "+mime);
        res.setHeader("Content-Type",mime+"; charset=utf-8");
        callback(null,content);
        //res.end(content);
    });
}
//получить все функции, доступные для вызова
//result: callback(null,array_of_functions_in_json-string_format) containing array of json strings
exports.getAllFunctions = function(callback)
{
    //создать JSON-объект
    var arr = [];
    router.urlArray.forEach(function(current,index)
    {
        arr.push(current.url);
    });
    var parsedArr = JSON.stringify(arr);
    callback(null,parsedArr);
}
//backend async function to upload files on server and make appropriate web adapters for them
//like '/API/test_js_compare' for compare function in test.js module
//result:callback(err,urlArray) containing an error or UrlArray to send it to front-end
exports.uploadFile = function(req,res,callback){
    async.waterfall([
        function(callback)
        {
            console.log("1st waterfall");
            var urlParsed = Url.parse(req.url);
            var fileName = parseQuery(urlParsed.query);
            console.log("fileName"+fileName);
            //принимаем файл
            var body='';
            req.on('readable',function()
            {
                body+=req.read();
            }).on('end',function() {
                if (body.endsWith("null")) {
                    //если файл заканчивается на null
                    body = body.substring(0, body.length - 4);
                }
                callback(null,body,urlParsed,fileName);
            });
        },
        function(body,urlParsed,fileName,callback)
        {
            //создаем директорию
            console.log("waterfall create dir");
            var mkdirp = require('mkdirp');
            var dirName = urlParsed.pathname;
            mkdirp("./" + dirName,function(err){
                if(err)
                {
                    console.log("error creating directory: "+dirName);
                    callback(new UploadError("Ошибка создания директории: "+dirName));
                }
                else {
                    callback(null, body,urlParsed,fileName,dirName);
                }
            });

        },
        function(body,urlParsed,fileName,dirName,callback){
            //записываем файл
            fs.writeFile("." + dirName + "/" + fileName, body, {encoding: 'utf-8'},function(err){
                if(err)
                {
                    console.log("error writing file: "+fileName);
                    callback(new UploadError("Ошибка создания файла: "+ fileName));
                }
                else {
                    callback(null, urlParsed, fileName);
                }
            });
        },
        function(urlParsed,fileName,callback)
        {
            //преобразуем в массив функций
            router.automaticParse(".."+urlParsed.pathname+"/"+fileName,"/API/",function (err,urlArray){
                if(err)
                {
                    callback(new UploadError("Ошибка преобразования модуля в API-методы"));
                }
                else
                {
                    callback(null,urlArray);
                }
            });
        },
        function (urlArray,callback) {
            //res.end(JSON.stringify(router.urlArray));
            callback(null,urlArray);
        }
    ],callback);
};
//мониторит директорию на наличие файлов и включает их содержимое
//в эндпоинты
//!Необходимо при старте сервера, или если есть директория
//и в ней файлы, которые нужно включить НЕ через клиентский запрос(/upload?module=test.js)
exports.lookupAndMakeEndpoints = function(dirPath,callback)
{
    fs.stat(dirPath,function (err,stats) {
        if(err)
        {
            if(err.code!='ENOENT')
            {
               return callback(err);
            }
        }
        else
        {
            //stats.isDirectory();
            //if dir exists, we make all work
            async.waterfall([function (callback) {
                if(stats.isDirectory())
                {
                    fs.readdir(dirPath,{encoding:'utf-8'},function(err,files){
                        if(err){ throw err;}
                        else
                        {
                            callback(null,files);
                        }
                    });
                }
                else
                {
                    callback(new Error(dirPath+" is not Directory"));
                }
            },function (files,callback) {
                //проверяем каждый файл
                var apiUrls=[];
                for(var i=0;i<files.length;i++)
                {
                    router.automaticParse("."+dirPath+"/"+files[i],"/API/",function (err,urlArray){
                        if(err)
                        {
                            throw(err);
                            //callback(new UploadError("Ошибка преобразования модуля в API-методы"));
                        }
                        else
                        {
                            //callback(null,urlArray);
                            //apiUrls = apiUrls.concat(urlArray);
                            //urlArray=[];
                            apiUrls = urlArray;
                        }
                    });
                }
                callback(null,apiUrls);
            }],callback);
        }
    });
};
