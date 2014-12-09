'use strict';

var chessEngine = require('uci');
var gameEngine = require('./game');
var chessHelpers = require('./chessHelpers');

var standardResult = function(game,history,includes) {
  var result = {};
  var gameStatus = game.getStatus();
  var side = chessHelpers.whichSide(history);
  var board = gameStatus.board.squares;
  var availableFullMoves = gameStatus.notatedMoves;

  if (checkStringForSubstring(includes,'status')) {
    result.isCheck = gameStatus.isCheck;
    result.isCheckmate = gameStatus.isCheckmate;
    result.isRepetition = gameStatus.isRepetition;
    result.isStalemate = gameStatus.isStalemate;
  }

  if (checkStringForSubstring(includes,'side')) {
    result.side = side;
  }
  
  if (checkStringForSubstring(includes,'pgn')) {
    result.pgn = chessHelpers.generatePgn(history);
  }

  if (checkStringForSubstring(includes,'fen')) {
    result.fen = chessHelpers.generateFen(board,side);
  }

  if (checkStringForSubstring(includes,'previousMoves')) {
    result.previousMoves = history;
  }

  if (checkStringForSubstring(includes,'valuation')) {
    result.valuation = chessHelpers.armyStrength(board);
  }
  
  if (checkStringForSubstring(includes,'availableFullMoves')) {
    result.availableFullMoves = availableFullMoves;
  }
  
  if (checkStringForSubstring(includes,'availableMoves')) {
    result.availableMoves = chessHelpers.flattenedMoves(availableFullMoves);
  }
  
  if (checkStringForSubstring(includes,'board')) {
    result.board = board;
  }

  if (checkStringForSubstring(includes,'previousFullMoves')) {
    result.previousFullMoves = game.game.moveHistory;
  }

  if (checkStringForSubstring(includes,'attacks')) {
    result.attacks = chessHelpers.analyseAttacks(availableMoves);
  }
  
  return result;
};

var checkStringForSubstring = function(string,substring) {
  if (string.indexOf(substring) > -1) {
    return true;
  } else {
    return false;
  }
};

var bestMove = function(res, next, includes, history, game) {
  var engine = new chessEngine(process.env.CHESS_ENGINE);
  var movesString = chessHelpers.getSquareBasedHistory(game.game.moveHistory);
  var notatedBestMove, result;
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
      result = standardResult(game,history,'availableFullMoves');
      notatedBestMove = chessHelpers.findAlgebraicEquivalent(result.availableFullMoves,bestmove);
      console.log('Bestmove: ');
      console.log(notatedBestMove);
      history.push(notatedBestMove);
      game = gameEngine.create(history);
      result = standardResult(game,history,includes);
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

exports.pgnparser = function(req, res, next) {
  var history = chessHelpers.findHistoryInRequest(req);

  if (req.params.nextMove) {
    history.push(req.params.nextMove);
  }
  
  if (req.params.moveCount !== undefined) {
    history = history.slice(0,req.params.moveCount);
  }

  var game = gameEngine.create(history);

  if (req.params.includes === undefined) {
    req.params.includes = 'status pgn';
  }
  if (req.params.stockfish === true || req.params.stockfish === 'true') {
    bestMove(res, next, req.params.includes, history, game);
    return;
  }

  var result = standardResult(game,history,req.params.includes);
  res.send(result);
  next();
};


exports.index = function(req, res, next) {
  var result = {};
  result.name = 'dxc4 API';
  result.demoClient = 'http://dxc4.com';
  result.apiDocs = 'http://apidocs.dxc4.com';
  result.apiUrl = 'http://api.dxc4.com';
  result.demoClientSource = 'https://github.com/SimplyDo/chessAPP';
  result.featureRequests = 'http://simplydo.uservoice.com/forums/274824-dxc4';
  result.issues = 'tbd';
  result.version = '0.0.6';
  res.send(result);
  next();
};
