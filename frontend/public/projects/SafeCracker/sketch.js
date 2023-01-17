let symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "+", "~"];
let currentGuess = ["", "", "", "", "", "", "", ""];
let previousGuess = ["", "", "", "", "", "", "", ""];
let currentCode = [];
let codeLength = 8;
let tries = 7;
let tryCounter = 0;
let cursor = 0;
let boop;
let clear;
let enter;
let digitalOpen;
let doorOpen;
let shuffle;

let textarea = document.getElementById('Console');

function setup() {
    boop = new sound("Assets/Boop.wav");
    clear = new sound("Assets/Clear.wav");
    enter = new sound("Assets/Enter.wav");
    digitalOpen = new sound("Assets/DigitalOpen.wav");
    doorOpen = new sound("Assets/DoorOpening.wav");
    shuffle = new sound("Assets/Shuffle.wav");

    generateCode();
    textarea.value = "Enter the 8 character\npasscode...\n"
}

function draw() {
    arrayMgmt();
    placeGuessesInBoxes();
    updateLights();
}

function generateCode() {
    //Reset Everything
    cursor = 0;
    currentCode = [];
    currentGuess = ["", "", "", "", "", "", "", ""];
    previousGuess = ["", "", "", "", "", "", "", ""];
    placeGuessesInBoxes();
    for (i = 0; i < codeLength; i++) {
        document.getElementById("PG" + i).style.borderColor = "white";
    }

    //Generate New Code
    for (i = 0; currentCode.length < codeLength; i++) {
        let randomSymbol = symbols[int(random(0, symbols.length))];
        if (randomSymbol != currentCode[0] &&
            randomSymbol != currentCode[1] &&
            randomSymbol != currentCode[2] &&
            randomSymbol != currentCode[3] &&
            randomSymbol != currentCode[4] &&
            randomSymbol != currentCode[5] &&
            randomSymbol != currentCode[6]) {
            currentCode.push(randomSymbol);
        }
    }
    //Display Info on "Console"
    textarea.value = textarea.value + "\n\nToo many failed attempts.\nGenerating New Randomized Code...\n- - - - - - - - - - - - - - - - -\nEnter the 8 character\npasscode...\n\n"

    shuffle.play();
    console.log("CorrectCode:  " + currentCode);
}

function checkCode() {
    //Assume the code is correct
    let correct = true;
    //Compare the correct code with the current guess
    for (i = 0; i < codeLength; i++) {
        //If any index doesn't match then the code is incorrect(correct = false) and we change the boder color to red.
        if (currentGuess[i] != currentCode[i]) {
            correct = false;
            document.getElementById("PG" + i).style.borderColor = "red";
            //Then we check to see if that symbol is found anywhere in the correct code. If so we turn the border color to yellow. 
            for (j = 0; j < currentCode.length; j++) {
                if (currentGuess[i] == currentCode[j]) {
                    document.getElementById("PG" + i).style.borderColor = "yellow";
                }
            }
        }
        //If the symbol matches then we turn the border green. 
        if (currentGuess[i] == currentCode[i]) {
            document.getElementById("PG" + i).style.borderColor = "green";
        }
        //If the symbol is seen as "" then turn the border white. 
        if (currentGuess[i] == "") {
            document.getElementById("PG" + i).style.borderColor = "white";
        }
    }

    if (correct === true) {
        document.getElementById("CurrentCode").style.borderColor = "green";
        textarea.value = textarea.value + "\n\n---------------SAFE UNLOCKED--------------"

        digitalOpen.play();
        doorOpen.play();

        console.log("Safe Unlocked!")
    } else if (correct === false) {
        console.log("Incorrect")
    }
    cursor = 0;
}


function arrayMgmt() {
    if (currentGuess.length > 8) {
        currentGuess.length = 8;
        submit();
    }
    if (cursor > codeLength) {
        cursor = 0
    }
}

function placeGuessesInBoxes() {
    for (i = 0; i < codeLength; i++) {
        if (currentGuess[i] != undefined) {
            document.getElementById(i).value = currentGuess[i];
        }
        if (previousGuess[i] != undefined) {
            document.getElementById("PG" + i).value = previousGuess[i];
        }
    }

}


function updateLights() {
    if (tryCounter >= 7) {
        tryCounter = 0;
        generateCode();
    }
    if (tryCounter == 0) {
        for (i = 0; i < 7; i++) {
            document.getElementById("Light" + i).style.backgroundColor = "#5ab4cd";
        }
    }
    for (i = 0; i < tryCounter; i++) {
        document.getElementById("Light" + i).style.backgroundColor = "#0d0c0c";
    }
}

//Textarea autoscroll. 
setInterval(function () {
    textarea.scrollTop = textarea.scrollHeight;
}, 1000)

/////////////////////////////////
//          BUTTONS            //
/////////////////////////////////
function clicked(i) {
    currentGuess.splice(cursor, 1, symbols[i]);
    boop.play();
    cursor++
}

function erase() {
    for (i = 0; i < codeLength; i++) {
        document.getElementById(i).value = "";
        document.getElementById(i).style.borderColor = "white";
    }
    currentGuess = ["", "", "", "", "", "", "", ""];
    clear.play();
    cursor = 0;
}

function submit() {
    checkCode();
    for (i = 0; i < codeLength; i++) {
        previousGuess[i] = currentGuess[i];

    }
    textarea.value = textarea.value + "\n"
    for (i = 0; i < codeLength; i++) {
        textarea.value = textarea.value + currentGuess[i];
    }
    currentGuess = ["", "", "", "", "", "", "", ""];
    enter.play();
    cusor = 0;
    tryCounter++
}


//SOUND OBJECT
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}
