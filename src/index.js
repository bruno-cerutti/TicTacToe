import React from 'react';
import ReactDOM from 'react-dom';
import styled, { css, injectGlobal } from 'styled-components';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

const historyApp = (state, action) => {
    if (state === undefined) {
        state = {
            history: [{
                squares: Array(9).fill(null),
                winner: null,
                xRules: true
            }],
            stepNumber: 0
        };
    }

    switch (action.type) {
        case 'ADD_MOVE':
            const history = state.history.slice(0, state.stepNumber + 1);
            const current = history[history.length - 1];
            if (current.winner || current.squares[action.squareIndex])
                return state;

            const squares = current.squares.slice();
            squares[action.squareIndex] = current.xRules ? 'X' : 'O';

            return {
                history: [
                    ...history,
                    {
                        squares: squares,
                        winner: calculateWinner(squares),
                        xRules: !current.xRules
                    }
                ],
                stepNumber: state.stepNumber + 1
            };
        case 'JUMP_TO_MOVE':
            return {
                ...state,
                stepNumber: action.step
            }
        default:
            return state
    }
};

const addMove = (squareIndex) => {
    return { type: "ADD_MOVE", squareIndex }
};
const jumpToMove = (step) => {
    return { type: "JUMP_TO_MOVE", step };
};

injectGlobal `
  body {
    font: 14px "Century Gothic", Futura, sans-serif;
    margin: 20px;
  }
`;

const Square = styled.button `
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;

  &:hover {
    outline: none;
  }

  &:focus {
    opacity:0.5;
  }

  ${props => props.value === 'X' && css`
		background: palevioletred;
		color: white;
	`}
  ${props => props.value === 'O' && css`
		background: blue;
		color: white;
	`}
`

const BoardRow = styled.div`
  &:after{
  clear: both;
  content: "";
  display: table;
  }
`

const GameInfo = styled.div`
  margin-left: 20px;
`

const GameMoves = styled.ol`
  padding-left: 30px;
`

const GameStatus = styled.div`
  margin-bottom: 10px;
`

const GameBoard = styled.div`
  display: flex;
  flex-direction: row;
`

const GameMove = ({text, onClickHandler}) => (
  <li>
    <a href="#" onClick = {onClickHandler}>{text}</a>
  </li>
);


const mapStateToBoardProps = (state) => {
  return {...state};
};
const mapDispatchToBoardProps = (dispatch) => {
  return {
    onSquareClick: (i) => dispatch(addMove(i))
  }
};
let Board = ({history, stepNumber, onSquareClick}) => {
  const current = history[stepNumber];

    return (
      <div>
        <BoardRow>
          <Square value={current.squares[0]} onClick={() => onSquareClick(0)}>{current.squares[0]}</Square>
          <Square value={current.squares[1]} onClick={() => onSquareClick(1)}>{current.squares[1]}</Square>
          <Square value={current.squares[2]} onClick={() => onSquareClick(2)}>{current.squares[2]}</Square>
        </BoardRow>
        <BoardRow>
          <Square value={current.squares[3]} onClick={() => onSquareClick(3)}>{current.squares[3]}</Square>
          <Square value={current.squares[4]} onClick={() => onSquareClick(4)}>{current.squares[4]}</Square>
          <Square value={current.squares[5]} onClick={() => onSquareClick(5)}>{current.squares[5]}</Square>
        </BoardRow>
        <BoardRow>
          <Square value={current.squares[6]} onClick={() => onSquareClick(6)}>{current.squares[6]}</Square>
          <Square value={current.squares[7]} onClick={() => onSquareClick(7)}>{current.squares[7]}</Square>
          <Square value={current.squares[8]} onClick={() => onSquareClick(8)}>{current.squares[8]}</Square>
        </BoardRow>
      </div>
    );
}
Board = connect(mapStateToBoardProps, mapDispatchToBoardProps)(Board);

const mapStateToGameProps = (state) => {
  return {...state};
};
const mapDispatchToGameProps = (dispatch) => {
  return {
    onGameMoveClick: (i) => dispatch(jumpToMove(i))
  }
};
let Game = ({history, stepNumber, onGameMoveClick}) => {
  const moves = history.map((step, i) => {
    const desc = i ?
      'Mossa n°' + i :
      'Si comincia!';

      return (
          <GameMove key={i}  text={desc} onClickHandler={() => onGameMoveClick(i)} />
      );
  });

  const current = history[stepNumber];
  let status;
  if (current.winner) {
      status = 'Winner is: ' + current.winner;
  }
  else {
      status = 'Next player: ' + (current.xRules ? 'X' : 'O');
  }

  return (
    <GameBoard>
      <Board />
      <GameInfo>
        <GameStatus>{status}</GameStatus>
        <GameMoves>{moves}</GameMoves>
      </GameInfo>
    </GameBoard>
  );
}
Game = connect(mapStateToGameProps, mapDispatchToGameProps)(Game);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        return squares[a];

  }
  return null;
}

// ========================================

ReactDOM.render(
  <Provider store={createStore(historyApp)}>
    <Game />
  </Provider>,
  document.getElementById('root')
);