const container = document.querySelector('.test-container');

const WIDTH = 800;
const HEIGHT = 600;

const toDegrees = radians => {
  return radians * (180 / Math.PI);
};

const drawLine = (x1, y1, x2, y2, thickness, color) => {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = -toDegrees(Math.atan2(x2 - x1, y2 - y1));
  
  const lineElem = document.createElement('div')
  /* here's the stuff i think is wrong */
  lineElem.style.left = `${x1}px`;
  lineElem.style.top = `${y1}px`;
  lineElem.style.width = `${distance}px`;
  lineElem.style.height = `${thickness}px`;
  lineElem.style.backgroundColor = `rgb(${color.toString()})`;
  lineElem.style.transformOrigin = 'top left';
  lineElem.style.transform = `rotate(${angle + 90}deg)`;

  container.appendChild(lineElem);
};

const origin = [WIDTH / 2, (HEIGHT / 2) - 100];

let pendulumAngle = 0;
let armLen = 100;

let pendulumVelocity = 0;
let pendulumAcceleration = 0;

const gravity = -0.01;

const drawPendulum = () => {
  // find the pendulum position based on angle and arm length
  const posX = origin[0] + (Math.sin(pendulumAngle) * armLen);
  const posY = origin[1] + (Math.cos(pendulumAngle) * armLen);
  // the trig functions are inverted because angle theta is on top

  pendulumAngle += 0.1;
  pendulumAcceleration = Math.sin(pendulumAngle) * gravity;

  pendulumAngle += pendulumVelocity;
  pendulumVelocity += pendulumAcceleration;

  pendulumVelocity *= 0.99;

  // render arm line
  drawLine(origin[0], origin[1], posX + 25/2, posY + 25/2, 5, [155, 155, 155]);

  const pendulumBob = document.createElement('div');
  pendulumBob.style.left = `${posX}px`;
  pendulumBob.style.top = `${posY}px`;
  pendulumBob.style.background = 'white'
  pendulumBob.style.width = '25px';
  pendulumBob.style.height = '25px';
  pendulumBob.style.borderRadius = '50%';

  container.appendChild(pendulumBob);
};

const update = () => {
  container.innerHTML = '';

  drawPendulum();

  window.requestAnimationFrame(update);
};

window.requestAnimationFrame(update);