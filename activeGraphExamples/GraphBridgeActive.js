function GraphBridgeStatic(obj){

    /*
     * GraphBridgeStatic is a link between JSXGraph and our viz's 
     * its based upon GraphBridge but it is designed to replace images
     * of graphs.
     * 
     * GraphBridgeStatic Version: 0.1
     *
     */

    // --------------------------------------------------------------------------- DEFAULT VARS
    var gb = this;

    gb.vwidthPer = 1;

    // --------------------------------------------------------------------------- BEGIN UTILS
    var graphBridgeStaticStyles ={
            axisLabelText:{

                fontFamily:"Times,serif",
                fontStyle:"italic",
                fontWeight:"bold",
                fontSize:"1.3em",
                color:"#444",
                cursor: "default",
                webkitTouchCallout: "none",
                webkitUserSelect: "none",
                khtmlUserSelect: "none",
                mozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",

                whiteSpace: "nowrap",

                pointerEvents:"none"

            },

            JXGtextStyle:".JXGtext {"+
            "        -webkit-touch-callout: none;"+
            "        -webkit-user-select: none;"+
            "        -khtml-user-select: none;"+
            "        -moz-user-select: none;"+
            "        -ms-user-select: none;"+
            "        user-select: none;"+
            "        touch-action: none;"+
            "        -ms-touch-action: none;"+
            "        cursor: default;"+
            "        line-height: 1em;"+
            "    }",

            axisLabelTextSans:{

                fontFamily:"Arial,sans",
                fontStyle:"normal",
                fontWeight:"bold",
                fontSize:"13px",
                color:"black",
                cursor: "default",
                webkitTouchCallout: "none",
                webkitUserSelect: "none",
                khtmlUserSelect: "none",
                mozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",

                whiteSpace: "nowrap",

                pointerEvents:"none"

            },


            horizontalGraphLabelText:{

                cursor: "default",
                webkitTouchCallout: "none",
                webkitUserSelect: "none",
                khtmlUserSelect: "none",
                mozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",
                pointerEvents:"none",

                whiteSpace: "nowrap"
            },

            verticalGraphLabelTextDefault:{

                verticalAlign:"bottom",

                transformOrigin: "center",
                mozTransformOrigin:"center",
                msTransformOrigin:"center",
                webkitTransformOrigin:"center",
                oTransformOrigin:"center",

                rotation: "-90deg",

                transform: "rotate(-90deg)",
                oTransform: "rotate(-90deg)",
                msTransform: "rotate(-90deg)",
                mozTransform: "rotate(-90deg)",
                webkitTransform: "rotate(-90deg)",

                minHeight:"1px",

                cursor: "default",
                webkitTouchCallout: "none",
                webkitUserSelect: "none",
                khtmlUserSelect: "none",
                mozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",
                pointerEvents:"none",

                whiteSpace: "nowrap",

                filter:"none"

            },

            verticalGraphLabelText:{

                verticalAlign:"bottom",

                transformOrigin: "top left",
                mozTransformOrigin:"top left",
                msTransformOrigin:"top left",
                webkitTransformOrigin:"top left",
                oTransformOrigin:"top left",

                rotation: "-90deg",

                transform: "rotate(-90deg)",
                oTransform: "rotate(-90deg)",
                msTransform: "rotate(-90deg)",
                mozTransform: "rotate(-90deg)",
                webkitTransform: "rotate(-90deg)",

                minHeight:"1px",

                cursor: "default",
                webkitTouchCallout: "none",
                webkitUserSelect: "none",
                khtmlUserSelect: "none",
                mozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",
                pointerEvents:"none",

                whiteSpace: "nowrap",

                filter:"none"

            },

            verticalGraphLabelText2:{

                verticalAlign:"bottom",

                transformOrigin: "top left",
                mozTransformOrigin:"top left",
                msTransformOrigin:"top left",
                webkitTransformOrigin:"top left",
                oTransformOrigin:"top left",

                rotation: "90deg",

                transform: "rotate(90deg)",
                oTransform: "rotate(90deg)",
                msTransform: "rotate(90deg)",
                mozTransform: "rotate(90deg)",
                webkitTransform: "rotate(90deg)",

                minHeight:"1px",

                cursor: "default",
                webkitTouchCallout: "none",
                webkitUserSelect: "none",
                khtmlUserSelect: "none",
                mozUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",
                pointerEvents:"none",

                whiteSpace: "nowrap",

                filter:"none"

            }
    };




    const GLIDER_DEFAULTS = {
  showInfobox: true,
  size: 2,
  face: 'o',
  fillColor: AM.red,
  strokeColor: AM.red,
  strokeWidth: 0,
  withLabel:false,
};
const GRID_DEFAULTS = {
  strokeColor: AM.gray,
  strokeOpacity: '1',
};
const LINE_DEFAULTS = {
  highlight: false,
  strokeWidth: 2,
  strokeColor: "#2d70b3",
};
const CURVE_DEFAULTS = LINE_DEFAULTS;
const IMAGE_DEFAULTS = { highlight: false };
const POINT_DEFAULTS = {
  showInfobox: true,
  size: 2,
  face: 'o',
  fillColor: AM.red,
  strokeColor: AM.red,
  strokeWidth: 0,
  withLabel:false,
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
  label: {display: 'html'},
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
  pan: { enabled: true },
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
JXG.Options.board.pan.enabled = true;
JXG.Options.board.pan.needShift = false;
JXG.Options.board.zoom.needShift = false;
JXG.Options.board.zoom.enabled = true;
JXG.Options.board.zoom.pinchHorizontal = true;
JXG.Options.board.zoom.pinchVertical = true;
JXG.Options.board.zoom.wheel = true;
JXG.Options.board.zoom.pinchVertical = true;


    /**
     * @function
     * @param from
     * @param to
     * @param overwrite
     * @return to object (not a copy of to)
     * awesome for copying css styles
     * 
     */
    function copyObj( from, to, overwrite ){
        var a;
        to = to || {};
        overwrite = ( overwrite!==undefined ? overwrite : true );

        for( a in from ){
            if( from.hasOwnProperty(a) ){
                //if( !overwrite ){
                //  to[a] = t.valid(to[a], from[a]);
                //}else{
                to[a] = from[a];
                //}
            }
        }
        return to;
    }

    //pull num from px
    /*
    function extractNumber(val)
    {
        var n = parseInt(val, 10);
        return n === null || isNaN(n) ? 0 : n;
    }
     */

    if(JXG.Options.useUnicodeMinus){
        JXG.Options.useUnicodeMinus = false;
    }
/*
    JXG.Options.board.pan.enabled = false;
    JXG.Options.board.pan.needShift = false;  
    JXG.Options.board.zoom.needShift = false;
    JXG.Options.board.zoom.enabled = false;
    JXG.Options.board.zoom.pinchHorizontal = false;
    JXG.Options.board.zoom.pinchVertical = false;
    JXG.Options.board.zoom.wheel = false;
    JXG.Options.board.zoom.pinchVertical = false;
*/
    //create the style for JXG text -- just removes interaction on the JXG text
    var jxgStyleInsert = document.createElement("STYLE");
    var jxgStyleNodeInsert = document.createTextNode(graphBridgeStaticStyles.JXGtextStyle);
    jxgStyleInsert.appendChild(jxgStyleNodeInsert);
    document.getElementsByTagName('head')[0].appendChild(jxgStyleInsert);

    // ---  This is a fix for gestures interfering with interaction
    // --- specifically nav swipe gestures on ipad and history swipe gestures on IE edge

    var gqArray = document.getElementsByClassName('graph-question');

    var gqI;
    if(gqArray){
        if(gqArray.length >0){
            for(gqI=0; gqI<gqArray.length; gqI++){
                gqArray[gqI].classList.add("disabled-swipex");
                gqArray[gqI].style["-ms-touch-action"] = "none";
                gqArray[gqI].style["touch-actionx"]     = "none";
                //  //console.debug("gqArray[gqI].style.width b4: "+gqArray[gqI].style.width);

                if(gqArray[gqI].style.width === ''){
                    gqArray[gqI].style.width = '700px';
                }
                // //console.debug("gqArray[gqI].style.width aftr: "+gqArray[gqI].style.width);
            }
        }
    }

    var gvArray = document.getElementsByClassName('graph-visualization');
    var gvI;
    if(gvArray){
        if(gvArray.length >0){
            for(gvI=0; gvI<gvArray.length; gvI++){
                gvArray[gvI].classList.add("disabled-swipex");
                gvArray[gvI].style["-ms-touch-action"] = "none";
                gvArray[gvI].style["touch-actionx"]     = "none";

                if(gvArray[gvI].style.width === ''){
                    gvArray[gvI].style.width = '700px';
                }
                // //console.debug("gvArray[gvI].style.width aftr: "+gvArray[gvI].style.width);
            }
        }
    }

    var gArray = document.getElementsByClassName('graph');
    var gI;
    if(gArray){
        if(gArray.length >0){
            for(gI=0; gI<gArray.length; gI++){

                gArray[gI].style.webkitTransform    = "translate3d(0,0,0)";

                // //console.debug("gArray[gI].style aftr: ",gArray[gI].style);
            }
        }
    }


    if(obj.thisPanel){

        obj.thisPanel.classList.add("disabled-swipex");
        obj.thisPanel.style["-ms-touch-action"] = "none";
        obj.thisPanel.style["touch-actionx"]     = "none";

        //for centering
        var mw = "700px";
        if(obj.thisPanel.style.width){
            mw = obj.thisPanel.style.width;
            if (mw.indexOf('px') > -1)
            {
                var iph =0;


                var allPanelHolders = document.getElementsByClassName('visualization-panel-holder');
                for (iph = 0; iph < allPanelHolders.length; iph++) {

                    if(allPanelHolders[iph].style.maxWidth === ""){
                        allPanelHolders[iph].style.maxWidth = mw;
                    }

                }
            }
        }

    }


    //NOTE! IMPORTANT!
    gb.thisPanel = obj.thisPanel;
    gb.thisGraphDiv = obj.thisGraphDiv;

    //get this value from the div of the graph or user supplied
    gb.bWidth = obj.bWidth || gb.thisGraphDiv.clientWidth;
    gb.bHeight = obj.bHeight || gb.thisGraphDiv.clientHeight;


    //that way, only need to provide 1 amount. 
    gb.defaultExtants = obj.defaultExtants;

    if(gb.defaultExtants){
        gb.minX = -gb.defaultExtants;
        gb.maxX = gb.defaultExtants;

        gb.minY = -gb.defaultExtants;
        gb.maxY = gb.defaultExtants;
    }else{
        gb.minX = obj.minX || -10;
        gb.maxX = obj.maxX || 10;

        gb.minY = obj.minY || -10;
        gb.maxY = obj.maxY || 10;
    }

    gb.showTicsBeyondExtants = obj.showTicsBeyondExtants || false;

    gb.ticksDistance = obj.ticksDistance || 2;
    gb.hTickDist = obj.hTickDist || gb.ticksDistance;

    gb.numMinorHTicks = obj.numMinorHTicks;
    gb.numMinorVTicks = obj.numMinorVTicks;


    gb.vTickDist = obj.vTickDist || gb.ticksDistance;

    // JXG.Options.axis.ticks.label.display = 'html';

    gb.hTicLabelOffset = obj.hTicLabelOffset || {x:1, y:-14};
    gb.vTicLabelOffset = obj.vTicLabelOffset || {x:-8, y:-1};

    gb.hTicLabelAnchor = obj.hTicLabelAnchor || {x:'middle', y:'middle'};
    gb.vTicLabelAnchor = obj.vTicLabelAnchor || {x:'right', y:'middle'};


    //ok so you have to add one more tick to each side. so
    if(obj.includeGutter !== undefined){
        gb.includeGutter = obj.includeGutter;
    }else{
        gb.includeGutter = true;
    }

    //also this should be defaulted to true,
    //meaning a user will specifically have to try and remove the gutter if they want it gone. and they should provide units as well then

    if(gb.includeGutter === true){

        gb.minMaxAdj = {};

        gb.minMaxAdj.minX = gb.minX - gb.hTickDist;
        gb.minMaxAdj.maxX = gb.maxX + gb.hTickDist;
        gb.minMaxAdj.minY = gb.minY - gb.vTickDist;
        gb.minMaxAdj.maxY = gb.maxY + gb.vTickDist;
    }
    //figure out the units
    //derived... but can also be overriden like so.
    if(obj.unitX && obj.unitY){
        gb.unitX = obj.unitX;
        gb.unitY = obj.unitY;
    }else{
        if(gb.includeGutter){
            gb.unitX = gb.bWidth /(Math.abs(gb.minMaxAdj.minX)+Math.abs(gb.minMaxAdj.maxX));
            gb.unitY = gb.bHeight /(Math.abs(gb.minMaxAdj.minY)+Math.abs(gb.minMaxAdj.maxY));
        }else{
            gb.unitX = gb.bWidth /(Math.abs(gb.minX)+Math.abs(gb.maxX));
            gb.unitY = gb.bHeight /(Math.abs(gb.minY)+Math.abs(gb.maxY));
        }
    }

    gb.gridHLineDist = obj.gridHLineDist || gb.hTickDist;
    gb.gridVLineDist = obj.gridVLineDist || gb.vTickDist;




    if(obj.arrowLeft !== undefined){
        gb.arrowLeft = obj.arrowLeft;
    }else{
        gb.arrowLeft = true;
    }

    if(obj.arrowRight !== undefined){
        gb.arrowRight = obj.arrowRight;
    }else{
        gb.arrowRight = true;
    }

    if(obj.arrowTop !== undefined){
        gb.arrowTop = obj.arrowTop;
    }else{
        gb.arrowTop = true;
    }


    if(obj.arrowBottom !== undefined){
        gb.arrowBottom = obj.arrowBottom;
    }else{
        gb.arrowBottom = true;
    }


    if(obj.isCentered !== undefined){
        gb.isCentered = obj.isCentered;
    }else{
        gb.isCentered = true;
    }


    //can use to provide a custom origin, but make sure iscentered is false
    gb.customOrigin = obj.customOrigin || null;
    if(gb.customOrigin){
        gb.isCentered = false; 
    }
    gb.axisLabels = obj.axisLabels || [{inHtml:"y"}, {inHtml:"x"}];

    gb.axisLabels.forEach((element) => {
        element.labelsUseSans = true;
    });

    //
    gb.offsetXAxis = obj.offsetXAxis || 0;
    gb.offsetYAxis = obj.offsetYAxis || 0;

    //
    gb.hDrawZero = obj.hDrawZero || false;
    gb.vDrawZero = obj.vDrawZero || false;
    //

    gb.hRemoveTheseTicks = obj.hRemoveTheseTicks || [];
    gb.vRemoveTheseTicks = obj.vRemoveTheseTicks || [];

    gb.hRemoveTheseTickLabels = obj.hRemoveTheseTickLabels || [];
    gb.vRemoveTheseTickLabels = obj.vRemoveTheseTickLabels || [];

    //allows to change the tic label by a multiplied number (so like  2, 4, 6, 8 can become 2000, 4000, 6000, 8000)
    gb.hNumericallyOffsetTicLabels = obj.hNumericallyOffsetTicLabels || 0;
    gb.vNumericallyOffsetTicLabels = obj.vNumericallyOffsetTicLabels || 0;
    
    //allows to change the tic label by an added number (so like  2, 4, 6, 8 can become 2002, 2004, 2006, 2008)

    gb.hNumericallyAddToTicLabels = obj.hNumericallyAddToTicLabels || 0;
    gb.vNumericallyAddToTicLabels = obj.vNumericallyAddToTicLabels || 0;

    //allows to use any scale symbol in tics
    gb.hScaleSymbol = obj.hScaleSymbol || '';
    gb.vScaleSymbol = obj.vScaleSymbol || '';

    //allows to use PI in tics
    gb.useHPI = obj.useHPI || false;
    gb.useVPI = obj.useVPI || false;

    gb.skipResponsive = obj.skipResponsive || false;


    gb.piSym = '&#960;';

    if(gb.useHPI === true){
        gb.hScaleSymbol = gb.piSym;
    }

    if(gb.useVPI === true){
        gb.vScaleSymbol = gb.piSym;
    }

    //allows to use fractions in tics labels
    gb.useHFractions = obj.useHFractions || false;
    gb.useVFractions = obj.useVFractions || false;

    gb.vwidthPer = 1;

    //make sure to get the conf object

    gb.confObj = {};
    copyObj( obj, gb.confObj );
    // --------------------------------------------------------------------------- END DEFAULT VARS

    //IMPORTANT the actual Bridge starts here but it just creates the graph, grid, labels, and axis
    // --------------------------------------------------------------------------- BEGIN ACTUAL Graph

/*
    var graphBridgeStatic_obj = obj.grapher.makeBoard(
            gb.thisGraphDiv.id, {
                unitX:gb.unitX,
                unitY:gb.unitY,
                axis : true,
                showNavigation : false
            });
*/
    var attributes = {unitX:gb.unitX,
                unitY:gb.unitY,
                axis : false,
                showNavigation : false};


    if (attributes.axis === true) {
      attributes.axis = BLANK_AXIS_OPTIONS;
    }
    var graphBridgeStatic_obj = JXG.JSXGraph.initBoard(gb.thisGraphDiv.id, attributes);


   // this.jsxboards.push(board);



    graphBridgeStatic_obj.vwidthPer = 1;

    graphBridgeStatic_obj.graphBridgeStaticStyles = graphBridgeStaticStyles;
    graphBridgeStatic_obj.axisLabels = gb.axisLabels;

    if(gb.isCentered === true){
        if(gb.includeGutter){

            //graphBridgeStatic_obj.origin = {scrCoords:[1, (Math.abs(gb.minMaxAdj.minX)*gb.unitX), (Math.abs(gb.minMaxAdj.minY)*gb.unitY) ]};
            graphBridgeStatic_obj.origin = {scrCoords:[1, (Math.abs(gb.minMaxAdj.minX)*gb.unitX), (Math.abs(gb.minMaxAdj.maxY)*gb.unitY) ]};
        }else{
            ////console.debug(" no gutter? going to set the origin : gb.includeGutter: "+gb.includeGutter);
            graphBridgeStatic_obj.origin = {scrCoords:[1, (Math.abs(gb.minX)*gb.unitX), (Math.abs(gb.maxY)*gb.unitY) ]};
        }

    }else{
        // //console.debug("reposition center accordingly"); 
        if(gb.customOrigin){
            graphBridgeStatic_obj.origin = {scrCoords:[1, gb.customOrigin.left, gb.customOrigin.top ]};
        }else{
            graphBridgeStatic_obj.origin = {scrCoords:[1, (Math.abs(gb.minX)*gb.unitX), (Math.abs(gb.maxY)*gb.unitY)  ]};
        }

    }

graphBridgeStatic_obj.create('grid', [], {
        gridX : gb.gridHLineDist,
        gridY : gb.gridVLineDist
    });
/*
    graphBridgeStatic_obj.makeGrid([], {
        gridX : gb.gridHLineDist,
        gridY : gb.gridVLineDist
    });
    */

    gb.axis = {};
    gb.showAxis = true;
    var horzAxis = {};
    var vertAxis = {};
    horzAxis.slope = "horizontal";
    horzAxis.tickInterval = gb.hTickDist;
    horzAxis.ticksDistance = gb.hTickDist;
    horzAxis.majorTicks = gb.hTickDist;
    horzAxis.useUnicodeMinus = false;
    if(gb.numMinorHTicks){
        //just exclude it if it is missing: make for much more backward compatibility
        horzAxis.minorTicks = gb.numMinorHTicks;
    }
    if(gb.hScaleSymbol !== ''){
        //horzAxis.scaleSymbol= gb.hScaleSymbol;
    }

    //set label properties for tics
    //!IMPORTANT these are all the lABEL attributes
    horzAxis.label= {display:'html', offset: [gb.hTicLabelOffset.x, gb.hTicLabelOffset.y], anchorX: gb.hTicLabelAnchor.x, anchorY: gb.hTicLabelAnchor.y};
    horzAxis.drawZero = gb.hDrawZero;


    vertAxis.slope = "vertical";
    vertAxis.tickInterval = gb.vTickDist;
    vertAxis.ticksDistance = gb.vTickDist;
    vertAxis.majorTicks = gb.vTickDist;
    vertAxis.useUnicodeMinus = false;

    if(gb.numMinorVTicks){
        //just exclude it if it is missing: make for much more backward compatibility
        vertAxis.minorTicks = gb.numMinorVTicks;
    }
    vertAxis.label= {display:'html', offset: [ gb.vTicLabelOffset.x, gb.vTicLabelOffset.y], anchorX: gb.vTicLabelAnchor.x, anchorY: gb.vTicLabelAnchor.y};
    vertAxis.drawZero = gb.vDrawZero;


    gb.axis = [horzAxis, vertAxis];

    var hAxis;
    var vAxis;

    if( gb.axis!==undefined && gb.showAxis!==false ){
        var a;
        for(a=0;a<gb.axis.length;a++){
            if( gb.axis[a].slope!==undefined ){

                if( gb.axis[a].tickInterval!==undefined ){ 
                    gb.axis[a].majorTicks=gb.axis[a].tickInterval; 
                }else if( gb.axis[a].ticksDistance!==undefined ){ 
                    gb.axis[a].majorTicks=gb.axis[a].ticksDistance; 
                }

                /*else{ 
                    gb.axis[a].majorTicks=args.grid.y; 
                }
                 */

                if( gb.axis[a].slope==="horizontal" ){

                    // MAKE AXIS
                    //hAxis = graphBridgeStatic_obj.makeAxis(  [[ 0, g.bottom_end_y_axis ], [ 1, g.bottom_end_y_axis ]], { ticks: t.copy( gb.axis[a], t.defaults.graph.tickPropsX )} );
                    // horzAxis.maxLabelLength= 7;
                    
                    //hAxis = graphBridgeStatic_obj.makeAxis(  [[ 0, gb.offsetXAxis ], [ 1, gb.offsetXAxis ]], { ticks: horzAxis} );
                    
                    hAxis = graphBridgeStatic_obj.create('axis', [[ 0, gb.offsetXAxis ], [ 1, gb.offsetXAxis ]], { ticks: horzAxis});
                    // show both arrows
                    //if( args.showGridBelowZero === true ){ results.hAxis.setArrow( true, true ); results.hAxis.updateNow(); }

                    hAxis.setArrow( gb.arrowLeft, gb.arrowRight );
                    //hAxis.updateNow();

                }else if( gb.axis[a].slope==="vertical" ){
                    // MAKE AXIS
                    // vAxis = graphBridgeStatic_obj.makeAxis(  [[ g.left_end_x_axis, 0 ], [ g.left_end_x_axis, 1 ]], { ticks: t.copy( gb.axis[a], t.defaults.graph.tickPropsY )} );
                    //vAxis = graphBridgeStatic_obj.makeAxis(  [[ gb.offsetYAxis, 0 ], [ gb.offsetYAxis, 1 ]], { ticks: vertAxis} );
                    
                    //vAxis = graphBridgeStatic_obj.makeAxis(  [[ gb.offsetYAxis, 0 ], [ gb.offsetYAxis, 1 ]], { ticks: vertAxis} );
                    //gb.offsetYAxis = 10;
                    vAxis = graphBridgeStatic_obj.create('axis', [[ gb.offsetYAxis, 0 ], [ gb.offsetYAxis, 1 ]], { ticks: vertAxis});


                    // show both arrows
                    //if( args.showGridBelowZero === true ){ results.vAxis.setArrow( true, true ); results.vAxis.updateNow(); }
                    // results.vAxis.setArrow( true, true ); results.vAxis.updateNow();
                    vAxis.setArrow(gb.arrowBottom, gb.arrowTop  );
                    //vAxis.updateNow();

                }

            }
        }
    }

    //just makes sure the order is from lowest to highest (not actually necc)
    /*
    hAxis.ticks[0].labels.sort(function(a, b){
        return Number(a.plaintext)-Number(b.plaintext);
    });

    vAxis.ticks[0].labels.sort(function(a, b){
        return Number(a.plaintext)-Number(b.plaintext);
    });
     */
    var ac;


    //reposition ticks

    //dunnno if this is necc

    var hdts = hAxis.defaultTicks;
    //hdts.updateNow();
    var vdts = vAxis.defaultTicks;
   // vdts.updateNow();

    var num;
    //var tickObj;
    var lblObj;
    var piNum;
    var rndNum;
    var fracNum;

    //var startWidth;
    //var startOffsetX;
    var newWidth;


    function isInt(n) {
        return n % 1 === 0;
    }

    //http://stackoverflow.com/questions/14002113/how-to-simplify-a-decimal-into-the-smallest-possible-fraction

    function getlowestfraction(x0) {
        var eps = 1.0E-15;
        var h, h1, h2, k, k1, k2, a, x;
        var retObj ={num:x0, den:x0, isNeg:false, isWhole:false};

        x = x0;
        a = Math.floor(x);
        h1 = 1;
        k1 = 0;
        h = a;
        k = 1;

        while (x-a > eps*k*k) {
            x = 1/(x-a);
            a = Math.floor(x);
            h2 = h1; h1 = h;
            k2 = k1; k1 = k;
            h = h2 + a*h1;
            k = k2 + a*k1;
        }

        //return h + "/" + k;

        retObj.isWhole = isInt(h/k);

        retObj.isNeg =  ((h*k)<0) ? '-' : '';

        retObj.num = h;
        retObj.den = k;

        return retObj;
    }

    gb.fraction= function(obj){
        var n = Number(obj.n);
        //var prec = obj.prec;
        //var up = obj.up;
        var nonMathML = obj.nonMathML;
        var addedSym = obj.addedSym ||'';

        // var s= String(n); 
        //p= s.indexOf('.');
        // var obj = {};
        ////console.debug(' ');
        /// //console.debug('n: '+n);

        // //console.debug("getlowestfraction: "+getlowestfraction(n));
        var frac = getlowestfraction(n);
        var st;

        /*
         * need to check for infinity?
            if(nonMathML === true){
                //console.debug("returning INfinity: "+st);
            }else{
                //console.debug("returning s (Infinity)");
                st = 
                    '<mrow>'+
                    '<mi>Infinity<\/mi>'+
                    '<\/mrow>';
            }
         */

        if(frac.isWhole){
            //whoel num
            // if(nonMathML === true){

            if(frac.num===1){
                if(addedSym){
                    st = addedSym;
                }else{
                    st = '1';
                }
            }else if(frac.num === -1){
                if(addedSym){
                    st = '-'+addedSym;
                }else{
                    st = '-1';
                }
            }else{
                st = frac.num+addedSym;  
            }

            //}else{
            if(nonMathML === true){
                //console.debug("returning a whole num: "+st);
            }else{

                st = 
                    '<mrow>'+
                    '<mi>'+st+'<\/mi>'+
                    '<\/mrow>';
                ////console.debug("returning a MATHML whole num: "+st);
            }
            return st; 
        }



        if(frac.num === -1) {
            if(addedSym){
                st = '-' + addedSym + "/" + frac.den;
            }else{
                st = "-1/" + frac.den;
            }

        }else if(frac.num === 1) {
            if(addedSym){
                st = addedSym + "/" + frac.den;
            }else{
                st = "1/" + frac.den;
            }
        }else{
            st = String(frac.num) + addedSym + "/" + frac.den;
        }





        /*
            if(p === -1) {

                if(nonMathML === true){

                    if(s==='1'){
                        if(addedSym){
                            st = addedSym;
                        }else{
                            st = '1';
                        }
                    }else if(s==='-1'){
                        if(addedSym){
                            st = '-'+addedSym;
                        }else{
                            st = '-1';
                        }
                    }else{
                        st = s+addedSym;  
                    }

                }else{
                    //console.debug("returning s (Infinity)");
                    st = 
                        '<mrow>'+
                        '<mi>Infinity<\/mi>'+
                        '<\/mrow>';
                }
                //console.debug("returning a whole num: "+st);

                return st;
            }

            var i= String(Math.floor(n)) || '', 
            dec= s.substring(p), 
            m= prec || Math.pow(10, dec.length-1), 
            num= up=== 1? Math.ceil(dec*m): Math.round(dec*m), 
                    den= m, 
                    g= Math.gcd(num, den);

            if(den/g === 1) {
                ////console.debug("returning den/g (full number) : "+String(i+(num/g)));
                //return String(i+(num/g));
                if(nonMathML === true){
                    st = String(i+(num/g));
                }else{
                    st = 
                        '<mrow>'+
                        '<mn>'+String(i+(num/g))+'<\/mn>'+
                        '<\/mrow>';
                }

                //console.debug("returning den/g (full number): "+st);

                return st;
            }
            //console.debug("up:: "+String(up));
            //console.debug("String(num/g):: "+String(num/g));
            //console.debug("String(den/g):: "+String(den/g));

            if(i ==='0'){
                //i= i+' and  ';
                i='';
            }

            //obj = {whole:i, numerator:num/g, denominator: den/g};
            //return obj;
            if(nonMathML === true){
               // st = i+ String(num/g)+addedSym+'/'+String(den/g);
                if(i==='1'){
                    if(addedSym){

                        st = String(num/g)+addedSym+'/'+String(den/g);
                    }else{

                        st = String(num/g)+'/'+String(den/g);
                    }
                }else if(i==='-1'){
                    if(addedSym){

                        st = String(num/g)+addedSym+'/'+String(den/g);
                    }else{

                        st = String(num/g)+'/'+String(den/g);
                    }
                }else{
                    if(addedSym){

                        st = String(num/g)+addedSym+'/'+String(den/g);
                    }else{

                        st = String(num/g)+'/'+String(den/g);
                    }

                }
                //console.debug('mixed number st'+st);
            }else{
                st = 
                    '<mrow>'+
                    '<mn>'+i+'<\/mn>'+
                    '<mfrac>'+
                    '<mrow>'+
                    '<mn>'+num/g+'<\/mn>'+
                    '<\/mrow>'+
                    '<mrow>'+
                    '<mn>'+den/g+'<\/mn>'+
                    '<\/mrow>'+
                    '<\/mfrac>'+
                    '<\/mrow>';
            }
         */

        //'<div class="top">'+num/g+'<\/div><div class="bottom">'+den/g+'<\/div>'
        //return i+ String(num/g)+'/'+String(den/g);
        return st;
    };


    /*
     * PICK UP HERE FOR VERTICAL FRACTIONS
     * 
     * st =  '<span style="text-align:center; color:'+slidr.vars.color+'"><span style="white-space: nowrap;"><span class="math-author">'+
                   slidr.vars.varName+'<\/span><span class="math-plain"><sub>'+slidr.vars.sliderNum+'<\/sub> = <\/span><\/span><br><div class="fractionHolder math-plain" style="color:'+slidr.vars.color+'">'+frc+'<\/div>';
     */

//alert("setting label maybe busted");
    for(ac = 0; ac < hAxis.ticks[0].labels.length;ac++){
        if(hAxis.ticks[0].labels[ac]){

               

            num  = Number(hAxis.ticks[0].labels[ac].plaintext.replace(gb.piSym, ''));
            lblObj = hAxis.ticks[0].labels[ac];

               if (gb.hNumericallyOffsetTicLabels === 0){
                num = Number(hAxis.ticks[0].labels[ac].plaintext);
                console.log("hAxis.ticks[0].labels[ac].plaintext: "+num);
console.log("hAxis.ticks[0].labels[ac]:  ",hAxis.ticks[0].labels[ac]);

               hAxis.ticks[0].labels[ac].setText(num * 1000);

               hAxis.ticks[0].labels[ac].innerHTML = (num * 1000);
//hAxis.ticks[0].labels[ac].text =(num * 1000);
//hAxis.ticks[0].labels[ac].updateText();
hAxis.ticks[0].labels[ac].updateSize();
hAxis.ticks[0].labels[ac].update();


       console.log("hAxis.ticks[0].labels[ac]:  DONE?"); 
            }

            if(gb.hScaleSymbol !== ''){
                //use PI or nay other symbol

                if(gb.hScaleSymbol === gb.piSym){
                    rndNum = AM.round((AM.round(num,2)/3.14), 2);
                }else{
                    rndNum = AM.round(num,2);
                }


                piNum = gb.fraction({n:rndNum, nonMathML:true, addedSym:gb.hScaleSymbol});

                hAxis.ticks[0].labels[ac].setText(piNum);

                lblObj.updateSize();
                lblObj.update();

                newWidth = hAxis.ticks[0].labels[ac].size[0];

                hAxis.ticks[0].labels[ac].setText("<span style='left:"+newWidth/2+"px'>"+piNum+"</span>");
                lblObj.updateSize();
                lblObj.update();

            }else if(gb.useHFractions === true){
                //use fractions

                rndNum = AM.round(num,2);

                fracNum = gb.fraction({n:rndNum, nonMathML:true});

                hAxis.ticks[0].labels[ac].setText(fracNum);

                lblObj.updateSize();
                lblObj.update();

                newWidth = hAxis.ticks[0].labels[ac].size[0];

                hAxis.ticks[0].labels[ac].setText("<span style='left:"+newWidth/2+"px'>"+fracNum+"</span>");
                lblObj.updateSize();
                lblObj.update();

            }

            if(gb.includeGutter){
                //turn off first and last one for gutter
                if(num <= gb.minMaxAdj.minX && !gb.showTicsBeyondExtants){
                    lblObj.visProp.visible = false;
                    lblObj.rendNode.style.visibility = "hidden";
                }

                if(num >= gb.minMaxAdj.maxX && !gb.showTicsBeyondExtants){
                    lblObj.visProp.visible = false;
                    lblObj.rendNode.style.visibility = "hidden";
                }

            }

            if(gb.hRemoveTheseTickLabels.indexOf(num)>=0){
                lblObj.visProp.visible = false;
                lblObj.rendNode.style.visibility = "hidden";
            }

            // if(gb.hRemoveTheseTicks.indexOf(num)>=0){
            //TODO: implement !: Basically this removes the TICKS only. 
            ////console.debug("remove the TICK Only of this one: "+num);
            ////console.debug(num+" tickObj");
            // //console.debug( tickObj);

            /// hAxis.ticks[0].ticks[ac][2] =false;
            ////console.debug(hAxis.ticks[0].ticks);

            ////console.debug("or it is this obj ");
            // //console.debug(tickObj);


            // hAxis.ticks[0].ticks[ac].visProp.visible = false;

            //      hAxis.ticks[0].ticks[ac].rendNode.style.visibility = "hidden";
            // tickObj.visProp.visible = false;
            //tickObj.rendNode.style.visibility = "hidden";


            //  }
        }

    }

    hAxis.ticks[0].update();
    hAxis.update();


    for(ac = 0; ac < vAxis.ticks[0].labels.length;ac++){
        if(vAxis.ticks[0].labels[ac]){
            // vAxis.ticks[0].labels[ac].visProp.anchory = 'bottom';

            num = Number(vAxis.ticks[0].labels[ac].plaintext);
            lblObj = vAxis.ticks[0].labels[ac];
            // yax.ticks[0].labels[ac].visProp.anchorx = 'right';   

            num  = Number(vAxis.ticks[0].labels[ac].plaintext.replace(gb.piSym, ''));

            lblObj = vAxis.ticks[0].labels[ac];

            if(gb.vScaleSymbol  !== ''){
                //use PI or any other symbol

                if(gb.vScaleSymbol === gb.piSym){
                    rndNum = AM.round((AM.round(num,2)/3.14), 2);
                }else{
                    rndNum = AM.round(num,2);
                }

                piNum = gb.fraction({n:rndNum, nonMathML:true, addedSym:gb.vScaleSymbol});

                vAxis.ticks[0].labels[ac].setText(piNum);

                lblObj.updateSize();
                lblObj.update();

                newWidth = vAxis.ticks[0].labels[ac].size[0];

                vAxis.ticks[0].labels[ac].setText("<span style='left:"+newWidth/2+"px'>"+piNum+"</span>");
                lblObj.updateSize();
                lblObj.update();

            }else if(gb.useVFractions === true){
                //use fractions

                rndNum = AM.round(num,2);

                fracNum = gb.fraction({n:rndNum, nonMathML:true});

                vAxis.ticks[0].labels[ac].setText(fracNum);

                lblObj.updateSize();
                lblObj.update();

                newWidth = vAxis.ticks[0].labels[ac].size[0];

                vAxis.ticks[0].labels[ac].setText("<span style='left:"+newWidth/2+"px'>"+fracNum+"</span>");
                lblObj.updateSize();
                lblObj.update();

            }
            if(gb.includeGutter){
                //turn off first and last one for gutter
                if(num <= gb.minMaxAdj.minY && !gb.showTicsBeyondExtants){
                    // //console.debug("less than or equal to -12 found");
                    lblObj.visProp.visible = false;
                    lblObj.rendNode.style.visibility = "hidden";
                }

                if(num >= gb.minMaxAdj.maxY && !gb.showTicsBeyondExtants){
                    //  //console.debug("greater than or equal to 12 found");
                    lblObj.visProp.visible = false;
                    lblObj.rendNode.style.visibility = "hidden";
                }

            }
            if(gb.vRemoveTheseTickLabels.indexOf(num)>=0){
                lblObj.visProp.visible = false;
                lblObj.rendNode.style.visibility = "hidden";
            }
        }
    }
    // vdts.updateNow();

    vAxis.ticks[0].update();
    vAxis.update();

    //expose the axis object for external customizations
    gb.hAxis = hAxis;
    gb.vAxis = vAxis;

    graphBridgeStatic_obj.hAxis = hAxis;
    graphBridgeStatic_obj.vAxis = vAxis;


    //graphBridgeStatic_obj.fullUpdate();
    graphBridgeStatic_obj.update();
    //ok you need to make the labels custom as they are cut off if you use jsxgraphs labels. and the defaults only allow one label

    var lbl;
    var leftPxPoint;
    var topPxPoint;

    var incNum;
    var lblPadding = 3;
    graphBridgeStatic_obj.axisLabels = [];

    if(gb.confObj.useDefaultLabelPos === true){


          for(incNum = 0; incNum < gb.axisLabels.length; incNum++){
            lbl = document.createElement('div');
            //removed for future possibility of multi graphs
            // lbl.className = 'prod_graphLabel';
            lbl.style.position = 'absolute';
            lbl.innerHTML =gb.axisLabels[incNum].inHtml;
            if(incNum === 0){
                lbl.className = "prod_graphLabel_y_top";
                lbl.style.left = '0';
                lbl.style.width = '100%';
                lbl.style.top = '12px';
                lbl.style.textAlign = 'center';
            }else if(incNum === 1){
                lbl.className = "prod_graphLabel_x_right";
                leftPxPoint = Number(graphBridgeStatic_obj.containerObj.offsetLeft+graphBridgeStatic_obj.containerObj.clientWidth+3);
                topPxPoint = graphBridgeStatic_obj.containerObj.offsetTop+graphBridgeStatic_obj.origin.scrCoords[2]-11;

            }else if(incNum === 2){
                lbl.className = "prod_graphLabel_y_bottom";
                //leftPxPoint = Number(graphBridgeStatic_obj.containerObj.offsetLeft+graphBridgeStatic_obj.origin.scrCoords[1]);
                //topPxPoint = graphBridgeStatic_obj.containerObj.offsetTop+graphBridgeStatic_obj.containerObj.clientHeight-3;

                lbl.style.left = '0';
                lbl.style.width = '100%';
                lbl.style.textAlign = 'center';
                 //lbl.style.top = (graphBridgeStatic_obj.containerObj.offsetTop+graphBridgeStatic_obj.containerObj.clientHeight-8)+'px';

            }else if(incNum === 3){
                lbl.className = "prod_graphLabel_x_left";
                //leftPxPoint = Number(graphBridgeStatic_obj.containerObj.offsetLeft -15);
                //topPxPoint = graphBridgeStatic_obj.containerObj.offsetTop+graphBridgeStatic_obj.origin.scrCoords[2]-11;
                lbl.style.width = '100%';
                lbl.style.left = 'calc(-50% - 5px)';
                lbl.style.top = '50%';
                lbl.style.transformOrigin = 'center';
                lbl.style.textAlign = 'center';
                 copyObj( graphBridgeStaticStyles.verticalGraphLabelTextDefault, lbl.style );

            }




            // gb.thisPanel.appendChild(lbl);

            //edit : 2.5.0 trying new positioning based upon the new placement of the label in the graph div
            graphBridgeStatic_obj.containerObj.appendChild(lbl);
            //now reposition... based on actual widths and heights of the text boxes

            


/*


            //you can also override totally
            if(gb.axisLabels[incNum].left){
                lbl.style.left = gb.axisLabels[incNum].left+'px';
            }
            if(gb.axisLabels[incNum].top){
                lbl.style.top = gb.axisLabels[incNum].top+'px';
            }

            //or you cn override "slightly"
            if(gb.axisLabels[incNum].offLeft){

                lbl.style.left = (parseInt(lbl.style.left, 10)+gb.axisLabels[incNum].offLeft)+'px';

            }
            if(gb.axisLabels[incNum].offTop){
                ////console.debug('label for : '+lbl.innerHTML+' gb.axisLabels[incNum].offTop: '+gb.axisLabels[incNum].offTop+" annnd lbl.style.top "+lbl.style.top);


                lbl.style.top = (parseInt(lbl.style.top, 10)+gb.axisLabels[incNum].offTop)+'px';
                // //console.debug('label for : '+lbl.innerHTML+' after moveing it lbl.style.top : '+lbl.style.top);

            }
*/
            //give it the normal text styling too or use user defined
            copyObj( graphBridgeStaticStyles.axisLabelText, lbl.style );

            // or give it the sans defined styling
            if(gb.axisLabels[incNum].labelsUseSans){

                copyObj( graphBridgeStaticStyles.axisLabelTextSans, lbl.style, true );
            }

            // or give it the user defined styling
            if(gb.axisLabels[incNum].customStyle){
                copyObj( gb.axisLabels[incNum].customStyle, lbl.style, true );
            }


            //give it you can align it vert or horz
            /*
            if(gb.axisLabels[incNum].vertAligned){
                if(gb.axisLabels[incNum].vertAligned === "cc"){
                    //counterclockwise
                    copyObj( graphBridgeStaticStyles.verticalGraphLabelText, lbl.style );
                }else{
                    //clockwise
                    copyObj( graphBridgeStaticStyles.verticalGraphLabelText2, lbl.style );
                }

            }else{
                copyObj( graphBridgeStaticStyles.horizontalGraphLabelText, lbl.style );  
            }
*/

            //edit : 2.5.1 trying new positioning based upon the new placement of the label in the graph div

           // lbl.style.left = (parseInt(lbl.style.left, 10)-graphBridgeStatic_obj.containerObj.offsetLeft)+'px';
           // lbl.style.top = (parseInt(lbl.style.top, 10)-graphBridgeStatic_obj.containerObj.offsetTop)+'px';

            //


            //add new label to exposed object 
            graphBridgeStatic_obj.axisLabels.push(lbl);

        }

    }else{
        for(incNum = 0; incNum < gb.axisLabels.length; incNum++){
            lbl = document.createElement('div');
            //removed for future possibility of multi graphs
            // lbl.className = 'prod_graphLabel';
            lbl.style.position = 'absolute';
            lbl.innerHTML =gb.axisLabels[incNum].inHtml;
            if(incNum === 0){
                lbl.className = "prod_graphLabel_y_top";
                leftPxPoint = Number(graphBridgeStatic_obj.containerObj.offsetLeft+graphBridgeStatic_obj.origin.scrCoords[1]);
                topPxPoint = graphBridgeStatic_obj.containerObj.offsetTop-22;

            }else if(incNum === 1){
                lbl.className = "prod_graphLabel_x_right";
                leftPxPoint = Number(graphBridgeStatic_obj.containerObj.offsetLeft+graphBridgeStatic_obj.containerObj.clientWidth+3);
                topPxPoint = graphBridgeStatic_obj.containerObj.offsetTop+graphBridgeStatic_obj.origin.scrCoords[2]-11;

            }else if(incNum === 2){
                lbl.className = "prod_graphLabel_y_bottom";
                leftPxPoint = Number(graphBridgeStatic_obj.containerObj.offsetLeft+graphBridgeStatic_obj.origin.scrCoords[1]);
                topPxPoint = graphBridgeStatic_obj.containerObj.offsetTop+graphBridgeStatic_obj.containerObj.clientHeight-3;

            }else if(incNum === 3){
                lbl.className = "prod_graphLabel_x_left";
                leftPxPoint = Number(graphBridgeStatic_obj.containerObj.offsetLeft -15);
                topPxPoint = graphBridgeStatic_obj.containerObj.offsetTop+graphBridgeStatic_obj.origin.scrCoords[2]-11;

            }




            // gb.thisPanel.appendChild(lbl);

            //edit : 2.5.0 trying new positioning based upon the new placement of the label in the graph div
            graphBridgeStatic_obj.containerObj.appendChild(lbl);
            //now reposition... based on actual widths and heights of the text boxes

            if(incNum === 0){
                lbl.className = "prod_graphLabel_y_top";
                leftPxPoint = Number(graphBridgeStatic_obj.containerObj.offsetLeft+graphBridgeStatic_obj.origin.scrCoords[1])-(lbl.clientWidth*0.2);
                topPxPoint = graphBridgeStatic_obj.containerObj.offsetTop-lbl.clientHeight-lblPadding*2;

            }else if(incNum === 1){
                lbl.className = "prod_graphLabel_x_right";
                leftPxPoint = Number(graphBridgeStatic_obj.containerObj.offsetLeft+graphBridgeStatic_obj.containerObj.clientWidth+lblPadding);
                topPxPoint = graphBridgeStatic_obj.containerObj.offsetTop+graphBridgeStatic_obj.origin.scrCoords[2]-(lbl.clientHeight*0.6);

            }else if(incNum === 2){
                lbl.className = "prod_graphLabel_y_bottom";
                leftPxPoint = Number(graphBridgeStatic_obj.containerObj.offsetLeft+graphBridgeStatic_obj.origin.scrCoords[1])-(lbl.clientWidth*0.2);
                topPxPoint = graphBridgeStatic_obj.containerObj.offsetTop+graphBridgeStatic_obj.containerObj.clientHeight-6+lblPadding;

            }else if(incNum === 3){
                lbl.className = "prod_graphLabel_x_left";
                leftPxPoint = (Number(graphBridgeStatic_obj.containerObj.offsetLeft - lbl.clientWidth) - lblPadding*2);

                topPxPoint = (graphBridgeStatic_obj.containerObj.offsetTop+graphBridgeStatic_obj.origin.scrCoords[2])-(lbl.clientHeight*0.6);

            }

            lbl.style.left = leftPxPoint+'px';
            lbl.style.top = topPxPoint+'px';





            //you can also override totally
            if(gb.axisLabels[incNum].left){
                lbl.style.left = gb.axisLabels[incNum].left+'px';
            }
            if(gb.axisLabels[incNum].top){
                lbl.style.top = gb.axisLabels[incNum].top+'px';
            }

            //or you cn override "slightly"
            if(gb.axisLabels[incNum].offLeft){

                lbl.style.left = (parseInt(lbl.style.left, 10)+gb.axisLabels[incNum].offLeft)+'px';

            }
            if(gb.axisLabels[incNum].offTop){
                ////console.debug('label for : '+lbl.innerHTML+' gb.axisLabels[incNum].offTop: '+gb.axisLabels[incNum].offTop+" annnd lbl.style.top "+lbl.style.top);


                lbl.style.top = (parseInt(lbl.style.top, 10)+gb.axisLabels[incNum].offTop)+'px';
                // //console.debug('label for : '+lbl.innerHTML+' after moveing it lbl.style.top : '+lbl.style.top);

            }

            //give it the normal text styling too or use user defined
            copyObj( graphBridgeStaticStyles.axisLabelText, lbl.style );

            // or give it the sans defined styling
            if(gb.axisLabels[incNum].labelsUseSans){

                copyObj( graphBridgeStaticStyles.axisLabelTextSans, lbl.style, true );
            }

            // or give it the user defined styling
            if(gb.axisLabels[incNum].customStyle){
                copyObj( gb.axisLabels[incNum].customStyle, lbl.style, true );
            }


            //give it you can align it vert or horz
            if(gb.axisLabels[incNum].vertAligned){
                if(gb.axisLabels[incNum].vertAligned === "cc"){
                    //counterclockwise
                    copyObj( graphBridgeStaticStyles.verticalGraphLabelText, lbl.style );
                }else{
                    //clockwise
                    copyObj( graphBridgeStaticStyles.verticalGraphLabelText2, lbl.style );
                }

            }else{
                copyObj( graphBridgeStaticStyles.horizontalGraphLabelText, lbl.style );  
            }


            //edit : 2.5.1 trying new positioning based upon the new placement of the label in the graph div

            lbl.style.left = (parseInt(lbl.style.left, 10)-graphBridgeStatic_obj.containerObj.offsetLeft)+'px';
            lbl.style.top = (parseInt(lbl.style.top, 10)-graphBridgeStatic_obj.containerObj.offsetTop)+'px';

            //


            //add new label to exposed object 
            graphBridgeStatic_obj.axisLabels.push(lbl);


        }

    }


    //use this for scaling on PHONES

    function getAllSelectors() { 
        var ret = [];
        for(var i = 0; i < document.styleSheets.length; i++) {
            var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
            for(var x in rules) {
                if(rules[x].conditionText) ret.push(rules[x]);
            }

        }
        return ret;
    }


    function selectorExists(cssString) { 
        var selectors = getAllSelectors();
        for(var i = 0; i < selectors.length; i++) {
            if(selectors[i].conditionText === cssString) {
                return true;
            }
        }
        return false;
    }

    function checkIfPx(val){

        var hasPx = val.indexOf('px') >= 0;
        return hasPx;
    }

    /* possible positioning and scaling for phones. */
    if(browserProperties.isPhone === true){
        if(selectorExists("only screen and (max-width: 768px)") === false){

          const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
          const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

            //ok need to check if there IS a contentDiv... if there is not then you may be able to use either
            // the parent of the graph div or... perhaps the graph vizualization div?

            //or do you check if the gb.vwidthPer is like 1 or more?



            //var foPan = document.getElementsByClassName("graph-visualization")[0];

            //console.debug("vw: "+vw);
            //console.debug("gb.thisPanel.clientWidth: "+gb.thisPanel.clientWidth);


            gb.vwidthPer = (vw-30) / gb.thisPanel.clientWidth;

            //console.debug("gb.vwidthPer: "+gb.vwidthPer);


            //console.debug("gb", gb);

            //console.debug("gb.confObj", gb.confObj);


            var vizDiv = gb.confObj.thisPanel; 

            ////console.debug("gb.thisGraphDiv.thisGraphDiv", gb.thisGraphDiv.thisGraphDiv);

            //console.debug("vizDiv", vizDiv);

            //console.debug("vizDiv.clientWidth: "+ vizDiv.clientWidth);

            //console.debug("vizDiv.style.maxWidth: "+ vizDiv.style.maxWidth);

            //maaaay have to use the clientwidth of teh viz div, as it may be smaller than ethe panelw width.


            //if it's to large you need to use a different measure
            if (gb.vwidthPer > 1){
                //console.debug("gb.vwidthPer > 1 : "+gb.vwidthPer );
                //console.debug("vizDiv.style.width : "+vizDiv.style.width );

                if(checkIfPx(vizDiv.style.width)){
                    
                    //console.debug("checkIfPx(vizDiv.style.width) : " +checkIfPx(vizDiv.style.width));
                    if(parseInt(vizDiv.style.width, 10) > (vw-30)){
                        //console.debug("parseInt(vizDiv.style.width, 10) > (vw-30) is true : " );

                        gb.vwidthPer = (vw-30) / parseInt(vizDiv.style.width, 10);
                        if (gb.vwidthPer > 1){
                            //dont let it enlarge
                            gb.vwidthPer = 1;
                        }
                    }else{
                        //dont let it enlarge
                        gb.vwidthPer = 1;
                    }
                }else if(vizDiv.clientWidth >100){
                    if(vizDiv.clientWidth > (vw-30)){
                        //console.debug("ok so there is no direct style on the vizDiv. The cientwidth is above 100.and the width of the clientwidth is larger.. so try sclaing t? " );

                        gb.vwidthPer = (vw-30) / vizDiv.clientWidth;

                        //console.debug("gb.vwidthPer: " +gb.vwidthPer);

                        if (gb.vwidthPer > 1){
                            
                            //console.debug("the width is too high  =, dont let it enlareg. " );
                            //dont let it enlarge
                            gb.vwidthPer = 1;
                        }
                    }else{
                        
                        //console.debug("ok so there is no direct style on the vizDiv. The cientwidth is above 100. nut the size puts it at laregr than 100%... so force it smaller " );
                        
                        //dont let it enlarge
                        gb.vwidthPer = 1;
                    }
                }else if(checkIfPx(vizDiv.style.maxWidth)){

                    if(parseInt(vizDiv.style.maxWidth, 10) > (vw-30)){
                        //console.debug("parseInt(vizDiv.style.maxWidth, 10) IS GREATER THAN (vw-30) is true : " );

                        gb.vwidthPer = (vw-30) / parseInt(vizDiv.style.maxWidth, 10);
                        if (gb.vwidthPer > 1){
                            //dont let it enlarge
                            gb.vwidthPer = 1;
                        }
                    }else{
                        //console.debug("ok so there is no direct style on the vizDiv. there is a maxWidth... but it is above teh vw-30 so force 100%" );

                        
                        ///??/ makes no sense... it woudl shrik as it is smaller.
                        
                        
                        //dont let it enlarge
                        gb.vwidthPer = 1;
                    }

                }else{

                    if(vizDiv.clientWidth > (vw-30)){
                        //console.debug("vizDiv.clientWidth > (vw-30) is true : " );

                        gb.vwidthPer = (vw-30) / vizDiv.clientWidth;
                        //console.debug(" gb.vwidthPer : "+ gb.vwidthPer )
                        if (gb.vwidthPer > 1){
                            //dont let it enlarge
                            gb.vwidthPer = 1;
                        }
                    }else{
                        //dont let it enlarge
                        gb.vwidthPer = 1;
                    }


                }



            }


            //console.debug(" done gb.vwidthPer : "+ gb.vwidthPer );
            
            //console.debug(" now do height >>>> ");

            //console.debug("gb.thisPanel.style.height: "+gb.thisPanel.style.height);

            //console.debug("parseInt(gb.thisPanel.style.height, 10): "+parseInt(gb.thisPanel.style.height, 10));

            ////console.debug("gb.vwidthPer: "+gb.vwidthPer);
            var adjHeight = 1;


            adjHeight = parseInt(gb.thisPanel.style.height, 10) * gb.vwidthPer;

            //console.debug("adjHeight: "+adjHeight);

            if(isNaN(adjHeight) === true || adjHeight === 0){
                //console.debug("adjHeight isNaN so try something else ");

                adjHeight = parseInt(vizDiv.style.height, 10) * gb.vwidthPer;

                //console.debug("used vizdiv style Height: "+adjHeight);
            }

            if(isNaN(adjHeight) === true || adjHeight === 0){
                //still borked... use ClientHeight
                adjHeight = gb.thisPanel.clientHeight * gb.vwidthPer;

                //console.debug("used this panel clientHeight: "+adjHeight);
            }

            if(isNaN(adjHeight) === true || adjHeight === 0){
                //still borked... use viz div ClientHeight
                adjHeight = vizDiv.clientHeight * gb.vwidthPer;
                //console.debug("used vizDiv clientHeight: "+adjHeight);
            }

            
           // if(adaptive-lineup)
            
          let hString = '';
          const alAr = document.getElementsByClassName('adaptive-lineup');
          const gqAr = document.getElementsByClassName('graph-question');
          const stAr = document.getElementsByClassName('stage');
          
          
          /*
          let prefaceDiv = '';
          if(gb.confObj.grapher){
              if(gb.confObj.grapher.player){
                  if(gb.confObj.grapher.player.containerId){
                      prefaceDiv = "#"+gb.confObj.grapher.player.containerId;
                  }
              }
              
          }
          */
          
          //console.debug("alAr: ",alAr);
          //console.debug("alAr.length: "+alAr.length);
          
          
          //console.debug("gqAr:",gqAr);
          //console.debug("gqAr.length: "+gqAr.length);
          
          
          if(alAr.length === 0 ){
            hString = 'height: '+(adjHeight+40)+'px;';
              //console.debug("adaptive-lineup length is not zero so the strng is:  "+ hString);
          }
          
          if(stAr.length > 0 ){
            hString = 'height: '+(adjHeight+40)+'px!important;';
              
            prefaceDiv = ".stage-container-panel";
              

              //console.debug("its a stage item length is not zero so the strng is:  "+ hString);
          }
          
          if(gqAr.length > 0 ){
            hString = 'height: '+(adjHeight+40)+'px!important;';
              //console.debug("graph-questio length is not zero so the strng is:  "+ hString);
          }
          
          //adaptive lineup overrides graphquestion
          
          if(alAr.length > 0 ){
            hString = '';
              //console.debug("adaptive-lineup length is not zero so you use no change  "+ hString);
          }
          
         
        
          

            graphBridgeStatic_obj.vwidthPer = gb.vwidthPer;
            ////console.debug("graphBridgeStatic_obj.vwidthPer: "+graphBridgeStatic_obj.vwidthPer);

            //create the style for transform -- basically you need to add the style for the scaling based upon the actual vw.
            //note that this one: .visualization-panel-holder  will only affect visualizations...
            if(!gb.skipResponsive){
                /*
                    var phoneStyleInsert = document.createElement("STYLE");
                    phoneStyleInsert.innerHTML =
                        '@media only screen and (max-width: 600px) {'+
                        '.visualization-panel-holderxxx > div:first-of-type{'+
                        'transform: scale('+gb.vwidthPer+');'+
                        'transform-origin: left top;'+
                        '}'+
                        '.visualization-panel-holder{'+
                        'height: '+(adjHeight+30)+'px!important;'+
                        '}'+   
                        '#contentDiv, #contentDiv1, #contentDiv2, #contentDiv3, #contentDiv4, #contentDiv5, #contentDiv6{'+ 
                        'transform: scale('+gb.vwidthPer+');'+ 
                        'transform-origin: left top;'+ 
                        'height: '+(adjHeight+30)+'px!important;'+
                        '}'+ 

                        '.graph-question {'+ 
                        'max-width: '+(vw-30)+'px;'+ 
                        'width: 100%!important;'+ 
                        '}'+
                        '}';

                    document.getElementsByTagName('head')[0].appendChild(phoneStyleInsert);
                 */


                /*

                    var phoneStyleInsert = document.createElement("STYLE");
                    phoneStyleInsert.innerHTML =
                        '@media only screen and (max-width: 600px) {'+
                        '.visualization-panel-holder{'+
                        'height: '+(adjHeight+30)+'px!important;'+
                        '}'+   
                        '.graph-visualization, .html5-visualization, .dhtml-visualization{'+ 
                        'transform: scale('+gb.vwidthPer+');'+ 
                        'transform-origin: left top;'+ 
                        'height: '+(adjHeight+30)+'px!important;'+
                        '}'+ 
                        '.graph-question {'+ 
                        'max-width: '+(vw-30)+'px;'+ 
                        'width: 100%!important;'+ 
                        '}'+
                        '}';

                    document.getElementsByTagName('head')[0].appendChild(phoneStyleInsert);

                 */
                
                //probably should preface each with this : '#'+gb.confObj.grapher.player.containerId+'
                var phoneStyleInsert = document.createElement("STYLE");
                phoneStyleInsert.innerHTML =
                    '@media only screen and (max-width: 600px) {'+
                    prefaceDiv+'.visualization-panel-holder{'+
                    hString+
                    '}'+   
                    '.graph-visualization{'+ 
                    'transform: scale('+gb.vwidthPer+');'+ 
                    'transform-origin: left top;'+ 
                    'heightxxx: '+(adjHeight+30)+'px!important;'+
                    '}'+ 
                    '.question-stem #contentDiv, .question-stem #contentDiv1, .question-stem #contentDiv2, .question-stem #contentDiv3, .question-stem #contentDiv4, .question-stem #contentDiv5, .question-stem #contentDiv6{'+ 
                    'transform: scale('+gb.vwidthPer+');'+ 
                    'transform-origin: left top;'+ 
                    hString+
                    '}'+ 
                    '.graph-question {'+ 
                    'max-width: '+(vw-30)+'px;'+ 
                    'width: 100%!important;'+ 
                    hString+
                    '}'+
                    '.graph {'+
                    '-webkit-touch-callout: none;'+
                    '-webkit-user-select: none;'+
                    '-khtml-user-select: none;'+
                    '-moz-user-select: moz-none;'+
                    '-ms-user-select: none;'+
                    '-o-user-select: none;'+
                    'user-select: none; '+
                    '}'+
                    '.disabled-swipex {'+
                    '-webkit-touch-callout: none;'+
                    '-webkit-user-select: none;'+
                    '-khtml-user-select: none;'+
                    '-moz-user-select: moz-none;'+
                    '-ms-user-select: none;'+
                    '-o-user-select: none;'+
                    'user-select: none; '+
                    '}'+
                    'foreignObject {'+
                    '-webkit-touch-callout: none;'+
                    '-webkit-user-select: none;'+
                    '-khtml-user-select: none;'+
                    '-moz-user-select: moz-none;'+
                    '-ms-user-select: none;'+
                    '-o-user-select: none;'+
                    'user-select: none; '+
                    '}'+
                '}';

                    document.getElementsByTagName('head')[0].appendChild(phoneStyleInsert);

            }
        }

        const mwd = document.getElementById('main-wrapping-div');


        var messWithInputs = function(){
            var inputAr = mwd.getElementsByTagName('input');
            var selectAr = mwd.getElementsByTagName('select');
            var inumb = 0;
            /*
                for(inumb = 0; inumb < inputAr.length; inumb++){
                    inputAr[inumb].addEventListener("mousedown", function(e){
                        e.target.style.fontSize = "16px";
                    });
                    inputAr[inumb].addEventListener("focusout", function(e){
                        e.target.style.fontSize = "16px";
                    });

                    inputAr[inumb].addEventListener("focus", function(e){
                        e.target.style.fontSize = "";
                    });

                    //console.debug("inputAr[inumb]", inputAr[inumb]);
                }
             */
            for(inumb = 0; inumb < selectAr.length; inumb++){
                const modNumWidth = ((0.6 * selectAr[inumb].clientWidth)/2) - 0;

                const modNumHeight = ((0.6 * selectAr[inumb].clientHeight)/2) - 1;

                
                //console.debug("modNumWidth ; "+modNumWidth);
                
                selectAr[inumb].style.marginRight = -modNumWidth+"px";

                selectAr[inumb].style.marginLeft = -modNumWidth+"px";

                selectAr[inumb].style.marginTop = -modNumHeight+"px";

                selectAr[inumb].style.marginBottom = -modNumHeight+"px";
                
                
                //console.debug("selectAr[inumb].style.marginRight ; "+selectAr[inumb].style.marginRight);
                //console.debug("selectAr[inumb].style.marginLeft ; "+selectAr[inumb].style.marginLeft);
                

                // selectAr[inumb]

                /*
                    selectAr[inumb].addEventListener("mousedown", function(e){
                        e.target.style.fontSize = "16px";
                    });
                    selectAr[inumb].addEventListener("focusout", function(e){
                        e.target.style.fontSize = "16px";
                    });

                    selectAr[inumb].addEventListener("focus", function(e){
                        e.target.style.fontSize = "";
                    });
                 */

                // //console.debug("selectAr[inumb]", selectAr[inumb]);
            }
            ////console.debug("bizarre input function fired");

        };

        messWithInputs();





        //!!!!!!!!!!!MAYBE ADD A TRANSFORM TO SHRINK THEM DOWN TO SCALE? LIKE ON LMS?

        var phoneStyleInsert2 = document.createElement("STYLE");
        phoneStyleInsert2.innerHTML =

            '#main-wrapping-div select, #main-wrapping-div option{'+
            "font-family: 'Lato','Lucida Sans Unicode',Helvetica,Arial,Verdana,sans-serif;"+
            "font-size:  20px;"+
            "text-overflow: clip;"+
            "box-sizing: border-box;"+
            "transform: scale(0.6);"+ 
            '}'+



            '#main-wrapping-div select:focus {'+
            'font-size: 20px;'+
            '}';



        document.getElementsByTagName('head')[0].appendChild(phoneStyleInsert2);
        ////console.debug("gb here... where are we2:",phoneStyleInsert2);




    } 
    // //console.debug("gb here... where are we");
    /* end possible positioning and scaling for phones. */




    // --------------------------------------------------------------------------- actual functionality

    gb.reset = function () {

        // ////console.debug("gb.reset");

    };

    gb.renderMathML = function(targDiv){
        MathJax.Hub.Queue(
                ["Typeset",MathJax.Hub,targDiv]

        );
    };



    graphBridgeStatic_obj.renderMathML = function(targDiv){
        MathJax.Hub.Queue(
                ["Typeset",MathJax.Hub,targDiv]

        );
    };

    //exposed copyobject: you can use it like this:  vars.boardObj.copyObj(lblTextStyle, vars.boardObj.axisLabels[0].style, true);

    graphBridgeStatic_obj.copyObj = function(objFrom, objTo, overwrite){
        copyObj( objFrom, objTo, overwrite );
    };

    //helper function to create a static bat graph. 
    graphBridgeStatic_obj.createBatGraph = function(obj){
        graphBridgeStatic_obj.create('functiongraph',
                [ function(x){ 
                    var val;
                    var a = obj.aValue || 1;
                    var k = obj.kValue || 0;
                    var h = obj.hValue || 0;
                    var pVal = obj.pinchingValue || 2;

                    if(x<-pVal + h){
                        val = a *((x-h)+pVal) + k;
                    }

                    if(x>=-pVal +h && x<=pVal +h){

                        val = a *(((x-h)*(x-h))-(pVal*2)) + k;
                    }

                    if(x>pVal + h){

                        val = a *(-(x-h)+pVal) + k;
                    }

                    return val;
                } ],
                { strokeWidth: obj.strokeWidth, strokeColor: obj.strokeColor }
        );
    };

    //helper function hide the grids and the axis and labels 
    graphBridgeStatic_obj.hideTheGraph = function(obj){
        if(!obj.showGrids){
            graphBridgeStatic_obj.grids[0].setAttribute({
                visible:false
            });
        }

        if(!obj.showHAxis){
            hAxis.setAttribute({
                visible:false
            });
        }

        if(!obj.showVAxis){
            vAxis.setAttribute({
                visible:false
            });
        }
        if(!obj.showLabels){

            ////console.debug("graphBridgeStatic_obj.axisLabels",graphBridgeStatic_obj.axisLabels);
            //vAxis.setAttribute({
            //   visible:false
            // });
            graphBridgeStatic_obj.axisLabels[0].style.visibility = "hidden";
            graphBridgeStatic_obj.axisLabels[1].style.visibility = "hidden";

            graphBridgeStatic_obj.axisLabels[0].style.display = "none";
            graphBridgeStatic_obj.axisLabels[1].style.display = "none";

        }

    };

     graphBridgeStatic_obj.makeLine = function(obj){
        return graphBridgeStatic_obj.create('line',obj.ptArray, obj);
    };

    graphBridgeStatic_obj.makePoint = function(obj){
        return graphBridgeStatic_obj.create('point',[obj.x,obj.y], {fixed:gb.confObj.fixedObjects});
    };

     graphBridgeStatic_obj.makePointsAndLine = function(obj){

        var i;
        var ptStart;
        var ptEnd;
        var pt;
        var line;
        /* note... this just makes point on a line and makes the in between oint gliders. later you can make it just make normal points. */
       // var gliderArray =[];
        for(i=0; i< obj.pts.length; i++){
            if(i===0){
                ptStart = graphBridgeStatic_obj.makePoint({x: obj.pts[i].x, y: obj.pts[i].y});
            }else if(i === obj.pts.length-1){
                ptEnd = graphBridgeStatic_obj.makePoint({x: obj.pts[i].x, y: obj.pts[i].y}); 
            }else{
                //pt = graphBridgeStatic_obj.makePoint({x: obj.pts[i].x, y: obj.pts[i].y});
                //graphBridgeStatic_obj.create('glider', [obj.pts[i].x, obj.pts[i].y, line], {name:'A'+i});
            }
            
        }
         line = graphBridgeStatic_obj.makeLine({ptArray:[ptStart,ptEnd], straightFirst:false, straightLast:false, fixed:gb.confObj.fixedObjects});

        for(i=0; i< obj.pts.length; i++){
            if(i===0){
                //ptStart = graphBridgeStatic_obj.makePoint({x: obj.pts[i].x, y: obj.pts[i].y});
            }else if(i === obj.pts.length-1){
               // ptEnd = graphBridgeStatic_obj.makePoint({x: obj.pts[i].x, y: obj.pts[i].y}); 
            }else{
                //pt = graphBridgeStatic_obj.makePoint({x: obj.pts[i].x, y: obj.pts[i].y});
                graphBridgeStatic_obj.create('glider', [obj.pts[i].x, obj.pts[i].y, line], {name:'A'+i});
            }
            
        }
        
    };
    



    //make it fire the default viz reset function if there is one, and run own reset as well
    /*
    if(gb.grapher.viz){
        var oldReset = gb.grapher.viz.onReset;
        graphBridgeStatic_obj.extendedReset = function() {
            gb.reset();
            oldReset.apply(gb.grapher.viz); // Use #apply in case `init` uses `this`

        };
        gb.grapher.viz.onReset = graphBridgeStatic_obj.extendedReset;
    }
     */

    //turn this to overflow visible so that the edge lines dont get cut off... 
    //... incidentially you could "shrink the containing div" and then reposition the graph to "slice off the edges"  
    gb.thisGraphDiv.style.overflow = "visible";

    return graphBridgeStatic_obj;
}