class Square {
    /*
        Define the individual square with 
        individual co-ordinates, along with canvas
        co-ordinates.
    */
    constructor(x, y, canvasCoordinates, pieceOnThisSquare) {
        this.x = x; // x-coordinate
        this.y = y; // y-coordinate
        this.canvasCoordinates = canvasCoordinates; // in pixels
        this.pieceOnThisSquare = pieceOnThisSquare;
    }

    setPiece(newPiece) {
        if (newPiece === null && this.pieceOnThisSquare === null) {
            return;
        } else if (newPiece === null) {
            // If a piece is captured
            this.pieceOnThisSquare.setSquare(undefined);
            this.pieceOnThisSquare = null;
        } else if (this.pieceOnThisSquare === null) {
            // if a player wants to place a piece on this square
            this.pieceOnThisSquare = newPiece;
            newPiece.setSquare(this);
        } else if (this.getPieceIdOnThisSquare() != newPiece.id && this.pieceOnThisSquare.color != newPiece.color) {
            this.pieceOnThisSquare = newPiece;
            newPiece.setSquare(this);
        } else {
            return "You can't capture your own piece dickhead"
        }
        
     }

     removePiece() {
         this.pieceOnThisSquare = null;
     }

     getPiece() {
         return this.pieceOnThisSquare;
     }

     getPieceIdOnThisSquare() {
         if (this.pieceOnThisSquare === null) {
             return "no piece on this square";
         }
         return this.pieceOnThisSquare.id
     }

     isOccupied() {
         return this.pieceOnThisSquare != null;
     }

     getCoordinates() {
         return [this.x, this.y];
     }

     getCanvasCoordinates() {
         return this.canvasCoordinates;
     }
}

export default Square;