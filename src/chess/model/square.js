class Square {
    /*
        Define the individual square with 
        individual co-ordinates, along with canvas
        co-ordinates.
    */
    constructor(x, y, canvasCoordinates, piece) {
        this.x = x; // x-coordinate
        this.y = y; // y-coordinate
        this.canvasCoordinates = canvasCoordinates; // in pixels
        this.piece = piece; // the chess piece
    }
}