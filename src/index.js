import React from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';
//import './index.css';

const Square = styled.button`
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
  clear: both;
`

class Board extends React.Component {
  renderSquare(i) {
    let sq = this.props.squares[i];
    return (
      <Square value={sq} onClick={() => this.props.onClick(i)}>{sq}</Square>
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
  constructor () {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        winner: null,
        xRules: true
      }],
      stepNumber: 0
    }
  }

  handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length-1]; 
      if (current.winner || current.squares[i])
      return; 
      const squares = current.squares.slice();
      squares[i] = current.xRules ? 'X' : 'O';
      const winner = calculateWinner(squares);
      this.setState ({history: history.concat([{
        squares: squares,
        winner: winner,
        xRules: !current.xRules}]), 
        stepNumber: history.length});
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, i) => {
      const desc = i ?
        'Mossa n°' + i :
        'Si comincia!';

        return (
            <li key={i}>
              <a href="#" onClick = {() => this.jumpTo(i)}>{desc}</a>
            </li>
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
      <div className="game">
        <div className="game-board">
          <Board squares ={current.squares}
                 onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
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

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
