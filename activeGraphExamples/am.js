/* global MathJax*/

//import browserProperties from '../../toolbox/src/util/NativeBrowserProperties.js';

const AM = window.AM || {};

const theConsole = console || {};
if (!theConsole.log) {
  theConsole.log = function () {};
}

AM.grey = '#CCCCCC';
AM.gray = '#CCCCCC';
AM.gold = '#FFCC00';
AM.red = '#CC0000';
AM.blue = '#0033FF';
AM.green = '#339966';
AM.pumpkin = '#FF9900';
AM.fuscia = '#FF00CC';
AM.fuchsia = '#FF00CC';
AM.purple = '#9900CC';
AM.darkGreen = '#006633';
AM.yellow = '#FFFF00';
AM.black = '#000000';
AM.white = '#FFFFFF';

// Crockford's thought about what typeof should return
// Testing Arrays is an issue since `value instanceof Array`
// may return false under gwt, so we actually check for array-ish-ness:
function typeOf(value) {
  let s = typeof value;
  if (s === 'object') {
    if (!value) {
      s = 'null';
    } else if (Array.isArray(value)) {
      s = 'array';
    }
  }
  return s;
}

// Throw descriptive error if value is not of given JavaScript type:
function assertType(value, type) {
  const t = typeOf(value);
  if (t !== type) {
    throw new Error(JSON.stringify(value) + ' has type: "' + t + '" rather than "' + type + '"');
  }
}

const ROUND_DECIMALS = 6;

// Rounds number `num` to nearest `ndecimals` decimal places.
function round(num, ndecimals) {
  let scale;
  if (!(ndecimals === 0 || ndecimals)) {
    ndecimals = ROUND_DECIMALS;
  }
  if (ndecimals >= 0) {
    scale = Math.pow(10, ndecimals);
    return Math.round(num * scale) / scale;
  } else {
    // if `ndecimals` < 0, invert meaning of scale to prevent divide errors
    scale = Math.pow(10, -ndecimals);
    return Math.round(num / scale) * scale;
  }
}

// Returns copy of `obj`, with all component numeric values replaced by round(...).
function roundObject(obj, ndecimals) {
  const type = typeOf(obj);
  if (type === 'number') {
    return round(obj, ndecimals);
  } else if (type === 'array') {
    const newobj = [];
    for (let i = obj.length - 1; i >= 0; --i) {
      newobj[i] = roundObject(obj[i], ndecimals);
    }
    return newobj;
  } else if (type === 'object') {
    const newobj = {};
    // Own enumerable property names
    for (const name of Object.keys(obj)) {
      newobj[name] = roundObject(obj[name], ndecimals);
    }
    return newobj;
  }
  return obj;
}

const ROUND_PRECISION = 6;

// Rounds number `num` to nearest `precision` significant digits.
function roundPrecision(num, precision) {
  if (num === 0) {
    return num;
  }
  precision = precision || ROUND_PRECISION;
  const exp = Math.ceil(Math.log(num < 0 ? -num : num) / Math.LN10);
  const scale = Math.pow(10, precision - exp);
  const shifted = Math.round(num * scale);
  // If `scale` < 1 (e.g., 0.00001), dividing by `scale` can cause roundoff,
  // so we multiply by its inverse, which is an integer.
  // When `scale` > 1 we are dividing by an integer which should evenly divide `shifted`.
  return scale > 1 ? shifted / scale : shifted * Math.pow(10, exp - precision);
}

// Returns first argument that is not empty or that === 0.
function coalesce(v1, v2) {
  return v1 || v1 === 0 ? v1 : v2;
}

function removeArrayElement(array, element) {
  if (array) {
    const i = array.indexOf(element);
    if (i >= 0) {
      array.splice(i, 1);
    }
  }
}

// Return a shallow copy of `obj`
function copy(obj) {
  if (obj) {
    if (Array.isArray(obj)) {
      return obj.slice();
    } else if (obj && typeof obj === 'object') {
      const cpy = {};
      // Own enumerable property names
      for (const prop of Object.keys(obj)) {
        cpy[prop] = obj[prop];
      }
      return cpy;
    }
  }
  return obj;
}

/* Return a deep copy of `obj`
 * @param {Object} obj Return a deep copy of this object
 * @return {Object} the deep copy
 */
