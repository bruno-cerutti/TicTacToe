import React from 'react';
import ReactDOM from 'react-dom';
import styled, { css, injectGlobal } from 'styled-components';
import { createStore } from 'redux';

const historyApp = (state, action) => {
  if(state === undefined){
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
      const current = history[history.length-1]; 
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
          }],
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

const GameMove = ({index, text, onClickHandler}) => (
  <li>
    <a href="#" onClick = {onClickHandler}>{text}</a>
  </li>
);

class Board extends React.Component {
  renderSquare(i) {
    let sq = this.props.squares[i];
    return (
      <Square value={sq} onClick={() => store.dispatch({ type: "ADD_MOVE", squareIndex: i })}>{sq}</Square>
    );
  }

  render() {
    return (
      <div>
        <BoardRow>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </BoardRow>
        <BoardRow>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </BoardRow>
        <BoardRow>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </BoardRow>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    const history = this.props.history;
    const current = history[this.props.stepNumber];

    const moves = history.map((step, i) => {
      const desc = i ?
        'Mossa n°' + i :
        'Si comincia!';

        return (
            <GameMove text={desc} onClickHandler={() => store.dispatch({ type: "JUMP_TO_MOVE", step: i })} />
        );

    });

    let status;
    if (current.winner) {
        status = 'Winner is: ' + current.winner;
    }
    else {
        status = 'Next player: ' + (current.xRules ? 'X' : 'O');
    }

    return (
      <GameBoard>
        <Board squares = {current.squares} />
        <GameInfo>
          <GameStatus>{status}</GameStatus>
          <GameMoves>{moves}</GameMoves>
        </GameInfo>
      </GameBoard>
    );
  }
}

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

const store = createStore(historyApp);

const render = () => {ReactDOM.render(
    <Game {...store.getState()} />,
    document.getElementById('root')
  );
}

store.subscribe(render);
render();