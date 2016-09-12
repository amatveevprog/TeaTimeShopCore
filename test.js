var str = "C:\\\\qweqwe\\sadasdad\\required_multi_mEga.jkdfjdsf";
var module1='C:\\dsafsdfsdfsdf\\required_multi_mEga.js';
var module=module1;
//console.log( module.includes("./") ? str.includes(module.split("./")[1]) : str.includes(module));

// var str1 = str.split("/");
// //убираем расширение
// var strN = str1[str1.length-1].split(".")[0];
// console.log(strN);
// //console.log(str1[str1.length-1]);
//
// var str2 = module1.split("/");
// console.log(str2[str2.length-1].split(".")[0]);
//TODO задача: вынуть из str required, обрезать
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

    var moduleSpl1
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
console.log(checkModuleStringInPath(str,module1));
/*var regExpression = /\/[A-Za-z_0-9]+(\.{1}[A-Za-z]+)?[^/]$/;
var match = regExpression.exec(str);
var regExp2 = /[^\./][A-Za-z_0-9]+[^\.]/;
var match2 = regExp2.exec(match[0]);
console.log(match2);*/

function deleteSymbolFromString(stringT,whatToDelete)
{
    var arr=stringT.split(whatToDelete);
    var newString='';
    arr.forEach(function(curr,index){
        if(arr[index]!=='')
        {
            newString+=curr;
            newString+="_";
        }
    });
    return newString;
}
//вынуть подстроку начиная с определенного символа
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

console.log(deleteSymbolFromString(deleteSymbolFromString("///adsfs/dfff.js","/"),"."));
//строки вида: "C://<имя модуля>/имя функции.js"

console.log(substrFromLastSymbol("C://path/nameOfModule/name.js",["/","\\"]).replace(".","_"));
console.log(substrFromLastSymbol("C:\\\\path/nameOfModule\\name.js",["/","\\"]).replace(".","_"));