function deepCopy(obj) {
  if (obj) {
    if (Array.isArray(obj)) {
      return Array.from(obj, (value) => deepCopy(value));
    } else if (obj && typeof obj === 'object') {
      const deepcpy = {};
      // Own enumerable property names
      for (const p of Object.keys(obj)) {
        deepcpy[p] = deepCopy(obj[p]);
      }
      return deepcpy;
    }
  }
  return obj;
}

// Return new object with just the named properties of `source`.
function copyProps(source, ...propertyNames) {
  const cpy = {};
  if (source) {
    for (const p of propertyNames) {
      const v = source[p];
      if (v !== undefined) {
        cpy[p] = v;
      }
    }
  }
  return cpy;
}

// Copies `src`'s properties to `dest`,
// overriding any previous `dest` values for each copied property.
// `dest` is not copied--it directly receives the new properties.
// Additional arguments, specify particular properties to copy.
// If no property names are provided, all `src` properties are copied.
// Returns the updated `dest`.
function copyTo(src, dest, ...propertyNames) {
  if (propertyNames.length > 0) {
    for (const p of propertyNames) {
      dest[p] = src[p];
    }
  } else {
    // Own enumerable property names
    for (const p of Object.keys(src)) {
      dest[p] = src[p];
    }
  }
  return dest;
}

// Array.slice, but applicable to `arguments` objects.
// ** DEPRECATED: `arguments` is obsolete
function copySlice(array, from, to) {
  return Array.prototype.slice.call(array, from, to);
}

/* Copies all of `donor`'s own properties to `recipient`,
 * overriding any previous `recipient` values for each copied property.
 * `recipient` is not copied--it directly receives the new properties.
 * @param {Object} recipient  Add donor properties to this object
 * @return {Object} the updated `recipient`.
 */
function addTo(recipient, donor) {
  recipient = recipient || {};
  if (donor) {
    // Own enumerable property names
    for (const name of Object.keys(donor)) {
      recipient[name] = donor[name];
    }
  }
  return recipient;
}

/**
 * Essentially `Object.assign({}, ...components)`, except that the own properties of
 * joined components are recursively joined.
 * Note that later property values override earlier property values.
 * @param {Object} components   Objects to be joined.
 * @return {Object} the joined object.
 */
function join(...components) {
  const joyn = {};
  for (const component of components) {
    for (const prop of Object.keys(component)) {
      const joynValue = joyn[prop];
      const componentValue = component[prop];
      if (componentValue || componentValue === 0) {
        if (joynValue && typeOf(joynValue) === 'object' && typeOf(componentValue) === 'object') {
          joyn[prop] = join(joynValue, componentValue);
        } else {
          joyn[prop] = componentValue;
        }
      }
    }
  }
  return joyn;
}

// Push the own property values of `obj` onto the `values` array
// ** DEPRECATED: use Object.values(obj) instead
function getValues(obj, values) {
  return Object.values(obj); // Own enumerable property values
}

// Return the "own" properties of `obj`
// ** DEPRECATED: use Object.keys(obj) instead
function getProperties(obj) {
  return Object.keys(obj); // Own enumerable property names
}

// Like Array.map, but returns input array if there is no callback.
// ** DEPRECATED: use `Object.prototype.map` instead
function map(array, mapFunction) {
  if (!array) {
    return array;
  } else {
    return array.map(mapFunction);
  }
}

// Return the result of applying a named method to a set of arguments
// ** DEPRECATED: not used???
function mapCall(targets, methodName, ...methodArgs) {
  if (!targets) {
    return targets;
  }
  const results = [];
  for (let i = 0; i < targets.length; ++i) {
    const obj = targets[i];
    const result = obj[methodName](...methodArgs);
    results.push(result);
  }
  return results;
}

// Apply a function to each value in an array
// ** DEPRECATED: use lodash `each` instead
function each(array, fctn) {
  if (array) {
    for (let i = 0; i < array.length; ++i) {
      fctn.call(null, array[i]);
    }
  }
}

// Return the result pr applying a named method to a set of arguments
// ** DEPRECATED: not used???
function callEach(objects, method, ...methodArgs) {
  if (objects) {
    for (let i = 0; i < objects.length; ++i) {
      const obj = objects[i];
      obj[method](...methodArgs);
    }
  }
}

