ChessAPI
========

A restful chess API. In order to use you need to include a game's full hostory in each request (POST).


Set up
=========

install dependencies:

```sh
$ npm install
```



Testing
=========

```sh
$ node-jasmine .
```


Start server
==========

tell the server where to find your UCI compatible chess engine executable:
```sh
export CHESS_ENGINE=$(command -v stockfish)
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
        "CHESS_ENGINE": "path/to/UCI/Chess/Engine/Executable"
    }
}
```
