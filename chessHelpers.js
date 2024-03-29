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

exports.ip = function(request) {
  var ip = request.headers['x-forwarded-for'] || 
    request.connection.remoteAddress || 
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress;
  return ip;
};

exports.generateFen = function(squaresArray,currentSide) {

  if (!squaresArray || !(squaresArray instanceof Array)) {
    return 'Requires an array as input';
  }

  var stringPos,notation,type,side,rank,file;
  var fen = '--------/--------/--------/--------/--------/--------/--------/--------';
  var notationMap = {white:{rook:'R',knight:'N',bishop:'B',queen:'Q',king:'K',pawn:'P'},black:{rook:'r',knight:'n',bishop:'b',queen:'q',king:'k',pawn:'p'}};
  var fileMap = {a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7};
  var replaceAtPos = function(string,index, character) {
    return string.substr(0, index) + character + string.substr(index+character.length);
  };

  for (var i = 0; i < squaresArray.length; i++) {
    if (squaresArray[i].piece) {
      side = squaresArray[i].piece.side.name;
      rank = squaresArray[i].rank;
      file = squaresArray[i].file;
      type = squaresArray[i].piece.type;
      notation = notationMap[side][type];
      stringPos = (9 * (8-rank)) + fileMap[file];
      fen = replaceAtPos(fen,stringPos,notation);
    }
  }
  fen = fen.replace( /([-]+)/ig, function replacer(match){
    var length = match.length;
    return length;
  });
  fen = fen + ' ' + currentSide.charAt(0);
  return fen;
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

exports.flattenedMoves = function(moves) {
  var flattenedMoves = [];
  for (var property in moves) {
    if (moves.hasOwnProperty(property)) {
     flattenedMoves.push(property);  
    }
  }
  return flattenedMoves;
};

exports.armyStrength = function(squaresArray) {
  var side, type;
  var valuation = {black:{totalValue:0,pieces:{}},white:{totalValue:0,pieces:{}}};
  var valueMap = {'king':0,'queen':9,'rook':5,'bishop':3,'knight':3,'pawn':1};
  for (var i = 0; i < squaresArray.length; i++) {
    if (squaresArray[i].piece) {
      side = squaresArray[i].piece.side.name;
      type = squaresArray[i].piece.type;
      if (valuation[side].pieces[type]) {
        valuation[side].pieces[type]++;
      } else {
        valuation[side].pieces[type] = 1;
      }
      valuation[side].totalValue = valuation[side].totalValue + valueMap[type];
    }
  }
  return valuation;
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
    return 'white';
  } else {
    return 'black';
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
