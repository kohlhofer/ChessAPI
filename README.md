ChessAPI
========

A restful chess API. In order to use you need to include a game's full hostory in each request (POST).


Set up
=========

install dependencies:
$ npm install



Testing
=========

$ node-jasmine . 


Start server
==========

# tell the server where to find your UCI compatible chess engine executable
export CHESS_ENGINE=$(command -v stockfish)

# start the server
$ node index.js

