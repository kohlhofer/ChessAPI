'use strict';

var chess = require('chess');

var makeMove = function(game,move) {
  return game.move(move);
};

exports.create = function(history) {
  var game = chess.create({ PGN : true });
  history.map( function(move) {
    makeMove(game,move);
  });
  return game;
};

