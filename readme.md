```JavaScript
needs theese node modules to work:<br>
1)async;
2)express@4;
3)mime;
4)mkdirp;
5)serve-static;
additional if you need
6)path;
7)util;
8)http;
9)fs;
```
simply install theese modules via npm:<br>
example: <br> `npm install express@4 --save`<br>
<b>an example of http-page</b><br>
<h1> Загрузка файла модуля на сервер</h1>
    <div>Выберите модуль для загрузки на сервер</div>
    <form name = "upload">
        <input type="file" name="module" class="btn btn-default">
        <input type="submit" value="Загрузить" class="btn btn-default">
        </form>
<br>
<h2>Latest Updates:</h2>
<p>
<b>*>monitoring< </b> When the server starts to listen the port [1000 by default], it looks up for the files that has been already uploaded to the server.Then it parses them to obtain the API-functions </p>
<h2 style="color:yellow">TODO</h2>
<p>tasks</p>
-[:+1:] ejs-templates<br>
-[:+1:] errors handling based on ejs<br>
-[:+1:] front-end aggregation and routing<br>


>SPERMASPRULEN!!!
