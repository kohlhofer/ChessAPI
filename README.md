ChessAPI
========

A restful chess API. In order to use you need to include a game's full hostory in each request (POST).


Set up
=========

install dependencies:
$ npm install

Edit requests.js to point to stock fish executable. e.g:
var engine = new chessEngine('/Users/alex/Development/chessnode/stockfish/stockfish-5-64');   


Testing
=========

$ node-jasmine . 


Start server
==========

$ node index.js

