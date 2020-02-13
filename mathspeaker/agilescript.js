// This is just a temporary copy of the Agile-Mind-specific part of MathJax.js. It can be convenient.
// The official source of the Agile-Mind-specific part, however, is the appended part of MathJax.js.
// This was last updated as part of the upgrade to MathJax 2.7.5.
window.mathjaxConfiguration = function() { 

	MathJax.Hub.Config({
		skipStartupTypeset: true,
		config: ['MMLorHTML.js'],
		jax: ['input/MathML','input/TeX','output/HTML-CSS'],
		extensions: ["tex2jax.js", 'mml2jax.js', 'MathZoom.js', 'TeX/AMSmath.js','TeX/AMSsymbols.js'],
		displayAlign: null,
		imageFont: null,
		messageStyle: "none",
		showMathMenu: false,
		showMathMenuMSIE: false,
	    styles: {
			".MathJax_Display" : {
				"text-align" : null
			},
			"#MathJax_Message": {
				display: "none !important"
			}
		},
		"HTML-CSS": {
			scale: 100,
			minScaleAdjust: 90,
			availableFonts: [],
			preferredFont: null,
			webFont: "STIX-Web"
		},
		tex2jax: {
			inlineMath: [['$$','$$']],
			displayMath: [],
            processEscapes: true,
            processClass: "math"
        },
	});

	MathJax.Hub.Register.StartupHook("mml Jax Ready", function () {
	    MathJax.ElementJax.mml.math.prototype.defaults.scriptsizemultiplier = 0.8;
	    MathJax.ElementJax.mml.math.prototype.defaults.scriptminsize = "12px";
	});

	MathJax.Hub.Register.StartupHook("End", function () {
		window.MathJax = MathJax;
		mathJaxApi.mathJaxReadyCallback();
	});

	window.MathJax = MathJax;

};

window.mathjaxConfigurationA11Y = function() { 

	MathJax.Hub.Config({
		skipStartupTypeset: true,
		config: ['MMLorHTML.js'],
		jax: ['input/MathML','input/TeX','output/HTML-CSS'],
		extensions: ["tex2jax.js", 'mml2jax.js', 'MathZoom.js', 'TeX/AMSmath.js','TeX/AMSsymbols.js', 'a11y/explorer.js'],
		displayAlign: null,
		imageFont: null,
		messageStyle: "none",
		showMathMenu: false,
		showMathMenuMSIE: false,
	    styles: {
			".MathJax_Display" : {
				"text-align" : null
			},
			"#MathJax_Message": {
				display: "none !important"
			}
		},
		"HTML-CSS": {
			scale: 100,
			minScaleAdjust: 90,
			availableFonts: [],
			preferredFont: null,
			webFont: "STIX-Web"
		},
		tex2jax: {
			inlineMath: [['$$','$$']],
			displayMath: [],
            processEscapes: true,
            processClass: "math"
        },
        explorer: {
            walker: 'syntactic',         // none, syntactic, semantic
            highlight: 'hover',           // none, hover, flame
            background: 'blue',          // blue, red, green, yellow, cyan, magenta, white, black
            foreground: 'black',         // black, white, magenta, cyan, yellow, green, red, blue
            speech: true,                // true, false
            generation: 'lazy',          // eager, mixed, lazy
            subtitle: true,              // true, false
            ruleset: 'mathspeak-default' // mathspeak-default, mathspeak-brief, mathspeak-sbrief, chromevox-default, chromevox-short, chromevox-alternative
        },
	});

	MathJax.Hub.Register.StartupHook("mml Jax Ready", function () {
	    MathJax.ElementJax.mml.math.prototype.defaults.scriptsizemultiplier = 0.8;
	    MathJax.ElementJax.mml.math.prototype.defaults.scriptminsize = "12px";
	});

	MathJax.Hub.Register.StartupHook("End", function () {
		window.MathJax = MathJax;
		mathJaxApi.mathJaxReadyCallback();
	});

	window.MathJax = MathJax;

};

var processAllMathEquations = function () {
	MathJax.Hub.Queue(["Typeset", MathJax.Hub], function () {
		if (mathJaxApi) {
			mathJaxApi.mathJaxTypeSettingDoneCallback();
		}
	});
};

var processAllMathEquationsWithCallback = function (callback) {
	MathJax.Hub.Queue(["Typeset", MathJax.Hub], callback);
};

var processMathEquations = function (element, callback) {
	MathJax.Hub.Queue(["Typeset", MathJax.Hub, element], callback);
};

var getMathJaxLog = function () {
	return MathJax.Message.Log();
};

if(window.mathJaxApi && window.mathJaxApi.scriptLoadedCallback) {
	window.mathJaxApi.scriptLoadedCallback();
}
