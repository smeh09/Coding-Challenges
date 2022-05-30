const container = document.querySelector('#container');

const lerp = (a, b, c) => {
  return a + (b - a) * c;
}

const toDegrees = radians => {
  return radians * (180 / Math.PI);
};

const drawLine = (x1, y1, x2, y2, thickness, color) => {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = -toDegrees(Math.atan2(x2 - x1, y2 - y1));
  
  const lineElem = document.createElement('div');
  lineElem.style.left = `${x1}px`;
  lineElem.style.top = `${y1}px`;
  lineElem.style.width = `${distance}px`;
  lineElem.style.height = `${thickness}px`;
  lineElem.style.backgroundColor = `rgb(${color.toString()})`;
  lineElem.style.transformOrigin = `0 ${thickness/2}px`;
  lineElem.style.transform = `rotate(${angle + 90}deg)`;

  container.appendChild(lineElem);
};

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

const TILE_SIZE = 75;

let playerPos = [300 - 25/2, 600 - 75 - 75/2 - 25/2];

let movingRight = false;
let movingLeft = false;
let movingTop = false;
let movingBottom = false;

let playerVel = [0, 0];

const update = () => {
  container.innerHTML = '';

  // tilemap
  for(let y = 0; y < map.length; y++) {
    for(let x = 0; x < map[y].length; x++) {
      const tile = document.createElement('div');
      tile.style.left = `${x * TILE_SIZE}px`;
      tile.style.top = `${y * TILE_SIZE}px`;
      tile.style.width = `${TILE_SIZE}px`;
      tile.style.height = `${TILE_SIZE}px`;
      tile.style.border = '1px solid grey';
      if(map[y][x] === 1) {
        tile.style.backgroundColor = 'rgb(255, 255, 255)';
      }
      container.appendChild(tile);
    }
  }

  // player
  const player = document.createElement('div');
  player.style.width = '20px';
  player.style.height = '20px';
  player.style.borderRadius = '50%';
  player.style.backgroundColor = 'rgb(255, 255, 255)';
  player.style.left = `${playerPos[0]}px`;
  player.style.top = `${playerPos[1]}px`;
  player.style.border = '2px solid black';
  container.appendChild(player);

  document.addEventListener('keydown', e => {
    if(e.code == 'KeyD') {
      movingRight = true;
    } if(e.code == 'KeyA') {
      movingLeft = true;
    } if(e.code == 'KeyW') {
      movingTop = true;
    } if(e.code == 'KeyS') {
      movingBottom = true;
    }
  });
  document.addEventListener('keyup', e => {
    if(e.code == 'KeyD') {
      movingRight = false;
    } if(e.code == 'KeyA') {
      movingLeft = false;
    } if(e.code == 'KeyW') {
      movingTop = false;
    } if(e.code == 'KeyS') {
      movingBottom = false;
    }
  });
  if(movingRight) {
    playerVel[0] = lerp(playerVel[0], playerVel[0] + 2, 0.17);
  } if(movingLeft) {
    playerVel[0] = lerp(playerVel[0], playerVel[0] - 2, 0.17);
  } if(movingTop) {
    playerVel[1] = lerp(playerVel[1], playerVel[1] - 2, 0.17);
  } if(movingBottom) {
    playerVel[1] = lerp(playerVel[1], playerVel[1] + 2, 0.17);
  }
  playerPos[0] += playerVel[0];
  playerPos[1] += playerVel[1];
  playerVel[0] = lerp(playerVel[0], 0, 0.17);
  playerVel[1] = lerp(playerVel[1], 0, 0.17);

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);