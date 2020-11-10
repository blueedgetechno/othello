// github:tom-weatherhead/thaw-reversi-engine.ts/src/test-descriptors.ts
'use strict';
import { whitePlayerToken } from './board';
import { createInitialState, getURLFriendlyBoardStringFromGameState, moveAutomatically } from './engine';
const defaultPlayer = whitePlayerToken;
const defaultMaxPly = 5;
function createInitialDataForStartOfGame() {
    const gameState = createInitialState();
    return {
        boardAsString: getURLFriendlyBoardStringFromGameState(gameState),
        gameState,
        maxPly: defaultMaxPly,
        player: defaultPlayer
    };
}
export const testDescriptors = [
    {
        // . . . . . . . .
        // . . . . . . . .
        // . . . . . . . .
        // . . . X O . . .
        // . . . O X . . .
        // . . . . . . . .
        // . . . . . . . .
        // . . . . . . . .
        name: 'InitialBoardStringTest',
        arrangeFunction: () => createInitialDataForStartOfGame(),
        actFunction: (initialData) => {
            return initialData.gameState.game.board.getPrintedBoardAsString();
        },
        assertFunction: (initialData, expect, result) => {
            const expectedResult = [
                '8  + + + +',
                '7 + + + + ',
                '6  + + + +',
                '5 + +OX + ',
                '4  + XO+ +',
                '3 + + + + ',
                '2  + + + +',
                '1 + + + + ',
                '',
                '  abcdefgh',
                ''
            ].join('\n');
            expect(result).toBe(expectedResult);
        }
    },
    {
        // . . . . . . . .
        // . . . . . . . .
        // . . . . . . . .
        // . . . X O . . .
        // . . . O X . . .
        // . . . . . . . .
        // . . . . . . . .
        // . . . . . . . .
        name: 'FirstMoveTest',
        arrangeFunction: () => createInitialDataForStartOfGame(),
        actFunction: (initialData) => {
            return moveAutomatically(initialData.gameState, initialData.maxPly);
        },
        assertFunction: (initialData, expect, result) => {
            expect(result).toBeTruthy();
            const lastBestMoveInfo = result.lastBestMoveInfo;
            expect(lastBestMoveInfo).toBeDefined();
            if (typeof lastBestMoveInfo !== 'undefined') {
                expect(lastBestMoveInfo.bestRow).toBeTruthy();
                expect(lastBestMoveInfo.bestColumn).toBeTruthy();
                expect(lastBestMoveInfo.bestScore).toBe(3);
                expect(lastBestMoveInfo.bestMoves).toStrictEqual([
                    { row: 2, column: 4 },
                    { row: 3, column: 5 },
                    { row: 4, column: 2 },
                    { row: 5, column: 3 }
                ]);
            }
        }
    },
    {
        name: 'UndoTest',
        doNotTestThroughWebService: true,
        arrangeFunction: () => createInitialDataForStartOfGame(),
        actFunction: (initialData) => {
            return initialData.gameState.player.findBestMove(initialData.maxPly);
        },
        assertFunction: (initialData, expect, result) => {
            const actualBoardAsString = getURLFriendlyBoardStringFromGameState(initialData.gameState);
            expect(result).toBeTruthy();
            expect(actualBoardAsString).toBe(initialData.boardAsString);
        }
    }
];
