const container=document.querySelector('#container');

const TILE_SIZE=75;

const lerp=(a,b,c)=>{
  return a+(b-a)*c;
}
const clamp=(x,min,max)=>{
  x<min?x=min:x=x;
  x>max?x=max:x=x;
  return x;
}
const genc=map=>{
  let c=[];
  for(let y=0;y<map.length;y++){
    for(let x=0;x<map[y].length;x++){
      map[y][x]===1?c.push([x*TILE_SIZE,y*TILE_SIZE]):{};
    }
  }
  return c;
}

const map=[
  [1,1,1,1,1,1,1,1],
  [1,0,1,0,0,1,0,1],
  [1,1,1,0,0,1,0,1],
  [1,0,0,0,0,1,0,1],
  [1,0,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1],
];
const c=genc(map);

let px=288,py=476,pr=12;
let pa=0;
let pv=[0,0];
let mt=false,mb=false,mr=false,ml=false;
const mv=400;

//draw map
for(let y=0;y<map.length;y++){
  for(let x=0;x<map[y].length;x++){
    const elem=document.createElement('div');
    elem.style.left=`${x*TILE_SIZE}px`;
    elem.style.top=`${y*TILE_SIZE}px`;
    elem.style.border='1px solid grey';
    elem.style.width=`${TILE_SIZE}px`;
    elem.style.height=`${TILE_SIZE}px`;
    if(map[y][x]===1){ elem.style.background='rgb(255,255,255)' };
    container.appendChild(elem);
  }
}
//draw player
const player=document.createElement('div');
player.style.left=`${px}px`;
player.style.top=`${py}px`;
player.style.width=`${pr*2}px`;
player.style.height=`${pr*2}px`;
player.style.border='2px solid black';
player.style.borderRadius='50%';
player.style.background='rgb(255,255,255)';
container.appendChild(player);

document.addEventListener('keydown',e=>{
  if(e.code==='KeyD'){ mr=true; }
  if(e.code=='KeyA'){ ml=true; }
  if(e.code=='KeyW'){ mt=true; }
  if(e.code=='KeyS'){ mb=true; }
});
document.addEventListener('keyup',e=>{
  if(e.code==='KeyD'){ mr=false; }
  if(e.code=='KeyA'){ ml=false; }
  if(e.code=='KeyW'){ mt=false; }
  if(e.code=='KeyS'){ mb=false; }
});

let lt;
const update=t=>{
  let dt=(t-lt)/1000;
  lt=t;

  if(mr){ pv[0]=lerp(pv[0],pv[0]+200,dt*5); }
  if(ml){ pv[0]=lerp(pv[0],pv[0]-200,dt*5); }
  if(mt){ pv[1]=lerp(pv[1],pv[1]-200,dt*5); }
  if(mb){ pv[1]=lerp(pv[1],pv[1]+200,dt*5); }
  pv[0]=lerp(pv[0],0,dt*5);
  pv[1]=lerp(pv[1],0,dt*5);
  pv[0]=clamp(pv[0],-mv,mv);
  pv[1]=clamp(pv[1],-mv,mv);
  px+=pv[0]*dt;
  for(let i=0;i<c.length;i++){
    if(px < c[i][0] + TILE_SIZE && px + pr*2 > c[i][0] && py < c[i][1] + TILE_SIZE && pr*2 + py > c[i][1]){
      if(pv[0]>0){ px=c[i][0]-pr*2; }
      if(pv[0]<0){ px=c[i][0]+TILE_SIZE; }
    }
  }
  py+=pv[1]*dt;
  for(let i=0;i<c.length;i++){
    if(px < c[i][0] + TILE_SIZE && px + pr*2 > c[i][0] && py < c[i][1] + TILE_SIZE && pr*2 + py > c[i][1]){
      if(pv[1]>0){ py=c[i][1]-pr*2; }
      if(pv[1]<0){ py=c[i][1]+TILE_SIZE; }
    }
  }
  player.style.left=`${px}px`;
  player.style.top=`${py}px`;

  window.requestAnimationFrame(update);
};

window.requestAnimationFrame(t=>{
  lt=t;
  window.requestAnimationFrame(update);
});