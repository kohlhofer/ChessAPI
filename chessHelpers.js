'use strict';

var parseStringForHistory = function(string) {
  var history;
  history = string.replace(/\[.*\]|\{.*\}|[0-9]*\.|[0|1](\/2)?-[0|1](\/[2])?/g, ''); //strip anything but moves
  history = history.replace(/[\n_]/g, ' '); // replace line breaks and underscores with spaces
  history = history.replace(/^\s+|\s+$/g, ''); // removed leading and trailing whitespaces
  history = history.replace(/\s{2,}/g, ' '); // collpase multiple whitespaces
  history = history.split(' ');  // put moves into an array
  return history;
};

exports.generatePgn = function(historyArray) {
  if (!historyArray || !(historyArray instanceof Array)) {
    return 'Requires an array as input';
  }
  var pgn = '', moveCount = 0;
  for (var i = 0; i < historyArray.length; i++) {
    if (i%2 === 0) {
      moveCount++;
      pgn += ' ' + moveCount + '.';
    }
    pgn += ' ' + historyArray[i];
  }
  pgn = pgn.slice( 1 );
  return pgn;
};

exports.parseStringForSquare = function(string) {
  if (!string) {
    return 'Requires a string as input';
  }
  var file = string.match(/[a-h]/i);
  var rank = string.match(/[1-8]/i);
  if (file !== null && rank !== null) {
   return {'file':file[0],'rank':rank[0]};
  } else {
    return false;
  }
};

exports.analyseSquare = function(moves,square) {
  var result = {};
  var move;
  var target;
  result.to = [];
  result.from = [];
  result.rank = square.rank;
  result.file = square.file;
  for (var property in moves) {
    if (moves.hasOwnProperty(property)) {
      move = moves[property];
      target = {};
      target[property] = move;
      if (move.src.rank === square.rank && move.src.file === square.file) {
        result.from.push(target);
      } else if (move.dest.rank === square.rank && move.dest.file === square.file) {
        result.to.push(target);
      }
    }
  }
  return result;
};

exports.findAlgebraicEquivalent = function(moves,squares) {
  var move;
  var from;
  var to;
  for (var property in moves) {
    if (moves.hasOwnProperty(property)) {
      move = moves[property];
      from = move.src.file+move.src.rank;
      to = move.dest.file+move.dest.rank;
      if (from ===  squares.from && to === squares.to) {
        if (!squares.promotion) {
          return property;
        } else if (squares.promotion.toLowerCase() === property.slice(-1).toLowerCase()) {
          return property;
        }
      }
    }
  }
  return false;
};

exports.analyseAttacks = function(moves) {
  var attacks = [];
  var move;
  var target;
  for (var property in moves) {
    if (moves.hasOwnProperty(property)) {
      move = moves[property];
      if (move.dest.piece != null) {
        target = {};
        target[property] = move;
        attacks.push(target);
      }
    }
  }
  return attacks;
};

exports.findHistoryInRequest = function(req) {
  if (req.params.pgn) {
    return parseStringForHistory(req.params.pgn);
  } else if (req.params.history) {
    if (req.params.history instanceof Array) {
      return req.params.history;
    } else { 
      return parseStringForHistory(req.params.history);
    }
  } else {
  return [];
  }
};

exports.whichSide = function(history) {
  // alt version for this via chess npm: console.log(game.game.getCurrentSide());
  if (history.length % 2 === 0) {
    return { name: 'white' };
  } else {
    return { name: 'black' };
  }
};

exports.getSquareBasedHistory = function (movesArray) {
  // This convert the history in a game to a stock fish compatible format
  var movesString = '';
  movesArray.map( function(move) {
    // TODO: figure out how to represent promotions here
    movesString += move.prevFile + move.prevRank + move.postFile + move.postRank;  
    if (move.promotion) {
      movesString += move.algebraic.slice(-1).toLowerCase() + ' ';
    } else {
      movesString += ' ';
    }
  });
  movesString = movesString.slice( 0,-1 );
  return movesString;
};
