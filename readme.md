
needs theese node modules to work:<br>
1)async<br>
2)express@4<br>
3)mime<br>
4)mkdirp<br>
5)serve-static<br>
additional if you need<br>
6)path<br>
7)util<br>
8)http<br>
9)fs<br>

simply install theese modules via npm:<br>
example: >npm install express@4 --save<br>
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
When the server starts to listen the port [1000 by default], it looks up for the files that has been already uploaded to the server.Then it parses them to obtain the API-functions </p>
<h2 style="color:yellow">TODO</h2>
<p>tasks</p>
-[x] ejs-templates
-[] errors handling based on ejs
-[] front-end aggregation and routing
