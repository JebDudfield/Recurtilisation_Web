class Fruit{
    //Fruit are distinguished via color and vertex count
    //Corner has a minimum of 3 vertices. Vertices are placed along an imaginary circle.
    //There is always a vertex at the top.
    vertices;
    //Center.
    position;
    //also serves as diameter
    size = 50;
    colour;
    strokeColour;
    //Not used by us, but by Plant.
    isOnRight;

    constructor(vertices, colour, position, isOnRight){
        this.vertices = vertices;
        this.colour = colour;
        this.strokeColour = color(red(colour)-40,green(colour)-40,blue(colour)-40);
        this.position = position;
        this.isOnRight = isOnRight;
    }

    draw(){
        fill(this.colour);
        stroke(this.strokeColour);
        strokeWeight(5);
        let radius = this.size/2;
        let vertexSepAngle = 2*PI/this.vertices;
        beginShape();
        for(let i = 0; i < this.vertices; i += 1){
            let vertexAngle = i*vertexSepAngle - PI/2;
            //Petals: Decided not to leave them in as low sidecounts don't work well with them.
            //fill(255);
            //stroke(225);
            //ellipse(position.x + radius*cos(vertexAngle+0.5*vertexSepAngle),position.y + radius*sin(vertexAngle+0.5*vertexSepAngle),size,size);
            vertex(this.position.x + radius*cos(vertexAngle),this.position.y + radius*sin(vertexAngle));
        }
        fill(this.colour);
        stroke(this.strokeColour);
        endShape(CLOSE);
        //drawHitbox();
    }

    /**
     * For gamefeel testing purposes.
     */
    drawHitbox(){
        fill(0,0,255,100);
        stroke(0,0,255,100);
        ellipse(this.position.x,this.position.y,1.5*this.size,1.5*this.size);
    }

    //returns true if the position is contained within the fruit's DIAMETER.
    containsPos(pos){
        return this.position.dist(pos) <= this.size*0.75;
    }

}