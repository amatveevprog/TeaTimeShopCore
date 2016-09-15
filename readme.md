
needs theese node modules to work:
1)async
2)express@4
3)mime
4)mkdirp
5)serve-static
additional if you need
6)path
7)util
8)http
9)fs

simply install theese modules via npm:<br>
example: >npm install express@4 --save<br>
<b>an example of http-page</b><br>
<h1> Загрузка файла модуля на сервер</h1>
    <div>Выберите модуль для загрузки на сервер</div>
    <form name = "upload">
        <input type="file" name="module" class="btn btn-default">
        <input type="submit" value="Загрузить" class="btn btn-default">
        </form>
