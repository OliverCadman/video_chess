import { Chess } from "chess.js";
import ChessPiece from "./chesspiece";
import Square from "./square";

class Game {
  constructor(playerIsWhite) {
    this.playerIsWhite = playerIsWhite; // bool;
    this.chessBoard = this.makeStartingBoard();

    // chess.js - Validates moves and detects check/checkmate/draw/stalemate.
    this.chess = new Chess();

    /* Define the co-ordinates of the board relative to player color's perspective */
    this.fromCoordinates = playerIsWhite
      ? {
          0: 8,
          1: 7,
          2: 6,
          3: 5,
          4: 4,
          5: 3,
          6: 2,
          7: 1,
        }
      : {
          0: 1,
          1: 2,
          2: 3,
          3: 4,
          4: 5,
          5: 6,
          6: 7,
          7: 8,
        };

    this.fromAlphabet = playerIsWhite
      ? {
          0: "a",
          1: "b",
          2: "c",
          3: "d",
          4: "e",
          5: "f",
          6: "g",
          7: "h",
        }
      : {
          0: "h",
          1: "g",
          2: "f",
          3: "e",
          4: "d",
          5: "c",
          6: "b",
          7: "a",
        };

    this.toCoordinates = playerIsWhite
      ? {
          8: 0,
          7: 1,
          6: 2,
          5: 3,
          4: 4,
          3: 5,
          2: 6,
          1: 7,
        }
      : {
          1: 0,
          2: 1,
          3: 2,
          4: 3,
          5: 4,
          6: 5,
          7: 6,
          8: 7,
        };

    this.toAlphabet = playerIsWhite
      ? {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          e: 4,
          f: 5,
          g: 6,
          h: 7,
        }
      : {
          h: 0,
          g: 1,
          f: 2,
          e: 3,
          d: 4,
          c: 5,
          b: 6,
          a: 7,
        };

    this.numberOfQueens = 1;
  }

  getBoard() {
    // Return the current chess board.
    return this.chessBoard;
  }

  setBoard(newBoard) {
    // Update the state of the board when an
    this.chessBoard = newBoard;
  }

  movePiece(pieceId, to, isMyMove) {
    /*
      Handles logic to move a chess piece, 
      and update the chess.js object with move.

      
    */
    const to2D = isMyMove
      ? {
          97: 0,
          179: 1,
          261: 2,
          343: 3,
          425: 4,
          507: 5,
          589: 6,
          671: 7,
        }
      : {
          97: 7,
          179: 6,
          261: 5,
          343: 4,
          425: 3,
          507: 2,
          589: 1,
          671: 0,
        };

    let currentBoard = this.getBoard();
    const pieceCoordinates = this.findPiece(currentBoard, pieceId);

    if (!pieceCoordinates) {
      console.log("no piece coordinates");
      return;
    }

    const x = pieceCoordinates[0];
    const y = pieceCoordinates[1];

    const toX = to2D[to[0]];
    const toY = to2D[to[1]];

    const originalPiece = currentBoard[y][x].getPiece();

    if (y === toY && x === toX) {
      return "moved in the same position.";
    }

    // Determine whether the move is a promotion.
    const isPromotion = this.isPawnPromotion(to, pieceId[1]);

    // Update chess.js with new move.
    // Add a new queen to the board if the move is a promotion.
    const moveAttempt = !isPromotion
      ? this.chess.move({
          from: this.toChessMove([x, y], to2D),
          to: this.toChessMove(to, to2D),
          piece: pieceId[1],
        })
      : this.chess.move({
          from: this.toChessMove([x, y], to2D),
          to: this.toChessMove(to, to2D),
          piece: pieceId[1],
          promotion: "q",
        });
    if (moveAttempt === null) {
      return "invalid move";
    }

    if (moveAttempt.flags === "e") {
      const move = moveAttempt.to;
      const x = this.toAlphabet[move[0]];
      let y;

      if (moveAttempt.color === "w") {
        y = parseInt(move[1], 10) - 1;
      } else {
        y = parseInt(move[1], 10) + 1;
      }

      currentBoard[this.toCoordinates[y]][x].setPiece(null);
    }

    const castle = this.isCastle(moveAttempt);
    if (castle.didCastle) {
      const originalRook = currentBoard[castle.y][castle.x].getPiece();
      currentBoard[castle.toY][castle.toX].setPiece(originalRook);
      currentBoard[castle.y][castle.x].setPiece(null);
    }

    const reassign = isPromotion
      ? currentBoard[toY][toX].setPiece(
          new ChessPiece(
            "queen",
            false,
            pieceId[0] === "w" ? "white" : "black",
            pieceId[0] === "w"
              ? "wq" + this.numberOfQueens
              : "bq" + this.numberOfQueens
          )
        )
      : currentBoard[toY][toX].setPiece(originalPiece);

    if (reassign !== "user tried to capture their own piece") {
      currentBoard[y][x].setPiece(null);
    } else {
      return reassign;
    }

    const checkMate = this.chess.in_checkmate()
      ? " has been checkmated"
      : " has not been checkmated";
    if (checkMate === " has been checkmated") {
      return this.chess.turn() + checkMate;
    }
    console.log(checkMate);

    const check = this.chess.in_check() ? " is in check" : " is not in check";
    if (check === " is in check") {
      return this.chess.turn() + check;
    }

    this.setBoard(currentBoard);

    if (moveAttempt.flags === "c") {
      return "capture";
    } else if (moveAttempt.flags === "b" || moveAttempt.flags === "n" || moveAttempt.flags === "") {
      return "move";
    }
  }

