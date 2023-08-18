class Plant{
    //Sinusoid Wave
    // y = O + Asin((2pi/T)x - P)
    // O = offset perpendicular to direction of travel
    // A = Amplitude of the wave
    // T = Period, the length it takes for the wave to repeat.
    // P = Phase, the offset in the direction of travel.

    //Tweakable Constants
    //Deceleration- how much does the plant's growth slow by each frame?
    deceleration = 0.95;
    //Wave constants
    //Offset
    offset = width/2;
    //Amplitude
    minAmp = 20;
    maxAmp = 20;
    ampRange = this.maxAmp-this.minAmp;
    //Period
    period = height/2;
    //Phase is variable, see below.
    //Overall shape constants
    tipY = height/5;
    baseY = height;
    range = this.baseY-this.tipY;
    maxWidth = 200;
    //Colors
    fill = color(0,255,100);
    stroke = color(0,200,100);
    //Progression constants
    stepHeight = 3500;
    //red, orange, yellow, blue, brown, purple
    /** TODO: Check how to do arrays in p5.js**/
    colorStages = [color(255,30,30),color(255,150,0),color(255,255,30),color(30,30,255),color(150,75,20),color(150,20,150)];
    vertexStages = [3,5,7];
    totalStages = this.colorStages.length*this.vertexStages.length;

    //Changing wave vars
    pHeight = 0;
    phase = 0;
    speed = 0;

    //Fruit vars
    fruitList = [];
    //For safe asynchronous removal with user input- if you click on a fruit, it will add it to this list
    //Any fruit in this list will be deleted at the end of an update tick.
    deferredRemovalList = [];
    //Tracks how far (in pixels) the plant has moved since the last fruit spawn.
    fruitSpawnOffset = height;
    //How far (in pixels) each fruit spawn should be apart.
    fruitSpawnPeriod = this.period/4;
    //Will the next spawned fruit cling to the right side?
    nextSpawnRight = true;
    //The amount that each fruit will add to speed.
    fruitSpeedUp = 0.5;

draw(){
    fill(this.fill);
    stroke(this.stroke);
    strokeWeight(5);
    beginShape();
    //float[] rVertices = new float[(int)(2*range)];
    let rVertices = new Array(2*this.range);
    //Top to bottom
    for(let i = 0; i < this.range; i++){
        let line = this.indexToLine(i);
        let centerX = this.getCenterOffsetAtIndex(i);
        let edgeOffset = this.getEdgeOffsetAtIndex(i);
        //We can add left vertices now, but we need to store right vertices to add them later.
        vertex(centerX - edgeOffset,line);
        /** TODO: fix array access, check it works good. **/
        rVertices[floor(2*i)] = centerX + edgeOffset;
        rVertices[floor(2*i+1)] = line;
    }
    //add right vertices
    for(let  i = this.range-1; i >= 0; i--){
        vertex(rVertices[floor(2*i)],rVertices[floor(2*i+1)]);
    }
    endShape();
    //this.getEdgeOffsetAtIndex(1);

    //Fruit drawing
    this.fruitList.forEach((f)=>f.draw());
    /*
    for(Fruit f : fruitList){
        f.draw();
    }
    */
}

//conversion functions between abstract index and absolute line/Y value
indexToLine(index){
    return this.tipY + index;
}
lineToIndex(line){
    return line - this.tipY;
}

//Returns the plant edge offset (half width) at a given index/distance from the tip
getEdgeOffsetAtIndex(index){
    console.assert(index >= 0 , "Index must be greater than or equal to 0.");
    return (this.maxWidth*index)/(2*this.range);
}

//Returns the wave position at a given index/distance from the tip
getCenterOffsetAtIndex(index){
    console.assert(index >= 0 , "Index must be greater than or equal to 0.");
    return this.offset + (this.minAmp + this.ampRange*(index/this.range))*sin((2*PI/this.period)*index - this.phase);
}

//Returns the distance moved in pixels.
//TODO: Animate fruits
update(){
    this.phase += this.speed;
    //Fruit creation
    //If we have moved enough to spawn another fruit, do so.
    //Speed is in terms of angles, need to convert it to linear speed.
    let linearSpeed = (this.speed/(2*PI))*this.period;
    this.fruitSpawnOffset += linearSpeed;
    while(this.fruitSpawnOffset > this.fruitSpawnPeriod){
        this.fruitList.push(new Fruit(this.getCurrentVertexCount(),this.getCurrentFruitColor(),new p5.Vector(this.offset,this.tipY+this.fruitSpawnOffset-this.fruitSpawnPeriod),this.nextSpawnRight));
        //Alternate spawn sides.
        this.nextSpawnRight = !this.nextSpawnRight;
        this.fruitSpawnOffset -= this.fruitSpawnPeriod;
    }
    //Fruit movement+deletion
    //Backwards traversal to support in-place deletion
    for(let i = this.fruitList.length-1; i >= 0; i--){
        let f = this.fruitList[floor(i)];
        //Update Y first so we see if we can delete it.
        f.position.y += linearSpeed;
        if(f.position.y - f.size/2 > height){
            this.fruitList.splice(i,1);
        }else{
            //Then do the work of updating x.
            f.position.x = this.getCenterOffsetAtIndex(this.lineToIndex(f.position.y));
            f.position.x += (f.isOnRight ? 1 : -1)*this.getEdgeOffsetAtIndex(this.lineToIndex(f.position.y));
            //And size!
        }
    }
    //Carry out any deferred deletions
    /*for(let f : this.deferredRemovalList){
        fruitList.remove(f);
    }*/
    this.deferredRemovalList.forEach((f) => {
        let index = this.fruitList.indexOf(f);
        if(index != -1){
            this.fruitList.splice(index,1);
        }
    });
    this.deferredRemovalList = [];

    this.speed *= this.deceleration;
    this.pHeight += linearSpeed;
    return linearSpeed;
}

getCurrentStage(){
    return min(floor(this.pHeight/this.stepHeight),this.totalStages-1);
}

//Cycle through colors, then vertices

getCurrentVertexCount(){
    return this.vertexStages[floor(this.getCurrentStage()/this.colorStages.length)];
}

getCurrentFruitColor(){
    return this.colorStages[this.getCurrentStage()%this.colorStages.length];
}

handleClick(clickPos){
    /*for(Fruit f : fruitList){
        if(f.containsPos(clickPos)){
            deferredRemovalList.add(f);
            speed = fruitSpeedUp;
        }
    }*/
    this.fruitList.forEach((f)=>{
        if(f.containsPos(clickPos)){
            this.deferredRemovalList.push(f);
            this.speed = this.fruitSpeedUp;
        }
    });
}
}