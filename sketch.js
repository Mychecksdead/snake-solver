
let turn, s, bait, as, size, color;
function setup() {
    createCanvas(400, 400);
    stroke(0);
    fill(255);
    background(0); 
    turn = 0;
    size = 10;
    s = new Snake();
    bait = new Bait();
    as = new AutonomSnake(bait.pos[0], bait.pos[1]);
    as.findPath(s.blocks);
}

let l = 0, r = 1, u = 2, d = 3;

function draw() {
    clear(); background(0);
    frameRate(20);
    
    as.findPath(s.blocks, s.full);

    as.autonomousMove(s.pos[0], s.pos[1]);
    s.move();    

    bait.renderBait();
    s.renderSnake();

    

    if(bait.pos[0] == s.pos[0] && bait.pos[1] == s.pos[1]){
        bait.eaten(s.blocks);
        s.full = 1;
        as.targetX = bait.pos[0];
        as.targetY = bait.pos[1];
    }
} 
function keyPressed(){
    if(keyCode == RIGHT_ARROW && turn != l) turn = r;
    if(keyCode == LEFT_ARROW && turn != r) turn = l;
    if(keyCode == DOWN_ARROW && turn != u) turn = d;
    if(keyCode == UP_ARROW && turn != d) turn = u;
}

class Bait{
    constructor(){
        this.pos = [Math.floor(random(0, width) / size), Math.floor(random(0, height) / size)];
    }
    renderBait(){
        fill('red');
        stroke('black');
        rect(this.pos[1] * size, this.pos[0] * size, size, size);
        fill('white');
        stroke('black');
    }
    eaten(snake){
        let equal = 0;
        while(!equal){
            equal = 1;
            this.pos = [Math.floor(random(0, width) / size), Math.floor(random(0, height) / size)];
            for(let i = 0; i < snake.length; ++i)
                if(snake[i][0] == this.pos[0] && snake[i][1] == this.pos[1]){
                    equal = 0;
                    break;
                }
            }
    }
}


class Snake{
    constructor(){
        this.size = 1;
        this.color = 255;
        this.blocks = [[0, 0]];
        this.pos = this.blocks[0];
        this.full = 0;
        this.lost = 0;
    }
    renderSnake(){
        for(let i = 0; i < this.size; ++i){
            rect(this.blocks[i][1] * size, this.blocks[i][0] * size, size, size);
        }
    }
    move(){
        let newx = this.blocks[0][0], newy = this.blocks[0][1];
        if(turn == r) //right
            newy += 1;
        else if(turn == u) //up
            newx -= 1;
        else if(turn == l) //left
            newy -= 1;
        else   //down
            newx += 1;
        newx = (newx + height/size) % (height/size);
        newy = (newy + width/size) % (width/size);      
 
        this.blocks.unshift([newx, newy]);
        if(s.full != 1) this.blocks.pop();
        else s.full = 0, this.size += 1;
        this.pos = this.blocks[0];

        for(let i = 1; i < this.size; ++i){
            if(newx == this.blocks[i][0] && newy == this.blocks[i][1]){
                this.blocks = [[0, 0]];
                this.size = 1;
                this.lost = 1;
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
            for(let j = 0; j < width/size; j++){
                this.parent[i].push([-1, -1]);
                this.field[i].push(0);
            }
        }
    }
    findPath(snake_blocks, is_full){
        this.parent = [];
        this.field = [];
        for(let i = 0; i < height/size; i++){
            this.parent.push([]);
            this.field.push([]);
            for(let j = 0; j < width/size; j++){
                this.parent[i].push([-1, -1]);
                this.field[i].push(0);
            }
        }

        for(let i = 1; i < snake_blocks.length; ++i) this.field[snake_blocks[i][0]][snake_blocks[i][1]] = (snake_blocks.length - i + is_full);
        
        let q = [[this.targetX, this.targetY]];
        let arr = [[1, 0], [0, 1], [-1, 0], [0, -1]];

        this.field[this.targetX][this.targetY] = height*width+2;
        this.parent[this.targetX][this.targetY] = [this.targetX, this.targetY];
        
        while(q.length > 0){
            let pos = q.shift();
            for(let i = 0; i < 4; ++i){
                let a = pos[0] + arr[i][0];
                let b = pos[1] + arr[i][1];
                a = (a + height/size) % (height/size);
                b = (b + width/size) % (width/size);

                let dist = abs(a - snake_blocks[0][0]) + abs(b - snake_blocks[0][1]);
                if(this.field[a][b] <= dist){
                    this.field[a][b] = height*width+2;
                    this.parent[a][b] = pos;
                    q.push([a, b]);
                }
            }
        }
    }
    autonomousMove(x, y){
        let a = this.parent[x][y][0];
        let b = this.parent[x][y][1];
        if(a == 0 && x == height/size - 1) a = height/size;
        if(a == height/size - 1 && x == 0) x = height/size;
        if(b == 0 && y == width/size - 1) b = width/size;
        if(b == width/size - 1 && y == 0) y = width/size;

        if(a < x && turn != d){
            turn = u;
        }else if(a > x && turn != u){
            turn = d; 
        }else if(b < y && turn != r){
            turn = l;
        }else if(b > y && turn != l){
            turn = r;
        }else{
            console.log("IMPOSSIBLE");  
        }
    }

};