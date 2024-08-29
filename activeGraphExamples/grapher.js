//import JXG from '../../../jsxgraph/jsxgraphcore.1.0.js';
//import AM from 'am.js';
//import browserProperties from 'NativeBrowserProperties.js';

//const theConsole = console || {};
if (!theConsole.log) theConsole.log = function () {};

const AMGrapherDefs = window.AMGrapherDefs || {};
window.AMGrapherDefs = AMGrapherDefs;
const _agile = window._agile || (window._agile = {});
const _amExports = _agile._amExports || (_agile._amExports = {});
_amExports.AMGrapherDefs = AMGrapherDefs;

// Constants:
const RESPONSE_DURATION_MILLIS = 2000;
const COMPOSITE_IMAGE_LAYER = 8;
const COMPOSITE_LABEL_LAYER = 9;
const COMPOSITE_ELEMENT_LAYER = 10;

const graphers = {};
AM.grapherDefs = AM.grapherDefs || {};

const GLIDER_DEFAULTS = {
  size: 8,
  face: 'o',
  strokeWidth: 1,
};
const GRID_DEFAULTS = {
  strokeColor: AM.gray,
  strokeOpacity: '1',
};
const LINE_DEFAULTS = {
  highlight: false,
  strokeWidth: 3,
  strokeColor: AM.red,
};
const CURVE_DEFAULTS = LINE_DEFAULTS;
const IMAGE_DEFAULTS = { highlight: false };
const POINT_DEFAULTS = {
  showInfobox: true,
  size: 8,
  face: 'o',
  fillColor: AM.red,
  strokeColor: AM.black,
  strokeWidth: 1,
};
const SLIDER_DEFAULTS = {
  name: '',
  withLabel: false,
  snapWidth: 0.05,
  strokeColor: AM.black,
  fillColor: 'white',
  face: 'o',
  size: 6,
};
const TEXT_DEFAULTS = {
  fixed: true, // fixes bizarre text element dragability bug -- trac 8670.
  highlight: false,
};
const TICKS_DEFAULTS = {
  insertTicks: false,
  minorTicks: 0,
  minorheight: 4,
  majorHeight: 7,
  drawLabels: true,
  drawZero: false,
  strokeOpacity: 1,
  strokeWidth: 1,
  strokeColor: AM.black,
  highlight: false,
  tickEndings: [1, 1],
};
const AXIS_DEFAULTS = {
  ticks: TICKS_DEFAULTS,
  strokeColor: AM.black,
  highlight: false,
};
const BOARD_DEFAULTS = {
  showCopyright: false,
  showNavigation: false,
  keepaspectratio: true,
  axis: AXIS_DEFAULTS,
  minimizeReflow: 'none',
  pan: { enabled: false },
};

const BLANK_AXIS_OPTIONS = { ticks: Object.assign({ ticksDistance: 1000000 }, TICKS_DEFAULTS) };

JXG.merge(JXG.Options, {
  axis: AXIS_DEFAULTS,
  board: BOARD_DEFAULTS,
  curve: CURVE_DEFAULTS,
  glider: GLIDER_DEFAULTS,
  grid: GRID_DEFAULTS,
  image: IMAGE_DEFAULTS,
  line: LINE_DEFAULTS,
  point: POINT_DEFAULTS,
  slider: SLIDER_DEFAULTS,
  text: TEXT_DEFAULTS,
  ticks: TICKS_DEFAULTS,
});

// Set options to disable zoom -- problematic for most uses of JSXGraph:
JXG.Options.board.pan.enabled = false;
JXG.Options.board.pan.needShift = false;
JXG.Options.board.zoom.needShift = false;
JXG.Options.board.zoom.enabled = false;
JXG.Options.board.zoom.pinchHorizontal = false;
JXG.Options.board.zoom.pinchVertical = false;
JXG.Options.board.zoom.wheel = false;
JXG.Options.board.zoom.pinchVertical = false;

if (browserProperties.hasTouchAPI() && browserProperties.isWindows()) {
  JXG.Options.precision.mouse = JXG.Options.precision.touch;
}

const gliderMethods = {
  setValue(value) {
    const max = this._smax || 1;
    const min = this._smin || 0;
    const pos = (value - min) / (max - min);
    this.setGliderPosition(pos);
  },

  Value() {
    const pos = this.position;
    const max = this._smax || 1;
    const min = this._smin || 0;
    const val = (max - min) * pos + min;
    return val;
  },

  moveToValue(value, millis, options) {
    const x1 = this.point1.X();
    const x2 = this.point2.X();
    const y1 = this.point1.Y();
    const y2 = this.point2.Y();
    const max = this._smax || 1;
    const min = this._smin || 0;
    const pos = (value - min) / (max - min);
    const x = x1 + pos * (x2 - x1);
    const y = y1 + pos * (y2 - y1);
    this.moveTo([x, y], millis, options);
  },
};

