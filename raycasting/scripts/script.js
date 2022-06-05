const container = document.querySelector("#container");

const TILE_SIZE = 75;

let playerX = 300;
let playerY = 487.5;
let playerA = 90;

let movingR = false;
let movingL = false;
let movingT = false;
let movingB = false;

let angleA = false;
let angleS = false;

let playerV = [0, 0];

const maxlen = 20;

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1]
];

const degrees = (radians) => {
  return radians * (180 / Math.PI);
};

const radians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const line = (x1, y1, x2, y2, thickness, color) => {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = -degrees(Math.atan2(x2 - x1, y2 - y1));
  
  const line = document.createElement('div');
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.width = `${distance}px`;
  line.style.height = `${thickness}px`;
  line.style.backgroundColor = `rgb(${color.toString()})`;
  line.style.transformOrigin = `0 ${thickness/2}px`;
  line.style.transform = `rotate(${angle + 90}deg)`;

  container.appendChild(line);

  return line;
};

const updateLine = (line, x1, y1, x2, y2, thickness, color) => {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = -degrees(Math.atan2(x2 - x1, y2 - y1));

  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.width = `${distance}px`;
  line.style.height = `${thickness}px`;
  line.style.backgroundColor = `rgb(${color.toString()})`;
  line.style.transformOrigin = `0 ${thickness/2}px`;
  line.style.transform = `rotate(${angle + 90}deg)`;

  return line;
}

const collide = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y
  );
};

const loadColliders = () => {
  let colliders = [];
  map.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === 1) {
        colliders.push([x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE]);
      }
    });
  });
  return colliders;
};

const colliders = loadColliders();

document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyD') {
    movingR = true;
  }
  if (event.code === 'KeyA') {
    movingL = true;
  }
  if (event.code === 'KeyW') {
    movingT = true;
  }
  if (event.code === 'KeyS') {
    movingB = true;
  }
  if (event.code == 'ArrowRight') {
    angleS = true;
  }
  if (event.code == 'ArrowLeft') {
    angleA = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'KeyD') {
    movingR = false;
  }
  if (event.code === 'KeyA') {
    movingL = false;
  }
  if (event.code === 'KeyW') {
    movingT = false;
  }
  if (event.code === 'KeyS') {
    movingB = false;
  }
  if (event.code == 'ArrowRight') {
    angleS = false;
  }
  if (event.code == 'ArrowLeft') {
    angleA = false;
  }
});

// create map
map.forEach((row, y) => {
  row.forEach((tile, x) => {
    if (tile === 1) {
      const tile = document.createElement('div');

      tile.style.left = `${x * TILE_SIZE}px`;
      tile.style.top = `${y * TILE_SIZE}px`;
      tile.style.width = `${TILE_SIZE}px`;
      tile.style.height = `${TILE_SIZE}px`;
      tile.style.border = '1px solid grey';
      tile.style.background = 'rgb(255, 255, 255)';

      container.appendChild(tile);
    }
  });
});

// create player
const player = document.createElement('div');

player.style.left = `${playerX - 15 / 2}px`;
player.style.top = `${playerY - 15 / 2}px`;
player.style.width = '15px';
player.style.height = '15px';
player.style.background = 'yellow';

container.appendChild(player);

// create raycast
let rayX = playerX, rayY = playerY;
let rayStopped = false;
let lastX = playerX, lastY = playerY, lastA = playerA;
let rayLine = line(playerX, playerY, rayX, rayY, 2, [0, 255, 100]);

let lastTimestamp;
const update = (timestamp) => {
  const deltatime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  let playerV = [0, 0,]

  if (angleA) {
    playerA += 200 * deltatime;
  }
  if (angleS) {
    playerA -= 200 * deltatime;
  }
  if (movingT) {
    playerV[0] = Math.cos(radians(playerA)) * 200 * deltatime;
    playerV[1] -= Math.sin(radians(playerA)) * 200 * deltatime;
  }
  if (movingB) {
    playerV[0] -= Math.cos(radians(playerA)) * 200 * deltatime;
    playerV[1] += Math.sin(radians(playerA)) * 200 * deltatime;
  }
  if (movingR) {
    playerV[0] -= Math.cos(radians(playerA + 90)) * 200 * deltatime;
    playerV[1] += Math.sin(radians(playerA + 90)) * 200 * deltatime;
  }
  if (movingL) {
    playerV[0] -= Math.cos(radians(playerA - 90)) * 200 * deltatime;
    playerV[1] += Math.sin(radians(playerA - 90)) * 200 * deltatime;
  }

  playerX += playerV[0];
  playerY += playerV[1];

  rayX = playerX;
  rayY = playerY;

  if (collide({'x': playerX, 'y': playerY, 'w': 151, 'h': 15}, {'x': 0, 'y': 0, 'w': 600, 'h': 600})) {
    let colliding = [];
    colliders.forEach((collider, index) => {
      colliding.push(collide({ 'x': rayX, 'y': rayY, 'w': 1, 'h': 1 }, { 'x': collider[0], 'y': collider[1], 'w': collider[2], 'h': collider[3] }))
    });

    let len = 0;
    while (colliding.indexOf(true) === -1 && len <= maxlen) {
      rayX += Math.cos(radians(playerA)) * 37.5;
      rayY -= Math.sin(radians(playerA)) * 37.5; 

      colliding = [];
      colliders.forEach((collider, index) => {
        colliding.push(collide({ 'x': rayX, 'y': rayY, 'w': 1, 'h': 1 }, { 'x': collider[0], 'y': collider[1], 'w': collider[2], 'h': collider[3] }))
      });

      len++;
    }

    colliders.forEach((collider, index) => {
      while (collide({ 'x': rayX, 'y': rayY, 'w': 1, 'h': 1 }, { 'x': collider[0], 'y': collider[1], 'w': collider[2], 'h': collider[3] })) {
        rayX -= Math.cos(radians(playerA)) * 0.5;
        rayY += Math.sin(radians(playerA)) * 0.5;
      }
    });
  }

  updateLine(rayLine, playerX, playerY, rayX, rayY, 2, [0, 255, 100]);

  player.style.left = `${playerX - 15 / 2}px`;
  player.style.top = `${playerY - 15 / 2}px`;

  window.requestAnimationFrame(update);
};

window.requestAnimationFrame((timestamp) => {
  lastTimestamp = timestamp;
  window.requestAnimationFrame(update);
});