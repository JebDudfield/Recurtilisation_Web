//Manages the in-game elements
class Game{

    //Tweakable Constants
    displayStepLength = 500;
    heightPos = new p5.Vector(30,50);
    heightSize = new p5.Vector(170,40);
    goalHeight = 10000;

    //Ending animation constants
    //max vertical displacement of plant
    plantDisplacement = 120;
    //length of end animation
    endFrameCount = 120;
    endFrame = 0;

    backButton = new UIElem(new p5.Vector(160,10),new p5.Vector(130,30),"Back to Menu!",UISmallText);

    winBox = new UIElem(new p5.Vector(250,50),new p5.Vector(170,40),"You win!",UIMediumText);

    p;

    constructor(){
        this.p = new Plant();
        this.initStars();
        this.backButton.execute = function(){
            activeState = UI_STATE.MENU;
            game = new Game();
        }
    }

    update(){
        if(!this.reachedGoal()){
            this.p.update();
        }else{
            //update is here so we get last fruit spawns and don't hard stop.
            this.p.update();
            //During end animation
            this.endFrame++;
        }
    }

    draw(){
        background(getBackgroundColorAtHeight(this.getDisplayHeight()));
        if(!this.reachedGoal()){
            this.drawStars(this.getDisplayHeight(),this.p.pHeight);
            this.p.draw();
        }else{
            //During end animation
            this.endFrame++;
            push();
            translate(0,this.plantDisplacement*this.getEndAnimationProgress());
            this.drawStars(this.getDisplayHeight(),this.p.pHeight);
            this.p.draw();
            this.drawEndFlower();
            this.drawSun();
            pop();
            this.winBox.draw();
            if(this.getEndAnimationProgress() == 1){
                this.backButton.draw();
            }
        }
        this.drawHeight();
    }

    getDisplayHeight(){
        return min(this.displayStepLength*this.p.pHeight/3500,this.goalHeight);
    }

    drawHeight(){
        let heightText = "Height: " + floor(this.getDisplayHeight()) + "m";
        //Box
        fill(UIBackgroundCol);
        stroke(UIStrokeCol);
        strokeWeight(5);
        rect(this.heightPos.x,this.heightPos.y,this.heightSize.x,this.heightSize.y);
        fill(UITextCol);
        textSize(UIMediumText);
        textAlign(LEFT,TOP);
        noStroke();
        text(heightText,this.heightPos.x+UITextOffsetX,this.heightPos.y+UITextOffsetY);
    }

    //Star positions are defined as offsets from corners of an invisible grid of 2x20 squares.
    starPosList;
    starCols = 5;
    starRows = 20;
    starBoxWidth = width/this.starCols;
    starBoxHeight = height/this.starCols;
    parallaxFactor = 0.2;


    initStars(){
        this.starPosList = new Array(this.starCols*this.starRows);
        for(let row = 0; row < this.starRows; row++){
            for(let col = 0; col < this.starCols; col++){
                this.starPosList[row*this.starCols+col] = new p5.Vector(random(0,this.starBoxWidth),random(0,this.starBoxHeight));
            }
        }
    }

    drawStars(dispHeight, actualHeight){
        //Has to be consistent at different pHeight levels.
        //Add pHeight, then take modulus by screenHeight.
        //Only display after orange fade.
        if(dispHeight > 6000){
            let alpha = 255;
            //If not fully dark, keep fading in.
            if(dispHeight < 9000){
                alpha *= (dispHeight-6000)/3000;
            }
            fill(255,255,255,alpha);
            stroke(205,205,205,alpha);
            strokeWeight(3);
            for(let row = 0; row < this.starRows; row++){
                for(let col = 0; col < this.starCols; col++){
                    //for drawing calculations, we want the *actual* height in pixels
                    let starX = this.starPosList[row*this.starCols+col].x + col*this.starBoxWidth;
                    let starY = this.starPosList[row*this.starCols+col].y + row*this.starBoxHeight;
                    starY = (starY + actualHeight*this.parallaxFactor)%height;
                    //point(starX,starY);
                    //rect(starX,starY,3,3);
                    ellipse(starX,starY,5,5);
                }
            }
        }

    }

    //End screen display code
    maxFlowerSize = 50;
    petalCount = 7;
    petalColor = color(255);
    petalStrokeColor = color(225);
    coreColor = color(255,179,0);
    coreStrokeColor = color(225,149,0);

    //centered on tip
    drawEndFlower(){
        let currentSize = this.maxFlowerSize*this.getEndAnimationProgress();
        //currentSize = maxFlowerSize;
        let flowerX = this.p.getCenterOffsetAtIndex(0);
        let flowerY = this.p.tipY;
        //Petals
        let vertexSepAngle = 2*PI/this.petalCount;
        for(let i = 0; i < this.petalCount; i += 1){
            let vertexAngle = i*vertexSepAngle - PI/2;
            fill(this.petalColor);
            stroke(this.petalStrokeColor);
            ellipse(flowerX + currentSize*cos(vertexAngle+0.5*vertexSepAngle),flowerY + currentSize*sin(vertexAngle+0.5*vertexSepAngle),currentSize,currentSize);
        }
        //Core
        fill(this.coreColor);
        stroke(this.coreStrokeColor);
        ellipse(flowerX, flowerY, currentSize, currentSize);
    }

    //End screen sun display code
    sunRadius = 1600;
    sunBottomY = 0;
    sunColor = color(255,255,0);
    sunStrokeColor = color(225,225,0);

    drawSun(){
        fill(this.sunColor);
        stroke(this.sunStrokeColor);
        ellipse(this.p.offset,this.sunBottomY-this.sunRadius,2*this.sunRadius,2*this.sunRadius);
    }

    getEndAnimationProgress(){
        return min(this.endFrame/this.endFrameCount,1);
    }

    reachedGoal(){
        return this.getDisplayHeight() >= this.goalHeight;
    }

    handleClick(pos){
        if(!this.reachedGoal()){
            this.p.handleClick(pos);
        }else if(this.getEndAnimationProgress() == 1){
            this.backButton.handleClick(pos);
        }
    }
}

//js weird loading my beloathed.
let bg_light_blue;
let bg_blue;
let bg_pink;
let bg_yellow;
let bg_orange;
let bg_black;
function backgroundColInitialise(){
    bg_light_blue = color(206,223,255);
    bg_blue = color(156,227,255);
    bg_pink = color(241, 156, 159);
    bg_yellow = color(236, 196, 85);
    bg_orange = color(186, 71, 17);
    bg_black = color(0,0,0);
}

function getBackgroundColorAtHeight(pHeight){
    //Bad programming practice, but I'm just going to hardcode in ranges.
    //Very  Light Blue -> Blue(1500) -> Pink (3000) -> Yellow(4500) -> Orange(6000) -> Black(9000)
    if(pHeight < 1500){
        return lerpColor(bg_light_blue,bg_blue,pHeight/1500);
    }else if(pHeight < 3000){
        return lerpColor(bg_blue,bg_pink,(pHeight-1500)/1500);
    }else if(pHeight < 4500) {
        return lerpColor(bg_pink,bg_yellow,(pHeight-3000)/1500);
    }else if(pHeight < 6000) {
        return lerpColor(bg_yellow,bg_orange,(pHeight-4500)/1500);
    }else if(pHeight < 9000) {
        return lerpColor(bg_orange,bg_black,(pHeight-6000)/3000);
    }
    return bg_black;
}