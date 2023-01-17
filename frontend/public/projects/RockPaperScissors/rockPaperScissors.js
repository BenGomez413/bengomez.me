// 1) Get user's input
// 2) Get a random number
// 3) Assign the random number to rock, paper, scissors
// 4) Check if the user won
// 5) Check if the computer won
// 5) Check if it's a tie




let userWins = 0;
let computerWins = 0;

while(userWins < 3 && computerWins < 3){
  let userPick = prompt('Pick "rock", "paper" or "scissors"');
  let randomNumber = Math.floor(Math.random() * 3) + 1;
  let computerPick;

  if(randomNumber === 1){
    computerPick = 'rock';
  } else if(randomNumber === 2){
    computerPick = 'paper';
  } else if(randomNumber === 3){
    computerPick = 'scissors';
  } else {
    console.log('bad pick');
  }

  
  //user won
  if(userPick === 'rock' && computerPick === 'scissors'||
    userPick === 'paper' && computerPick === 'rock'|| 
    userPick === 'scissors' && computerPick === 'paper'){
      console.log(`You have beaten the machine! \nThe computer Picked: ${computerPick}`);
      userWins++;
  } else if(userPick === 'rock' && computerPick === 'paper'||
    userPick === 'paper' && computerPick === 'scissors'|| 
    userPick === 'scissors' && computerPick === 'rock'){
      console.log(`You Lost! \nThe computer Picked: ${computerPick}`);
      computerWins++;
  } else if(userPick === computerPick){
    console.log(`Tie! \nThe computer Picked: ${computerPick}`);
  } else {
    console.log('bad pick');
  }
}

if(userWins > computerWins){
  console.log(`You WON! \nUserWins: ${userWins} \nComputerWins: ${computerWins}`);
} else {
  console.log(`You LOST! \nUserWins: ${userWins} \nComputerWins: ${computerWins}`);
}







// let name = "Jim";
// let age = 30;
// console.log('Hi my name is ' + name);  
// console.log(`Hi my name is ${name}! And I am ${age} old!`);