// useXYPos: True to use x,y positions (points), false to use value positions (sliders & gliders)
function makeLabelFunction(board, element, useXYPos) {
  // label: string, or function(value) or for points, function(x, y) returning string.
  //        default: function(sliderValue) { return sliderValue.toString; }
  // attrs: offset + Text attributes
  return function (label, attrs) {
    let objectLabel;
    if (!label) {
      objectLabel = useXYPos ? () => `(${element.X()}, ${element.Y()})` : () => element.Value();
    } else if (typeof label === 'function') {
      objectLabel = useXYPos ? () => label(element.X(), element.Y()) : () => label(element.Value());
    } else {
      objectLabel = label;
    }
    attrs = attrs || {};
    attrs.layer = COMPOSITE_LABEL_LAYER;
    const offset = attrs.offset;
    const xoffset = (offset && offset[0]) || 0;
    const yoffset = (offset && offset[1]) || 0;
    const parents = [() => element.X() + xoffset, () => element.Y() + yoffset, objectLabel];
    const txt = board.makeText(parents, attrs);
    return txt;
  };
}

const MIN_TOUCH_DIMENSION = 40; // Min touchable area width or height for image glider/slider/point objects

// attrs: name|responseID: 'id or name',
function setupElementImage(board, element, url, size, attrs, id) {
  attrs = AM.join({ fixed: true }, attrs);
  const width = size[0];
  const height = size[1];
  const offset = attrs.offset;
  const xoffset = AM.coalesce(offset && offset[0], -width / 2);
  const yoffset = AM.coalesce(offset && offset[1], -height / 2);

  setupActiveArea(board, element, width, height, xoffset, yoffset, attrs);

  const imageParents = [url, [() => element.X() + xoffset, () => element.Y() + yoffset], [width, height]];
  if (id && !attrs.id) {
    attrs.id = id;
  }
  attrs.layer = COMPOSITE_IMAGE_LAYER;
  const image = board.makeImage(imageParents, attrs);
  element.image = image;
  element.setUrl = (url) => {
    image.setUrl(url);
  };
  return element;
}

function setupActiveArea(board, element, width, height, xoffset, yoffset, attrs) {
  let widthpx = width * board.unitX;
  let heightpx = height * board.unitY;
  let xoffsetpx = xoffset * board.unitX;
  let yoffsetpx = yoffset * board.unitY;
  if (AM.HAS_TOUCH_API) {
    if (widthpx < MIN_TOUCH_DIMENSION) {
      xoffsetpx -= (MIN_TOUCH_DIMENSION - widthpx) / 2;
      widthpx = MIN_TOUCH_DIMENSION;
    }
    if (heightpx < MIN_TOUCH_DIMENSION) {
      yoffsetpx -= (MIN_TOUCH_DIMENSION - heightpx) / 2;
      heightpx = MIN_TOUCH_DIMENSION;
    }
  }

  attrs.offset = undefined;

  element.hasPoint = function (x, y) {
    // All calculations in screen coordinates (pixels):
    const coords = this.coords.scrCoords;
    const dx = x - coords[1] - xoffsetpx;
    // Note: in screen coords, y increases downward, hence reversal:
    const dy = coords[2] - y - yoffsetpx;
    const inBounds = dx >= 0 && dx <= widthpx && dy >= 0 && dy <= heightpx;
    // console.log('-- [' + coords[1] + ',' + coords[2] + ',' + widthpx + ',' + heightpx +
    //         '] + [' + xoffsetpx + ',' + yoffsetpx + '] hasPoint [' + x + ',' + y + '] -> ' + inBounds);
    return inBounds;
  };
}

function setupDragHandlers(element) {
  // handler args: x, y, position
  if (!element.Value) {
    element.Value = () => 0;
  }
  element.onDragStart = (handler) => {
    element.on('down', () => handler.call(element, element.X(), element.Y(), element.Value()));
  };
  element.onDragStop = (handler) => {
    element.on('up', () => handler.call(element, element.X(), element.Y(), element.Value()));
  };
  element.onDrag = (handler) => {
    element.on('drag', () => handler.call(element, element.X(), element.Y(), element.Value()));
  };
}

