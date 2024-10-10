document.addEventListener('DOMContentLoaded', () => {
    const snakeCanvas = document.getElementById('snakeCanvas');
    const ctx = snakeCanvas.getContext('2d');
    const startSnakeButton = document.getElementById('startSnakeButton');
    const snakeScore = document.getElementById('snakeScore');

    let snake, food, dx, dy, score, gameLoop;
    const gridSize = 20;
    const tileCount = 20;

    function setupSnakeGame() {
        snake = [{ x: 10, y: 10 }];
        food = { x: 15, y: 15 };
        dx = 0;
        dy = 0;
        score = 0;
        updateSnakeScore();
        startSnakeButton.textContent = 'Start Game';
        startSnakeButton.disabled = false;
    }

    function startSnakeGame() {
        if (gameLoop) {
            clearTimeout(gameLoop);
        }
        setupSnakeGame();
        snakeGameLoop();
        startSnakeButton.textContent = 'Restart Game';
    }

    function snakeGameLoop() {
        gameLoop = setTimeout(() => {
            clearCanvas();
            moveSnake();
            drawFood();
            drawSnake();

            if (checkCollision()) {
                alert(`Game Over! Your score: ${score}`);
                setupSnakeGame();
                return;
            }

            snakeGameLoop();
        }, 100);
    }

    function clearCanvas() {
        ctx.fillStyle = '#2c2c2c';
        ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            updateSnakeScore();
            generateFood();
        } else {
            snake.pop();
        }
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function drawSnake() {
        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    }

    function checkCollision() {
        const head = snake[0];
        return (
            head.x < 0 || head.x >= tileCount ||
            head.y < 0 || head.y >= tileCount ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    function updateSnakeScore() {
        snakeScore.textContent = `Score: ${score}`;
    }

    function changeDirection(e) {
        // Prevent default scrolling behavior
        e.preventDefault();

        const key = e.key;
        if (key === 'ArrowUp' && dy === 0) {
            dx = 0;
            dy = -1;
        } else if (key === 'ArrowDown' && dy === 0) {
            dx = 0;
            dy = 1;
        } else if (key === 'ArrowLeft' && dx === 0) {
            dx = -1;
            dy = 0;
        } else if (key === 'ArrowRight' && dx === 0) {
            dx = 1;
            dy = 0;
        }
    }

    // Use keydown event instead of the generic 'keydown' listener
    document.addEventListener('keydown', changeDirection);
    startSnakeButton.addEventListener('click', startSnakeGame);

    // Initialize game
    setupSnakeGame();
});
