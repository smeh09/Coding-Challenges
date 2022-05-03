const containerElem = document.querySelector('.test-container');

const lerp = (a, b, c) => {
  return a + (b - a) * c;
}

const generateWaterData = (startX, startY, width, height) => {
  const waterLen = 800 / width;
  let waterData = [];
  for (let i = 0; i < waterLen; i++) {
    waterData.push({
      'x': startX + (i * width),
      'y': startY,
      'w': width,
      'h': height,
    });
  }
  return waterData;
};

const collide = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y
  );
};

const waterData = generateWaterData(0, 500, 50, 100);

const ballData = {
  'x': 75,
  'y': -50,
  'w': 25,
  'h': 25,
};

const gravity = 0.015;
let ballVelocity = [0, 0];
let ballYAcceleration = 0;

let mx = 0;
let my = 0;

const renderBallData = ballData => {

  containerElem.addEventListener("mousedown", function (e) {
    let bounds = containerElem.getBoundingClientRect();
    ballData.x = e.clientX - bounds.left;
    ballData.y = e.clientY - bounds.top;
    ballYAcceleration = 0;
    ballVelocity[1] = 0;
  });

  ballYAcceleration += gravity;
  if (ballYAcceleration >= 0.5) {
    ballYAcceleration = 0.5;
  }
  if (ballVelocity[1] >= 20) {
    ballVelocity[1] = 20;
  }
  ballVelocity[1] += ballYAcceleration;
  ballData.y += ballVelocity[1];

  const ballElem = document.createElement('div');
  ballElem.style.left = `${ballData.x}px`;
  ballElem.style.top = `${ballData.y}px`;
  ballElem.style.width = `${ballData.w}px`;
  ballElem.style.height = `${ballData.h}px`;
  ballElem.style.background = `rgb(255, 255, 255)`;
  ballElem.style.borderRadius = '50%';

  containerElem.appendChild(ballElem);
}


let sineAmplitude = 7;
let sineSpeed = 4;
let collideMove = 0;

const renderWaterData = (waterData, sineAngle, ballData) => {

  waterData.forEach(waterRect => {
    sineAngle += 0.1;
    sineAmplitude = lerp(sineAmplitude, 7, 0.007);
    collideMove = lerp(collideMove, 0, 0.007);

    if (collide(ballData, waterRect)) {
      sineAmplitude = ballVelocity[1]*2;
      collideMove = lerp(collideMove, collideMove - ballVelocity[1], 1/(ballYAcceleration * 15));
    }

    let height = waterRect.h + Math.sin(sineAngle * sineSpeed) * sineAmplitude;
    height += collideMove - sineAmplitude/2;
    const updatedY = 600 - height;

    const waterElem = document.createElement('div');
    waterElem.style.width = `${waterRect.w}px`;
    waterElem.style.height = `${height}px`;
    waterElem.style.left = `${waterRect.x}px`;
    waterElem.style.top = `${updatedY}px`;
    waterElem.style.borderTop = '5px solid white';
    waterElem.style.background = `rgba(${[61, 255, 229, 0.5].toString()})`;

    containerElem.appendChild(waterElem);
  });
};

let sineAngle = 0;

const update = () => {
  containerElem.innerHTML = '';

  sineAngle += 0.01;

  renderBallData(ballData);
  renderWaterData(waterData, sineAngle, ballData);

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(() => {
  update();
});