// Gets response ID, generating one if necessary,
const responseIDFor = (() => {
  let gensymCount = 0;
  return (attributes, isRequired) => {
    let responseID = attributes.responseID || attributes.id;
    if (!responseID && (isRequired || !attributes.fixed)) {
      responseID = attributes.name || '__' + ++gensymCount;
      attributes.responseID = responseID;
    }
    return responseID;
  };
})();

const amBoardMethods = {
  scaleToScreenX(x) {
    return x * this.unitX;
  },
  scaleToBoardX(x) {
    return x / this.unitX;
  },
  scaleToScreenY(x) {
    return x * this.unitY;
  },
  scaleToBoardY(x) {
    return x / this.unitY;
  },
  scaleToScreen(sizeArray) {
    return [sizeArray[0] * this.unitX, sizeArray[1] * this.unitY];
  },
  scaleToBoard(sizeArray) {
    return [sizeArray[0] / this.unitX, sizeArray[1] / this.unitY];
  },

  cancelDrag() {
    this.mode = this.BOARD_MODE_NONE;
    this.mouse = null;
    this.downObjects.length = 0;
  },

  makeLine(parents, attributes) {
    const line = this.create('line', parents, attributes);
    return line;
  },

  makeGlider(parents, attributes) {
    attributes = attributes || {};
    const responseID = responseIDFor(attributes);
    let glider;
    if (parents.length === 2) {
      glider = this.create('glider', [0, 0, parents[1]], attributes);
    } else {
      glider = this.create('glider', parents, attributes);
    }
    glider.Value = gliderMethods.Value;
    glider.setValue = gliderMethods.setValue;
    glider.moveToValue = gliderMethods.moveToValue;
    if (responseID) {
      this.grapher.jsxobjects[responseID] = glider;
    }
    glider.makeLabel = makeLabelFunction(this, glider, false);
    setupDragHandlers(glider);
    if (parents.length === 2) {
      glider.setGliderPosition(parents[0]);
    }
    return glider;
  },

  // gliderParents: [x, y, curveOrLine] or [pos, curveOrLine]
  makeImageGlider(gliderParents, imageUrl, imageSize, attrs) {
    const responseID = (attrs && (attrs.responseID || attrs.name)) || null;
    imageUrl = this.grapher.toAbsoluteURL(imageUrl);
    const gliderAttrs = {
      name: '',
      responseID: responseID,
      showInfoBox: false,
      withLabel: false,
      visible: true,
      highlight: false,
      size: 0,
      opacity: 0,
      highlightFillOpacity: 0,
      strokeWidth: 0,
      strokeOpacity: 0,
      highlightStrokeOpacity: 0,
      layer: COMPOSITE_ELEMENT_LAYER,
      snapToGrid: attrs.snapToGrid,
      snapSizeX: attrs.snapSizeX,
      snapSizeY: attrs.snapSizeY,
    };
    const glider = this.makeGlider(gliderParents, gliderAttrs);
    setupElementImage(this, glider, imageUrl, imageSize, attrs, responseID);
    return glider;
  },

  // Deprecated: use makeSlider
  makeTrackedSlidern(responseID, parents, attributes) {
    return this.makeSlider(parents, Object.assign(attributes, { responseID: responseID }));
  },

  makeSlider(parents, attributes) {
    attributes = attributes || {};
    const responseID = responseIDFor(attributes, true);
    const slider = this.create('slider', parents, attributes);
    slider.setValue = gliderMethods.setValue;
    slider.moveToValue = gliderMethods.moveToValue;
    slider.makeLabel = makeLabelFunction(this, slider, false);
    this.grapher.jsxobjects[responseID] = slider;
    return slider;
  },

  // attrs: name|responseID: 'id or name',
  makeImageSlider(sliderParents, imageUrl, imageSize, attrs) {
    const sliderAttrs = AM.copyProps(attrs, 'name', 'responseID', 'snapWidth');
    const responseID = attrs ? attrs.responseID || attrs.name : null;
    imageUrl = this.grapher.toAbsoluteURL(imageUrl);
    sliderAttrs.layer = COMPOSITE_ELEMENT_LAYER;
    sliderAttrs.showInfoBox = false;
    sliderAttrs.withLabel = false;
    sliderAttrs.visible = true;
    sliderAttrs.size = 0;
    const slider = this.makeSlider(sliderParents, sliderAttrs);
    setupElementImage(this, slider, imageUrl, imageSize, attrs, responseID);
    return slider;
  },

  // attrs: name|responseID: 'id or name',
  makeImagePoint(pointParents, imageUrl, imageSize, attrs) {
    const pointAttrs = AM.copyProps(attrs, 'name', 'responseID', 'fixed', 'snapToGrid', 'snapSizeX', 'snapSizeY');
    const responseID = (attrs && (attrs.responseID || attrs.name)) || null;
    imageUrl = this.grapher.toAbsoluteURL(imageUrl);
    pointAttrs.layer = COMPOSITE_ELEMENT_LAYER;
    pointAttrs.showInfoBox = false;
    pointAttrs.withLabel = false;
    pointAttrs.visible = true;
    pointAttrs.size = 0;
    const point = this.makePoint(pointParents, pointAttrs, responseID);
    setupElementImage(this, point, imageUrl, imageSize, attrs, responseID);
    return point;
  },

  // Deprecated: use makePoint
  makeTrackedPoint(responseID, parents, attributes) {
    return this.makePoint(parents, Object.assign(attributes, { responseID: responseID }));
  },

  // Use name or responseID property to name corresponding response property
  makePoint(parents, attributes) {
    attributes = attributes || {};
    const responseID = responseIDFor(attributes);
    if (!responseID) {
      attributes.highlight = false;
    }
    const point = this.create('point', parents, attributes);
    point.setValue = function (xyobj) {
      this.setPosition(JXG.COORDS_BY_USER, [xyobj.x, xyobj.y]);
    };
    if (responseID) {
      this.grapher.jsxobjects[responseID] = point;
    }
    point.makeLabel = makeLabelFunction(this, point, true);
    setupDragHandlers(point);
    return point;
  },

  makeFunctiongraph(parents, attributes) {
    return this.create('functiongraph', parents, attributes);
  },

  makeSliderLabel(slider, varName, varColor, attributes) {
    const parents = [
      function () {
        return slider.X() + 0.9;
      },
      function () {
        return slider.Y() + 1.0;
      },
      function () {
        return `<div class="sliderLabel"><strong><em><span style="color:${varColor};">${varName}</span>
=<div class="sliderLabelValue"><strong><em>${slider.Value().toFixed(2)}</em></strong></div></div>`;
      },
    ];
    const txt = this.create('text', parents, attributes);
    return txt;
  },

  makeText(parents, attributes) {
    return this.create('text', parents, attributes);
  },

  // Additional elements to create (from calls to JXG.JSGraph.registerElement):

  makeAngle(parents, attributes) {
    return this.create('angle', parents, attributes);
  },

  makeArc(parents, attributes) {
    return this.create('arc', parents, attributes);
  },

  makeArrow(parents, attributes) {
    return this.create('arrow', parents, attributes);
  },

  makeArrowParallel(parents, attributes) {
    return this.create('arrowparallel', parents, attributes);
  },

  makeAxis(parents, attributes) {
    return this.create('axis', parents, attributes);
  },

  makeBisector(parents, attributes) {
    return this.create('bisector', parents, attributes);
  },

  makeBisectorLines(parents, attributes) {
    return this.create('bisectorlines', parents, attributes);
  },

  makeCentroid(parents, attributes) {
    return this.create('centroid', parents, attributes);
  },

  makeChart(parents, attributes) {
    return this.create('chart', parents, attributes);
  },

  makeCircle(parents, attributes) {
    return this.create('circle', parents, attributes);
  },

  makeCircumCenter(parents, attributes) {
    return this.create('circumcenter', parents, attributes);
  },

  makeCircumCircle(parents, attributes) {
    return this.create('circumcircle', parents, attributes);
  },

  makeCircumCircleArc(parents, attributes) {
    return this.create('circumcirclearc', parents, attributes);
  },

  makeCircumCircleMidpoint(parents, attributes) {
    return this.create('circumcirclemidpoint', parents, attributes);
  },

  makeCircumCircleSector(parents, attributes) {
    return this.create('circumcirclesector', parents, attributes);
  },

  makeConic(parents, attributes) {
    return this.create('conic', parents, attributes);
  },

  makeCurve(parents, attributes) {
    return this.create('curve', parents, attributes);
  },

  makeEllipse(parents, attributes) {
    return this.create('ellipse', parents, attributes);
  },

  makeGrid(parents, attributes) {
    return this.create('grid', parents, attributes);
  },

  makeGroup(parents, attributes) {
    return this.create('group', parents, attributes);
  },

  makeHyperbola(parents, attributes) {
    return this.create('hyperbola', parents, attributes);
  },

  makeImage(parents, attributes) {
    if (!parents || !parents[0]) throw new Error('Invalid parents provided for makeImage');
    const grapher = this.grapher;
    parents[0] = grapher.toAbsoluteURL(parents[0]);
    const image = this.create('image', parents, attributes);
    image.setUrl = function (url) {
      image.url = grapher.toAbsoluteURL(url);
    };
    return image;
  },

  makeIncenter(parents, attributes) {
    return this.create('incenter', parents, attributes);
  },

  makeIncircle(parents, attributes) {
    return this.create('incircle', parents, attributes);
  },

  makeIntegral(parents, attributes) {
    return this.create('integral', parents, attributes);
  },

  makeIntersection(parents, attributes) {
    return this.create('intersection', parents, attributes);
  },

  makeLegend(parents, attributes) {
    return this.create('legend', parents, attributes);
  },

  makeLocus(parents, attributes) {
    return this.create('locus', parents, attributes);
  },

  makeMidpoint(parents, attributes) {
    return this.create('midpoint', parents, attributes);
  },

  makeMinorArc(parents, attributes) {
    return this.create('minorarc', parents, attributes);
  },

  makeMirrorPoint(parents, attributes) {
    return this.create('mirrorpoint', parents, attributes);
  },

  makeNormal(parents, attributes) {
    return this.create('normal', parents, attributes);
  },

  makeOrthogonalProjection(parents, attributes) {
    return this.create('orthogonalprojection', parents, attributes);
  },

  makeOtherIntersection(parents, attributes) {
    return this.create('otherintersection', parents, attributes);
  },

  makeParabola(parents, attributes) {
    return this.create('parabola', parents, attributes);
  },

  makeParallel(parents, attributes) {
    return this.create('parallel', parents, attributes);
  },

  makeParallelPoint(parents, attributes) {
    return this.create('parallelpoint', parents, attributes);
  },

  makePerpendicular(parents, attributes) {
    return this.create('perpendicular', parents, attributes);
  },

  makePerpendicularPoint(parents, attributes) {
    return this.create('perpendicularpoint', parents, attributes);
  },

  makePerpendicularSegment(parents, attributes) {
    return this.create('perpendicularsegment', parents, attributes);
  },

  makePlot(parents, attributes) {
    return this.create('plot', parents, attributes);
  },

  makePolar(parents, attributes) {
    return this.create('polar', parents, attributes);
  },

  makePolygon(parents, attributes) {
    return this.create('polygon', parents, attributes);
  },

  makeReflection(parents, attributes) {
    return this.create('reflection', parents, attributes);
  },

  makeRegularPolygon(parents, attributes) {
    return this.create('regularpolygon', parents, attributes);
  },

  makeRiemannSum(parents, attributes) {
    return this.create('riemannsum', parents, attributes);
  },

  makeSector(parents, attributes) {
    return this.create('sector', parents, attributes);
  },

  makeSegment(parents, attributes) {
    return this.create('segment', parents, attributes);
  },

  makeSemicircle(parents, attributes) {
    return this.create('semicircle', parents, attributes);
  },

  makeSpline(parents, attributes) {
    return this.create('spline', parents, attributes);
  },

  makeSquare(parents, attributes) {
    return this.create('square', parents, attributes);
  },

  makeTangent(parents, attributes) {
    return this.create('tangent', parents, attributes);
  },

  makeTapeMeasure(parents, attributes) {
    return this.create('tapemeasure', parents, attributes);
  },

  makeTicks(parents, attributes) {
    return this.create('ticks', parents, attributes);
  },

  makeTraceCurve(parents, attributes) {
    return this.create('tracecurve', parents, attributes);
  },

  makeTransform(parents, attributes) {
    return this.create('transform', parents, attributes);
  },

  makeTriangle(parents, attributes) {
    return this.create('triangle', parents, attributes);
  },

  makeTurtle(parents, attributes) {
    return this.create('turtle', parents, attributes);
  },
};