// Return `learURL` appended with a final '/' if not present
function normalizeLeadURL(leadURL) {
  let url = leadURL;
  if (leadURL && leadURL.charAt(leadURL.length - 1) !== '/') {
    url = leadURL + '/';
  }
  // theConsole.log('Normlized URL: "' + leadURL + '" --> "' + url + '"');
  return url;
}

const ABSOLUTE_URL_REGEX = /^(?:[-\w_]+:[:\-\w_]*)?\//;

function toAbsoluteURL(leadURL, relURL) {
  let url;
  const type = typeof relURL;
  if (type === 'function') {
    url = function () {
      return toAbsoluteURL(leadURL, relURL());
    };
  } else if (!relURL || type !== 'string') {
    throw new Error('Cannot convert non-string URL to absolute URL');
  } else if (!leadURL) {
    url = relURL; // This handles case where absolute URL not provided
  } else if (ABSOLUTE_URL_REGEX.test(relURL)) {
    // Is relURL an absolute URL or Base 64 image?
    url = relURL;
  } else {
    url = normalizeLeadURL(leadURL) + relURL;
  }
  // theConsole.log('Absolute URL "' + leadURL + '" + "' + relURL + '" --> "' + url + '"');
  return url;
}

const JAX_WAIT = 100; // MS to wait before retrieving MathJax elements

/**
  Make a function to dynamically update a MathJax math expression
  @method  makeMathUpdater
  @param {function} getMath  Function that creates dynamic math text, e.g.
            function() {
              return '<math><mstyle displaystyle="true"><mi>x</mi><mo>=</mo><mn>'
                   + slider.Value().toFixed(2)
                   + '</mn></style></math>';
            }
  @param {Element|Id} elementOrId   The DOM element containing math or its ID
  @param {number}     index         Index of math elementJax in DOM element (0 if there is just one, the default)
  @param {function}   callback      Optional function called after MathJax is done rendering
  @return {function}  The function for updating the MathJax math expression
*/
function makeMathUpdater(getMath, elementOrId, index, callback) {
  // Be careful that at most 1 update to `elementOrId` is in flight
  let jax = null;
  let jaxTries = 4;
  let waiting = 0;
  function mathjaxCB() {
    if (waiting <= 1) {
      waiting = 0;
      if (callback) callback();
    } else {
      waiting = 1;
      // Skip the queue since MathJax should be ready
      jax.Text(getMath(), mathjaxCB);
    }
  }
  function updater() {
    if (jax) {
      if (waiting > 0) {
        ++waiting;
      } else {
        waiting = 1;
        // Skip the queue since MathJax should be ready
        jax.Text(getMath(), mathjaxCB);
      }
    }
  }
  function init() {
    setTimeout(function () {
      MathJax.Hub.Queue(
        function () {
          jax = MathJax.Hub.getAllJax(elementOrId)[index || 0];
          if (!jax && --jaxTries <= 0) {
            const elementId = typeof elementOrId === 'string' ? elementOrId : elementOrId.itemId;
            throw new Error(`Could not find jax for element: ${elementId}`);
          }
        },
        function () {
          if (jax) {
            // Give MathJax a time to set up and load:
            MathJax.Hub.Queue(['Text', jax, getMath(), callback]);
          } else {
            init();
          }
        }
      );
    }, JAX_WAIT);
  }
  init();
  return updater;
}

const IS_COUNTING = 0;
const IS_PAUSED = 1;
const IS_DONE = 2;
const STATUS_NAMES = ['isCounting', 'isPaused', 'isDone'];

class PausingTimeout {
  constructor() {}

  // So old-style classes can mixin PausingTimeout behavior:
  init(thenCallFunction, millis, isPaused) {
    if (millis === undefined || millis < 0) {
      millis = 0;
    }
    this.millis = millis;
    this.thenCallFunction = thenCallFunction;
    if (isPaused) {
      this.status = IS_PAUSED;
      this.startTime = 0;
      this.timeoutId = 0;
    } else {
      this.status = IS_COUNTING;
      this.startTime = Date.now();
      this.timeoutId = setTimeout(() => this.action(), millis);
    }
  }

  static make(thenCallFunction, millis, isPaused) {
    const pauser = new PausingTimeout();
    pauser.init(thenCallFunction, millis, isPaused);
    return pauser;
  }

  action() {
    this.timeoutId = 0;
    this.status = IS_DONE;
    this.deactivate();
    this.thenCallFunction();
  }

