class ChessPiece {
    /*
        Define the individual chess piece.
    */
    constructor(name, isAttacked, color, id) {
        this.name = name // string;
        this.id = id // string;
        this.isAttacked = isAttacked // bool;
        this.color = color // string;

    }

    setSquare(newSquare) {
        // Assign piece to a specific square.
        if (newSquare === undefined) {
            this.squareThisPieceIsOn = newSquare;
            return
        }

        if (this.squareThisPieceIsOn === undefined) {
            this.squareThisPieceIsOn = newSquare;
            newSquare.setPiece(this);
        }

        const isNewSquareDifferent = this.squareThisPieceIsOn.x !== newSquare.x || this.squareThisPieceIsOn.y !== newSquare.y;

        if (isNewSquareDifferent) {
            this.squareThisPieceIsOn = newSquare;
            newSquare.setPiece(this);
        }
    }

    getSquare() {
        return this.squareThisPieceIsOn;
    }
}

export default ChessPiece