class Grapher {
  constructor(uuid, behavior, pageURL) {
    this.uuid = uuid;
    this.behavior = behavior;
    this.pageURL = AM.normalizeLeadURL(pageURL);
    this.jsxboards = [];
    this.jsxobjects = {};
    this.isFrozen = false;
    this.isSuspended = false;
  }

  updateBoards() {
    for (const jsxboard of this.jsxboards) {
      jsxboard.update();
    }
  }

  cancelDrags() {
    for (const jsxboard of this.jsxboards) {
      jsxboard.cancelDrag();
    }
  }

  toAbsoluteURL(url) {
    const absUrl = AM.toAbsoluteURL(this.pageURL, url);
    return absUrl;
  }

  makeTimer(fn, interval, limit, callback) {
    return new AM.Timer(fn, interval, limit, callback);
  }

  makeAnimator(defaultMillis) {
    return new AM.Animator(defaultMillis);
  }

  makeBoard(htmlId, attributes) {
    const axis = attributes.axis;
    if (axis === true) {
      attributes.axis = BLANK_AXIS_OPTIONS;
    }
    const board = JXG.JSXGraph.initBoard(htmlId, attributes);
    AM.checkPreventDefaults(board.containerObj);

    board.grapher = this;
    this.jsxboards.push(board);
    return board;
  }

