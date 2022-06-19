
let turn, s, bait, size;
function setup() {
  createCanvas(400, 400);
  stroke(255);
  fill(255);
  turn = 0;
  size = 10;
  s = new Snake();
  bait = new Bait();
}


function draw() {
  clear();
  background(0);
  frameRate(10);
  translate(width/2, height/2);
  s.renderSnake();
  s.move();
  bait.renderBait();
  if(bait.pos[0] == s.pos[0] && bait.pos[1] == s.pos[1]){
    bait.eaten();
    s.full = 1;
  }
} 
function keyPressed(){
  if(keyCode == RIGHT_ARROW && turn != 2) turn = 0;
  if(keyCode == LEFT_ARROW && turn != 0) turn = 2;
  if(keyCode == DOWN_ARROW && turn != 1) turn = 3;
  if(keyCode == UP_ARROW && turn != 3) turn = 1;
}

class Bait{
  constructor(){
    this.pos = [Math.floor(random(-width/2, width/2) / size), Math.floor(random(-height/2, height/2) / size)];
  }
  renderBait(){
    fill('red');
    stroke('red');
    rect(this.pos[0] * size, this.pos[1] * size, size, size);
    fill('white');
    stroke('white');
  }
  eaten(){
    this.pos = [Math.floor(random(-width/2, width/2) / size), Math.floor(random(-height/2, height/2) / size)];
  }
}


class Snake{
  constructor(){
    this.size = 1;
    this.color = 255;
    this.blocks = [[0, 0]];
    this.pos = this.blocks[0];
    this.full = 0;
  }
  renderSnake(){
    for(let i = 0; i < this.size; ++i){
      if(i==0) fill('green'), stroke('green');
      this.blocks[i][0] = ((this.blocks[i][0] + height/size/2 + height/size) % (height/10)) - height/size/2;
      this.blocks[i][1] = ((this.blocks[i][1] + height/size/2 + height/size) % (height/10)) - height/size/2;
      rect(this.blocks[i][0] * size, this.blocks[i][1] * size, size, size);
      if(i==0) fill('white'), stroke('white');
    }
  }
  move(){
    let newx = this.blocks[0][0], newy = this.blocks[0][1];
    if(turn == 0) //right
      newx += 1;
    else if(turn == 1) //up
      newy -= 1;
    else if(turn == 2) //left
      newx -= 1;
    else   //down
      newy += 1;
    this.blocks.unshift([newx, newy]);
    if(s.full != 1) this.blocks.pop();
    else s.full = 0, this.size += 1;
    this.pos = this.blocks[0];

    for(let i = 1; i < this.size; ++i){
      if(newx == this.blocks[i][0] && newy == this.blocks[i][1]){
        this.blocks = [[0, 0]];
        this.size = 1;
        break;
      }
    }
  }

};