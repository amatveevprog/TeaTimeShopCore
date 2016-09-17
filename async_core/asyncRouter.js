var EndpointError = require('./endpoint_error');
var fs = require('fs');
var async = require('async');

var Router = function()
{
    this.libArray = [];
    this.urlArray = [];// pares: url^function
};
//еще более прокачанный require!!!
Router.prototype.require_2_1 = function (modulePath,callback) {

    var Router = this;
    async.waterfall([function (callback) {
        //
        var required_module,required_cache;
        required_module = require(modulePath);
        required_cache = require.cache[require.resolve(modulePath)].exports;
        callback(null,required_module,required_cache)
    },function (module,cache,callback) {
        //looking in cache for our included module...
        var arrayObject=[];
        for(key in cache)
        {
            var element = cache[key];
            //смотрим на элемент и на ключ
            if(typeof element=='function')
            {
                var funcName = key;
                //если попалась функция, то сохраняем ее
                var funcToken = {'nameOfFunc':funcName,"numOfArgs":element.length,'funcPtr':element.bind(null)};
                arrayObject.push(funcToken);
            }
        }
        callback(null,module,arrayObject);
    },function (module,arrayObject,callback) {
        //проверка, что arrayObject не пустой
        if(arrayObject.length>0)
        {
            var moduleFuncObject = {"moduleName":require.cache[require.resolve(modulePath)].id,'funcObject':arrayObject};
            //добавление функции в массив библиотеки
            Router.libArray.push(moduleFuncObject);
        }
        callback(null,module,arrayObject);
    }],callback);
};
Router.prototype.getFunction = function(moduleName,funcName)
{
    //ищем функцию в нашем массиве.
    for(var i=0;i<this.libArray.length;i++)
    {
        if(checkModuleStringInPath(this.libArray[i].moduleName,moduleName))
        {
            //ищем функцию в данном модуле
            for(var j=0;j<this.libArray[i].funcObject.length;j++)
            {
                if(this.libArray[i].funcObject[j].nameOfFunc==funcName)
                {
                    return this.libArray[i].funcObject[j].funcPtr;
                }
            }
        }
    }return null;

}
//назначить исполняемую функцию конкретному урлу
Router.prototype.assignFuncToUrl = function (url,moduleName,funcName)
{
    var got = this.getFunction(moduleName,funcName);
    if(got!=null)
    {
        for(var i=0;i<this.urlArray.length;i++)
        {
            if(this.urlArray[i].url==url)
            {
                this.urlArray[i].Function=got;
                return true;
            }
        }
        return false;
    }
    else
        throw(new Error("Function <"+funcName+"> not found or no such module: <"+moduleName+">"));
    //apply уже при вызове функции, т.к. мы не знаем количество параметров
}
//добавить в массив урл с пустой функцией
Router.prototype.addToUrlArray = function(newURL)
{
    var element = {'url':newURL,'Function':null};
    this.urlArray.push(element);
}
Router.prototype.hasUrl = function(url)
{
    for(var i=0;i<this.urlArray.length;i++)
    {
        if(url==this.urlArray[i].url)
        {
            return true;
        }
    }
    return false;
}
Router.prototype.getNumOfFunctsInModule = function(moduleName)
{
    var retObject={};
    var out_param_NumOfModule;
    for(var i=0;i<this.libArray.length;i++)
    {
        //если нашли модуль с именем moduleName
        if(checkModuleStringInPath(moduleName,this.libArray[i].moduleName))
        {
            out_param_NumOfModule = i;
            retObject = {"moduleNumInArr":i,"length":this.libArray[i].funcObject.length};
            return retObject;
        }
    }
    return null;
}
Router.prototype.executeOnUrlSync = function(url,paramArray)
{
    //смотрим urlArray:
    for(var i=0;i<this.urlArray.length;i++)
    {
        if(this.urlArray[i].url==url)
        {
            return this.urlArray[i].Function.apply(null,paramArray);
        }
    }
    return null;
}
Router.prototype.executeOnUrl = function(url,paramArray,callback)
{
    //смотрим urlArray:
    for(var i=0;i<this.urlArray.length;i++) {
        if (this.urlArray[i].url == url) {
            if(paramArray!=null) {
                return callback(null, this.urlArray[i].Function.apply(null, paramArray));
            }
            else
            {
                return callback(null, this.urlArray[i].Function.apply(null));
            }
        }
    }
    return callback(new EndpointError("No such endpoint!"));
}
//!new! асинхронная функция автоматического считывания из файла и преобразование export-функций файла в web-функции
Router.prototype.automaticParse = function(filePath,url_prefix,callback)
{
    var requiredPtr;
    var Router = this;
    this.require_2_1(filePath,function (err,module,result) {
        if(err) {
            //console.error("Error in require 2_1!");
            throw(err);
        }
        else
        {
            requiredPtr = module;
            //console.log("successfull requisition of: "+result);


            var numberOfModule = Router.getNumOfFunctsInModule(filePath).moduleNumInArr;//получить номер модуля по названию
            var out_param;
            var numberOfFunctionsInModule = Router.getNumOfFunctsInModule(filePath).length;

            if(numberOfFunctionsInModule!=null) {
                var nameOfModule = Router.libArray[numberOfModule].moduleName;
                var htmlModuleName = substrFromLastSymbol(nameOfModule,["/","\\"]).replace(".","_")+"_";
                for (var i = 0; i <numberOfFunctionsInModule; i++) {
                    //пробегаемся по массиву, получаем имена функций
                    var my_function = Router.libArray[numberOfModule].funcObject[i].funcPtr;
                    var my_functionName = Router.libArray[numberOfModule].funcObject[i].nameOfFunc;
                    //генерим имя функции
                    var httpFunctionName = url_prefix+htmlModuleName+my_functionName;
                    //загоняем в массив
                    //1)addTourlArray
                    addUrlObjectToUrlArray(Router.urlArray,httpFunctionName,my_function);
                }
            }
            //return requiredPtr;
            //необходимо вызвать callback с urlArray
            callback(null,Router.urlArray);
            //функция - вынуть подстроку начиная с определенного символа
            //пример: из строки C://path/module.js вынуть module.js
            function substrFromLastSymbol(myString,arrSymbols)
            {
                var positionOfSymbol=-1;
                for(var i=myString.length-1;i>=0;i--)
                {
                    if (arrSymbols.some(elem => elem==myString[i])) {
                    positionOfSymbol = i;
                    break;
                }
                }
                if(positionOfSymbol>=0)
                {
                    return myString.substr(positionOfSymbol+1);
                }
                return myString;
            }



        }
    });
    //узнаем число функций

}
Router.prototype.getAllNamesOfFunctions = function()
{
    var allNames = [];
    this.urlArray.forEach(function(current,index)
    {

    });
}
//добавить в массив объект с урлом и назначенной ему функцией
function addUrlObjectToUrlArray(arr,url,funcPtr)
{
    var element = {'url':url,'Function':funcPtr};
    arr.push(element);
}
function checkModuleStringInPath(path,module)
{
    var fileArray;
    if(path.includes("\\"))
    {
        fileArray = path.split("\\");
    }
    else
    {
        fileArray = path.split("/");
    }
    var fileStr = fileArray[fileArray.length-1];//получили имя файла с расширением(если оно есть)
    var fileNameWithoutExt = fileStr.split(".")[0];

    var moduleSpl1;
    if(module.includes("\\"))
    {
        moduleSpl1 = module.split("\\");
    }
    else
    {
        moduleSpl1 = module.split("/");
    }
    var moduleSpl2 = moduleSpl1[moduleSpl1.length-1].split(".")[0];

    return (fileNameWithoutExt==moduleSpl2);
}
module.exports = new Router();

