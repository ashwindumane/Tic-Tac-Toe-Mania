document.addEventListener('DOMContentLoaded', () => {
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let scores = { player1: 0, player2: 0, draws: 0 };
    let gameMode = 'pvp';
    let difficulty = 'medium';
    let player1Name = 'Player 1';
    let player2Name = 'Player 2';
    let player1Color = '#ff6b6b';
    let player2Color = '#4ecdc4';
    
    const boardElement = document.getElementById('board');
    const currentPlayerDisplay = document.getElementById('current-player-display');
    const score1Element = document.getElementById('score1');
    const score2Element = document.getElementById('score2');
    const drawsElement = document.getElementById('draws');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const color1Input = document.getElementById('color1');
    const color2Input = document.getElementById('color2');
    const pvpBtn = document.getElementById('pvp-btn');
    const pvcBtn = document.getElementById('pvc-btn');
    const difficultySelect = document.getElementById('difficulty');
    const resetBtn = document.getElementById('reset-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const winModal = document.getElementById('win-modal');
    const winnerMessage = document.getElementById('winner-message');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    function initGame() {
        createBoard();
        updatePlayerDisplay();
        loadSettings();
        addEventListeners();
    }
    
    function createBoard() {
        boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            boardElement.appendChild(cell);
        }
    }
    
    function updatePlayerDisplay() {
        const playerName = currentPlayer === 'X' ? player1Name : player2Name;
        currentPlayerDisplay.textContent = `${playerName}'s turn`;
        document.documentElement.style.setProperty('--player1-color', player1Color);
        document.documentElement.style.setProperty('--player2-color', player2Color);
        
        score1Element.querySelector('.player-name').textContent = player1Name;
        score1Element.querySelector('.score-value').textContent = scores.player1;
        score1Element.style.borderTop = `3px solid ${player1Color}`;
        
        score2Element.querySelector('.player-name').textContent = player2Name;
        score2Element.querySelector('.score-value').textContent = scores.player2;
        score2Element.style.borderTop = `3px solid ${player2Color}`;
        
        drawsElement.querySelector('.score-value').textContent = scores.draws;
    }
    
    function loadSettings() {
        player1Name = player1Input.value || 'Player 1';
        player2Name = player2Input.value || 'Player 2';
        player1Color = color1Input.value;
        player2Color = color2Input.value;
        
        if (gameMode === 'pvc') {
            difficultySelect.disabled = false;
            difficulty = difficultySelect.value;
        } else {
            difficultySelect.disabled = true;
        }
        
        updatePlayerDisplay();
    }
    
    function addEventListeners() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
        
        player1Input.addEventListener('change', () => {
            player1Name = player1Input.value || 'Player 1';
            updatePlayerDisplay();
        });
        
        player2Input.addEventListener('change', () => {
            player2Name = player2Input.value || 'Player 2';
            updatePlayerDisplay();
        });
        
        color1Input.addEventListener('input', () => {
            player1Color = color1Input.value;
            updatePlayerDisplay();
        });
        
        color2Input.addEventListener('input', () => {
            player2Color = color2Input.value;
            updatePlayerDisplay();
        });
        
        pvpBtn.addEventListener('click', () => {
            gameMode = 'pvp';
            pvpBtn.classList.add('active');
            pvcBtn.classList.remove('active');
            difficultySelect.disabled = true;
            resetGame();
        });
        
        pvcBtn.addEventListener('click', () => {
            gameMode = 'pvc';
            pvcBtn.classList.add('active');
            pvpBtn.classList.remove('active');
            difficultySelect.disabled = false;
            resetGame();
        });
        
        difficultySelect.addEventListener('change', () => {
            difficulty = difficultySelect.value;
        });
        
        resetBtn.addEventListener('click', resetGame);
        newGameBtn.addEventListener('click', newGame);
        
        playAgainBtn.addEventListener('click', () => {
            winModal.style.display = 'none';
            resetGame();
        });
    }
    
    function handleCellClick(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        
        if (board[index] !== '' || !gameActive) return;
        
        makeMove(index, currentPlayer);
        
        const winningCombination = checkWin();
        if (winningCombination) {
            handleWin(winningCombination);
            return;
        }
        
        if (checkDraw()) {
            handleDraw();
            return;
        }
        
        switchPlayer();
        
        if (gameMode === 'pvc' && currentPlayer === 'O') {
            setTimeout(makeComputerMove, 500);
        }
    }
    
    function makeMove(index, player) {
        board[index] = player;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
    }
    
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updatePlayerDisplay();
    }
    
    function checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return pattern;
            }
        }
        
        return null;
    }
    
    function checkDraw() {
        return !board.includes('') && !checkWin();
    }
    
    function handleWin(winningCombination) {
        gameActive = false;
        
        winningCombination.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.classList.add('win');
        });
        
        if (currentPlayer === 'X') {
            scores.player1++;
        } else {
            scores.player2++;
        }
        updatePlayerDisplay();
        
        const winnerName = currentPlayer === 'X' ? player1Name : player2Name;
        winnerMessage.textContent = `${winnerName} wins!`;
        winModal.style.display = 'flex';
    }
    
    function handleDraw() {
        gameActive = false;
        scores.draws++;
        updatePlayerDisplay();
        
        winnerMessage.textContent = "It's a draw!";
        winModal.style.display = 'flex';
    }
    
    function makeComputerMove() {
        if (!gameActive) return;
        
        let index;
        
        switch (difficulty) {
            case 'easy':
                index = getRandomMove();
                break;
            case 'medium':
                index = Math.random() < 0.5 ? getSmartMove() : getRandomMove();
                break;
            case 'hard':
                index = getSmartMove();
                break;
            default:
                index = getRandomMove();
        }
        
        makeMove(index, 'O');
        
        const winningCombination = checkWin();
        if (winningCombination) {
            handleWin(winningCombination);
            return;
        }
        
        if (checkDraw()) {
            handleDraw();
            return;
        }
        
        switchPlayer();
    }
    
    function getRandomMove() {
        const availableMoves = [];
        board.forEach((cell, index) => {
            if (cell === '') availableMoves.push(index);
        });
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    function getSmartMove() {
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                if (checkWin()) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }
        
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                if (checkWin()) {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }
        
        if (board[4] === '') return 4;
        
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(index => board[index] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        return getRandomMove();
    }
    
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        updatePlayerDisplay();
    }
    
    function newGame() {
        scores = { player1: 0, player2: 0, draws: 0 };
        resetGame();
        updatePlayerDisplay();
    }
    
    initGame();
});