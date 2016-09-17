/*'./required/logger.js'
'./required/database.js'*/

exports.HW = function(number)
{
    return "Hello World! "+number+" times!!!";
}
exports.plus = function(a,b)
{
    return a+b;
}
exports.concatenate = function(str1,str2)
{
    return str1.concat(str2);
}
exports.array = function(param1,param2,param3)
{
    var p1 = parseInt(param1);
    var p2 = parseInt(param2);
    var p3 = parseInt(param3);
    var array=[];
    array.push(p1);
    array.push(p2);
    array.push(p3);
    return array;
    /*for(var i=0;i<arguments.length;i++)
    {

    }*/
}
//console.log(module.exports);