  onPause() {
    if (this.status === IS_COUNTING) {
      clearTimeout(this.timeoutId);
      this.timeoutId = 0;
      this.millis = Math.max(this.startTime + this.millis - Date.now(), 0);
      this.status = IS_PAUSED;
    }
  }

  onResume() {
    if (this.status === IS_PAUSED) {
      this.status = IS_COUNTING;
      this.startTime = Date.now();
      this.timeoutId = setTimeout(() => this.action(), this.millis);
    }
  }

  // Handles internal aspects of being "done"
  onDone() {
    if (this.status !== IS_DONE) {
      if (this.status === IS_COUNTING) {
        clearTimeout(this.timeoutId);
        this.timeoutId = 0;
      }
      this.status = IS_DONE;
      this.deactivate();
    }
  }

  // Hook to do any external cleanup
  deactivate() {}

  toString() {
    const d = 'PausingTimeout';
    const s = STATUS_NAMES[this.status];
    switch (this.status) {
      case IS_DONE:
        return d + s;
      case IS_COUNTING:
        return d + s + ' remaining: ' + (Date.now() - this.startTime);
      case IS_PAUSED:
        return d + s + ' remaining: ' + this.millis;
    }
  }
}

/**
 * Prevent default touch actions for browsers where this is problematic (i.e., IE).
 * @param {Element|Id} elementOrId  Element (or element ID) whose default touch actions are to be stopped
 */
function checkPreventDefaults(elementOrId) {
  if (browserProperties.hasTouchAPI() && browserProperties.isWindows()) {
    const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
    if (!element) {
      throw new Error('element not found: ' + elementOrId);
    }
    element.style['-ms-touch-action'] = 'none';
    element.style['touch-action'] = 'none';
  }
}

// elementOrId: DOM Element or ID for DOM Element to receive click events
// handler:     Click handler function
function setOnClick(elementOrId, handler) {
  const CLICK_DELTA = 8;
  const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  let startx;
  let starty;
  let inTouch = false;

  function checkTouch(evt) {
    if (!inTouch) {
      return false;
    }
    const touches = evt.changedTouches;
    return (
      touches.length === 1 &&
      Math.abs(startx - touches[0].clientX) <= CLICK_DELTA &&
      Math.abs(starty - touches[0].clientY) <= CLICK_DELTA
    );
  }

  function signalClick(evt) {
    const e = document.createEvent('MouseEvents');
    e.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      evt.screenX,
      evt.screenY,
      evt.clientX,
      evt.clientY,
      evt.ctrlKey || false,
      evt.altKey || false,
      evt.shiftKey || false,
      evt.metaKey || false,
      evt.button || 0,
      evt.relatedTarget || evt.target
    );
    element.dispatchEvent(e);
  }

  if (element && handler) {
    element.addEventListener('click', handler);
    if (browserProperties.hasTouchAPI()) {
      element.addEventListener(
        'touchstart',
        function (evt) {
          const touches = evt.changedTouches;
          if (touches.length === 1) {
            startx = touches[0].clientX;
            starty = touches[0].clientY;
            inTouch = true;
          } else {
            inTouch = false;
          }
        },
        false
      ); // Event listener capture
      element.addEventListener(
        'touchmove',
        function (evt) {
          if (!checkTouch(evt)) {
            inTouch = false;
          }
        },
        false
      ); // Event listener capture
      element.addEventListener(
        'touchend',
        function (evt) {
          if (checkTouch(evt)) {
            evt.preventDefault();
            evt.stopPropagation();
            signalClick(evt);
          }
          inTouch = false;
        },
        true
      ); // Event listener capture
    }
  }
  return element;
}

function setOnChange(elementOrId, handler) {
  const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  if (element) {
    element.onchange = handler;
  }
  return element;
}

(function () {
  const WHITESPACE_REGEX = /\s+/g;
  AM.collapseSpaces = function (str) {
    return typeof str === 'string' ? str.trim().replace(WHITESPACE_REGEX, ' ') : null;
  };
})();

