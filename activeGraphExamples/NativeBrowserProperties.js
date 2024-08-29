/* eslint-disable max-len */

// Trac #28879: to distinguish iPad vs. iPhone in desktop mode:
const MIN_IPAD_DIMENSION = 700; // iPad mini is 768, so somewhat smaller than 768

// WARNING: HORRIBLE HACK:
const PHONY_SAFARI_IPAD_UA_STRING =
  'Mozilla/5.0 (iPad; CPU OS 13_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/87.0.4280.77 Mobile/15E148 Safari/604.1';
const REPLACEMENT_SAFARI_IPAD_UA_STRING =
  'Mozilla/5.0 (iPad; CPU iPad OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

const PLATFORM_REGEX =
  /\([^)]*?(?:(SMART-TV); )?(Linux[;:] ?(?:U; )?(?:Android|Ubuntu|\w+)|Windows(?: NT)?|(?:X11; ?)?CrOS|Macintosh|iPhone|iPad|(?:X11; ?)?Linux|\w+)\b([^)]+)\).*?Gecko(?:\)|\/\d*)/g;
const PLATFORM_DEVICE_X = 1;
const DEVICE_OR_OS_X = 2;
const PLATFORM_INFO_X = 3;

// const BRAND_REGEX = /\b(?:(Mobile(?:\/\w+|\b))|(?:(Ubuntu)(?:\/(\d+(?:\.\d+)*))?)|(?<!like )(?:(Chrom(?:e|ium)|CriOS|Version|Edg(?:e|iOS)?|Firefox|FxiOS|SamsungBrowser|OPR|Silk|Netscape))\/(\d+(?:\.\d\w*)*))\b/g;

// NOTE: the `(like )` clause should be a negative look behind as above, but because Safari lacks this...:
const BRAND_REGEX =
  /\b(?:(Mobile(?:\/\w+|\b))|(?:(Ubuntu)(?:\/(\d+(?:\.\d+)*))?)|(like )?(?:(Chrom(?:e|ium)|CriOS|Version|Edg(?:e|iOS)?|Firefox|FxiOS|SamsungBrowser|OPR|Silk|Netscape|Camino|Ubuntu|\w+))\/(\d+(?:\.\d\w*)*))\b/g;
const BRAND_MOBILE_X = 1;
const BRAND_PLATFORM_X = 2;
const BRAND_PLATFORM_VERSION_X = 3;
const BRAND_LIKE_X = 4;
const BRAND_NAME_X = 5;
const BRAND_VERSION_X = 6;

const INFO_REGEX =
  /((?:\b|_)x86(?=\b|_64\b)|\bx64\b|\bIntel\b|\bWOW64\b|\barm(?=\b|v\d\w*\b))|\b(\d+(?:[._]\d+)*)\b/g;
const INFO_ARCH_ID_X = 1;
const INFO_FULL_VERSION_X = 2;
// const INFO_VERSION_X = 3;

const LEGACY_PHONE_CHECK = /\b(?:(?:IE)?Mobile|Windows Phone)\b/;
const KNOWN_BROWSER_REGEX =
  /\b(?:Chrome|Chromium|Edge|Firefox|IE|Opera|Safari)\b/i;

const IS_OTHER_DEVICE = Symbol('isOtherDevice');

