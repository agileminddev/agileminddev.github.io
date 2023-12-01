let resetString = null;
let timerString = "";
let active = null;
let alarming = false;

const getTimerValue = () => {
  const paddedTimerString = `0000${timerString}`.slice(-4);
  const mins = parseInt(paddedTimerString.slice(0, 2));
  const secs = parseInt(paddedTimerString.slice(-2));
  return [mins, secs];
}

const formatDigit = (id, index) => {
  let timerDigit = "";
  if (timerString.length > index) {
    const reversed = timerString.split("").reverse().join("");
    timerDigit = reversed.slice(index, index + 1);
  }
  const set = timerDigit.length > 0;

  const digitSpan = document.getElementById(id);
  if (set) {
    if (!id.endsWith("-label")) {
      digitSpan.innerHTML = timerDigit;
    }
    digitSpan.classList.remove("faded-fg");
  } else {
    if (!id.endsWith("-label")) {
      digitSpan.innerHTML = "0";
    }
    digitSpan.classList.add("faded-fg");
  }
}

const formatClock = () => {
  formatDigit("min-tens", 3);
  formatDigit("min-ones", 2);
  formatDigit("min-label", 2);
  formatDigit("sec-tens", 1);
  formatDigit("sec-ones", 0);
  formatDigit("sec-label", 0);
  updateActiveButtons();
}

const toggleElementVisibility = (id, display) => {
  const element = document.getElementById(id);
  if (element.style.display == "none") {
    element.style.display = display || "block";
  } else {
    element.style.display = "none";
  }
}

const isElementVisible = (id) => {
  const element = document.getElementById(id);
  return element.style.display != "none"
}

const toggleTenkey = () => {
  toggleElementVisibility("divider");
  toggleElementVisibility("tenkey", "grid");
}

const tenkeyPush = (value) => {
  if (active) {
    return;
  }

  timerString = `${timerString}${value}`.slice(-4);
  resetString = null;
  resetAnimation();
  formatClock();
}

const startAnimation = (seconds) => {
  if (seconds > 0) {
    console.log(`----starting animation: ${seconds}s`);
  } else {
    console.log("----restarting animation");
  }

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

const resetAnimation = () => {
  console.log("----reset animation");
  const countdown = document.getElementById("countdown");
  countdown.style["animation-duration"] = "unset";
  countdown.style["animation-play-state"] = "paused";
  countdown.style["animation-fill-mode"] = "none";
}

const backspacePush = () => {
  if (timerString == "" || active) {
    return;
  }

  timerString = timerString.slice(0, timerString.length - 1);
  resetString = null;
  resetAnimation();
  formatClock();
}

const escapePush = () => {
  if (active) {
    return;
  }

  timerString = "";
  resetString = null;
  resetAnimation();
  formatClock();
}

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

const timerExpired = () => {
  console.log('----------timerExpired');
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

var timeLeft = 0;
const stopTimer = (startButton) => {
  console.log('----------stopTimer');
  const button = startButton || document.getElementById("start");
  button.innerHTML = "Start";
  clearTimeout(active);
  timeLeft = 1000 - (new Date().getTime() - startTime);
  active = null;
  if (alarming) {
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
  document.getElementById("countdown").style["animation-play-state"] = "paused";
  document.getElementById("countdown-wrapper").classList.add("faded-bg");
}

const startPush = (startButton) => {
  console.log('----------start');
  if (active || alarming) {
    if (alarming) {
      resetAnimation();
    }
    stopTimer(startButton);
  } else {
    const [mins, secs] = getTimerValue();
    if (mins + secs == 0) {
      return;
    }

    const countdown = document.getElementById("countdown");
    let seconds = 0;
    if (!resetString) {
      resetString = timerString;
      seconds = mins * 60 + secs;
    }
    startAnimation(seconds);
    startButton.innerHTML = "Stop";
    document.getElementById("countdown-wrapper").classList.remove("faded-bg");
    if (timeLeft < 1) {
      timeLeft = 1000;
    }
    console.log(`-----starting with ${timeLeft}ms`);
    active = setTimeout(tick, timeLeft);
    timeLeft = 0;
  }
}

const resetPush = () => {
  console.log('----------reset');
  stopTimer();
  if (resetString) {
    resetAnimation();
    timerString = resetString;
    resetString = null;
    formatClock();
  }
}

const toggleSize = () => {
  const clock = document.getElementById("clock");
  clock.classList.toggle("big");
}

const updateActiveButtons = () => {
  const [mins, secs] = getTimerValue();
  document.getElementById("start").disabled = mins + secs == 0 && !alarming;
  document.getElementById("reset").disabled = !resetString;
}

const setupListeners = () => {
  // watch for tenkey from keyboard
  document.addEventListener("keydown", (event) => {
    console.log(event);
    const code = event.keyCode == 8 ? 46 : event.keyCode; // 8 and 46 are backspace/delete
    const key = document.getElementById(`key-${code}`);
    if (key && !active) {
      key.click();
    }
    if ("BUTTON" != document.activeElement.tagName) {
      if (code == 13) {
        startPush(document.getElementById("start"));
      }
    }
  }, false);

  // update buttons as needed
  document.addEventListener("click", (event) => {
    updateActiveButtons();
  }, false);
}