AM.typeOf = typeOf;
AM.assertType = assertType;
AM.checkType = assertType;
AM.round = round;
AM.roundObject = roundObject;
AM.roundPrecision = roundPrecision;
AM.coalesce = coalesce;
AM.removeArrayElement = removeArrayElement;
AM.slice = Array.prototype.slice; // Applicable to array-like objects, eg `arguments`
AM.copy = copy;
AM.copyTo = copyTo;
AM.deepCopy = deepCopy;
AM.copyProps = copyProps;
AM.copySlice = copySlice;
AM.addTo = addTo;
AM.join = join;
AM.getValues = getValues;
AM.getProperties = getProperties;
AM.map = map;
AM.mapCall = mapCall;
AM.each = each;
AM.callEach = callEach;
AM.normalizeLeadURL = normalizeLeadURL;
AM.toAbsoluteURL = toAbsoluteURL;
AM.makeMathUpdater = makeMathUpdater;
AM.PausingTimeout = PausingTimeout;
AM.isArray = Array.isArray;
AM.setOnClick = setOnClick;
AM.setOnChange = setOnChange;
AM.checkPreventDefaults = checkPreventDefaults;
AM.IS_SAFARI_MOBILE = browserProperties.hasTouchAPI(); // Deprecated in favor of HAS_TOUCH_API
AM.HAS_TOUCH_API = browserProperties.hasTouchAPI();
AM.IS_WINDOWS_TOUCH_OS = browserProperties.hasTouchAPI() && browserProperties.isWindows();

// Need general event listener ala VizEventListener.
// Event listening setTimeout (PausingEventListener)
// Event listening setInterval
// On first use redefine JXG.Board.addAnimation to use event listening interval
// " " " "               JSX.Board.stopAllAnimation
// " " " "               JSX.Board.animate

