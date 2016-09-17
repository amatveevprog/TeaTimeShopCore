
function Vector(x,y)
{
    this.x=x;
    this.y=y;
}
Vector.prototype.plus = function(v)
{
    var elem={};
    elem.x=this.x+v.x;
    elem.y=this.y+v.y;
    return elem;
}
Vector.prototype.minus = function(v)
{
    var elem={};
    elem.x=this.x-v.x;
    elem.y=this.y-v.y;
    return elem;
}
Vector.prototype.times = function(number)
{
    var elem={};
    elem.x=this.x*number;
    elem.y=this.y*number;
    return elem;
}
var vt = new Vector(1,2);

//преобразование в веб-методы
exports.sumOfTwoVectors = function(x1,y1,x2,y2)
{
    try
    {
        x1 = parseInt(x1);
        x2 = parseInt(x2);
        y1 = parseInt(y1);
        y2 = parseInt(y2);
    }
    catch(error)
    {
        return null;
    }
    var vector1 = new Vector(x1,y1);
    var vector2 = new Vector(x2,y2);
    return vector1.plus(vector2);
}
exports.diffOfTwoVectors = function(x1,y1,x2,y2)
{
    try
    {
        x1 = parseInt(x1);
        x2 = parseInt(x2);
        y1 = parseInt(y1);
        y2 = parseInt(y2);
    }
    catch(error)
    {
        return null;
    }
    var vector1 = new Vector(x1,y1);
    var vector2 = new Vector(x2,y2);
    return vector1.minus(vector2);
}
exports.compositionOfTwoVectors = function(x1,y1,times)
{
    try
    {
        x1 = parseInt(x1);
        y1 = parseInt(y1);
        times = parseInt(times);
    }
    catch(error)
    {
        return null;
    }
    var vector1 = new Vector(x1,y1);
    return vector1.times(times);
}

