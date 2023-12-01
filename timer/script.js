// string to use when resetting
let resetString = null;
// current timer
let timerString = "";
// running timer
let active = null;
// true when timer hits zero but before acked
let alarming = false;

// convert timer string into minutes and seconds
const getTimerValue = () => {
  const paddedTimerString = `0000${timerString}`.slice(-4);
  const mins = parseInt(paddedTimerString.slice(0, 2));
  const secs = parseInt(paddedTimerString.slice(-2));
  return [mins, secs];
}

// format given digit
const formatDigit = (id, index) => {
  // pluck digit from string
  let timerDigit = "";
  if (timerString.length > index) {
    const reversed = timerString.split("").reverse().join("");
    timerDigit = reversed.slice(index, index + 1);
  }
  // was it entered or not?
  const set = timerDigit.length > 0;

  // update the proper digit on the screen
  const digitSpan = document.getElementById(id);
  if (set) {
    // digit entered by user
    if (!id.endsWith("-label")) {
      digitSpan.innerHTML = timerDigit;
    }
    digitSpan.classList.remove("faded-fg");
  } else {
    // placeholder digit
    if (!id.endsWith("-label")) {
      digitSpan.innerHTML = "0";
    }
    digitSpan.classList.add("faded-fg");
  }
}

// redraw the timer
const formatClock = () => {
  formatDigit("min-tens", 3);
  formatDigit("min-ones", 2);
  formatDigit("min-label", 2);
  formatDigit("sec-tens", 1);
  formatDigit("sec-ones", 0);
  formatDigit("sec-label", 0);
  updateActiveButtons();
}

// hide or show the element
const toggleElementVisibility = (id, display) => {
  const element = document.getElementById(id);
  if (element.style.display == "none") {
    element.style.display = display || "block";
  } else {
    element.style.display = "none";
  }
}

// is the element shown?
const isElementVisible = (id) => {
  const element = document.getElementById(id);
  return element.style.display != "none"
}

// show/hide the keypad section
const toggleTenkey = () => {
  toggleElementVisibility("divider");
  toggleElementVisibility("tenkey", "grid");
}

// a digit was pushed
const tenkeyPush = (value) => {
  if (active) {
    return;
  }

  timerString = `${timerString}${value}`.slice(-4);
  resetString = null;
  resetAnimation();
  formatClock();
}

// start the countdown bar
const startAnimation = (seconds) => {
  let countdown = document.getElementById("countdown");
  if (seconds > 0) {
    // create and replace element to actually restart animation
    countdown.style["animation"] = `timerBar ${seconds}s linear forwards`;
    const newCountdown = countdown.cloneNode(true);
    countdown.parentNode.replaceChild(newCountdown, countdown);
    countdown = newCountdown;
  }
  countdown.style["animation-play-state"] = "running";
}

// stop reset the animation
const resetAnimation = () => {
  const countdown = document.getElementById("countdown");
  countdown.style["animation-duration"] = "unset";
  countdown.style["animation-play-state"] = "paused";
  countdown.style["animation-fill-mode"] = "none";
}

// backspace or delete was pushed
const backspacePush = () => {
  if (timerString == "" || active) {
    return;
  }

  timerString = timerString.slice(0, timerString.length - 1);
  resetString = null;
  resetAnimation();
  formatClock();
}

// escape key was pushed
const escapePush = () => {
  if (active) {
    return;
  }

  timerString = "";
  resetString = null;
  resetAnimation();
  formatClock();
}

// initialize audio
let audioElement = null;
let audioContext = null;
const initAudio = () => {
  if (audioElement) {
    return;
  }
  audioElement = document.querySelector("audio");
  audioContext = new AudioContext();
  audioContext.createMediaElementSource(audioElement).connect(audioContext.destination);
}

// active timer just hit zero
const timerExpired = () => {
  alarming = true;
  document.getElementById("start").innerHTML = "OK";
  document.getElementById("clock").classList.add("alarming-bg");
  document.getElementById("min-tens").classList.add("alarming-fg");
  document.getElementById("min-ones").classList.add("alarming-fg");
  document.getElementById("min-label").classList.add("alarming-fg");
  document.getElementById("sec-tens").classList.add("alarming-fg");

  initAudio();
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  audioElement.play();
  formatClock();
}