(function () {
  let _activeAnimations = [];

  function addAnimator(animator) {
    const i = _activeAnimations.indexOf(animator);
    if (i < 0) {
      _activeAnimations.push(animator);
    }
  }

  function Timer(timerFn, interval, limit, callback) {
    let count = 0;
    let intervalID = window.setInterval(() => {
      if (!intervalID) {
        return;
      }
      if (limit < 0 || count < limit) {
        timerFn(this);
        ++count;
      } else {
        window.clearInterval(intervalID);
        intervalID = null;
        if (callback) {
          callback();
        }
      }
    }, interval);
    this.cancel = function () {
      if (intervalID) {
        window.clearInterval(intervalID);
        intervalID = null;
        if (callback) {
          callback();
        }
      }
    };
    this.setFn = function (fn) {
      timerFn = fn;
    };
    this.getCount = function () {
      return count;
    };
  }

  class AnimatorTimeout extends PausingTimeout {
    constructor(stepper, fun, millis, isPaused) {
      super();
      this.init(fun, millis, isPaused);
      this.stepper = stepper;
    }

    deactivate() {
      this.stepper._removeTimeout(this);
    }
  }

  // Animator presents a series of GeometryElement animations.
  // Animators are built as a series of steps.
  // Steps are executed sequentially--when a step completes the next step begins.
  // A step can cancel the operation of future steps.
  // An animator itself may have a callback.
  // Callbacks are called when the animator completes, even if cancelled.
  // Steps can register GeometryElements they create using the `stepper.memo` method.
  // This creates a list of GeometryElements that can be cleared from the board.
  // Thus, one can clear the GeometryElements associated with a particular Animator,
  // leaving other GemoetryElements on the board.
  // millis:  Default duration for component animations.

  const DEFAULT_STEP_MILLIS = 2000;
  // Stepper states:
  const IS_NEW = 0;
  const IS_STARTED = 1;
  const IS_SUSPENDING = 2;
  const IS_SUSPENDED = 3;
  const IS_DONE = 4;
  let animatorCount = 0;

  class Animator {
    constructor(millis) {
      this.stepper = new Stepper(this, millis);
      addAnimator(this);
    }

    static suspendAll() {
      for (let i = 0, len = _activeAnimations.length; i < len; ++i) {
        _activeAnimations[i].suspend();
      }
    }

    static resetAll(callback) {
      for (let i = 0, len = _activeAnimations.length; i < len; ++i) {
        _activeAnimations[i].reset();
      }
      _activeAnimations = [];
      if (callback) {
        callback();
      }
    }

    start() {
      this.stepper.start();
    }

    restart() {
      this.stepper.clear();
      this.stepper.reset();
      this.stepper.start();
    }

    reset() {
      this.stepper.reset();
    }

    suspend() {
      this.stepper.suspend();
    }

    clear() {
      this.stepper.clear();
    }

    addStep(step) {
      this.stepper.addStep(step);
    }

    callback(cb) {
      this.stepper.callback = cb;
    }
  }

  class Stepper {
    constructor(animator, millis) {
      this.init();
      this.animator = animator;
      this.id = ++animatorCount;
      this.steps = [];
      this.callback = null;
      this.parent = null;
      this.millis = millis === undefined ? DEFAULT_STEP_MILLIS : millis;
      this.memoElements = [];
      this.animatedElements = null;
      this.elementSteppers = null;

      this._nextCB = () => {
        this._nextStep();
      }; // Convenient closure for callbacks
    }

    // Useful debugging function to generate 'next' callbacks & log wait info:
    // function animatorNext(stepper, msg, nextFun) {
    //     // The log message needs the current step index, but current waiting
    //     var logmsg = 'step ' + stepper.id + '.' + stepper.stepIndex + ': ' + msg;
    //     theConsole.log('> ' + logmsg + ' waiting:' + stepper.waiting);
    //     return function()  {
    //         theConsole.log('< ' + logmsg + ' waiting:' + stepper.waiting);
    //         (nextFun || stepper.nextStep).call(stepper);
    //     };
    // }

    init() {
      this.stepIndex = 0;
      this.waiting = 0;
      this.status = IS_NEW;
      this.suspendCallback = null;
      this.children = null;
      this.timeouts = [];
    }

    setTimeout(fun, millis) {
      const t = new AnimatorTimeout(this, fun, millis, this.status !== IS_STARTED);
      this.timeouts.push(t);
    }

    _removeTimeout(t) {
      removeArrayElement(this.timeouts, t);
    }

    _cancelAllTimeouts() {
      let i = this.timeouts.length;
      while (--i >= 0) {
        this.timeouts[i].onDone();
      }
    }

    _resumeAllTimeouts() {
      let i = this.timeouts.length;
      while (--i >= 0) {
        this.timeouts[i].onResume();
      }
    }

    _pauseAllTimeouts() {
      let i = this.timeouts.length;
      while (--i >= 0) {
        this.timeouts[i].onPause();
      }
    }

    start() {
      if (this.status === IS_SUSPENDED || this.status === IS_SUSPENDING) {
        this.STATUS = IS_STARTED;
        let i = this.children ? this.children.length : 0;
        this._resumeAllTimeouts();
        if (i > 0) {
          while (--i >= 0) {
            this.children[i].start();
          }
        }
        if (this.status !== IS_SUSPENDING) {
          this.nextStep();
        }
      } else if (this.status !== IS_STARTED) {
        this.status = IS_STARTED;
        this.animatedElements = this.parent ? this.parent.animatedElements : {};
        this.elementSteppers = this.parent ? this.parent.elementSteppers : {};
        this.nextStep();
      }
    }

    nextStep() {
      setTimeout(this._nextCB, 0); // Calls _nextCB step in a timeout
    }

    _nextStep() {
      if (this.status === IS_DONE) {
        return;
      }
      if (this.waiting > 0) {
        --this.waiting;
      }
      if (this.waiting > 0) {
        return;
      }
      if (this.stepIndex < this.steps.length) {
        // Use while in case some step is not really an animation
        // --waiting would not be incremented so just go on to next step.
        while (this.waiting === 0 && this.stepIndex < this.steps.length) {
          if (this.status === IS_SUSPENDING) {
            this._suspend();
            return;
          }
          const step = this.steps[this.stepIndex];
          ++this.stepIndex;
          step(this);
        }
      } else {
        if (this.parent) {
          this.parent._removeChild(this);
        }
        AM.removeArrayElement(_activeAnimations, this.animator);
        this._cancelAllTimeouts();
        this.status = IS_DONE;
        if (this.callback) {
          this.callback();
        }
      }
    }

    _elementCleanup(id) {
      const steppers = this.elementSteppers[id];
      let i = steppers ? steppers.length : 0;
      if (steppers) {
        this.elementSteppers[id] = null;
        delete this.elementSteppers[id];
      }
      if (this.animatedElements[id]) {
        this.animatedElements[id] = null;
        delete this.animatedElements[id];
      }
      while (--i >= 0) {
        // theConsole.log('< Element cleanup: [' + steppers.length + '] ' + id + " in " + steppers[i].id);
        steppers[i]._nextStep();
      }
    }

    // Tracks this animated element and sets option callback as necessary
    _addAnimatedElement(el, options) {
      const id = el.id;
      const prevSteppers = this.elementSteppers[id];
      this.animatedElements[id] = el;
      if (prevSteppers) {
        prevSteppers.push(this);
      } else {
        this.elementSteppers[id] = [this];
      }
      options = options || {};
      options.callback = () => {
        this._elementCleanup(id);
      };
      ++this.waiting;
      return options;
    }

    addStep(step) {
      this.steps.push(step);
    }

    moveTo(point, xy, millis, options) {
      if (millis === null || millis === undefined) {
        millis = this.millis;
      }
      point.moveTo(xy, millis, this._addAnimatedElement(point, options));
    }

    moveToValue(glider, value, millis, options) {
      if (millis === null || millis === undefined) {
        millis = this.millis;
      }
      glider.moveToValue(value, millis, this._addAnimatedElement(glider, options));
    }

    moveLine(line, xy1, xy2, millis) {
      const movep1 = xy1[0] !== line.point1.X() || xy1[1] !== line.point1.Y();
      const movep2 = xy2[0] !== line.point2.X() || xy2[1] !== line.point2.Y();
      if (movep1) {
        this.moveTo(line.point1, xy1, millis);
      }
      if (movep2) {
        this.moveTo(line.point2, xy2, millis);
      }
    }

    animate(element, attributes, millis) {
      // We handle tracking complete animate action with a timer, not using _addAnimatedElement
      // so that property animation is not tied to movement animation
      this.animatedElements[element.id] = element;
      // Need callback in case element has moving animation as well:
      const options = {
        callback: () => {
          this._elementCleanup(element.id);
        },
      };
      element.animate(attributes, millis, options);
      ++this.waiting;
      this.setTimeout(this._nextCB, millis);
    }

    timer(fn, interval, limit) {
      ++this.waiting;
      return new Timer(fn, interval, limit, this._nextStep);
    }

    pause(millis) {
      // Pause really just sets the minimum duration of the step:
      if (millis > 0) {
        ++this.waiting;
        this.setTimeout(this._nextCB, millis);
      }
    }

    runAnimator(a) {
      ++this.waiting;
      a.callback(this._nextCB);
      this._addChild(a.stepper);
      a.start();
    }

    _addChild(stepper) {
      if (stepper.parent !== this) {
        if (!this.children) {
          this.children = [stepper];
        } else {
          this.children.push(stepper);
        }
        stepper.parent = this;
      }
    }

    _removeChild(stepper) {
      if (stepper.parent === this && this.children) {
        AM.removeArrayElement(this.children, stepper);
      }
    }

    memo(...geometryElements) {
      const len = geometryElements.length;
      for (let i = 0; i < len; ++i) {
        const element = geometryElements[i];
        this.memoElements.push(element);
      }
    }

    clear() {
      // Remove board memoElements in reverse order because of possible element dependencies.
      // Does this matter?
      let i = this.memoElements.length;
      while (--i >= 0) {
        this.memoElements[i].remove();
      }
      this.memoElements = [];
    }

    stopAnimations() {
      for (const id of Object.keys(this.animatedElements)) {
        const el = this.animatedElements[id];
        if (el.board.animationObjects[id]) {
          el.board.animationObjects[id] = null;
          delete el.board.animationObjects[id];
        }
      }
      this.animatedElements = {};
    }

    reset(resetCallback) {
      this.init();
      this.stopAnimations();
      this._cancelAllTimeouts();
      resetCallback = resetCallback || this.resetCallback;
      if (resetCallback) {
        this.resetCallback = null;
        resetCallback();
      }
    }

    suspend(suspendCallback) {
      if (this.status === IS_STARTED) {
        this.status = IS_SUSPENDING;
        this.suspendCallback = suspendCallback;
        let i = this.children ? this.children.length : 0;
        while (--i >= 0) {
          this.children[i].suspend();
        }
        this._pauseAllTimeouts();
      } else if (suspendCallback) {
        // suspendCallback();
      }
    }

    _suspend() {
      this.status = IS_SUSPENDED;
      const callback = this.suspendCallback;
      if (callback) {
        this.suspendCallback = null;
        callback();
      }
    }
  }

  AM.Timer = Timer;
  AM.Animator = Animator;
})();

//export default AM;
