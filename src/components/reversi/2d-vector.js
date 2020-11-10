// github:tom-weatherhead/thaw-reversi-engine.ts/src/2d-vector.ts
export class TwoDimensionalVector {
    constructor(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
}
TwoDimensionalVector.eightDirections = [
    new TwoDimensionalVector(-1, -1),
    new TwoDimensionalVector(0, -1),
    new TwoDimensionalVector(1, -1),
    new TwoDimensionalVector(-1, 0),
    new TwoDimensionalVector(1, 0),
    new TwoDimensionalVector(-1, 1),
    new TwoDimensionalVector(0, 1),
    new TwoDimensionalVector(1, 1)
];
