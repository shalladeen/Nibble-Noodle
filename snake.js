var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var count = 0;
var scoreElement = document.getElementById('score'); 
var score = 0;
var gameOver = false;

var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

var apple = {
  x: 320,
  y: 320
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function resetGame() {
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;
  score = 0;
  gameOver = false;
  updateScore();
}

function updateScore() {
  scoreElement.textContent = 'Score: ' + score;
}

function showStartMenu(){
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  var title = 'Nibble Noodle';
  context.fillStyle = 'white';
  context.font = '20px "Press Start 2P"';
  context.textAlign = 'center';
  context.fillText(title, canvas.width / 2, canvas.height / 2 - 30);

  var fontSize = 13 + Math.sin(pulseTime) * 0.10;
  context.font = `${fontSize}px "Press Start 2P"`;
  var startText = 'Press Spacebar to Start';
  context.fillText(startText, canvas.width / 2, canvas.height / 2 + 20);

  pulseTime += 0.1;
}

function loop() {
  requestAnimationFrame(loop);
  context.imageSmoothingEnabled = false;

  if (gameOver) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'red';
    context.font = '20px "Press Start 2P"';
    var gameOverText = 'GAME OVER';
    var gameOverTextWidth = context.measureText(gameOverText).width;
    context.fillText(gameOverText, (canvas.width - gameOverTextWidth) / 2, canvas.height / 2 - 20);

    var fontSize = 13 + Math.sin(pulseTime) * 0.10; 
    context.fillStyle = 'white';
    context.font = `${fontSize}px "Press Start 2P"`;
    var restartText = 'Press Spacebar to Restart';
    var restartTextWidth = context.measureText(restartText).width;
    context.fillText(restartText, (canvas.width - restartTextWidth) / 2, canvas.height / 2 + 20);

    pulseTime += 0.1;
    return;
  }

  pulseTime = 0;

  if (++count < 10) {
    return;
  }
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({x: snake.x, y: snake.y});

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid-1, grid-1);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
      updateScore();
    }

    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        gameOver = true;
      }
    }
  });
}

document.addEventListener('keydown', function(e) {
  if (gameOver && e.which === 32) {
    resetGame();
  }
  if (!gameOver) {
    if (e.which === 37 && snake.dx === 0) {
      snake.dx = -grid;
      snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
      snake.dy = -grid;
      snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
      snake.dx = grid;
      snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
      snake.dy = grid;
      snake.dx = 0;
    }
  }
});

requestAnimationFrame(loop);
