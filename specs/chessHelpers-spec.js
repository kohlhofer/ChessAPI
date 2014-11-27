'use strict';

var chessHelpers = require('../chessHelpers');
 
describe('generatePgn', function () {

  it('should gnerate a PGN moves string from a moves array', function () {
    var moves = ['d4','e5','dxe5'];
    var pgn = chessHelpers.generatePgn(moves);
    expect(pgn).toBe('1. d4 e5 2. dxe5');
  });

  it('should return an empty string if the moves array is empty', function () {
    var pgn = chessHelpers.generatePgn([]);
    expect(pgn).toBe('');
  });

  it('should return an error if nothing is passed in', function () {
    var pgn = chessHelpers.generatePgn();
    expect(pgn).toBe('Requires an array as input');
  });
  
  it('should return an error if no valid array is passed in', function () {
    var pgn = chessHelpers.generatePgn('hello world');
    expect(pgn).toBe('Requires an array as input');
  });

}); 

describe('parseStringForSquare', function () {

  it('should find a file and rank in a string', function () {
    var string = 'a3';
    var square = chessHelpers.parseStringForSquare(string);
    expect(square.file).toBe('a');
    expect(square.rank).toBe('3');
  });

  it('it should return false if the string does not contain a square', function () {
    var string = 'hello world';
    var square = chessHelpers.parseStringForSquare(string);
    expect(square).toBe(false);
  });
  
  it('it should return an error if nothing is passed in', function () {
    var square = chessHelpers.parseStringForSquare();
    expect(square).toBe('Requires a string as input');
  });

}); 


describe('analyseSquare', function () {

  var moves;

  beforeEach(function() {
    moves = {'Nf3':{'src':{'file':'g','rank':1,'piece':{'moveCount':0,'side':{'name':'white'},'type':'knight','notation':'N'}},'dest':{'file':'f','rank':3,'piece':null}},'f3':{'src':{'file':'f','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'f','rank':3,'piece':null}},'f4':{'src':{'file':'f','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'f','rank':4,'piece':null}},'g3':{'src':{'file':'g','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'g','rank':3,'piece':null}},'g4':{'src':{'file':'g','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'g','rank':4,'piece':null}},'h3':{'src':{'file':'h','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'h','rank':3,'piece':null}},'h4':{'src':{'file':'h','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'h','rank':4,'piece':null}}};
  });
  
  it('should return all available moves to a specific square', function () {
    var square = {rank:3,file:'f'};
    var result = chessHelpers.analyseSquare(moves,square);
    expect(result.to.length).toBe(2);
    expect(result.from.length).toBe(0);
  });

  it('should return all available moves from a specific square', function () {
    var square = {rank:2,file:'h'};
    var result = chessHelpers.analyseSquare(moves,square);
    expect(result.to.length).toBe(0);
    expect(result.from.length).toBe(2);
  });
  
  it('should return the square coorindates it was passed', function () {
    var square = {rank:2,file:'h'};
    var result = chessHelpers.analyseSquare({},square);
    expect(result.rank).toBe(2);
    expect(result.file).toBe('h');
  });

}); 