  isTest() {
    return this.behavior === 'test';
  }

  isQuiz() {
    return this.behavior === 'quiz';
  }

  isPractice() {
    return this.behavior === 'practice';
  }

  isGuidedAssessment() {
    return this.behavior === 'guided_assessment';
  }

  // Provides repeatable pseudo-random numbers.
  // Not great algorithm, but adequate for our needs.
  random() {
    if (!this.lastRandom) {
      if (!this.seed) {
        this.seed = Date.now();
      }
      this.lastRandom = this.seed;
    }
    this.lastRandom = (this.lastRandom * 9301 + 49297) % 233280;
    return this.lastRandom / 233280.0;
  }

  // Integer value to seed pseudo random number generator.
  // Should be called once on initial graph setup before any calls to random().
  setSeed(s) {
    this.seed = s;
    this.lastRandom = this.seed;
  }

  submitAnswer(/* response, tries, correct */) {
    // Default implementation does nothing
  }

  // Freezes all tracked points, sliders
  freeze() {
    if (!this.isFrozen) {
      for (const name of Object.keys(this.jsxobjects)) {
        const jsxobject = this.jsxobjects[name];
        const type = jsxobject.type;
        if (jsxobject.isDraggable && (type === JXG.OBJECT_TYPE_POINT || type === JXG.OBJECT_TYPE_GLIDER)) {
          jsxobject.isDraggable = false;
          jsxobject.isFrozen = true;
        }
      }
      this.isFrozen = true;
    }
  }

