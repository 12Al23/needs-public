//

var sleepCurrentValue = 100;
var foodCurrentValue = 100;
var toiletCurrentValue = 100;
var hygieneCurrentValue = 100;
var funCurrentValue = 100;
var socialCurrentValue = 100;
var maxValue = 100;
let timers = {};
let percentageDisplay;
let countdownDisplay;
let periodModeActive = false;



/*buttonBar buttons*/
const startButton = document.querySelector("#startButton");
const activityButton = document.querySelector("#activityButton");
const periodButton = document.querySelector("#periodButton");
const periodExtras = document.querySelector("#periodExtras");
const tamponButton = document.querySelector("#tamponButton");
const mooncupButton = document.querySelector("#mooncupButton");
/*stat buttons*/
const sleepButton = document.querySelector("#sleepButton");
const foodButton = document.querySelector("#foodButton");
const toiletButton = document.querySelector("#toiletButton");
const hygieneButton = document.querySelector("#hygieneButton");
const funButton = document.querySelector("#funButton");
const socialButton = document.querySelector("#socialButton");
/*options buttons*/
const sleepOption1 = document.querySelector("#sleepOption1");
const foodOption1 = document.querySelector("#foodOption1");
const toiletOption1 = document.querySelector("#toiletOption1");
const hygieneOption1= document.querySelector("#hygieneOption1");
const funOption1 = document.querySelector("#funOption1");
const socialOption1 = document.querySelector("#socialOption1");


/*stats setup*/

const percentageText = document.querySelector("#percentageText");
const percentage = document.querySelector("#percentage");
const timerText = document.querySelector("#timerText");
const countdownValue = document.querySelector("#countdownValue")
const commonInterval = 1000; // Common interval for all timers
const sleepTotalSeconds = 57600; //16 hours until zero
const foodTotalSeconds = 21600; //6 hours
const toiletTotalSeconds = 14400; //4 hours
const hygieneTotalSeconds = 86400; //24 hours
const funTotalSeconds = 604800; //7 days
const socialTotalSeconds = 604800; //7 days
// Adjust decrease rates based on importance or desired rate of change
const sleepDecreaseRate = (100/sleepTotalSeconds); 
const foodDecreaseRate = (100/foodTotalSeconds);
const toiletDecreaseRate = (100/toiletTotalSeconds); 
const hygieneDecreaseRate = (100/hygieneTotalSeconds);
const funDecreaseRate = (100/funTotalSeconds); 
const socialDecreaseRate = (100/socialTotalSeconds); 

// stat config timers

const statConfig = {
  sleep:   { totalSeconds: sleepTotalSeconds,   decreaseRate: sleepDecreaseRate },
  food:    { totalSeconds: foodTotalSeconds,    decreaseRate: foodDecreaseRate },
  toilet:  { totalSeconds: toiletTotalSeconds,  decreaseRate: toiletDecreaseRate },
  hygiene: { totalSeconds: hygieneTotalSeconds, decreaseRate: hygieneDecreaseRate },
  fun:     { totalSeconds: funTotalSeconds,     decreaseRate: funDecreaseRate },
  social:  { totalSeconds: socialTotalSeconds,  decreaseRate: socialDecreaseRate },
};

const statNames = ["sleep", "food", "toilet", "hygiene", "fun", "social"];




//this represents the countdown figure left in seconds
var sleepCountdownValue = (sleepTotalSeconds*(sleepCurrentValue/100));
var foodCountdownValue = (foodTotalSeconds*(foodCurrentValue/100));
var toiletCountdownValue = (toiletTotalSeconds*(toiletCurrentValue/100));
var hygieneCountdownValue = (hygieneTotalSeconds*(hygieneCurrentValue/100));
var funCountdownValue = (funTotalSeconds*(funCurrentValue/100));
var socialCountdownValue = (socialTotalSeconds*(socialCurrentValue/100));



//////// boost config value table

