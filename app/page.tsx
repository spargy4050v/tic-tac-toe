"use client";
import { useState } from 'react';
import Image from "next/image";

type SquareProps = {
  value: string | null;
  onSquareClick: () => void;
}

function Square({value, onSquareClick}: SquareProps) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

type BoardProps = {
  xIsNext: boolean;
  squares: (string | null) [];
  onPlay: (nextSquares: (string | null)[]) => void;
}

function Board({ xIsNext, squares, onPlay}: BoardProps) {
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
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? 'X' : 'O');
  }
  
  const boardRows = [];
  for(let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for(let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      squaresInRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
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
    <>
      <div className="status">{status}</div>
      <div className="board">
        {boardRows}
      </div>
    </>
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

  const moves = history.map((squares, move) => {
    let description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    if (move === currentMove) {
      return <li key={move}>You are at move #{move}</li>
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="flex items-center gap-2 mb-2">
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
        <ol>{sortedMoves}</ol>
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
      return squares[a];
    }
  }
  return null;
}