  // Undoes the previous freeze
  unfreeze() {
    if (this.isFrozen) {
      for (const name of Object.keys(this.jsxobjects)) {
        const jsxobject = this.jsxobjects[name];
        const type = jsxobject.type;
        if (jsxobject.isFrozen && (type === JXG.OBJECT_TYPE_POINT || type === JXG.OBJECT_TYPE_GLIDER)) {
          jsxobject.isDraggable = true;
          jsxobject.isFrozen = false;
        }
      }
      this.isFrozen = false;
    }
  }

  stopAllAnimations() {
    for (const jsxboard of this.jsxboards) {
      jsxboard.stopAllAnimation();
    }
    AM.Animator.suspendAll();
  }

  // Default additionalResponses returns null
  additionalResponses() {
    return null;
  }

  getResponse(skipAdditionalResponses) {
    const response = this.seed ? { _seed: this.seed } : {};
    for (const name of Object.keys(this.jsxobjects)) {
      const jsxobject = this.jsxobjects[name];
      const type = jsxobject.type;
      if (type === JXG.OBJECT_TYPE_POINT) {
        response[name] = { x: AM.round(jsxobject.X()), y: AM.round(jsxobject.Y()) };
      } else if (type === JXG.OBJECT_TYPE_GLIDER) {
        // gliders and sliders
        response[name] = AM.round(jsxobject.Value());
      }
    }
    // Give author chance to do any funky calculations:
    if (!skipAdditionalResponses) {
      const specials = this.additionalResponses();
      if (specials) {
        Object.assign(response, AM.roundObject(specials));
      }
    }
    return response;
  }

  // For debugging responses with Firebug.
  // Sends `limit` responses every 2 seconds.
  logResponses(limit) {
    let count = 0;
    const logResponse = () => {
      theConsole.log('response: ' + JSON.stringify(this.getResponse()));
      if (++count < limit) {
        setTimeout(logResponse, 2000);
      }
    };
    logResponse();
  }

