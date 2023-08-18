//UI element for menus
//Intended to be used with anonymous class overriding of execute and draw.
class UIElem{
    position;
    size;
    text;
    textSize;
    constructor(position, size, text, textSize){
    this.position = position;
    this.size = size;
    this.text = text;
    this.textSize = textSize;
}
handleClick(point){
    if(point.x > this.position.x && point.x < this.position.x + this.size.x && point.y > this.position.y && point.y < this.position.y + this.size.y){
        this.execute();
    }
}
execute(){}
draw(){
    fill(UIBackgroundCol);
    stroke(UIStrokeCol);
    strokeWeight(5);
    rect(this.position.x,this.position.y,this.size.x,this.size.y);
    fill(UITextCol);
    textSize(this.textSize);
    textAlign(CENTER,TOP);
    noStroke();
    text(this.text,this.position.x + this.size.x/2,this.position.y+UITextOffsetY);
}
}