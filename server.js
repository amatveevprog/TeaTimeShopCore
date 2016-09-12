//var querystring = require('querystring');
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var router = require('./router');
router.require_2_0('./required');

//var router = new Router();
//router.require_2_0('./required');
//var myfunc = router.getFunction('required','array');
//var TrueFalse = router.assignFuncToUrl("http://localhost/getSum","required","plus");
//var param1=1,param2=2;
//var arr=[];
//arr.push(param1,param2);
//console.log(router.urlArray[1].Function.apply(null,arr));

//console.log("---123");

//заполнение массива urlArray в роутере
var arrURL = ["/API/plus","/API/concatenate",
    "/API/getArray",
    "/API/getHelloWorld"];
for(var i=0;i<arrURL.length;i++)
{
    router.addToUrlArray(arrURL[i]);
}
//регистрация функций:
router.assignFuncToUrl(arrURL[0],"required",'plus');
router.assignFuncToUrl(arrURL[1],"required",'concatenate');
router.assignFuncToUrl(arrURL[2],"required",'array');
router.assignFuncToUrl(arrURL[3],"required",'HW');

http.createServer(function(req,res)
{
    var urlParsed = url.parse(req.url);
    if(router.hasUrl(urlParsed.pathname))
    {
        //надо считать параметры
        var paramsArray = parseQuery(urlParsed.query);
        //ищем соответствующую функцию и запускаем ее
        var result = router.executeOnUrl(urlParsed.pathname,paramsArray);
        res.statusCode=200;
        res.end("result:"+JSON.stringify(result));
    }
    else if((req.method == "POST")&&(req.url.includes("/upload")))
    {
        //принимаем файл
        var body='';
        req.on('readable',function()
        {
            body+=req.read();
        }).on('end',function()
        {
            if(body.endsWith("null"))
            {
                //если файл заканчивается на null
                body=body.substring(0,body.length-4);
            }
            //console.log("BODY:"+body);
            var fileName = parseQuery(urlParsed.query);
            writeFile(fileName[0],urlParsed.pathname,body);
            //автоматически парсим и вынимаем все экспорт-функции!
            //process.exit();

            router.automaticParse("."+urlParsed.pathname+"/"+fileName,"/API/");
            //sendFile("uploaded.html",res);
            res.end(JSON.stringify(router.urlArray));
        });
    }
    else if(req.url=='/')
    {
        sendFile("index.html",res);
    }
    else if(req.url=='/functions')
    {
        sendAllFunctions(res);
    }
    else if(req.url=='/uploaded')
    {
        sendFile("uploaded.html",res);
    }
    else
    {
        res.statusCode=404;
        res.end("Page not found");
    }
    /*else {
        switch (req.url) {
            case '/':
                sendFile('index.html');
                break;
            //case '/API/'
            default:
                res.statusCode=404;
                res.end("Page not found");
        }
    }*/
}).listen(process.env.PORT || 3000);
//получить массив параметров из запроса
function parseQuery(queryString)
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
}
function sendFile(filePath,res) {
    fs.readFile(filePath,function(err,content)
    {
       if(err) throw err;

        var mime = require('mime').lookup(filePath);
        console.log("mime-type: "+mime);
        res.setHeader("Content-Type",mime+"; charset=utf-8");
        res.end(content);
    });
}
function writeFile(fileName,dirName,content) {
    //сначала смотрим директорию
    /*if(!fs.statSync('./upload/').isDirectory());
     {
     //создаем директорию
     fs.mkdir(n)
     }*/
    //var ws = fs.createWriteStream()
    //fs.mkdirSync("./" + dirName,777);
    var mkdirp = require('mkdirp');
    mkdirp.sync("./" + dirName);
    fs.writeFileSync("." + dirName + "/" + fileName, content, {encoding: 'utf-8'});
    /*var s = mkdirp("./" + dirName, function (err, DD) {
        if (err) throw err;
        console.log(DD);
        fs.writeFileSync("." + dirName + "/" + fileName, content, {encoding: 'utf-8'});
        // //создаем файл
        // fs.writeFile("./" + dirName + "/" + fileName, content, {encoding: 'utf-8'}, function (err) {
        //     if (err) throw err;
        //     console.log("Successfull writing to a file! your file is avaliable at:" + dirName + "/" + fileName);
        //
        // });
    });*/
    /*if (!s) {
        var pathToFile = "." + dirName + "/" + fileName;
        fs.writeFile(pathToFile, content, {encoding: 'utf-8'}, function (err) {
            if (err) throw err;
            console.log("Successfull writing to a file! your file is avaliable at:" + dirName + "/" + fileName);

        });
    }*/
    //fs.writeFileSync("." + dirName + "/" + fileName, content, {encoding: 'utf-8'});
}
function sendAllFunctions(res)
{
    //создать JSON-объект
    var arr = [];
    router.urlArray.forEach(function(current,index)
    {
        arr.push(current.url);
    });
    var parsedArr = JSON.stringify(arr);
    res.end(parsedArr);
}