  // Restores graph to state previously returned from getResponse.
  restore(resp) {
    if (!resp) {
      return null;
    }
    // theConsole.log('Restore to ' + JSON.stringify(resp));
    for (const name of Object.keys(resp)) {
      let value = resp[name];
      if (name === '_seed') {
        if (typeof value === 'string') {
          value = parseFloat(value);
        }
        this.seed = value;
      } else {
        const jsxobject = this.jsxobjects[name];
        if (jsxobject) {
          const jsxtype = jsxobject.type;
          if (typeof jsxtype === 'number') {
            if (value === undefined) {
              throw new Error(`Restored point '${name}', no value given`);
            } else if (jsxtype === JXG.OBJECT_TYPE_POINT) {
              jsxobject.setPosition(JXG.COORDS_BY_USER, [value.x, value.y]);
              // console.log(`Restored point ${name} = ${JSON.stringify(value)}`);
            } else if (jsxtype === JXG.OBJECT_TYPE_GLIDER) {
              // gliders and sliders
              if (typeof value === 'string') {
                value = parseFloat(value);
              }
              jsxobject.setValue(value);
              // theConsole.log(`Restored glider/slider ${name} = ${JSON.stringify(value)}`);
            } else {
              throw new Error(`Cannot restore '${name}', unknown JSXGraph object type: ${jsxtype}`);
            }
          }
        }
      }
    }
  }

  // Updates all boards in grapher -- refreshes screen positions, etc.
  update() {
    for (const jsxboard of this.jsxboards) {
      jsxboard.update();
    }
  }

  // Restores board to previous state and then updates
  restoreAndUpdate(resp) {
    this.restore(resp);
    this.update();
  }

  attachToEvents(fn, event, jsxObjects) {
    for (const jsxObject of jsxObjects) {
      jsxObject.on(event, fn);
    }
  }
}

// TODO: These should go away--just use AM. ... rather than grapher. ...
Grapher.prototype.addTo = AM.addTo;
Grapher.prototype.copy = AM.copy;
Grapher.prototype.deepCopy = AM.deepCopy;
Grapher.prototype.copySlice = AM.copySlice;
Grapher.prototype.showHint = () => null;

Grapher.prototype.makeMathUpdater = AM.makeMathUpdater;

// "System" version of Grapher methods that set up and control the "user" version of the methods
const proxyMethods = {
  /**
   * Clears and rebuilds the grapher object.
   *
   * @param {Object} response   If provided, graph state is restored from response
   * @return {Graph} This graph if softReset, or new replacement for this graph.
   **/
  reset(response) {
    let nextGraph = this;
    const rebuild = () => {
      AM.Animator.resetAll();
      for (const jsxboard of this.jsxboards) {
        jsxboard.stopAllAnimation();
        JXG.JSXGraph.freeBoard(jsxboard);
      }
      graphers[this.uuid] = undefined;
      nextGraph = new Grapher(this.uuid, this.behavior, this.pageURL);
      if (this.player) {
        nextGraph.init(this.player);
      }
      setupGraph(nextGraph, this.uuid, response);
      if (nextGraph.reset) {
        nextGraph.reset();
      }
    };
    const restore = () => {
      this.freeze();
      this.stopAllAnimations();
      this.cancelDrags();
      AM.Animator.resetAll();
      this.restoreAndUpdate(response || this._response0);
      this.unfreeze();
    };
    if (this.softReset) {
      this.softReset(restore, rebuild);
    } else {
      rebuild();
    }
    return nextGraph;
  },

  showResponse(response, freeze) {
    const points = [];
    const sliders = [];
    // Animate known objects:
    if (response) {
      for (const name of Object.keys(response)) {
        const jsxobject = this.jsxobjects[name];
        if (jsxobject) {
          let value = response[name];
          const jsxtype = jsxobject.type;
          if (typeof jsxtype === 'number') {
            if (value === undefined) {
              throw new Error(`Cannot restore response for '${name}', no value given`);
            } else if (jsxtype === JXG.OBJECT_TYPE_POINT) {
              if (value.x !== undefined && value.y !== undefined) {
                if (jsxobject.getAttribute('snapToGrid')) {
                  points.push(jsxobject);
                  jsxobject.setAttribute({ snapToGrid: false });
                }
                jsxobject.moveTo([value.x, value.y], RESPONSE_DURATION_MILLIS);
              }
            } else if (jsxtype === JXG.OBJECT_TYPE_GLIDER) {
              // gliders and sliders
              if (jsxobject.getAttribute('snapWidth') >= 0) {
                sliders.push(jsxobject);
                sliders.push(jsxobject.getAttribute('snapWidth'));
                jsxobject.setAttribute({ snapWidth: -1 });
              }
              if (typeof value === 'string') {
                value = parseFloat(value);
              }
              jsxobject.moveToValue(value, RESPONSE_DURATION_MILLIS);
            } else {
              throw new Error(`Cannot restore response for '${name}', unknown JSXGraph object type: ${jsxtype}`);
            }
          }
        }
      }
    }
    if (this.showResponse) {
      this.showResponse(response, freeze);
    }
    if (freeze) {
      this.freeze();
    } else if (points.length > 0 || sliders.length > 0) {
      window.setTimeout(() => {
        for (const point of points) {
          point.setAttribute({ snapToGrid: true });
        }
        for (let i = sliders.length - 2; i >= 0; i -= 2) {
          sliders[i].setAttribute({ snapeWidth: sliders[i + 1] });
        }
      }, RESPONSE_DURATION_MILLIS);
    }
  },
};