const boostConfig = {
  sleep:   [100, 60, 30],
  food:    [70, 10],
  toilet:  [25, 12],
  hygiene: [5, 50, 40, 70],
  fun:     [20, 20, 20],
  social:  [60, 10, 20],
};

// boost function

function boostStat(stat, amount) {
  const newValue = Math.min(window[`${stat}CurrentValue`] + amount, 100);
  window[`${stat}CurrentValue`] = newValue;
  updateProgressBar(stat, newValue);
  mainScreenFunction();
};



//initialize buttons
startButton.onclick = startButtonFunction;
activityButton.onclick = activityButtonFunction;
periodButton.onclick = periodButtonFunction;

//initialize buttons
sleepButton.onclick = sleepStatsDisplayFunction;
foodButton.onclick = foodStatsDisplayFunction;
toiletButton.onclick = toiletStatsDisplayFunction;
hygieneButton.onclick = hygieneStatsDisplayFunction;
funButton.onclick = funStatsDisplayFunction;
socialButton.onclick = socialStatsDisplayFunction;
//initialize buttons
sleepOption1.onclick = sleepOptionsDisplayFunction;
foodOption1.onclick = foodOptionsDisplayFunction;
toiletOption1.onclick = toiletOptionsDisplayFunction;
hygieneOption1.onclick = hygieneOptionsDisplayFunction;
funOption1.onclick = funOptionsDisplayFunction;
socialOption1.onclick = socialOptionsDisplayFunction;
//onclick boost functions
statNames.forEach(function(stat) {
  boostConfig[stat].forEach(function(amount, index) {
    const button = document.querySelector(`#${stat}Boost${index + 1}`);
    if (button) {
      button.onclick = function() {
        boostStat(stat, amount);
      };
    }
  });
});




////// period mode 

// period mode config
const periodMultipliers = {
  sleep:   16 / 15,  // 15h instead of 16h
  food:    1.2,
  toilet:  1.2,
  hygiene: 1.3,
};

// increase coundown speed
function getDecreaseRate(stat) {
  const baseRate = statConfig[stat].decreaseRate;
  if (periodModeActive && periodMultipliers[stat]) {
    return baseRate * periodMultipliers[stat];
  }
  return baseRate;
};

function getEffectiveTotalSeconds(stat) {
  const baseTotal = statConfig[stat].totalSeconds;
  if (periodModeActive && periodMultipliers[stat]) {
    return baseTotal / periodMultipliers[stat];
  }
  return baseTotal;
};
























///////////main screen function

function mainScreenFunction() {
  
  
  activityButton.innerText = "Log Activity";
  activityButton.onclick = activityButtonFunction;
  document.getElementById("popupDiv2").style.display = "none";
  document.getElementById("popupDiv3").style.display = "none";
  document.getElementById("startButton").style.display = "block";
  document.getElementById("periodButton").style.display = "block";
  if (periodModeActive) {
    periodExtras.style.display = "flex";
  }
  // Display the option buttons
  document.getElementById("options1").style.display = "flex";
    // Hide the sample buttons
  document.getElementById("sleepOptions").style.display = "none";
  document.getElementById("foodOptions").style.display = "none";
  document.getElementById("toiletOptions").style.display = "none";
  document.getElementById("hygieneOptions").style.display = "none";
  document.getElementById("funOptions").style.display = "none";
  document.getElementById("socialOptions").style.display = "none";
  clearInterval(percentageDisplay);
  clearInterval(countdownDisplay);
  //placeholder text
  percentage.innerText = "...";
  countdownValue.innerText = "..." + "seconds";
  
  
};






////////////start-restart

function startButtonFunction() {
  startButton.innerText = "Restart";
  startButton.onclick = restartFunction;

  statNames.forEach(function(stat) {
    window[`${stat}CurrentValue`] = 100;
    startTimer(stat);
  });
};
    
