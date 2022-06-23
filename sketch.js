
let turn, s, bait, as, size;
function setup() {
    createCanvas(400, 400);
    stroke(255);
    fill(255);
    background(0); 
    turn = 0;
    size = 10;
    s = new Snake();
    bait = new Bait();
    as = new AutonomSnake(bait.pos[0] + height/size/2, bait.pos[1] + height/size/2);
    as.findPath(s.blocks);
}


function draw() {
    clear(); background(0); frameRate(10); translate(width/2, height/2);
    
    s.renderSnake();
    bait.renderBait();
    
    as.autonomousMove(s.pos[0] +  height/size/2, s.pos[1] +  height/size/2);
    s.move();

    if(bait.pos[0] == s.pos[0] && bait.pos[1] == s.pos[1]){
        s.renderSnake();
        bait.renderBait();
        bait.eaten();
        s.full = 1;
        as.targetX = bait.pos[0] + height/size/2;
        as.targetY = bait.pos[1] + height/size/2;
        as.findPath(s.blocks);
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
        rect(this.pos[1] * size, this.pos[0] * size, size, size);
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
            this.blocks[i][0] = ((this.blocks[i][0] + height/size/2 + height/size) % (height/10)) - height/size/2;
            this.blocks[i][1] = ((this.blocks[i][1] + height/size/2 + height/size) % (height/10)) - height/size/2;
            rect(this.blocks[i][1] * size, this.blocks[i][0] * size, size, size);
        }
    }
    move(){
        let newx = this.blocks[0][0], newy = this.blocks[0][1];
        if(turn == 0) //right
            newy += 1;
        else if(turn == 1) //up
            newx -= 1;
        else if(turn == 2) //left
            newy -= 1;
        else   //down
          newx += 1;
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

class AutonomSnake{
    constructor(x, y){
        this.targetX = x;
        this.targetY = y;
        this.parent = [];
        this.field = [];
        for(let i = 0; i < height/size; i++){
            this.parent.push([]);
            this.field.push([]);
            for(let j = 0; j < height/size; j++){
                this.parent[i].push([-1, -1]);
                this.field[i].push(0);
            }
        }
    }
    f(num){
        return (num+40)%40;
    }
    findPath(snake_blocks){
        this.parent = [];
        this.field = [];
        for(let i = 0; i < height/size; i++){
            this.parent.push([]);
            this.field.push([]);
            for(let j = 0; j < height/size; j++){
                this.parent[i].push([-1, -1]);
                this.field[i].push(0);
            }
        }

        for(let i = 0; i < snake_blocks.length; ++i) this.field[snake_blocks[i][0] + height/size/2][snake_blocks[i][1] + height/size/2] = 1;

        let q = [[this.targetX, this.targetY]];
        let arr = [[1, 0], [0, 1], [-1, 0], [0, -1]];

        this.field[this.targetX][this.targetY] = 1;
        this.parent[this.targetX][this.targetY] = [this.targetX, this.targetY];
        
        while(q.length > 0){
            let pos = q.shift();
            for(let i = 0; i < 4; ++i){
                let a = this.f(pos[0] + arr[i][0]);
                let b = this.f(pos[1] + arr[i][1]);
                if(this.field[a][b] == 0){
                    this.field[a][b] = 1;
                    this.parent[a][b] = pos;
                    q.push([a, b]);
                }
            }
        }
    }
    autonomousMove(x, y){
        if(this.parent[x][y][0] < x && turn != 3){
            turn = 1;
        }else if(this.parent[x][y][0] > x && turn != 1){
            turn = 3;
        }else if(this.parent[x][y][1] < y && turn != 0){
            turn  = 2;
        }else if(this.parent[x][y][1] > y && turn != 2){
            turn = 0;
        }else{
            console.log("Can't move for now....");
        }
    }

};