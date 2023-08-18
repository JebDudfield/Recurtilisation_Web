/** JEB APPROVED AS REVISED PENDING TESTING **/
function setup(){
    can = createCanvas(W, H);
    can.id('GameCanvas');
    //Required for consistent stars.
    randomSeed(37249273);
    stroke(255);
    frameRate(30);
    //windowTitle("Recurtilisation: Grow Right Ahead!");
    colorInitialise();
    initialise();
}

//New variables for P5.js
let can;
const W = 480;
const H = 800;

//New functions for p5.js
function colorInitialise(){
    UIBackgroundCol = color(205,127,50);
    UIStrokeCol = color(185,107,20);
    UITextCol = color(0);
    backgroundColInitialise();
}

function preload(){
    titleImage  = loadImage("data/Title_408_108.png");
}

//p5.js totally new bits end here

//UI variables
const UI_STATE = {
    MENU : Symbol("MENU"),
    HOWTO : Symbol("HOWTO"),
    GAMEPLAY : Symbol("GAMEPLAY"),
    CREDITS : Symbol("CREDITS")
}

//UI Bits and Bobs
let activeState = UI_STATE.MENU;
let UIBackgroundCol;
let UIStrokeCol;
let UITextCol;
const UISmallText = 16;
const UIMediumText = 20;
const UIBigText = 24;
const UITextOffsetX = 10;
const UITextOffsetY = 8;
let titleImage;
let menuPlant;
let titleElem;
let startButton;
let howToButton;
let howToText;
let howToFootnote;
let creditsButton;
let creditsText;
let backButton;

let game;

function initialise(){
    game = new Game();
    menuPlant = new Plant();
    menuPlant.update();

    titleElem = new UIElem(new p5.Vector(36,20),new p5.Vector(408,108),"",UIBigText);
    titleElem.draw = function(){
        image(titleImage, this.position.x, this.position.y, this.size.x, this.size.y);
    }

    startButton = new UIElem(new p5.Vector(150,380),new p5.Vector(180,40), "Start Game", UIBigText);
    startButton.execute = function(){
        activeState = UI_STATE.GAMEPLAY;
    }

    howToButton = new UIElem(new p5.Vector(150,430),new p5.Vector(180,40), "Info", UIBigText);
    howToButton.execute = function(){
        activeState = UI_STATE.HOWTO;
    }

    howToText = new UIElem(new p5.Vector(60,80), new p5.Vector(360,300),
        "Built in a week for Kiwijam 2023,\n" +
        "Recurtilisation* is a simple game about\n" +
        "growing a titan-plant with fertiliser\n" +
        "made from its own fruit.\n" +
        "Click the fruit to grow your plant!\n" +
        "Relax and watch the sky go by.\n" +
        "As your plant grows, its fruit will change.\n" +
        "10,000 meters is your goal.\n" +
        "I hope you enjoy!"
        , UIMediumText);

    howToFootnote = new UIElem(new p5.Vector(140,400), new p5.Vector(200,30), "(*Recursion + Fertilisation)", UISmallText);

    creditsButton = new UIElem(new p5.Vector(150,480),new p5.Vector(180,40), "Credits", UIBigText);
    creditsButton.execute = function(){
        activeState = UI_STATE.CREDITS;
    }

    creditsText = new UIElem(new p5.Vector(60,80), new p5.Vector(360,300),
        " \n" +
        "Programming: \n" +
        "Jebadiah \"Jield\" Dudfield \n" +
        " \n" +
        "The title font, Endor, was created\n" +
        "by Graham Meade & \"Apostrophe\"\n" +
        "at Apostrophic Labs in 2001.\n" +
        "http://pedroreina.net/apostrophiclab"
        , UIMediumText);

    backButton = new UIElem(new p5.Vector(180,700), new p5.Vector(120,35),"Back",UIMediumText);
    backButton.execute = function(){
        activeState = UI_STATE.MENU;
    }

}

function draw(){
    background(getBackgroundColorAtHeight(game.getDisplayHeight()));
    switch(activeState){
        case UI_STATE.MENU:
            menuPlant.draw();
            titleElem.draw();
            startButton.draw();
            howToButton.draw();
            creditsButton.draw();
            break;
        case UI_STATE.GAMEPLAY:
            game.update();
            game.draw();
            break;
        case UI_STATE.HOWTO:
            howToText.draw();
            howToFootnote.draw();
            backButton.draw();
            break;
        case UI_STATE.CREDITS:
            creditsText.draw();
            backButton.draw();
            break;
    }
}

function mousePressed(){
    let clickPos = new p5.Vector(mouseX,mouseY);
    switch(activeState){
        case UI_STATE.MENU:
            startButton.handleClick(clickPos);
            howToButton.handleClick(clickPos);
            creditsButton.handleClick(clickPos);
            break;
        case UI_STATE.GAMEPLAY:
            game.handleClick(clickPos);
            break;
        case UI_STATE.HOWTO:
        case UI_STATE.CREDITS:
            backButton.handleClick(clickPos);
            break;
    }
}

function mouseWheel(){
    game.p.speed += 10;
}