function restartFunction() {
  startButton.innerText = "Start";
  startButton.onclick = startButtonFunction;

  statNames.forEach(function(stat) {
    clearInterval(timers[stat]);
    window[`${stat}CurrentValue`] = 100;
    window[`${stat}CountdownValue`] = statConfig[stat].totalSeconds;
    updateProgressBar(stat, 100);
  });

  saveState();
};







//////////// savestate, persistence


function saveState() {
  const state = {
    savedAt: Date.now(),
    stats: {},
    isRunning: startButton.innerText === "Restart", // true only if Start has been clicked
    periodModeActive: periodModeActive,
    tamponElapsed: tamponTimer.getElapsed(),
    tamponActive: tamponTimer.isActive(),
    mooncupElapsed: mooncupTimer.getElapsed(),
    mooncupActive: mooncupTimer.isActive(),
  };
  statNames.forEach(function(stat) {
    state.stats[stat] = window[`${stat}CurrentValue`];
  });
  localStorage.setItem("selfCareState", JSON.stringify(state));
};

// load state

function loadState() {
  const raw = localStorage.getItem("selfCareState");
  if (!raw) return; // nothing saved yet, fresh start

  const state = JSON.parse(raw);
  const secondsElapsed = (Date.now() - state.savedAt) / 1000;

  periodModeActive = state.periodModeActive;
  if (periodModeActive) {
    periodButton.innerText = "End Period Mode";
    periodButton.style.backgroundColor = "#cc4477";
    periodButton.onclick = notPeriodFunction;
    periodExtras.style.display = "flex";
  }

  statNames.forEach(function(stat) {
    let value = state.stats[stat];
    if (state.isRunning) {
      const rate = getDecreaseRate(stat);
      value = value - (rate * secondsElapsed);
      if (value < 0) value = 0;
    }
    window[`${stat}CurrentValue`] = value;
    window[`${stat}CountdownValue`] = getEffectiveTotalSeconds(stat) * (value / 100);
    updateProgressBar(stat, value);
  });

  if (state.isRunning) {
    startButton.innerText = "Restart";
    startButton.onclick = restartFunction;
    statNames.forEach(function(stat) {
      startTimer(stat);
    });
  }


  if (state.tamponActive) {
    tamponTimer.resume(state.tamponElapsed + secondsElapsed);
  }
  if (state.mooncupActive) {
    mooncupTimer.resume(state.mooncupElapsed + secondsElapsed);
  }
};












////////////update progress bar

function updateProgressBar(stat, value) {
  const progressBar = document.getElementById(`${stat}ProgressBar`);
  if (progressBar) {
    // Calculate the new width percentage
    const newWidth = (value / maxValue) * 100;
    // Update the width of the progress bar
    progressBar.style.width = `${newWidth}%`;
    // Optionally, you can update the text inside the progress bar to show the current value
    progressBar.innerText = `${value}%`;
    // Change the color of the progress bar based on the value
    progressBar.style.backgroundColor = value <= 25 ? 'red' : (value <= 50 ? 'orange' : 'green');
    
  };
  
};



///////////////start timer

function startTimer(stat) {
  timers[stat] = setInterval(function() {
    const rate = getDecreaseRate(stat);
    let currentValue = window[`${stat}CurrentValue`] - rate;
    if (currentValue < 0) currentValue = 0;
    window[`${stat}CurrentValue`] = currentValue;
    window[`${stat}CountdownValue`] = getEffectiveTotalSeconds(stat) * (currentValue / 100);
    updateProgressBar(stat, currentValue);
    saveState();
  }, commonInterval);
};






/////////////increase progress bar functions
//Changed so that only progress bar container is targeted
// Add click event listeners to each progress bar
document.getElementById("sleepProgressContainer").addEventListener("click", function() {
  // Increase the value by 10%, but ensure it doesn't exceed 100
  sleepCurrentValue = Math.min(sleepCurrentValue + 10, 100);
  // Update the progress bar
  updateProgressBar("sleep", sleepCurrentValue);
});

