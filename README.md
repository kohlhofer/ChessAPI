ChessAPI
========

A restful chess API at http://api.dxc4.com 

In order to use it you need to include a game's full history in each request (POST). For a demo client visit http://dxc4.com

Feedback and support lives here: http://simplydo.uservoice.com/forums/274824-dxc4


Set up
=========

install dependencies:

```sh
$ npm install
```



Testing
=========

```sh
$ jasmine-node .
```


Start server
==========

tell the server where to find your UCI compatible chess engine executable:
```sh
export CHESS_ENGINE=$(command -v stockfish)
export CHESS_API_PORT=8080
```

start the server:
```sh
$ node index.js
```

PM2 
=========

You can use PM2 to run the API which sports better logging, auto restarts, etc.. 
https://github.com/Unitech/PM2

Caveat: PM2 does not pass through enviroment variables so you will require to use a JSON config file like this:

```json
{
    "name"        : "Chess API",
    "script"      : "index.js",
    "log_date_format"  : "YYYY-MM-DD HH:mm Z",
    "env": {
        "CHESS_ENGINE": "path/to/UCI/Chess/Engine/Executable",
        "CHESS_API_PORT": 8080
```
    }
}
```
