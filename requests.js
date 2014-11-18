'use strict';

var chessEngine = require('uci');
var gameEngine = require('./game');
var chessHelpers = require('./chessHelpers');

var standardResult = function(game,history) {
  var result = game.getStatus();
  result.history = history;
  result.fullMoves = game.game.moveHistory;
  result.side = chessHelpers.whichSide(history);
  result.pgn = chessHelpers.generatePgn(history);
  return result;
};

var errorResult = function() {
  next(new restify.InvalidArgumentError('No move provided'));
  return;
}

exports.game = function(req, res, next) {
  var history = chessHelpers.findHistoryInRequest(req);
  if (req.params.movecount !== undefined) {
    history = history.slice(0,req.params.movecount);
  }
  var game = gameEngine.create(history);
  var result = standardResult(game,history);
  res.send(result);
  next();
};

exports.move = function(req, res, next) {
  var history = chessHelpers.findHistoryInRequest(req);
  if (req.params.move) {
    var newMove = req.params.move;
    history.push(newMove);
  }
  var game = gameEngine.create(history);
  var result = standardResult(game,history);
  res.send(result);
  next();
};

exports.bestMove = function(req, res, next) {
  var engine = new chessEngine(process.env.CHESS_ENGINE);
  var history = chessHelpers.findHistoryInRequest(req);
  var game = gameEngine.create(history);
  var movesString = chessHelpers.getSquareBasedHistory(game.game.moveHistory);
  var notatedBestMove, result, moved;
  engine.runProcess().then(function () {
      return engine.uciCommand();
  }).then(function (idAndOptions) {
      console.log('Engine name - ' + idAndOptions.id.name);
      return engine.isReadyCommand();
  }).then(function () {
      // console.log('Ready');
      return engine.uciNewGameCommand();
  }).then(function () {
      // console.log('New game started');
      return engine.positionCommand('startpos',movesString);
  }).then(function () {
      // console.log('Starting position set');
      // console.log('Starting analysis');
      return engine.goInfiniteCommand(function infoHandler(info) {
          console.log(info);
      });
  }).delay(100).then(function () {
      // console.log('Stopping analysis');
      return engine.stopCommand();
  }).then(function (bestmove) {
      result = standardResult(game,history);
      notatedBestMove = chessHelpers.findAlgebraicEquivalent(result.notatedMoves,bestmove);
      console.log('Bestmove: ');
      // console.log(bestmove);
      console.log(notatedBestMove);
      history.push(notatedBestMove);
      game = gameEngine.create(history);
      result = standardResult(game,history);
      res.send(result);
      next();
      return engine.quitCommand();
  }).then(function () {
      console.log('Stopped');
  }).fail(function (error) {
      console.log(error);
      process.exit();
  }).done();
};

exports.index = function(req, res, next) {
  var result = {};
  result.name = 'ChessAPI';
  result.version = '0.0.5';
  result.documentation = '';
  result.demoClient = '';
  res.send(result);
  next();
};

exports.square = function(req, res, next) {
  var history = chessHelpers.findHistoryInRequest(req);
  var game = gameEngine.create(history);
  var result = standardResult(game,history);
  if (req.params.square) {
    var square = chessHelpers.parseStringForSquare(req.params.square, next);
    result.square = chessHelpers.analyseSquare(result.notatedMoves, square);
  }
  res.send(result);
  next();
};

exports.attack = function(req, res, next) {
  var history = chessHelpers.findHistoryInRequest(req);
  var game = gameEngine.create(history);
  var result = standardResult(game,history);
  result.attacks = chessHelpers.analyseAttacks(result.notatedMoves);
  res.send(result);
  next();
};
