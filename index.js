'use strict';

var restify = require('restify');
var requests = require('./requests');

var server = restify.createServer({ 
  name: 'chessAPI'
});

server.use(restify.fullResponse());
server.use(restify.queryParser({ mapParams: true }));
server.use(restify.bodyParser({
  mapParams: true,
  mapFiles: false,
  overrideParams: true
}));

server.get('/', requests.index); // return board, status and available moves for the current player
server.post('/game', requests.game); // return board, status and available moves for the current player
server.post('/move', requests.move); // validate and apply new move
server.post('/bestmove', requests.bestMove); // let the engine make the best move
server.post('/square', requests.square); // any moves to or from the selected square for the current player

server.listen(process.env.CHESS_API_PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});
