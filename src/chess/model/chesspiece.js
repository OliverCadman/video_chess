class ChessPiece {
    /*
        Define the individual chess piece.
    */
    constructor(name, id, isAttacked, color) {
        this.name = name // string;
        this.id = id // string;
        this.isAttacked = isAttacked // bool;
        this.color = color // string;

    }

    setSquare() {
        // Assign piece to a specific square.
    }

    getSquare() {
        // Get the current square that a piece is occupying.
        // undefined if the piece is not on the board.
    }

    
}