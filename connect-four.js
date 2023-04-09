class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor(height = 6, width = 7) {
    this.height = height;
    this.width = width;
    this.player1 = new Player("");
    this.player2 = new Player(""); 
    this.currPlayer = this.player1;
    this.board = [];
    this.gameActive = false;
    this.player1ColorInput = document.getElementById('player1-color');
    this.player2ColorInput = document.getElementById('player2-color');
    this.startButton = document.getElementById('start-game');

    this.makeBoard();
    this.makeHtmlBoard();
    this.boundRestartGame = this.restartGame.bind(this);
    this.startButton.addEventListener('click', this.startGame.bind(this));
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');

    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    setTimeout(() => {
      alert(msg);
      this.gameActive = false;
      this.startButton.textContent = "Restart Game";
    }, 250);
  }

  handleClick(evt) {
    if (!this.gameActive) return;

    const x = +evt.target.id;
  
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    if (this.checkForWin()) {
      const playerColor = this.currPlayer.color;
      return this.endGame(`Player ${this.currPlayer === this.player1 ? 1 : 2} (${playerColor}) won!`);
    }
    
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    this.switchPlayersAndUpdateInput();
  }

  checkForWin() {
    const _win = cells => cells.every(
        ([y, x]) => y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
      );
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  resetGame() {
    this.gameActive = true;
    this.board = [];
    this.makeBoard();
  
    const boardElem = document.getElementById('board');
    while (boardElem.firstChild) {
      boardElem.removeChild(boardElem.firstChild);
    }
  
    this.makeHtmlBoard();
  
    this.player1ColorInput.disabled = false;
    this.player2ColorInput.disabled = false;
  }

  restartGame() {
    this.resetGame();
    this.startButton.textContent = 'Start Game';
    this.startButton.removeEventListener('click', this.boundRestartGame);
    this.startButton.addEventListener('click', this.startGame.bind(this));
  
    this.gameActive = false;
  
    this.player1ColorInput.value = '';
    this.player2ColorInput.value = '';

    [this.player1ColorInput, this.player2ColorInput].forEach(input => {
      input.classList.remove('active-input');
      input.style.borderColor = '';
      input.style.boxShadow = '';
    });
    
    this.currPlayer = this.player1;
  }

  setPlayerColors() {
    const player1Color = this.player1ColorInput.value;
    const player2Color = this.player2ColorInput.value;
  
    if (!player1Color || !player2Color) {
      return false;
    }

    this.player1.color = player1Color; 
    this.player2.color = player2Color;
    return true;
  }

  startGame() {
    if (this.setPlayerColors()) {
      this.resetGame();
      this.startButton.removeEventListener('click', this.startGame.bind(this));
      this.startButton.addEventListener('click', this.boundRestartGame);

      this.player1ColorInput.disabled = true;
      this.player2ColorInput.disabled = true;

      this.updateInputIndicator();
    } else {
      alert('Please set player colors before starting game.');
    }
  }

  switchPlayersAndUpdateInput() {
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
    this.updateInputIndicator();
  }

  updateInputIndicator() {
    const currentPlayerInput = this.currPlayer === this.player1 ? this.player1ColorInput : this.player2ColorInput;
    const otherPlayerInput = this.currPlayer === this.player1 ? this.player2ColorInput : this.player1ColorInput;

    currentPlayerInput.classList.add('active-input');
    currentPlayerInput.style.borderColor = this.currPlayer.color;
    currentPlayerInput.style.boxShadow = `0 0 8px ${this.currPlayer.color}`;

    otherPlayerInput.classList.remove('active-input');
    otherPlayerInput.style.borderColor = '';
    otherPlayerInput.style.boxShadow = '';
  }
}

new Game(6, 7);








