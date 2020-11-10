// github:tom-weatherhead/thaw-reversi-engine.ts/src/engine.ts
'use strict';
import { blackPlayerToken } from './board';
import { Game } from './game';
// TODO: Pass an optional 'descriptor = {}' parameter? See avoidwork's filesize.js
export function findBestMove(gameState, maxPly) {
    return gameState.player.findBestMove(maxPly);
}
export function createInitialState(boardAsString, playerToken) {
    boardAsString = boardAsString || Game.initialBoardAsString;
    const game = new Game(boardAsString);
    return {
        blackPopulation: game.blackPlayer.piecePopulation,
        boardAsString,
        game,
        isGameOver: false,
        numPiecesFlippedInLastMove: 0,
        player: playerToken === blackPlayerToken
            ? game.blackPlayer
            : game.whitePlayer,
        whitePopulation: game.whitePlayer.piecePopulation
    };
}
export function moveManually(gameState, row, column) {
    const resultOfPlacePiece = gameState.game.board.placePiece(gameState.player, row, column);
    return {
        blackPopulation: gameState.game.blackPlayer.piecePopulation,
        boardAsString: gameState.game.board.getAsString(),
        game: gameState.game,
        isGameOver: !gameState.game.isGameNotOver(),
        numPiecesFlippedInLastMove: typeof resultOfPlacePiece !== 'undefined'
            ? resultOfPlacePiece.flippedPieces.length
            : 0,
        player: gameState.player.opponent,
        whitePopulation: gameState.game.whitePlayer.piecePopulation
    };
}
export function moveAutomatically(gameState, maxPly) {
    const lastBestMoveInfo = findBestMove(gameState, maxPly);
    const result = moveManually(gameState, lastBestMoveInfo.bestRow, lastBestMoveInfo.bestColumn);
    result.lastBestMoveInfo = lastBestMoveInfo;
    return result;
}
export function getURLFriendlyBoardStringFromGameState(gameState) {
    return gameState.game.board.getAsString().replace(/ /g, 'E');
}
