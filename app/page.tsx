"use client";
import { useState } from 'react';
import Image from "next/image";

type SquareProps = {
  value: string | null;
  onSquareClick: () => void;
  isWinningSquare: boolean;
  disabled?: boolean;
}

function Square({value, onSquareClick, isWinningSquare, disabled}: SquareProps) {
  return (
    <button
      className={`square ${isWinningSquare ? 'winning-square' : ''}`}
      onClick={onSquareClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

type BoardProps = {
  xIsNext: boolean;
  squares: (string | null) [];
  onPlay: (nextSquares: (string | null)[]) => void;
  onReset?: () => void;
}

function Board({ xIsNext, squares, onPlay, onReset}: BoardProps) {
  function handleClick(i: number) {
    if(squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }
  
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + (xIsNext ? 'O' : 'X');
  } else if (squares.every(square => square !== null)) {
    status = (
      <div className="flex items-center gap-x-2">
        <span>It's a draw!</span>
        <button className="modern-btn" type="button" onClick={onReset}>
          Reset Game
        </button>
      </div>
    );
  } else {
    status = "Next player: " + (xIsNext ? 'X' : 'O');
  }
  
  const boardRows = [];
  for(let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for(let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      let isWinningSquare = false;
      if(winner) {
        for (let i = 0; i < winner.length; i++) {
          if (winner[i] === index)
            isWinningSquare = true;
        }
      }
      squaresInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinningSquare={isWinningSquare}
          disabled={!!winner || squares[index] !== null}
        />
      );
    }
    boardRows.push(
      <div className="flex flex-row" key={row}>
        {squaresInRow}
      </div>
    );
  }

  return (
    <div className="">
      <div className="status mb-4">{status}</div>
      <div className="board">{boardRows}</div>
    </div>
);
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = ([...history.slice(0, currentMove + 1), nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length -1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    if (currentMove === 0 && history.length === 1) {
      return <li key={move}>Start Game</li>
    }
    let description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    if (move === currentMove) {
      return <li key={move}>You are at {move === 0 ? 'game start' : 'move #' + move}</li>
    }
    return (
      <li key={move}>
        <button className="modern-btn" type="button"
          onClick={() => jumpTo(move)}>{description}
        </button>
      </li>
    );
  });

const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="px-4 sm:px-6 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-center text-6xl font-bold mb-16 mt-16">
        Tic Tac Toe
      </h1>
      <div className="game flex flex-col md:flex-row items-center md:items-start justify-center gap-10 w-full max-w-4xl">
        <div className="game-board sticky top-0">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} onReset={resetGame} />
        </div>
        <div className="game-info w-full md:w-auto">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span>Sort moves </span>
            <button 
              type="button"
              onClick={() => setIsAscending(!isAscending)}
              className={`relative w-12 h-6 rounded-full transition-colors 
                duration-200 ${isAscending ? 'bg-blue-500' : 'bg-gray-400'}`}
              aria-pressed={isAscending}
            >
              <span
              className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white 
                shadow transition-transform duration-200 
                ${isAscending ? 'translate-x-6' : ''}`}
              />
            </button>
            <span>{isAscending ? ' Ascending' : ' Descending'}</span>
          </div>
          <ol className="move-list-container text-center md:text-left">
            {sortedMoves}
          </ol>
        </div>
      </div>
    </div>
  )
}

function calculateWinner(squares: (string | null)[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i=0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}