document.getElementById("foodProgressContainer").addEventListener("click", function() {
  foodCurrentValue = Math.min(foodCurrentValue + 10, 100);
  updateProgressBar("food", foodCurrentValue);
});

document.getElementById("toiletProgressContainer").addEventListener("click", function() {
  // Increase the value by 10%, but ensure it doesn't exceed 100
  toiletCurrentValue = Math.min(toiletCurrentValue + 10, 100);
  // Update the progress bar
  updateProgressBar("toilet", toiletCurrentValue);
});

document.getElementById("hygieneProgressContainer").addEventListener("click", function() {
  hygieneCurrentValue = Math.min(hygieneCurrentValue + 10, 100);
  updateProgressBar("hygiene", hygieneCurrentValue);
});

document.getElementById("funProgressContainer").addEventListener("click", function() {
  // Increase the value by 10%, but ensure it doesn't exceed 100
  funCurrentValue = Math.min(funCurrentValue + 10, 100);
  // Update the progress bar
  updateProgressBar("fun", funCurrentValue);
});

document.getElementById("socialProgressContainer").addEventListener("click", function() {
  socialCurrentValue = Math.min(socialCurrentValue + 10, 100);
  updateProgressBar("social", socialCurrentValue);
});


















///////////////////////////////////////////////////onclick stats display functions

function sleepStatsDisplayFunction() {
  
  
  popupFunction(sleepCurrentValue);
  updatePercentageDisplay("sleep");
  updateCountdownDisplay("sleep");
};



function foodStatsDisplayFunction() {
  
  
  popupFunction(foodCurrentValue);
  updatePercentageDisplay("food");
  updateCountdownDisplay("food");
};


function toiletStatsDisplayFunction() {


  
  popupFunction(toiletCurrentValue);
  updatePercentageDisplay("toilet");
  updateCountdownDisplay("toilet");
};



function hygieneStatsDisplayFunction() {
  
  

  popupFunction(hygieneCurrentValue);
  updatePercentageDisplay("hygiene");
  updateCountdownDisplay("hygiene");
};


function funStatsDisplayFunction() {
  
  
  popupFunction(funCurrentValue);
  updatePercentageDisplay("fun");
  updateCountdownDisplay("fun");
};


function socialStatsDisplayFunction() {
      
  
  popupFunction(socialCurrentValue);
  updatePercentageDisplay("social");
  updateCountdownDisplay("social");
};







//////////////////////////////////////////////////////////////stats popup funtions
/*moved all popup display bits here to avoid repitition*/

function popupFunction(value) {
  document.getElementById("popupDiv2").style.display = "flex";
  activityButton.innerText = "Main Screen";
  activityButton.onclick = mainScreenFunction;
  document.getElementById("startButton").style.display = "none";
  document.getElementById("periodButton").style.display = "none";
  periodExtras.style.display = "none";
   // Update the percentage text dynamically

   // Stop any leftover interval from a previously opened stat popup
  clearInterval(percentageDisplay);
  clearInterval(countdownDisplay);
  
};





    
////////////////////////////////////////////////////////stats percentage update function

// Function to update the percentage stat display number every second
function updatePercentageDisplay(stat) {
  percentageDisplay = setInterval(function() {
    const value = window[`${stat}CurrentValue`];
    percentage.innerText = value.toFixed(2) + "%";
  }, commonInterval);
};






    
//////////////////////////////////////////////////////////stats countdown update function



// Function to display countdown timers in easily readable format for user

function formatTime(totalSeconds) {
  totalSeconds = Math.max(0, Math.round(totalSeconds));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};


// Function to update timer stat displays

function updateCountdownDisplay(stat) {
  countdownDisplay = setInterval(function() {
    const value = window[`${stat}CountdownValue`];
    countdownValue.innerText = formatTime(value);
  }, commonInterval);
};


    