describe('findAlgebraicEquivalent', function () {

  
  var moves;

  beforeEach(function() {
    moves = {'d8R':{'src':{'file':'d','rank':7,'piece':{'moveCount':4,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'d','rank':8,'piece':null}},'d8N':{'src':{'file':'d','rank':7,'piece':{'moveCount':4,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'d','rank':8,'piece':null}},'d8B':{'src':{'file':'d','rank':7,'piece':{'moveCount':4,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'d','rank':8,'piece':null}},'d8Q':{'src':{'file':'d','rank':7,'piece':{'moveCount':4,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'d','rank':8,'piece':null}}};
  });

  it('should return the algebraic equivalent for a move described in squares', function () {
    moves = {'Nf3':{'src':{'file':'g','rank':1,'piece':{'moveCount':0,'side':{'name':'white'},'type':'knight','notation':'N'}},'dest':{'file':'f','rank':3,'piece':null}},'f3':{'src':{'file':'f','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'f','rank':3,'piece':null}},'f4':{'src':{'file':'f','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'f','rank':4,'piece':null}},'g3':{'src':{'file':'g','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'g','rank':3,'piece':null}},'g4':{'src':{'file':'g','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'g','rank':4,'piece':null}},'h3':{'src':{'file':'h','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'h','rank':3,'piece':null}},'h4':{'src':{'file':'h','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'h','rank':4,'piece':null}}};
    var squares = {to:'f3',from:'g1'};
    var move = chessHelpers.findAlgebraicEquivalent(moves,squares);
    expect(move).toBe('Nf3');
  });
  

  it('should return the correct notation for promotions', function () {
    var squares = {to:'d8',from:'d7',promotion:'N'};
    var move = chessHelpers.findAlgebraicEquivalent(moves,squares);
    expect(move).toBe('d8N');
  });

  it('should return false if there is no matching alegraic move available', function () {
    var squares = {to:'d4',from:'d5'};
    var move = chessHelpers.findAlgebraicEquivalent(moves,squares);
    expect(move).toBeFalsy();
  });

}); 


describe('analyseAttacks', function () {
  
  it('should find all possible attacks in avaialble moves', function () {
    var moves = {'Nxe5':{'src':{'file':'f','rank':3,'piece':{'moveCount':1,'side':{'name':'white'},'type':'knight','notation':'N'}},'dest':{'file':'e','rank':5,'piece':{'moveCount':1,'side':{'name':'black'},'type':'pawn','notation':''}}},'f3':{'src':{'file':'f','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'f','rank':3,'piece':null}},'f4':{'src':{'file':'f','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'f','rank':4,'piece':null}},'g3':{'src':{'file':'g','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'g','rank':3,'piece':null}},'g4':{'src':{'file':'g','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'g','rank':4,'piece':null}},'h3':{'src':{'file':'h','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'h','rank':3,'piece':null}},'h4':{'src':{'file':'h','rank':2,'piece':{'moveCount':0,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'h','rank':4,'piece':null}},'dxe5':{'src':{'file':'d','rank':4,'piece':{'moveCount':1,'side':{'name':'white'},'type':'pawn','notation':''}},'dest':{'file':'e','rank':5,'piece':{'moveCount':1,'side':{'name':'black'},'type':'pawn','notation':''}}}};
    var attacks = chessHelpers.analyseAttacks(moves);
    expect(attacks.length).toBe(2);
  });

}); 

describe('findHistoryInRequest', function () {
  
  it('should return a moves array based on a pgn request parameter', function () {
    var request = {params:{pgn:'1. a3 h6 2. a4'}};
    var history = chessHelpers.findHistoryInRequest(request);
    expect(history).toEqual([ 'a3', 'h6', 'a4' ]);
  });
  
  it('should return a moves array based on a history array request parameter', function () {
    var request = {params:{history:[ 'a3', 'h6', 'a4' ]}};
    var history = chessHelpers.findHistoryInRequest(request);
    expect(history).toEqual([ 'a3', 'h6', 'a4' ]);
  });

  it('should gracefully return a moves array based on string history array  request parameter', function () {
    var request = {params:{history:'1. a3 h6 2. a4'}};
    var history = chessHelpers.findHistoryInRequest(request);
    expect(history).toEqual([ 'a3', 'h6', 'a4' ]);
  });

}); 

describe('whichSide', function () {
  
  it('should return whos turn it is based on the move count', function () {
    var history = ['a3','h6','b4'];
    var side = chessHelpers.whichSide(history);
    expect(side).toBe('black');
  });

  it('should return whos turn it is based on the move count', function () {
    var history = ['a3','h6','b4','h5'];
    var side = chessHelpers.whichSide(history);
    expect(side).toBe('white');
  });

}); 

describe('getSquareBasedHistory', function () {
  
  it('should return a string of squares based on a moves array', function () {
    var movesArray = [{'capturedPiece':null,'hashCode':'rp1W0h2HeTX2cNjrgpLETA==','algebraic':'d4','promotion':false,'piece':{'moveCount':2,'side':{'name':'white'},'type':'pawn','notation':''},'prevFile':'d','prevRank':2,'postFile':'d','postRank':4},{'capturedPiece':null,'hashCode':'T2M8GpsuhWIwrBMQwNQ41g==','algebraic':'e5','promotion':false,'piece':{'moveCount':1,'side':{'name':'black'},'type':'pawn','notation':''},'prevFile':'e','prevRank':7,'postFile':'e','postRank':5},{'capturedPiece':{'moveCount':1,'side':{'name':'black'},'type':'pawn','notation':''},'hashCode':'YSEsgVsA+EIjVeaKtHi+cQ==','algebraic':'dxe5','promotion':false,'piece':{'moveCount':2,'side':{'name':'white'},'type':'pawn','notation':''},'prevFile':'d','prevRank':4,'postFile':'e','postRank':5}];
    var movesString = chessHelpers.getSquareBasedHistory(movesArray);
    expect(movesString).toBe('d2d4 e7e5 d4e5');
  });

}); 
