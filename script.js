// Elementos del DOM
const cat = document.getElementById('cat');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

// Variables para el puntaje y tiempo
let score = 0;
let lastTime = null;

// Posiciones iniciales en porcentaje
let p1 = { x: 20, y: 50 };
let p2 = { x: 80, y: 50 };

// Velocidad de movimiento
const speed = 1;

// Variable que indica si el gato está mirando (Luz Roja)
let isCatWatching = false;

// Variables para la animación y timeout del gato
let animationFrame;
let catTimeout;

// Objeto para rastrear las teclas presionadas
const keys = {};

// Registrar eventos de teclado
document.addEventListener('keydown', (e) => {
  // Si el gato está mirando y se presiona alguna tecla de movimiento, se pierde el juego.
  if (
    isCatWatching &&
    ['w','W','a','A','s','S','d','D','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)
  ) {
    endGame("¡Perdiste! Rex te vio.");
  }
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Actualiza las posiciones de los jugadores solo cuando el gato no está mirando.
function updatePositions() {
  if (isCatWatching) return; // No se permite movimiento si el gato está viendo

  // Jugador 1 (W, A, S, D)
  if (keys['w'] || keys['W']) { p1.y -= speed; }
  if (keys['s'] || keys['S']) { p1.y += speed; }
  if (keys['a'] || keys['A']) { p1.x -= speed; }
  if (keys['d'] || keys['D']) { p1.x += speed; }
  
  // Jugador 2 (Flechas)
  if (keys['ArrowUp']) { p2.y -= speed; }
  if (keys['ArrowDown']) { p2.y += speed; }
  if (keys['ArrowLeft']) { p2.x -= speed; }
  if (keys['ArrowRight']) { p2.x += speed; }

  // Limitar las posiciones (0% a 100%)
  p1.x = Math.max(0, Math.min(100, p1.x));
  p1.y = Math.max(0, Math.min(100, p1.y));
  p2.x = Math.max(0, Math.min(100, p2.x));
  p2.y = Math.max(0, Math.min(100, p2.y));

  // Actualizar posiciones en pantalla
  player1.style.left = p1.x + '%';
  player1.style.top = p1.y + '%';
  player2.style.left = p2.x + '%';
  player2.style.top = p2.y + '%';
}

// Verificar si los dos jugadores están "juntos"
function checkTogether() {
  const rect1 = player1.getBoundingClientRect();
  const rect2 = player2.getBoundingClientRect();

  const dx = (rect1.x + rect1.width / 2) - (rect2.x + rect2.width / 2);
  const dy = (rect1.y + rect1.height / 2) - (rect2.y + rect2.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < 80;
}

// Función para terminar el juego
function endGame(msg) {
  messageDisplay.textContent = msg;
  cancelAnimationFrame(animationFrame);
  clearTimeout(catTimeout);
  // Limpiar teclas para evitar movimientos posteriores
  for (let key in keys) {
    keys[key] = false;
  }
}

// Función para alternar el estado del gato (Luz Verde / Luz Roja)
function toggleCat() {
  isCatWatching = !isCatWatching;
  cat.src = isCatWatching ? 'gato_mirando.jpg' : 'gato_espalda.png';
}

// Función para programar el cambio de estado del gato en intervalos aleatorios
function scheduleCatToggle() {
  const delay = Math.random() * 2000 + 2000; // Entre 2 y 4 segundos
  catTimeout = setTimeout(() => {
    toggleCat();
    scheduleCatToggle();
  }, delay);
}
scheduleCatToggle();

// Bucle principal del juego usando requestAnimationFrame
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  updatePositions();

  if (checkTogether()) {
    score += delta / 1000;
  }
  scoreDisplay.textContent = 'Tiempo juntos: ' + score.toFixed(2) + ' s';

  animationFrame = requestAnimationFrame(gameLoop);
}
animationFrame = requestAnimationFrame(gameLoop);

// Función para reiniciar el juego
function resetGame() {
  // Reiniciar variables de posición y puntaje
  score = 0;
  lastTime = null;
  p1 = { x: 20, y: 50 };
  p2 = { x: 80, y: 50 };
  isCatWatching = false;
  cat.src = 'gato_espalda.png';
  messageDisplay.textContent = '';
  
  // Cancelar animación y timeout previos
  cancelAnimationFrame(animationFrame);
  clearTimeout(catTimeout);
  
  // Reiniciar teclas
  for (let key in keys) {
    keys[key] = false;
  }
  
  // Actualizar posiciones a valores iniciales
  player1.style.left = p1.x + '%';
  player1.style.top = p1.y + '%';
  player2.style.left = p2.x + '%';
  player2.style.top = p2.y + '%';
  scoreDisplay.textContent = 'Tiempo juntos: 0 s';
  
  // Reiniciar ciclo de juego y el cambio del gato
  lastTime = null;
  animationFrame = requestAnimationFrame(gameLoop);
  scheduleCatToggle();
}

// Asignar evento al botón de reinicio
restartBtn.addEventListener('click', resetGame);