//////////////////////////////////////////////////////////////////////ACTIVITY BUTTON FUNCTION*/

  
  function activityButtonFunction() {
    document.getElementById("popupDiv3").style.display = "flex";
    activityButton.innerText = "Main Screen";
    activityButton.onclick = mainScreenFunction;
    document.getElementById("startButton").style.display = "none";
    document.getElementById("periodButton").style.display = "none";
    periodExtras.style.display = "none";
    
    
};












///////////////activity option button funtions

function sleepOptionsDisplayFunction() {
    // Hide the option buttons
    document.getElementById("options1").style.display = "none";
    // Display the sample buttons
    document.getElementById("sleepOptions").style.display = "flex";
  
};


function foodOptionsDisplayFunction() {
    // Hide the option buttons
    document.getElementById("options1").style.display = "none";
    // Display the sample buttons
    document.getElementById("foodOptions").style.display = "flex";
  
};

function toiletOptionsDisplayFunction() {
    // Hide the option buttons
    document.getElementById("options1").style.display = "none";
    // Display the sample buttons
    document.getElementById("toiletOptions").style.display = "flex";
  
};

function hygieneOptionsDisplayFunction() {
    // Hide the option buttons
    document.getElementById("options1").style.display = "none";
    // Display the sample buttons
    document.getElementById("hygieneOptions").style.display = "flex";
 
};

function funOptionsDisplayFunction() {
    // Hide the option buttons
    document.getElementById("options1").style.display = "none";
    // Display the sample buttons
    document.getElementById("funOptions").style.display = "flex";
  
};

function socialOptionsDisplayFunction() {
    // Hide the option buttons
    document.getElementById("options1").style.display = "none";
    // Display the sample buttons
    document.getElementById("socialOptions").style.display = "flex";
  
};































/*PERIOD BUTTON FUNCTIONS*/

function periodButtonFunction() {
  /*hydration and food go down slightly faster. sleep goes down slightly faster, and fun. enable buff options and tampon timer */
  periodModeActive = true;
  periodButton.innerText = "End Period Mode";
  periodButton.style.backgroundColor = "#cc4477";
  periodButton.onclick = notPeriodFunction;
  periodExtras.style.display = "flex";
};

function notPeriodFunction() {
  periodModeActive = false;
  periodButton.innerText = "Period Mode";
  periodButton.style.backgroundColor = "#FAE8E0";
  periodButton.onclick = periodButtonFunction;
  periodExtras.style.display = "none";
  tamponTimer.stop();
  mooncupTimer.stop();
};



// period tampon timer and mooncup
function createReminderTimer(button, label, durationSeconds) {
  let interval;
  let secondsElapsed = 0;
  let active = false;

  function tick() {
    secondsElapsed += 1;
    if (secondsElapsed >= durationSeconds) {
      button.innerText = "Replace now!";
      button.style.backgroundColor = "red";
    }
  };

  function start() {
    active = true;
    secondsElapsed = 0;
    button.innerText = `${label}: On`;
    button.style.backgroundColor = "#cc4477";
    button.onclick = stop;
    interval = setInterval(tick, commonInterval);
  };

  function resume(elapsedSeconds) {
    active = true;
    secondsElapsed = elapsedSeconds;
    button.onclick = stop;
    if (secondsElapsed >= durationSeconds) {
      button.innerText = "Replace now!";
      button.style.backgroundColor = "red";
    } else {
      button.innerText = `${label}: On`;
      button.style.backgroundColor = "#cc4477";
    }
    interval = setInterval(tick, commonInterval);
  };

  function stop() {
    active = false;
    clearInterval(interval);
    button.innerText = `${label}: Off`;
    button.style.backgroundColor = "#FAE8E0";
    button.onclick = start;
  };

  button.onclick = start;
  return {
    stop,
    resume,
    getElapsed: function() { return secondsElapsed; },
    isActive: function() { return active; },
  };
};





const tamponTimer = createReminderTimer(tamponButton, "Tampon Timer", 6 * 60 * 60);
const mooncupTimer = createReminderTimer(mooncupButton, "Mooncup Timer", 12 * 60 * 60);



loadState();
