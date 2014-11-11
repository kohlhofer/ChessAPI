'use strict';

var gameEngine = require('../game');
 
describe('create', function () {

  it('should return a game where black is checkmate', function () {
    var history = ['e4','c5','Nf3','e6','d4','cxd4','Nxd4','Nc6','Nc3','Qc7','g3','a6','Bg2','Nf6','O-O','Nxd4','Qxd4','Bc5','Bf4','d6','Qd3','Nd7','Na4','e5','Bd2','b5','Nxc5','Nxc5','Qa3','Bb7','Ba5','Qe7','Qe3','O-O','Rad1','f5','exf5','Rxf5','Bxb7','Nxb7','Bb4','Rf7','Qa3','Qc7','Bxd6','Qxc2','Rc1','Qf5','Bc7','Rc8','Bb6','Rxc1','Rxc1','h5','Qxa6','Nd6','b3','h4','Be3','Rf6','Qa8+','Kh7','Qg2','Rg6','a4','Qd3','axb5','Nf5','Qf3','hxg3','hxg3','Rg5','Qh1+','Rh5','Qxh5','Kg8','Rc8','Qd8','Rxd8'];
    var game = gameEngine.create(history);
    expect(game.isCheck).toBeFalsy();
    expect(game.isCheckmate).toBeTruthy();
    expect(game.isRepetition).toBeFalsy();
    expect(game.isStalemate).toBeFalsy();
    expect(game.game.board.squares.length).toBe(64);
  });
});
