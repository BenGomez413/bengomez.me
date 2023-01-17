let options = ['rock', 'paper', 'scissors'];

let gamesPlayed = 0;
let userWins = 0;
let computerWins = 0;

let userPick;
let computerPick;

let result;
let animating = false;

function play(option) {
  if (animating === false) {
    for(let i = 0; i < options.length; i++){
      document.querySelector(`.${options[i]}`).children[0].style.opacity = '0%';
    }
    
    animating = true;
    userPick = option;
    computerPick = options[Math.floor(Math.random() * 3)];

    console.log(`User: ${userPick}`);
    console.log(`Computer: ${computerPick}`);


    if (userPick === 'rock' && computerPick === 'scissors' ||
      userPick === 'paper' && computerPick === 'rock' ||
      userPick === 'scissors' && computerPick === 'paper') {
      console.log(`WIN!`);
      result = 'win';
      userWins++;

    } else if (userPick === 'rock' && computerPick === 'paper' ||
      userPick === 'paper' && computerPick === 'scissors' ||
      userPick === 'scissors' && computerPick === 'rock') {
      console.log(`LOSS!`);
      result = 'loss';
      computerWins++;

    } else if (userPick === computerPick) {
      console.log(`TIE!`);
      result = 'tie';

    } else {
      console.log('bad pick');
    }

    gamesPlayed++
    animateGame();
  } else {console.log('Be patient')}
}


function updateScoreboard() {
  const scoreGamesPlayed = document.getElementById('games-played');
  const scoreUser = document.getElementById('user-wins');
  const scoreComputer = document.getElementById('computer-wins');

  const scoreUserContainer = document.getElementById('user-wins-container');
  const scoreComputerContainer = document.getElementById('computer-wins-container');

  scoreGamesPlayed.innerHTML = gamesPlayed;
  scoreUser.innerHTML = userWins;
  scoreComputer.innerHTML = computerWins;


  if (result === 'win') {
    scoreUserContainer.style.borderBottom = 'solid 4px rgba(63, 161, 89, 0.50)';
    scoreComputerContainer.style.borderBottom = 'solid 4px rgba(173, 64, 64, 0.50)';
  } else if (result === 'loss') {
    scoreUserContainer.style.borderBottom = 'solid 4px rgba(173, 64, 64, 0.50)';
    scoreComputerContainer.style.borderBottom = 'solid 4px rgba(63, 161, 89, 0.50)';
  } else if (result === 'tie') {
    scoreUserContainer.style.borderBottom = 'solid 4px rgba(22, 115, 201, 0.50)';
    scoreComputerContainer.style.borderBottom = 'solid 4px rgba(22, 115, 201, 0.50)';
  } else {
    console.log('bad result');
  }
}




function animateGame() {
  const userHandDiv = document.getElementById('user-hand-div');               //the div has the animation
  const userHand = document.getElementById('user-hand');                      //used to change the hand icon
  const computerHandDiv = document.getElementById('computer-hand-div');       //the div has the animation
  const computerHand = document.getElementById('computer-hand');              //used to change the hand icon

  userHand.className = `fas fa-hand-rock`;
  computerHand.className = `fas fa-hand-rock`;
  
  userHandDiv.classList.add('run-left-animation');
  computerHandDiv.classList.add('run-right-animation');

  userHandDiv.style.display = 'inline-block'
  computerHandDiv.style.display = 'inline-block'

  setTimeout(function () {
    userHand.className = `fas fa-hand-${userPick}`;
    computerHand.className = `fas fa-hand-${computerPick}`;
    updateScoreboard();
    

    for(let i = 0; i < options.length; i++){
      document.querySelector(`.${options[i]}`).children[0].style.opacity = '100%';
    }

    userHandDiv.classList.remove('run-left-animation');
    computerHandDiv.classList.remove('run-right-animation');

    animating = false;
  }, 1500);



}



//make it work
//center the icons
//make scoreboard
//other