function initializeGrapher(grapher, response) {
  if (grapher.initialize) {
    grapher.initialize(response);
    grapher._response0 = grapher.getResponse(true);
  }
  if (response && Object.keys(response).length > 0) {
    proxyMethods.showResponse.call(grapher, response, false);
  }
  if (grapher.jsxboards.length === 0) {
    throw new Error(`No JSXBoards defined for graph ${grapher.uuid}`);
  }
  if (grapher.jsxobjects.length === 0) {
    throw new Error(`No JSXObjects defined for graph ${grapher.uuid}`);
  }
  if (response) {
    grapher.restore(response);
  }
  grapher.updateBoards();
}

function setupGraph(grapher, uuid, response) {
  const makerfn = AM.grapherDefs[uuid] || AMGrapherDefs[uuid] || (AM.visualizationDefs && AM.visualizationDefs[uuid]);
  if (!makerfn) {
    throw new Error(`No maker function for interaction: ${uuid}`);
  }
  makerfn.call(grapher, grapher);
  graphers[uuid] = grapher;
  initializeGrapher(grapher, response);
  return grapher;
}

// Perform first time JSXGraph initialization:
let initializeJSXGraph = () => {
  Object.assign(JXG.Board.prototype, amBoardMethods);
  JXG.GeometryElement.prototype.updateNow = function () {
    if (this.getAttribute('needsRegularUpdate')) {
      this.prepareUpdate().update().updateRenderer();
    } else {
      this.setAttribute({ needsRegularUpdate: true });
      this.prepareUpdate().update().updateRenderer();
      this.setAttribute({ needsRegularUpdate: false });
    }
  };
  initializeJSXGraph = () => {}; // Just do once
};

AM.Grapher = Grapher;

AM.callGrapher = function (uuid, fname, args) {
  const grapher = graphers[uuid];
  if (!grapher) {
    throw new Error(`Unknown grapher UUID: '${uuid}'`);
  }
  const method = proxyMethods[fname] || grapher[fname];
  if (!method) {
    throw new Error(`Unknown grapher method: '${fname}'`);
  }
  return method.apply(grapher, args || []);
};

/**
 * Set up a grapher for the interaction identified by `uuid`.
 * makerfn, the authored function that actually constructs the graph, is retrieved from
 * AM.GrapherDefs[uuid].
 *
 * @param {String} uuid       UUID of associated interaction.
 * @param {String} behavior   One of 'test', 'quiz', 'practice', 'guided_assessment', 'visualization', null
 * @param {Object} response   Optional response object defining initial state of graph.
 * @param {String} pageURL    Optional absolute path to containing page used to convert relative image URL's
 * @return {Grapher} the new Grapher
 */
AM.setupGrapherInteraction = function (uuid, behavior, response, pageURL) {
  initializeJSXGraph();
  const grapher = new Grapher(uuid, behavior, pageURL);
  return setupGraph(grapher, uuid, response);
};

/**
 * Set up a grapher for the given graph visualization player.
 * makerfn, the authored function that actually constructs the graph, is retrieved from
 * AM.visualizationDefs[uuid].
 *
 * @param {Player} player   Visualization player for this graph visualization object
 * @param {String} pageURL  Optional absolute path to containing page used to convert relative image URL's
 * @return {Grapher} The new grapher, as a visualization for `player`.
 */
AM.setupGraphVisualization = function (player, pageURL) {
  initializeJSXGraph();
  const grapher = new Grapher(player.uuid, 'visualization', pageURL);
  //if (player) {
    //grapher.init(player);
  //}
  setupGraph(grapher, player.uuid, null);
  grapher.freeze();
  return grapher;
};

//export default AMGrapherDefs;