// Order is important:
const LEGACY_BROWSERS = [
  {
    groupProperties: { browserId: 'Opera' },
    regex:
      /^Opera\b[^(]+\([^)]*?(Windows(?: NT)?|Macintosh|iPhone|iPad|Linux)[^)]*\).*?Version\/(\d+(?:\.\d\w*)*)/,
    platform: 1,
    version: 2,
  },
  {
    // Mobile IE
    groupProperties: { browserId: 'IE', platform: 'Windows' },
    regex:
      /\bWindows Phone(?:\s*(\d+(?:\.\d+)*))?\b.*?\bIEMobile\/(\d+(?:\.\d+)*)/,
    platformVersion: 1,
    version: 2,
  },
  {
    // MsIE 11
    groupProperties: { browserId: 'IE', platform: 'Windows' },
    regex: /\(Windows\b.*?\bTrident\/\d+.*?\brv:(\d+(?:\.\d+)*)/,
    version: 1,
  },
  {
    // Mobile IE
    groupProperties: { browserId: 'IE', platform: 'WindowsCE' },
    regex:
      /\((?:compatible|Mozilla\/[.\d]*); MSIE (?:\d+(?:\.\d+)*); Windows CE; IEMobile[ /](\d+(?:\.\d+)*)\b/,
    version: 1,
  },
  {
    // older MS IE version
    groupProperties: { browserId: 'IE', platform: 'Windows' },
    regex: /\((?:compatible|Mozilla\/[.\d]*); MSIE (\d+(?:\.\d+)*); Windows\b/,
    version: 1,
  },
  {
    groupProperties: { browserId: 'Mozilla' },
    regex: /^Mozilla[^(]*\(.*?\bU; (\w+)[^)]+\brv:(\d+(?:\.\d+)*)/,
    platform: 1,
    version: 2,
  },
  {
    // smartboard
    groupProperties: {
      browserId: 'Chromium',
      device: 'SmartBoard',
      isTablet: false,
    },
    regex: /^Chromium (\d+(?:\.\d+)*).+?(Android) (\d+(?:\.\d+)*); SMARTEMB\b/,
    version: 1,
    platform: 2,
    platformVersion: 3,
  },
  {
    // Some older Linux/Ubuntu Chromium browsers do not follow usual rules:
    groupProperties: { browserId: 'Chromium', isChromium: true },
    regex:
      /\((Linux;?(?: Ubuntu)?) (\d+(?:\.\d+)*).+?Chromium\/(\d+(?:\.\d+)*)\b/,
    platform: 1,
    platformVersion: 2,
    version: 3,
  },
];

/* eslint-enable max-len */

const BASE_PROPERTIES = {
  Chrome: { browserId: 'Chrome', isChrome: true },
  Safari: { browserId: 'Safari', isSafari: true },
  Edge: { browserId: 'Edge', isEdge: true },
  Chromium: { browserId: 'Chromium', isChromium: true },
  Firefox: { browserId: 'Firefox', isFirefox: true },
  Opera: { browserId: 'Opera', isOpera: true },
  Netscape: { browserId: 'Netscape' },
  x64: { architecture: 'x86' },
  arm: { architecture: 'arm' },
  Windows: { platform: 'Windows', isWindows: true },
  AndroidTablet: {
    platform: 'Android',
    isAndroid: true,
    device: 'tablet',
    isTablet: true,
  },
  ChromeOS: { platform: 'ChromeOS', isChromeOS: true },
  Android: { platform: 'Android', isAndroid: true },
  Linux: { platform: 'Linux', isLinux: true },
  Ubuntu: { platformVariant: 'Ubuntu', isUbuntu: true },
  CrOS: { platform: 'ChromeOS', isChromeOS: true, isDesktop: true },
  iOS: { platform: 'iOS', architecture: 'arm', isIOS: true },
  MacOS: {
    platform: 'MacOS',
    device: 'desktop',
    deviceBrand: 'Macintosh',
    isMacintosh: true,
    isMacOS: true,
    isDesktop: true,
  },
  iPad: {
    architecture: 'arm',
    device: 'tablet',
    deviceBrand: 'iPad',
    isTablet: true,
    isIPad: true,
  },
  desktopIPad: {
    architecture: 'arm',
    device: 'desktop',
    deviceBrand: 'iPad',
    isDesktop: true,
    isIPad: true,
  },
  iPhone: {
    architecture: 'arm',
    device: 'phone',
    deviceBrand: 'iPhone',
    isPhone: true,
    isIPhone: true,
  },
  desktopIPhone: {
    architecture: 'arm',
    device: 'desktop',
    deviceBrand: 'iPhone',
    isDesktop: true,
    isIPhone: true,
  },
  IE: { browserId: 'IE', isIE: true },
  WindowsCE: { platformVariant: 'WindowsCE', isPhone: true },
  phone: { device: 'phone', isPhone: true },
  tablet: { device: 'tablet', isTablet: true },
  desktop: { device: 'desktop', isDesktop: true },
  SmartTv: { device: 'SmartTv', [IS_OTHER_DEVICE]: true, isSmartTv: true },
  SmartBoard: {
    device: 'SmartBoard',
    [IS_OTHER_DEVICE]: true,
    isSmartBoard: true,
  },
};

const PROPERTY_GROUPS = {
  Chrome: BASE_PROPERTIES.Chrome,
  ['Google Chrome']: BASE_PROPERTIES.Chrome,
  CriOS: Object.assign(
    {},
    BASE_PROPERTIES.Chrome,
    BASE_PROPERTIES.iOS,
    BASE_PROPERTIES.iPhone,
  ),
  Chromium: BASE_PROPERTIES.Chromium,
  Safari: BASE_PROPERTIES.Safari,
  Edge: BASE_PROPERTIES.Edge,
  Edg: BASE_PROPERTIES.Edge,
  ['Microsoft Edge']: BASE_PROPERTIES.Edge,
  EdgiOS: Object.assign({}, BASE_PROPERTIES.Edge, BASE_PROPERTIES.iOS),
  Opera: BASE_PROPERTIES.Opera,
  OPR: BASE_PROPERTIES.Opera,
  Firefox: BASE_PROPERTIES.Firefox,
  FxiOS: Object.assign(
    {},
    BASE_PROPERTIES.Firefox,
    BASE_PROPERTIES.iOS,
    BASE_PROPERTIES.iPhone,
  ),
  Netscape: BASE_PROPERTIES.Netscape,
  x64: BASE_PROPERTIES.x64,
  _x64: BASE_PROPERTIES.x64,
  WOW64: BASE_PROPERTIES.x64,
  x86: BASE_PROPERTIES.x64,
  Intel: BASE_PROPERTIES.x64,
  arm: BASE_PROPERTIES.arm,
  Windows: BASE_PROPERTIES.Windows,
  ['Windows NT']: BASE_PROPERTIES.Windows,
  AndroidTablet: Object.assign(
    {},
    BASE_PROPERTIES.Android,
    BASE_PROPERTIES.AndroidTablet,
  ),
  Android: BASE_PROPERTIES.Android,
  ChromeOS: BASE_PROPERTIES.ChromeOS,
  ['Chrome OS']: BASE_PROPERTIES.ChromeOS,
  ['Linux; Android']: BASE_PROPERTIES.Android,
  ['Linux; U; Android']: BASE_PROPERTIES.Android,
  ['Linux;Android']: BASE_PROPERTIES.Android,
  ['Linux: Android']: BASE_PROPERTIES.Android,
  Linux: BASE_PROPERTIES.Linux,
  ['X11; Linux']: BASE_PROPERTIES.Linux,
  Ubuntu: Object.assign({}, BASE_PROPERTIES.Linux, BASE_PROPERTIES.Ubuntu),
  ['Linux; Ubuntu']: Object.assign(
    {},
    BASE_PROPERTIES.Linux,
    BASE_PROPERTIES.Ubuntu,
  ),
  ['Linux: Ubuntu']: Object.assign(
    {},
    BASE_PROPERTIES.Linux,
    BASE_PROPERTIES.Ubuntu,
  ),
  CrOS: BASE_PROPERTIES.CrOS,
  ['X11; CrOS']: BASE_PROPERTIES.CrOS,
  MacOS: BASE_PROPERTIES.MacOS,
  macOS: BASE_PROPERTIES.MacOS,
  Macintosh: BASE_PROPERTIES.MacOS,
  iOS: BASE_PROPERTIES.iOS,
  iPad: Object.assign({}, BASE_PROPERTIES.iPad, BASE_PROPERTIES.iOS),
  desktopIPad: Object.assign(
    {},
    BASE_PROPERTIES.desktopIPad,
    BASE_PROPERTIES.iOS,
  ),
  iPhone: Object.assign({}, BASE_PROPERTIES.iPhone, BASE_PROPERTIES.iOS),
  desktopIPhone: Object.assign(
    {},
    BASE_PROPERTIES.desktopIPhone,
    BASE_PROPERTIES.iOS,
  ),
  IE: Object.assign({}, BASE_PROPERTIES.Windows, BASE_PROPERTIES.IE),
  MsIE_11: Object.assign({}, BASE_PROPERTIES.Windows, BASE_PROPERTIES.IE),
  WindowsCE: Object.assign(
    {},
    BASE_PROPERTIES.Windows,
    BASE_PROPERTIES.WindowsCE,
    BASE_PROPERTIES.IE,
  ),
  ['Windows CE']: Object.assign(
    {},
    BASE_PROPERTIES.Windows,
    BASE_PROPERTIES.WindowsCE,
    BASE_PROPERTIES.IE,
  ),
  phone: BASE_PROPERTIES.phone,
  tablet: BASE_PROPERTIES.tablet,
  desktop: BASE_PROPERTIES.desktop,
  SmartTv: BASE_PROPERTIES.SmartTv,
  smartTv: BASE_PROPERTIES.SmartTv,
  ['SMART-TV']: BASE_PROPERTIES.SmartTv,
  ['SMART-TV; X11; Linux']: Object.assign(
    {},
    BASE_PROPERTIES.SmartTv,
    BASE_PROPERTIES.Linux,
  ),
  SmartBoard: BASE_PROPERTIES.SmartBoard,
  smartBoard: BASE_PROPERTIES.SmartBoard,
  SMARTEMB: BASE_PROPERTIES.SmartBoard,
};

// OS's that can run on desktop
const DESKTOP_PLATFORMS = [
  'Windows',
  'MacOS',
  'ChromeOS',
  'Linux',
  'Firefox',
  'Silk',
];

// By default, this.readyPromise forced to resolve after 2 secs:
const hiEntropyPromiseTimeout = 2000;
// We use these navigator.userAgentData high entropy properties:
const hiEntropyProperties = [
  'architecture',
  'bitness',
  'model',
  'platformVersion',
  'uaFullVersion',
];

class NativeBrowserProperties {
  /**
   * Creates a NativeBrowserProperties instance with default property values.
   *
   * Unless `skipInitialize` is "truthy", this also intializes this NativeBrowserProperties object
   * from the navigator.userAgentData object or the navigator.userAgent string.
   *
   * The `skipInitialize` flag skips the default initialization.
   * This is useful for running test cases of specific user agent data or strings.
   *
   * For user agent data objects, high entropy values are only available via a promise.
   * The NativeBrowserProperties `readyPromise` will wait for such a hi entropy value promise to resolve.
   * The `timeoutMs` value, if present and non-zero, will resolve `readyPromise` after waiting.
   * This allows loading, etc. to proceed, although without the high entoropy browser property values.
   * The low entropy values are always available after initialization.
   *
   * @param {boolean} skipInitialize    Skip the default initialization
   * @param {int}     timeoutMs         Supplied to default initailization as the high entropy values promise timeout.
   */
  constructor(skipInitialize, timeoutMs = hiEntropyPromiseTimeout) {
    this.properties = {};
    if (!skipInitialize) {
      this.initialize(navigator.userAgentData, navigator.userAgent, timeoutMs);
    }
  }

  getBrowserId() {
    return this.properties.browserId;
  }
  hasPointerEvents() {
    return this.properties.hasPointerEvents;
  }
  hasTouchAPI() {
    return this.properties.hasTouchAPI;
  }
  getVersion() {
    return this.properties.version; // Browser major version
  }
  getFullVersion() {
    return this.properties.fullVersion; // Browser full version string
  }
  getPlatform() {
    return this.properties.platform; // OS name
  }
  getPlatformVersion() {
    return this.properties.platformVersion; // OS major version
  }
  getFullPlatformVersion() {
    return this.properties.fullPlatformVersion; // OS full version string
  }
  getArchitecture() {
    return this.properties.architecture; // Type of processor
  }
  getChromeVersion() {
    return this.properties.chromeVersion; // Chrome/Chromium version if Chrome-based browser
  }
  getFullChromeVersion() {
    return this.properties.fullChromeVersion; // Chrome/Chromium full version if Chrome-based browser
  }
  isChrome() {
    return this.properties.isChrome; // Browser is Chrome
  }
  isChromeBased() {
    return this.properties.chromeVersion > 0;
  }
  isMobileChrome() {
    return this.properties.isChrome && this.properties.isMobile;
  }
  isDesktopChrome() {
    return this.properties.isChrome && this.properties.isDesktop;
  }
  isChromium() {
    return this.properties.isChromium; // Browser is Chromium
  }
  isEdge() {
    return this.properties.isEdge;
  }
  isMobileEdge() {
    return this.properties.isEdge && this.properties.isMobile;
  }
  isDesktopEdge() {
    return this.properties.isEdge && this.properties.isDesktop;
  }
  isIOSEdge() {
    return this.properties.isIOSDevice() && this.properties.isEdge;
  }
  isChromiumEdge() {
    return this.properties.isEdge && this.properties.chromiumVersion > 0;
  }
  isNonChromiumEdge() {
    return this.properties.isEdge && this.properties.chromiumVersion === 0;
  }
  isFirefox() {
    return this.properties.isFirefox;
  }
  isMobileFirefox() {
    return this.properties.isFirefox && this.properties.isMobile;
  }
  isDesktopFirefox() {
    return this.properties.isFirefox && this.properties.isDesktop;
  }
  isIE() {
    return this.properties.isIE;
  }
  isMobileIE() {
    return this.properties.isIE && this.properties.isMobile;
  }
  isDesktopIE() {
    return this.properties.isIE && this.properties.isDesktop;
  }
  isOpera() {
    return this.properties.isOpera;
  }
  isSafari() {
    return this.properties.isSafari;
  }
  isMobileSafari() {
    return this.properties.isSafari && this.properties.isMobile;
  }
  isDesktopSafari() {
    return this.properties.isSafari && this.properties.isDesktop;
  }
  isOtherBrowser() {
    return this.properties.isOtherBrowser;
  }
  isAndroid() {
    return this.properties.isAndroid;
  }
  isMobileAndroid() {
    return this.properties.isAndroid && this.properties.isMobile;
  }
  isDesktopAndroid() {
    return this.properties.isAndroid && this.properties.isDesktop;
  }
  isChromeOS() {
    return this.properties.isChromeOS;
  }
  isIOS() {
    return this.properties.isIOS;
  }
  isLinux() {
    return this.properties.isLinux;
  }
  isMacOS() {
    return this.properties.isMacOS;
  }
  isUbuntu() {
    return this.properties.isUbuntu;
  }
  isWindows() {
    return this.properties.isWindows;
  }
  isIOSDevice() {
    return this.properties.isIPad || this.properties.isIPhone; // IPad or IPhone device
  }
  isDesktop() {
    return this.properties.isDesktop;
  }
  isIPad() {
    return this.properties.isIPad;
  }
  isDesktopIPad() {
    return this.properties.isIPad && this.properties.isDesktop;
  }
  isIPhone() {
    return this.properties.isIPhone;
  }
  isMacintosh() {
    return this.properties.isMacintosh;
  }
  isMobile() {
    return this.properties.isMobile;
  }
  isPhone() {
    return this.properties.isPhone;
  }
  isSmartBoard() {
    return this.properties.isSmartBoard;
  }
  isSmartTv() {
    return this.properties.isSmartTv;
  }
  isTablet() {
    return this.properties.isTablet;
  }
  isOtherDevice() {
    return this.properties.isSmartTv || this.properties.isSmartBoard;
  }
  isMozilla() {
    const properties = this.properties;
    return !(
      properties.isMobile ||
      properties.isIE ||
      properties.isEdge ||
      properties.isChrome ||
      properties.isSafari
    );
  }

  phoneOnly(styles) {
    return this.properties.isPhone ? styles : ``;
  }

  androidOnly(styles) {
    return this.properties.isAndroid ? styles : ``;
  }

  /**
   * Set browser properties based on a user agent string or user agent data object.
   * This is typically called by the contructor using `navigator.userAgentData` and `navigator.userAgent`.
   * But for testing it is useful cancel this default initialization and
   * explicitly call this method with test case with test user agent string or data objects.
   *
   * For user agent data objects, high entropy values are only available via a promise.
   * The NativeBrowserProperties `readyPromise` will wait for such a hi entropy value promise to resolve.
   * The `timeoutMs` value, if present and non-zero, will resolve `readyPromise` after waiting.
   * This allows loading, etc. to proceed, although without the high entoropy browser property values.
   * The low entropy values are always available after initialization.
   *
   * Sniffs `navigator` and `window` properties to set predicate properties `hasTouchAPI` and `hasPointerEvents`.
   *
   * @param {Object}  uaData      A user agent data object or proxy UA data object
   * @param {Object}  uaString    A conventional user agent string
   * @param {int}     timeoutMs   Timeout for resolving the ready promise.
   *
   * @return {NativeBrowserProperties}   this object
   */
  initialize(uaData, uaString, timeoutMs = hiEntropyPromiseTimeout) {
    const properties = this.properties;
    properties.hasTouchAPI =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;
    // properties.hasTouchAPI = !!(
    //   window.ontouchstart ||
    //   (window.clientInformation && window.clientInformation.maxTouchPoints >= 0
    //     ? window.clientInformation.maxTouchPoints > 0
    //     : navigator.pointerEnabled
    //     ? navigator.maxTouchPoints
    //     : navigator.msPointerEnabled
    //     ? navigator.msMaxTouchPoints
    //     : window.Touch)
    // );
    properties.hasPointerEvents = 'PointerEvent' in window;

    if (uaData) {
      this.setupFromUaData(uaData);
    }
    if (!properties.browserId) {
      // No success with ua data, so try navigator.userAgent
      if (uaString) {
        this.setupFromUaString(uaString);
      }
    }
    if (!properties.browserId) {
      // Gracefully handle browser identification failures:
      this.setBrowserAttributes(
        'OtherBrowser',
        null,
        null,
        null,
        null,
        null,
        null,
      );
    }
    this.setupPromise(uaData, timeoutMs);
    return this;
  }

  /**
   * Set some useful composite properties:
   *    - isDesktop
   *    - isIPad when an iPad is using desktop mode
   */
  finalizeProperties() {
    const properties = this.properties;
    if (!properties.isDesktop && (properties.isPhone || properties.isTablet)) {
      properties.isMobile = true;
    } else if (
      !this.properties[IS_OTHER_DEVICE] &&
      DESKTOP_PLATFORMS.indexOf(properties.platform) >= 0
    ) {
      this.applyGroupProperties('desktop');
    }
    const browserId = properties.browserId;
    if (!(browserId && KNOWN_BROWSER_REGEX.test(browserId))) {
      properties.isOtherBrowser = true;
    }
  }

  /**
   * Sets up the ready promise for this NativeBrowserProperties object.
   * If `uaData` object is falsy the ready promise resolves immediately.
   * This is the case for UA string UA data.
   * Otherwise, if `timeoutMs` > 0, resolves the ready promise without high entropy values.
   * In this case, this object will only contain lower entropy browser property values.
   * If the high entropy promise resolves prior to any timeout,
   * this object will contain those high entropy value.
   * Potentially, the ready promise may never resolve.
   *
   * @param {Object}  uaData      A user agent data object or proxy UA data object
   * @param {int}     timeoutMs   Timeout for resolving the ready promise.
   */
  setupPromise(uaData, timeoutMs = hiEntropyPromiseTimeout) {
    if (!uaData) uaData = navigator.userAgentData;
    if (uaData && uaData.getHighEntropyValues) {
      let readyPromiseResolve;
      let timeoutId = 0;
      this.readyPromise = new Promise((resolve) => {
        readyPromiseResolve = resolve;
      });
      const hiEPromise = uaData.getHighEntropyValues(hiEntropyProperties);
      hiEPromise.then((uaObject) => {
        if (timeoutId > 0) clearTimeout(timeoutId);
        this.setupFromUaData(uaObject);
        this.finalizeProperties();
        readyPromiseResolve(this);
      });
      // The browser could reject hiEPromise
      // If so, use the already processed low entropy data:
      hiEPromise.catch(() => {
        if (timeoutId > 0) clearTimeout(timeoutId);
        this.finalizeProperties();
        readyPromiseResolve(this);
      });
      if (timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          this.finalizeProperties();
          readyPromiseResolve(this); // promise resolves even if HiE data not available
        }, timeoutMs);
      }
    } else {
      this.finalizeProperties();
      this.readyPromise = Promise.resolve();
    }
  }

  /**
   * Uses `uaData` to set browser properties.
   * Handles both low and high entropy ua data objects.
   * The `uaData` object may be `navigator.userAgentData` or
   * the the `navigator.userAgentData.getHighEntropyValues()` promise value.
   * @param {UserAgentData} uaData  The UserAgentData object
   */
  setupFromUaData(uaData) {
    if (!uaData || !uaData.brands || uaData.brands.length === 0) return;
    const { architecture, platformVersion, uaFullVersion, mobile } = uaData;
    const uaBrands = uaData.fullVersionList || uaData.brands;
    const platform = uaData.platform;
    if (mobile) this.applyGroupProperties('phone');
    let nonChromeBrand;
    const brands = {};
    for (const brandObj of uaBrands) {
      const brand = this.getGroupValue(brandObj.brand, 'browserId');
      if (brand) {
        brands[brand] = brandObj.version;
        if (!(brand === 'Chrome' || brand === 'Chromium')) {
          nonChromeBrand = brand;
        }
      }
    }
    const mainBrand =
      nonChromeBrand ||
      (brands.Chrome && 'Chrome') ||
      (brands.Chromium && 'Chromium');
    const mainVersion = uaFullVersion || brands[mainBrand];
    const chromeVersion = brands.Chrome || brands.Chromium;
    this.setBrowserAttributes(
      mainBrand,
      mainVersion,
      chromeVersion,
      platform,
      platformVersion,
      architecture,
    );
    // this.setupEngineBrands(brands);
  }

  /**
   * Provide version information about browser engines on which the identified browser is built.
   * E.g., Chromium / Chrome for newer Edge Chromium-based browsers
   * @param {Object}  brands    Object: {brandName1: version, brandName2: version, ...}
   */
  setupEngineBrands(brands) {
    const properties = this.properties;
    for (const brand of Object.getOwnPropertyNames(brands)) {
      if (brand !== properties.browserId && brand !== 'Version') {
        const version = brands[brand];
        properties[`${brand.charAt(0).toLowerCase()}${brand.slice(1)}Version`] =
          parseInt(version);
        properties[
          `full${brand.charAt(0).toUpperCase()}${brand.slice(1)}Version`
        ] = version;
      }
    }
  }

  /**
   * Set the platform version.
   * `platformVersion` should be the full version if available, otherwise just the major platform version.
   * The platform version property value is always the major platform version as an integer.
   * The full platform version property value is the input `platformVersion` string.
   * @param {String}  platformVersion   The platform version
   */
  setPlatformVersion(platformVersion) {
    if (platformVersion) {
      // Ensure '.' separators
      platformVersion = platformVersion.replace(/_/g, '.');
      this.properties.platformVersion = parseInt(platformVersion);
      this.properties.fullPlatformVersion = platformVersion;
    }
  }

  /**
   * Use `keyValue` to access a set of group properties and apply them to `this.properties`.
   * If there is no defined group for `keyValue` and `defaultValue` is truthy,
   * set `this.properties[property] = `keyValue`.
   * Return the final value of `this.properties[property]`.
   * If `property` is null, any found properties are applied to `this.properties` and `defaultValue` returned.
   * @param {string} keyValue      The property value key in `PROPERTY_GROUPS`.
   * @param {string} property      The required property in the group properties or added with `defaultValue`
   * @param {Object} defaultValue  If truthy, set `this.properties[property] = defaultValue`.
   * @return {object}              The final `this.properties[property]` value, null if not set.
   */
  applyGroupProperties(keyValue, property, defaultValue) {
    if (!keyValue) return null;
    const groupProps = PROPERTY_GROUPS[keyValue];
    if (!property) {
      if (groupProps) Object.assign(this.properties, groupProps);
      return defaultValue;
    }
    const value = groupProps && groupProps[property];
    if (value) {
      Object.assign(this.properties, groupProps);
      return value;
    } else if (defaultValue) {
      this.properties[property] = defaultValue;
      return defaultValue;
    }
    return null;
  }

  /**
   * Return the property group value for `property`, returning `defaultValue` if not present.
   * @param {string} keyValue        The property value key in `PROPERTY_GROUPS`.
   * @param {string} property       The property in the group properties
   * @param {Object} defaultValue   Default value to return if `property` is not present in the named property group
   * @return {Object}   The current group value of `property` or `defaultValue`
   */
  getGroupValue(keyValue, property, defaultValue) {
    const props = PROPERTY_GROUPS[keyValue];
    return (props && props[property]) || defaultValue;
  }

  /**
   * Set browser ID, platform, and version numbers.
   * If architecture is not falsey, this specifies the browser OS.
   * Optionally pulls architecture and OS versions from platformInfo if provided.
   * Optionally set architecture (OS) and architecture version numbers if `platformInfo` is not falsey.
   * The explicit archtecture parameter overrides any architecture found from platformInfo.
   * @param {String} browserId        Identifier for Browser brand.
   * @param {String} version          Full browser version string (but may contain only major version).
   * @param {String} chromeVersion    Full Chrome/Chromium version for Chrome-based barowsers.
   * @param {String} deviceOrOS       The browser platform (OS) or device.
   * @param {String} platformVersion  OS version.
   * @param {String} architecture     If not falsey explicit architecture
   * @param {String} platformInfo     The platform information portion of the UA string.
   */
  setBrowserAttributes(
    browserId,
    version,
    chromeVersion,
    deviceOrOS,
    platformVersion,
    architecture,
    platformInfo,
  ) {
    const properties = this.properties;
    if (deviceOrOS) {
      const deviceBrand = this.getGroupValue(deviceOrOS, 'deviceBrand');
      if (
        deviceBrand === 'Macintosh' &&
        properties.hasTouchAPI /* && browserId === 'Safari' */
      ) {
        if (
          window.top.screen.width < MIN_IPAD_DIMENSION ||
          window.top.screen.height < MIN_IPAD_DIMENSION
        ) {
          this.applyGroupProperties('desktopIPhone', null);
        } else {
          this.applyGroupProperties('desktopIPad', null);
        }
      } else {
        this.applyGroupProperties(deviceOrOS, 'platform');
      }
    }
    const platform = properties.platform;
    if (
      !properties.isPhone &&
      !properties[IS_OTHER_DEVICE] &&
      platform === 'Android'
    ) {
      this.applyGroupProperties('tablet');
    }
    this.applyGroupProperties(browserId, 'browserId', browserId);
    if (version) {
      properties.fullVersion = version;
      properties.version = parseInt(version) || 0;
    }
    if (chromeVersion) {
      properties.fullChromeVersion = chromeVersion;
      properties.chromeVersion = parseInt(chromeVersion) || 0;
      properties.isChromeBased = true;
    }
    if (platformInfo) {
      let m;
      INFO_REGEX.lastIndex = 0;
      while ((m = INFO_REGEX.exec(platformInfo))) {
        if (m[INFO_ARCH_ID_X]) {
          if (!architecture) {
            architecture = m[INFO_ARCH_ID_X];
          }
        } else if (platform && !platformVersion) {
          platformVersion = m[INFO_FULL_VERSION_X];
        }
      }
    }
    if (architecture && !properties.architecture) {
      this.applyGroupProperties(architecture, 'architecture');
    }
    if (platformVersion && !properties.platformVersion) {
      this.setPlatformVersion(platformVersion);
    }
  }

  /**
   * Analyze the userAgent string for browser properties
   * @param {String} uaString   The userAgent string.
   */
  setupFromUaString(uaString) {
    // WARNING: HORRIBLE HACK:
    if (uaString === PHONY_SAFARI_IPAD_UA_STRING) {
      uaString = REPLACEMENT_SAFARI_IPAD_UA_STRING;
    }

    PLATFORM_REGEX.lastIndex = 0;
    const properties = this.properties;
    let m = PLATFORM_REGEX.exec(uaString);
    const brands = {};
    if (!m) {
      this.setupLegacyBrowser(uaString);
    } else {
      const platformInfo = m[PLATFORM_INFO_X];
      const lastIndex = PLATFORM_REGEX.lastIndex;
      let deviceOrOS = m[DEVICE_OR_OS_X];
      let device = m[PLATFORM_DEVICE_X];
      let brandPlatform;
      let platformVersion;
      let nonChromeBrand;
      device = this.applyGroupProperties(device, 'device', device);
      BRAND_REGEX.lastIndex = lastIndex;
      while ((m = BRAND_REGEX.exec(uaString))) {
        if (m[BRAND_MOBILE_X]) {
          if (this.getGroupValue(deviceOrOS, 'deviceBrand') != 'iPad') {
            this.applyGroupProperties('phone', 'device');
          }
        } else if ((brandPlatform = m[BRAND_PLATFORM_X])) {
          let maybePlatform = this.applyGroupProperties(
            brandPlatform,
            'platformVariant',
          );
          if (!maybePlatform && !deviceOrOS) {
            maybePlatform = deviceOrOS = this.getGroupValue(
              brandPlatform,
              'platform',
            );
          }
          if (maybePlatform) {
            platformVersion = platformVersion || m[BRAND_PLATFORM_VERSION_X];
          }
        } else {
          const like = m[BRAND_LIKE_X];
          if (!like) {
            let brand = m[BRAND_NAME_X];
            brand = this.getGroupValue(brand, 'browserId', brand);
            const version = m[BRAND_VERSION_X];
            if (brand && brand !== 'AppleWebKit' && brand != 'Safari') {
              brands[brand] = version || '0';
              if (
                brand !== 'Chrome' &&
                brand !== 'Chromium' &&
                brand !== 'Version'
              ) {
                nonChromeBrand = brand;
              }
            }
          }
        }
      }
      const theOS = this.getGroupValue(deviceOrOS, 'platform', deviceOrOS);
      this.applyGroupProperties(device, 'device');

      if (
        brands.Version &&
        !brands.Chrome &&
        !nonChromeBrand &&
        (theOS === 'MacOS' || theOS === 'iOS')
      ) {
        this.setBrowserAttributes(
          'Safari',
          brands.Version,
          null,
          deviceOrOS,
          platformVersion,
          null,
          platformInfo,
        );
      } else if (brands.Chrome || brands.Chromium) {
        const mainBrand =
          nonChromeBrand || (brands.Chrome ? 'Chrome' : 'Chromium');
        const chromeVersion = brands.Chrome || brands.Chromium;
        const mainVersion = brands[mainBrand];
        this.setBrowserAttributes(
          mainBrand,
          mainVersion,
          chromeVersion,
          deviceOrOS,
          platformVersion,
          null,
          platformInfo,
        );
        // this.setupEngineBrands(brands);
      } else if (brands.Firefox) {
        this.setBrowserAttributes(
          'Firefox',
          brands.Firefox,
          null,
          deviceOrOS,
          platformVersion,
          null,
          platformInfo,
        );
      } else if (brands.Version && theOS === 'Windows') {
        this.setBrowserAttributes(
          'Safari',
          brands.Version,
          null,
          deviceOrOS,
          platformVersion,
          null,
          platformInfo,
        );
      } else if (nonChromeBrand) {
        const version = brands[nonChromeBrand];
        this.setBrowserAttributes(
          nonChromeBrand,
          version,
          null,
          deviceOrOS,
          platformVersion,
          null,
          platformInfo,
        );
      } else if (theOS === 'Android') {
        // Older Android ran Chrome without explicit mention in the UA string:
        this.setBrowserAttributes(
          'Chrome',
          null,
          null,
          deviceOrOS,
          platformVersion,
          null,
          platformInfo,
        );
      }
      if (!properties.browserId) {
        this.setupLegacyBrowser(uaString);
        if (!properties.browserId) {
          this.setBrowserAttributes(
            'OtherBrowser',
            null,
            null,
            deviceOrOS,
            platformVersion,
            null,
            platformInfo,
          );
        }
      }
    }
  }

  /**
   * Search for a matching legacy browser.
   * The first matching browser is used to set a limited collection of properties:
   *    browserId / <browserId predicate>
   *    version / fullVersion
   *    platform
   *
   * @param {String} uaString   The user agent string
   */
  setupLegacyBrowser(uaString) {
    // const properties = this.properties;
    for (const legacyObj of LEGACY_BROWSERS) {
      const m = legacyObj.regex.exec(uaString);
      if (m) {
        const groupProperties = legacyObj.groupProperties;
        const browserId = groupProperties.browserId;
        const version = m[legacyObj.version];
        const platform = groupProperties.platform || m[legacyObj.platform];
        const platformVersion =
          legacyObj.platformVersion && m[legacyObj.platformVersion];
        const architecture =
          legacyObj.architecture && m[legacyObj.architecture];
        const device =
          groupProperties.device ||
          (legacyObj.device >= 0 && m[legacyObj.device]);
        if (device) {
          this.applyGroupProperties(device, 'device');
        }
        let chromeVersion = null;
        if (browserId === 'Chrome' || browserId === 'Chromium') {
          chromeVersion = version;
        }
        this.setBrowserAttributes(
          browserId,
          version,
          chromeVersion,
          platform,
          platformVersion,
          architecture,
          null,
        );
        // if (legacyObj.isPhone === 'false') {
        //   delete properties.isPhone;
        // } else
        if (legacyObj.isPhone || LEGACY_PHONE_CHECK.test(uaString)) {
          this.applyGroupProperties('phone');
        }
        // if (legacyObj.isTablet === 'false' && properties.isTablet) {
        //   delete properties.isTablet;
        // }
        break;
      }
    }
  }

  /**
   * Set property values from a CSV `<property name>: <value>` string.
   * Only the plist properties are set.  Unmentioned properties retain their previous value.
   *
   * @param {String} plist  The CSV `<property name>: <value>` string of property values.
   * @return {NativeBrowserProperties} `this`
   */
  setProperties(plist) {
    if (plist) {
      const properties = this.properties;
      const props = JSON.parse(`{${plist}}`);
      for (const pname of Object.getOwnPropertyNames(props)) {
        properties[pname] = props[pname];
      }
    }
    return this;
  }

  /**
   * Return a JSON-format string of just the non-default valued properties.
   * Setting a new NativeBrowserProperties object with the returned plist makes
   * a clone of the plist's original NativeBrowserProperties object.
   * The component `<property name>: <value>` pairs are sorted by property name
   * so plist String equality is property list equality.
   *
   * @return {Array<String>} The JSON string
   */
  toCompactPlist() {
    const ar = this.toCompactPropertyStrings();
    return ar.join(',');
  }

  /**
   * Return an array of `"<property>": <value>` strings for all non-default valued properties.
   * E.g.: ['"browserId": "Edge"', '"isWindows": true', '"fullVersion": "10.3"'].
   * The returned array is sorted by property name.
   *
   * @return {Array<String>} Array of flattened browser properties as strings
   */
  toCompactPropertyStrings() {
    const ar = [];
    const properties = this.properties;
    for (const p of Object.getOwnPropertyNames(properties).sort()) {
      const v = properties[p];
      if (v) {
        const type = typeof v;
        if (type === 'string') {
          ar.push(`"${p}": "${v}"`);
        } else if (type === 'boolean' || type === 'number') {
          ar.push(`"${p}": ${v}`);
        }
      }
    }
    return ar;
  }

  /**
   * Create and return an object with the properties and values of this NativeBrowserProperties
   * object that have a "truthy" value.
   * Useful for testing.
   *
   * @return {Object} the minimum Object representation for `bpropObj`.
   */
  toCompactObject() {
    const obj = {};
    const properties = this.properties;
    for (const pname of Object.getOwnPropertyNames(properties)) {
      const value = properties[pname];
      if (value) {
        obj[pname] = value;
      }
    }
    return obj;
  }

  static getCurrentProperties() {
    return browserProperties;
  }
}

const browserProperties = new NativeBrowserProperties();

// Note: toolboxModule.js sets
//    window._agile.toolbox.browserProperties = browserProperties
//    window._agile.toolbox.BrowserProperties = BrowserProperties

// For access from producer code:
window.browserProperties = browserProperties.properties;

//export { browserProperties as default, NativeBrowserProperties };
