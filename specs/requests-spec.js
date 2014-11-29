'use strict';

var requests = require('../requests');
 
describe('game', function () {

  it('it should send a result via restify and call the next route', function () {
    var req = {params:{pgn:'1. a3 h6 2. a4'}};
    var res = {};
    var next = jasmine.createSpy('call next route');
    res.send = jasmine.createSpy('send results via restify');
    var gameRequest = requests.game(req,res,next);
    expect(next).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

});

describe('move', function () {

  it('it should send a result via restify and call the next route', function () {
    var req = {params:{pgn:'1. a3 h6 2. a4'}};
    var res = {};
    var next = jasmine.createSpy('call next route');
    res.send = jasmine.createSpy('send results via restify');
    var gameRequest = requests.move(req,res,next);
    expect(next).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

});

describe('index', function () {

  it('it should send a default set of meta information and call the next route', function () {
    var res = {};
    var req = {};
    var next = jasmine.createSpy('call next route');
    res.send = jasmine.createSpy('send results via restify');
    var gameRequest = requests.index(req,res,next);
    expect(next).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

});

describe('bestMove', function () {

//  it('it should send a result via restify and call the next route', function () {
//    var req = {params:{pgn:'1. a3 h6 2. a4'}};
//    var res = {};
//    var next = jasmine.createSpy('call next route');
//    res.send = jasmine.createSpy('send results via restify');
//    var gameRequest = requests.bestMove(req,res,next);
//    expect(next).toHaveBeenCalled();
//    expect(res.send).toHaveBeenCalled();
//  });

});

describe('square', function () {

  it('it should send a result via restify and call the next route', function () {
    var req = {params:{pgn:'1. a3 h6 2. a4'}};
    var res = {};
    var next = jasmine.createSpy('call next route');
    res.send = jasmine.createSpy('send results via restify');
    var gameRequest = requests.square(req,res,next);
    expect(next).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

});

describe('game', function () {

  it('it should send a result via restify and call the next route', function () {
    var req = {params:{pgn:'1. a3 h6 2. a4'}};
    var res = {};
    var next = jasmine.createSpy('call next route');
    res.send = jasmine.createSpy('send results via restify');
    var gameRequest = requests.game(req,res,next);
    expect(next).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalled();
  });

});