// tick is the method that gets called every second
var startTime = 0;
const tick = () => {
  startTime = new Date().getTime();
  let [mins, secs] = getTimerValue();

  // first update display
  if (secs > 0) {
    secs = secs - 1;
  } else {
    mins = mins - 1;
    secs = 59;
  }
  timerString = `${mins * 100 + secs}`;
  formatClock();

  // alert if done, else tick down another second
  if (mins + secs == 0) {
    // wait a ms to allow screen to update
    setTimeout(() => { timerExpired() }, 1);
  } else {
    active = setTimeout(tick, 1000);
  }
}

// stop button was hit
var timeLeft = 0;
const stopTimer = (startButton) => {
  // update label
  const button = startButton || document.getElementById("start");
  button.innerHTML = "Start";

  // cancel 1 second timer
  clearTimeout(active);
  active = null;

  // figure out how many millis left in the current second if need to restart
  timeLeft = 1000 - (new Date().getTime() - startTime);

  if (alarming) {
    // the alarm is going off -- shut it all down
    audioElement.pause();
    audioContext.suspend();
    audioElement.currentTime = 0
    alarming = false;
    timerString = "";
    document.getElementById("clock").classList.remove("alarming-bg");
    document.getElementById("min-tens").classList.remove("alarming-fg");
    document.getElementById("min-ones").classList.remove("alarming-fg");
    document.getElementById("min-label").classList.remove("alarming-fg");
    document.getElementById("sec-tens").classList.remove("alarming-fg");
    formatClock();
  }

  // pause the countdown bar
  document.getElementById("countdown").style["animation-play-state"] = "paused";
  document.getElementById("countdown-wrapper").classList.add("faded-bg");
}

// start/stop/ok button pushed
const startPush = (startButton) => {
  if (alarming) {
    // alarm is going off
    resetAnimation();
    stopTimer(startButton);
  } else if (active) {
    // pause the timer
    stopTimer(startButton);
  } else {
    // nothing else is happening -- start the timer
    const [mins, secs] = getTimerValue();
    if (mins + secs == 0) {
      // okay, the user hasn't entered any time so nothing to do
      return;
    }

    // how many seconds on the timer?
    let seconds = 0;
    if (!resetString) {
      // remember the starting point if there isn't one
      resetString = timerString;
      seconds = mins * 60 + secs;
    }
    // restart the timer
    startAnimation(seconds);
    startButton.innerHTML = "Stop";
    const countdown = document.getElementById("countdown");
    document.getElementById("countdown-wrapper").classList.remove("faded-bg");
    if (timeLeft < 1) {
      // if the millis from the last go-around are close to zero just restart at a second
      timeLeft = 1000;
    }
    // start timer chain
    active = setTimeout(tick, timeLeft);
    timeLeft = 0;
  }
}

// reset button pushed
const resetPush = () => {
  stopTimer();
  if (resetString) {
    resetAnimation();
    timerString = resetString;
    resetString = null;
    formatClock();
  }
}

// make big or small
const toggleSize = () => {
  const clock = document.getElementById("clock");
  clock.classList.toggle("big");
}

// enable/disable start/reset buttons
const updateActiveButtons = () => {
  const [mins, secs] = getTimerValue();
  document.getElementById("start").disabled = mins + secs == 0 && !alarming;
  document.getElementById("reset").disabled = !resetString;
  // should probably enable/disable tenkey as well
  const keys = [27, 46, ...Array.from({ length: 10 }, (_, index) => 48 + index)];
  for (const key of keys) {
    document.getElementById(`key-${key}`).disabled = alarming || active;
  }
}

// initialize listeners
const setupListeners = () => {
  // watch for input from keyboard
  document.addEventListener("keydown", (event) => {
    const code = event.keyCode == 8 ? 46 : event.keyCode; // 8 and 46 are backspace/delete

    // 0-9 named for the keycodes
    const key = document.getElementById(`key-${code}`);
    if (key && !active) {
      key.click();
    }

    // if return pressed when a button doesn't have the focus
    if ("BUTTON" != document.activeElement.tagName && code == 13) {
      startPush(document.getElementById("start"));
    }
  }, false);

  // update buttons as needed
  document.addEventListener("click", (event) => {
    updateActiveButtons();
  }, false);
}