  isCastle(moveAttempt) {
    // Determine and validate a castling attempt.
    const piece = moveAttempt.piece;
    const move = {
      from: moveAttempt.from,
      to: moveAttempt.to,
    };

    const isBlackCastle =
      (move.from === "e1" && move.to === "g1") ||
      (move.from === "e1" && move.to === "c1");
    const isWhiteCastle =
      (move.from === "e8" && move.to === "g8") ||
      (move.from === "e8" && move.to === "c8");

    if (!(isWhiteCastle || isBlackCastle) || piece !== "k") {
      return {
        didCastle: false,
      };
    }

    let originalPositionOfRook;
    let newPositionOfRook;

    if (move.from === "e1" && move.to === "g1") {
      originalPositionOfRook = "h1";
      newPositionOfRook = "f1";
    } else if (move.from === "e1" && move.to === "c1") {
      originalPositionOfRook = "a1";
      newPositionOfRook = "d1";
    } else if (move.from === "e8" && move.to === "g8") {
      originalPositionOfRook = "h8";
      newPositionOfRook = "f8";
    } else {
      originalPositionOfRook = "a8";
      newPositionOfRook = "d8";
    }

    return {
      didCastle: true,
      x: this.toAlphabet[originalPositionOfRook[0]],
      y: this.toCoordinates[originalPositionOfRook[1]],
      toX: this.toAlphabet[newPositionOfRook[0]],
      toY: this.toCoordinates[newPositionOfRook[1]],
    };
  }

  isPawnPromotion(to, piece) {
    /*
      Determine whether a pawn has reached the other side of the board.
      If increment the number of new queens.
    */
    const res = piece === "p" && (to[1] === 97 || to[1] === 671);
    if (res) {
      this.newQueens += 1;
    }
    return res;
  }

  toChessMove(finalPosition, to2D) {
    /*
      Convert the co-ordinates passed as arguments
      into a format readable by the chess.js object.
    */
    let move;
    if (finalPosition[0] > 100) {
      move =
        this.fromAlphabet[to2D[finalPosition[0]]] +
        this.fromCoordinates[to2D[finalPosition[1]]];
    } else {
      move =
        this.fromAlphabet[finalPosition[0]] +
        this.fromCoordinates[finalPosition[1]];
    }
    return move;
  }

  restartGame() {
    /*
      Reset chess.js logic when a game is restarted.
    */
    this.chess.reset();
  }

  findPiece(board, pieceId) {
    // Identify an individual piece on the board, by it's piece ID.
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j].getPieceIdOnThisSquare() === pieceId) {
          return [j, i];
        }
      }
    }
  }

  makeStartingBoard() {
    // Construct the board.

    // Add squares and place the pieces on appropriate squares.
    const backRank = [
      "rook",
      "knight",
      "bishop",
      "queen",
      "king",
      "bishop",
      "knight",
      "rook",
    ];
    var startingChessBoard = [];
    for (var i = 0; i < 8; i++) {
      startingChessBoard.push([]);
      for (var j = 0; j < 8; j++) {
        // j is horizontal
        // i is vertical
        const coordinatesOnCanvas = [(j + 1) * 82 + 15, (i + 1) * 82 + 15];
        const emptySquare = new Square(j, i, null, coordinatesOnCanvas);

        startingChessBoard[i].push(emptySquare);
      }
    }

    // Define the IDs of pieces on the backrank.
    const whiteBackRankId = [
      "wr1",
      "wn1",
      "wb1",
      "wq1",
      "wk1",
      "wb2",
      "wn2",
      "wr2",
    ];
    const blackBackRankId = [
      "br1",
      "bn1",
      "bb1",
      "bq1",
      "bk1",
      "bb2",
      "bn2",
      "br2",
    ];

    // Add pieces to squares, with attributes relative to
    // the color of each player, and the rank of the chessboard.
    for (var j = 0; j < 8; j += 7) {
      for (var i = 0; i < 8; i++) {
        if (j === 0) {
          // top
          startingChessBoard[j][this.playerIsWhite ? i : 7 - i].setPiece(
            new ChessPiece(
              backRank[i],
              false,
              this.playerIsWhite ? "black" : "white",
              this.playerIsWhite ? blackBackRankId[i] : whiteBackRankId[i]
            )
          );
          startingChessBoard[j + 1][this.playerIsWhite ? i : 7 - i].setPiece(
            new ChessPiece(
              "pawn",
              false,
              this.playerIsWhite ? "black" : "white",
              this.playerIsWhite ? "bp" + i : "wp" + i
            )
          );
        } else {
          // bottom
          startingChessBoard[j - 1][this.playerIsWhite ? i : 7 - i].setPiece(
            new ChessPiece(
              "pawn",
              false,
              this.playerIsWhite ? "white" : "black",
              this.playerIsWhite ? "wp" + i : "bp" + i
            )
          );
          startingChessBoard[j][this.playerIsWhite ? i : 7 - i].setPiece(
            new ChessPiece(
              backRank[i],
              false,
              this.playerIsWhite ? "white" : "black",
              this.playerIsWhite ? whiteBackRankId[i] : blackBackRankId[i]
            )
          );
        }
      }
    }
    return startingChessBoard;
  }
}

export default Game;
