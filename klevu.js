//klevuLib
//source/core/klevuLib/activate.js

//source/core/klevuLib/klevuLib.js
//automatic error submitting
try {
    (function (global, factory) {
        "use strict";
        //check if there is a window object if not expose factory as a module
        if (!global.document) {
            //throw error in case there is no document.
            throw new Error("kLib requires a window with a document");
        } else {
            factory(global);
        }
        // send window or this if window is not set
    })(typeof window !== "undefined" ? window : this, function (window) {
        "use strict";
        if (typeof window["klevu"] !== 'undefined') {
            return  window["klevu"];
        }
        
//source/core/klevuLib/modules/globalObject.js
/* ---------------------------------- GLOBAL OBJECT AND PROTOTYPE DECLARATIONS ---------------------------------- */
// Define a internal copy of kLib
var kLib = function kLib( options ) {
  return kLib.pt.options( options );
};
// Define function prototype
kLib.pt = kLib.prototype = {
  // The current version of kLib being used
  version : version ,
  constructor : kLib
};

/* INIT FUNCTION */
// main init library function , merge all options to the main settings to be used in the lib
kLib.options = kLib.pt.options = function options( options ) {
  kLib.extend( true , settings , options );
  kLib.reInitialize();
  return this;
};
kLib.reInitialize = function () {
  if ( settings.chains.initChain.list().length > 0 ) {
    settings.chains.initChain.setData( settings );
    settings.chains.initChain.fire();
  }
  return this;
};

// core power up function
function coreBuild() {
  // set the api key
  if ( typeof klevu_apiKey !== "undefined" ) {
    kLib.settings.search = {apiKey:klevu_apiKey};
    kLib.settings.analytics = {apiKey:klevu_apiKey};
  }
  //check for the settings rewrites
  var overrideSettings = getAllUrlParameters();
  if ( overrideSettings.length > 0 ) {
    kLib.each( overrideSettings , function ( key , elem ) {
      if ( elem.name.startsWith( "klib_" ) ) {
        elem.name = elem.name.replace( "klib_" , "" ).replace( new RegExp( /_/ , "g" ) , "." );
        setObjectPath( settings , elem.name , elem.value );
      }
    } );
  }
  // power up interactive and ready chains
  kLib.interactive();
  kLib.ready();

  settings.chains.initChain = kLib.chain();

  
}; 
//source/core/klevuLib/modules/defaults.js
/* ---------------------------------- INTERNAL VARIABLE DECLARATIONS ---------------------------------- */

var version = "2.5.7"; //current version
var document = window.document; // the document
var objectTypes = "Boolean Number String Function Array Date RegExp Object Error Symbol";

// Base functions and declarations for Arrays
var arr = [];
var slice = arr.slice;
var concat = arr.concat;
var push = arr.push;
var indexOf = arr.indexOf;

// Base functions and declarations for Objects
var getProto = Object.getPrototypeOf;
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;
var fnToString = hasOwn.toString;
var ObjectFunctionString = fnToString.call( Object );

// Regular expressions
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g; // used to remove the whitespace from the beginning and end of a
// string
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g ); // used to explode a sting in multiple parameters if tab , space , or
// new line is present
var rbracket = /\[\]$/;
var r20 = /%20/g;
var rhash = /#.*$/;
var rantiCache = /([?&])_=[^&]*/;
var rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg;
var rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
var rprotocol = /^\/\//;
var rnoContent = /^(?:GET|HEAD)$/;
var rquery = ( /\?/ );

// define support so extensions can add there own support strings
var support = {};

/* ---------------------------------- INTERNAL SETTINGS DECLARATIONS ---------------------------------- */
// define global settings
var settings = {
  url : {
    protocol : document.location.protocol ,
  }

};
 
//source/core/klevuLib/modules/polyfills.js
/* ---------------------------------- Polyfill FUNCTIONS ---------------------------------- */
//string startWith
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}
// document.querySelectorAll
if (!window.document.querySelectorAll) {
  window.document.querySelectorAll = function (selectors) {
    var style = window.document.createElement("style"),
      elements = [],
      element;
    window.document.documentElement.firstChild.appendChild(style);
    window.document._qsa = [];
    if (!style.styleSheet || typeof style.styleSheet.cssText === "undefined") return elements;
    style.styleSheet.cssText = selectors + "{x-qsa:expression(window.document._qsa && window.document._qsa.push(this))}";
    window.scrollBy(0, 0);
    style.parentNode.removeChild(style);

    while (window.document._qsa.length) {
      element = window.document._qsa.shift();
      element.style.removeAttribute("x-qsa");
      elements.push(element);
    }
    window.document._qsa = null;
    return elements;
  };
};
if (!window.document.querySelector) {
  window.document.querySelector = function (selectors) {
    var elements = window.document.querySelectorAll(selectors);
    return (elements.length) ? elements[0] : null;
  };
};
// Element.matches() polyfill
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
};
// Array.filter() polyfill
if (!Array.prototype.filter) {
  Array.prototype.filter = function (func, thisArg) {
    "use strict";
    if (!((typeof func === "Function" || typeof func === "function") && this))
      throw new TypeError();

    var len = this.length >>> 0,
      res = new Array(len), // preallocate array
      t = this,
      c = 0,
      i = -1;
    if (thisArg === undefined) {
      while (++i !== len) {
        // checks to see if the key was set
        if (i in this) {
          if (func(t[i], i, t)) {
            res[c++] = t[i];
          }
        }
      }
    } else {
      while (++i !== len) {
        // checks to see if the key was set
        if (i in this) {
          if (func.call(thisArg, t[i], i, t)) {
            res[c++] = t[i];
          }
        }
      }
    }

    res.length = c; // shrink down array to proper size
    return res;
  };
}
// Array.forEach() as per
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback /*, thisArg*/ ) {

    var T, k;

    if (this === null) {
      throw new TypeError("this is null or not defined");
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = arguments[1];
    }

    // 6. Let k be 0.
    k = 0;

    // 7. Repeat while k < len.
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //  This is implicit for LHS operands of the in operator.
      // b. Let kPresent be the result of calling the HasProperty
      //  internal method of O with argument Pk.
      //  This step can be combined with c.
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined.
  };
}

// function to check dataset attribute
function checkForDataset() {
  if (!document.documentElement.dataset) {
    return false;
  }
  var el = document.createElement('div');
  el.setAttribute("data-a-b", "c");
  return el.dataset && el.dataset.aB == "c";
}

// element.dataset polyfill
if (!checkForDataset()) {
  Object.defineProperty(Element.prototype, 'dataset', {
    get: function () {
      var element = this;
      var attributes = this.attributes;
      var map = {};
      for (var i = 0; i < attributes.length; i++) {
        var attribute = attributes[i];
        if (attribute && attribute.name && (/^data-\w[\w-]*$/).test(attribute.name)) {
          var name = attribute.name;
          var value = attribute.value;
          var propName = name.substr(5).replace(/-./g, function (prop) {
            return prop.charAt(1).toUpperCase();
          });
          Object.defineProperty(map, propName, {
            enumerable: true,
            get: function () {
              return this.value;
            }.bind({
              value: value || ''
            }),
            set: function (name, value) {
              if (typeof value !== 'undefined') {
                this.setAttribute(name, value);
              } else {
                this.removeAttribute(name);
              }
            }.bind(element, name)
          });
        }
      }
      return map;
    }
  });
}

// nodes.forEach() polyfill
if (typeof NodeList.prototype.forEach !== "function") {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// isNaN() polyfill
if (typeof window.isNaN !== "function") {
  window.isNaN = function isNaN(value) {
    var n = Number(value);
    return n !== n;
  };
}

// Number.isNaN() polyfill
if (typeof Number.isNaN !== "function") {
  Number.isNaN = Number.isNaN || function isNaN(input) {
    return typeof input === 'number' && input !== input;
  }
} 
//source/core/klevuLib/modules/globalFunctions.js


/* ---------------------------------- INTERNAL FUNCTIONS ---------------------------------- */
function queryString(params){
  var queryString = Object.keys(params).map(function(key) {
    return key + '=' + params[key]
  }).join('&');
  return queryString;
}
// check if param is undefined
function isUndefined( obj ) {
  return (typeof (obj) === "undefined");
}
//convert to boolean , will default to false
function toBoolean(value){
  switch(kLib.type(value)) {
    case 'string':
      return (value === 'true') || (value === '1');
    case 'boolean':
      return !!value;
    case 'number':
      return value === 1;
    case 'undefined':
      return false;
    default:
      return false;
  }

}

// No operation function
function noOp() {
}

// check if a object is a window or not
function isWindow( obj ) {
  return isUndefined(obj) && obj !== null && obj === obj.window;
}

//evaluate script in DOM
function DOMEval( code , doc , node ) {
  doc = doc || document;

  var i;
  var script = doc.createElement( "script" );
  var preservedScriptAttributes = {
    type : true ,
    src : true ,
    noModule : true
  };
  script.text = code;
  if ( node ) {

    for ( i in preservedScriptAttributes ) {
      if ( node[ i ] ) {
        script[ i ] = node[ i ];
      }
    }
  }
  doc.head.appendChild( script ).parentNode.removeChild( script );
}

// Evaluates a script in a global context
function globalEval( code ) {
  DOMEval( code );
}

// check if a object is a function or not
function isFunction( obj ) {
  return typeof obj === "function" && typeof obj.nodeType !== "number";
}

// get the type of a object
function toType( obj ) {
  if ( obj === null ) {
    return obj + "";
  }

  // Support: Android <=2.3 only (functionish RegExp)
  return typeof obj === "object" || typeof obj === "function" ?
    class2type[ toString.call( obj ) ] || "object" :
    typeof obj;
}

/* OBJECT */
// Check to see if an object is a plain object (created using "{}" or "new Object")
function isPlainObject( obj ) {
  var proto , Ctor;

  // Detect obvious negatives
  // Use toString instead of kLib.type to catch host objects
  if ( !obj || toString.call( obj ) !== "[object Object]" ) {
    return false;
  }

  proto = getProto( obj );

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if ( !proto ) {
    return true;
  }

  // Objects with prototype are plain iff they were constructed by a global Object function
  Ctor = hasOwn.call( proto , "constructor" ) && proto.constructor;
  return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
}

// Check to see if an object is empty
function isEmptyObject( obj ) {
  for ( var prop in obj ) {
    if ( obj.hasOwnProperty( prop ) )
      return false;
  }

  return true;
}

function explodeObjectPath( path ) {
  path = path.replace( new RegExp( "[\\]]" , [ "g" ] ) , "" ).split( new RegExp( "[\\[\\.]" , [ "g" ] ) );
  return path;
}

function getObjectPathValue( object , path ,defaultVal) {
  if ( kLib.isUndefined( defaultVal ) ) defaultVal = undefined;
  var key = path.shift();
  if ( path.length === 0 ) {
    return (!isUndefined( object[ key ] )) ? object[ key ] : defaultVal;
  }
  return (!isUndefined( object[ key ] )) ? getObjectPathValue( object[ key ] , path ,defaultVal ) : defaultVal;
}

function getObjectPath( object , path ,defaultVal) {
  if ( kLib.isUndefined( defaultVal ) ) defaultVal = undefined;
  if ( !isUndefined( object ) && isPlainObject( object ) ) {
    path = explodeObjectPath( path );
    return getObjectPathValue( object , path , defaultVal);
  }
}

function getInterfaceObjectPath(object,path ,defaultVal){
  if ( kLib.isUndefined( defaultVal ) ) defaultVal = undefined;
  if ( !isUndefined( object ) ) {
    path = explodeObjectPath( path );
    return getObjectPathValue( object , path , defaultVal);
  }
}

function setObjectPath( object , path , value ) {
  if ( isUndefined( value ) ) return object;
  path = explodeObjectPath( path );
  var index = -1 ,
    length = path.length ,
    endIndex = length - 1 ,
    nested = object;

  while ( ++index < length ) {
    var key = path[ index ];
    if ( index === endIndex ) {
      nested[ key ] = value;
    } else if ( isUndefined( nested[ key ] ) || nested[ key ] === null ) {
      nested[ key ] = {};
    }
    nested = nested[ key ];
  }

  return object;
}




function clean( obj ) {
  var propNames = Object.keys( obj );
  var functionLocal = {
    check : function check( data ) {
      return data === null || data === undefined || data === [] || data === {} || data === false || data === 0 || data === "" || ((typeof data !== "number" && typeof data !== "boolean") && isEmptyObject( data ));
    } ,
    filter : function filter( data ) {
      return !functionLocal.check( data );
    } ,
    sanitise : function sanitise( obj , propName ) {
      if ( functionLocal.check( obj[ propName ] ) ) {
        delete obj[ propName ];
        return true;
      }
      return false;
    }
  };
  for ( var i = 0 ; i < propNames.length ; i++ ) {
    var propName = propNames[ i ];
    if ( !functionLocal.sanitise( obj , propName ) ) {
      if ( typeof obj[ propName ] === "object" ) {
        obj[ propName ] = clean( obj[ propName ] );
        if ( isArrayLike( obj[ propName ] ) ) {
          obj[ propName ] = obj[ propName ].filter( functionLocal.filter );
        }
        functionLocal.sanitise( obj , propName );
      }
    }
  }
  return obj;
}

//compare 2 objects
function isEqualObj( value , other ) {

  // Get the value type
  var type = Object.prototype.toString.call( value );

  // If the two objects are not the same type, return false
  if ( type !== Object.prototype.toString.call( other ) ) return false;

  // If items are not an object or array, return false
  if ( [ "[object Array]" , "[object Object]" ].indexOf( type ) < 0 ) return false;

  // Compare the length of the length of the two items
  var valueLen = type === "[object Array]" ? value.length : Object.keys( value ).length;
  var otherLen = type === "[object Array]" ? other.length : Object.keys( other ).length;
  if ( valueLen !== otherLen ) return false;

  // Compare two items
  var compare = function ( item1 , item2 ) {

    // Get the object type
    var itemType = Object.prototype.toString.call( item1 );

    // If an object or array, compare recursively
    if ( [ "[object Array]" , "[object Object]" ].indexOf( itemType ) >= 0 ) {
      if ( !isEqualObj( item1 , item2 ) ) return false;
    }

    // Otherwise, do a simple comparison
    else {

      // If the two items are not the same type, return false
      if ( itemType !== Object.prototype.toString.call( item2 ) ) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if ( itemType === "[object Function]" ) {
        if ( item1.toString() !== item2.toString() ) return false;
      } else {
        if ( item1 !== item2 ) return false;
      }

    }
  };

  // Compare properties
  if ( type === "[object Array]" ) {
    for ( var i = 0 ; i < valueLen ; i++ ) {
      if ( compare( value[ i ] , other[ i ] ) === false ) return false;
    }
  } else {
    for ( var key in value ) {
      if ( value.hasOwnProperty( key ) ) {
        if ( compare( value[ key ] , other[ key ] ) === false ) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;

};
/* ARRAY */
//check if object is of
function isArrayLike( obj ) {
  var length = !!obj && "length" in obj && obj.length ,
    type = toType( obj );

  if ( isFunction( obj ) || isWindow( obj ) ) {
    return false;
  }

  return type === "array" || length === 0 ||
    typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

// Search for a specified value within an array from a index i and return its index
function inArray( elem , arr , i ) {
  return arr === null ? -1 : indexOf.call( arr , elem , i );
}

// Merge the contents of two arrays together into the first array.
function merge( first , second ) {
  var len = +second.length ,
    j = 0 ,
    i = first.length;

  for ( ; j < len ; j++ ) {
    first[ i++ ] = second[ j ];
  }

  first.length = i;

  return first;
}

// Convert an array-like object into a true JavaScript array
function makeArray( arr , results ) {
  var ret = results || [];

  if ( arr !== null ) {
    if ( isArrayLike( Object( arr ) ) ) {
      merge( ret ,
        typeof arr === "string" ?
          [ arr ] : arr
      );
    } else {
      push.call( ret , arr );
    }
  }

  return ret;
}

// Finds the elements of an array which satisfy a filter function
function grep( elems , callback , invert ) {
  var callbackInverse ,
    matches = [] ,
    i = 0 ,
    length = elems.length ,
    callbackExpect = !invert;

  // Go through the array, only saving the items
  // that pass the validator function
  for ( ; i < length ; i++ ) {
    callbackInverse = !callback( elems[ i ] , i );
    if ( callbackInverse !== callbackExpect ) {
      matches.push( elems[ i ] );
    }
  }

  return matches;
}

// Translate all items in an array or object to new array of items.
function map( elems , callback , arg ) {
  var length , value ,
    i = 0 ,
    ret = [];

  // Go through the array, translating each of the items to their new values
  if ( isArrayLike( elems ) ) {
    length = elems.length;
    for ( ; i < length ; i++ ) {
      value = callback( elems[ i ] , i , arg );

      if ( value !== null ) {
        ret.push( value );
      }
    }

    // Go through every key on the object,
  } else {
    for ( i in elems ) {
      value = callback( elems[ i ] , i , arg );

      if ( value !== null ) {
        ret.push( value );
      }
    }
  }

  // Flatten any nested arrays
  return concat.apply( [] , ret );
}

// transform object to array
function toArray( elem ) {
  return slice.call( elem );
}

function toUniqueArray(array) {
  if (!kLib.isArrayLike(array)) return false;

  var unique = function unique(value, index, self) {
    return self.indexOf(value) === index;
  };

  return array.filter(unique);
}

/* STRING AND NUMERIC */
// check if object is numeric
function isNumeric( obj ) {
  var type = toType( obj );
  return ( type === "number" || type === "string" ) && !isNaN( obj - parseFloat( obj ) );
}

// check if object is string
function isString( obj ) {
  var type = toType( obj );
  return ( type === "number" || type === "string" );
}

// Remove the whitespace from the beginning and end of a string.
function trim( text ) {
  return text === null ?
    "" :
    ( text + "" ).replace( rtrim , "" );
}

/* FUNCTIONAL */
// iterator function
function each( obj , callback ) {
  var length , i = 0;

  if ( isArrayLike( obj ) ) {
    length = obj.length;
    for ( ; i < length ; i++ ) {
      if ( callback.call( obj[ i ] , i , obj[ i ] ) === false ) {
        break;
      }
    }
  } else {
    for ( i in obj ) {
      if ( obj.hasOwnProperty( i ) ) {
        if ( callback.call( obj[ i ] , i , obj[ i ] ) === false ) {
          break;
        }
      }
    }
  }

  return obj;
}

// Convert String-formatted options into Object-formatted ones
function explodeOptions( options ) {
  var object = {};
  each( options.match( rnothtmlwhite ) || [] , function ( _ , flag ) {
    object[ flag ] = true;
  } );
  return object;
}

// Symbol processor
if ( typeof Symbol === "function" ) {
  kLib.pt[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
// Populate the class2type map
each( explodeOptions( objectTypes ) , function ( i ) {
  class2type[ "[object " + i + "]" ] = i.toLowerCase();
} );
//base64 encode
function b64EncodeUnicode( str ) {
  return window.btoa( window.encodeURIComponent( str ).replace( /%([0-9A-F]{2})/g , function ( match , p1 ) {
    return String.fromCharCode( parseInt( p1 , 16 ) );
  } ) );
}

//base64 decode
function b64DecodeUnicode( str ) {
  return window.decodeURIComponent( Array.prototype.map.call( window.atob( str ) , function ( c ) {
    return "%" + ("00" + c.charCodeAt( 0 ).toString( 16 )).slice( -2 );
  } ).join( "" ) );
}

// Get Query paramater from main window url
function getUrlParameter( sParam ) {
  var sPageURL =  window.location.search.substring( 1 ) ,
    sURLVariables = sPageURL.split( "&" ) ,
    sParameterName ,
    i;

  for ( i = 0 ; i < sURLVariables.length ; i++ ) {
    sParameterName = sURLVariables[ i ].split( "=" );

    if ( sParameterName[ 0 ] === sParam ) {
      try{
        return sParameterName[ 1 ] === undefined ? false : decodeURIComponent(sParameterName[ 1 ]);
      } catch (e) {
        sendReport(e,"UrlParam");
        logError(e);
        return false;
      }

    }
  }
}

function getAllUrlParameters() {
  var sPageURL =  window.location.search.substring( 1 )  ,
    sURLVariables = sPageURL.split( "&" ) ,
    sParameterName ,
    i ,
    returnArray = [];

  for ( i = 0 ; i < sURLVariables.length ; i++ ) {
    sParameterName = sURLVariables[ i ].split( "=" );
    try{
      returnArray.push( {
        name : sParameterName[ 0 ] ,
        value : sParameterName[ 1 ] === undefined ? false : decodeURIComponent(sParameterName[ 1 ])
      } );
    } catch (e) {
      sendReport(e,"UrlParam");
      logError(e);
    }
  }
  return returnArray;
}

// get setting
function getSetting( local , path , defaultVal , global ) {
  if ( kLib.isUndefined( global ) ) global = { settings : kLib.settings };
  if ( global === null ) global = { settings : kLib.settings };
  if ( kLib.isUndefined( defaultVal ) ) defaultVal = undefined;
  //settings object
  local = { settings : local.settings };
  var localValue = kLib.getObjectPath( local , path );
  var globalValue = kLib.getObjectPath( global , path );
  if ( (!kLib.isUndefined( localValue )) ) {
    if ( isPlainObject( localValue ) || Array.isArray( localValue ) ) {
      return kLib.extend( true , {} , kLib.extend( true , globalValue , localValue ) );
    } else {
      return localValue;
    }

  } else if ( !kLib.isUndefined( globalValue ) ) {
    return globalValue;
  } else {
    return defaultVal;
  }
}

function getGlobalSetting( path , defaultVal ) {
  path = "settings." + path;
  return getSetting( { settings : {} } , path , defaultVal , null );
}

// set setting
function setSetting( local , path , value , useGlobal ) {
  if ( isUndefined( useGlobal ) ) useGlobal = false;
  if ( useGlobal ) {
    setObjectPath( { settings : kLib.settings } , path , value );
  } else {
    setObjectPath( local , path , value );
  }
  return getSetting( local , path );
}

//generate random id
function randomId() {
  function s4() {
    return Math.floor( (1 + Math.random()) * 0x10000 ).toString( 16 ).substring( 1 );
  }

  return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}
function randomFunctionName(){
  var name = randomId();
  return "f"+name.replace(new RegExp("-", 'g'),"");
}

//generate random class
function randomClass() {
  function s4() {
    return Math.floor( (1 + Math.random()) * 0x10000 ).toString( 16 ).substring( 1 );
  }

  return "kl"+s4() + s4() + s4();
}

//generateHash
function hashCode( string ) {
  var hash = 0 , length = string.length , iterator = 0;
  if ( length > 0 )
    while ( iterator < length )
      hash = (hash << 5) - hash + string.charCodeAt( iterator++ ) | 0;
  return hash;
};
/* WORKER FUNCTIONS */

// build paramaters object
function buildParams( prefix , obj , add ) {
  var name;

  if ( Array.isArray( obj ) ) {

    // Serialize array item.
    kLib.each( obj , function ( i , v ) {
      if ( rbracket.test( prefix ) ) {

        // Treat each array item as a scalar.
        add( prefix , v );

      } else {

        // Item is non-scalar (array or object), encode its numeric index.
        buildParams(
          prefix + "[" + ( typeof v === "object" && v !== null ? i : "" ) + "]" ,
          v ,
          add
        );
      }
    } );

  } else if ( toType( obj ) === "object" ) {

    // Serialize object item.
    for ( name in obj ) {
      buildParams( prefix + "[" + name + "]" , obj[ name ] , add );
    }

  } else {

    // Serialize scalar item.
    add( prefix , obj );
  }
}

// Serialize an array of form elements or a set of
// key/values into a query string
kLib.param = function ( a ) {
  var prefix ,
    s = [] ,
    add = function ( key , valueOrFunction ) {

      // If value is a function, invoke it and use its return value
      var value = isFunction( valueOrFunction ) ?
        valueOrFunction() :
        valueOrFunction;

      s[ s.length ] = encodeURIComponent( key ) + "=" +
        encodeURIComponent( value === null ? "" : value );
    };

  // If an array was passed in, assume that it is an array of form elements.
  if ( Array.isArray( a ) || ( a.version && !kLib.isPlainObject( a ) ) ) {

    // Serialize the form elements
    kLib.each( a , function () {
      add( this.name , this.value );
    } );

  } else {

    for ( prefix in a ) {
      buildParams( prefix , a[ prefix ] , add );
    }
  }

  // Return the resulting serialization
  return s.join( "&" );
};

// Cross-browser xml parsing
function parseXML( data ) {
  var xml;
  if ( !data || typeof data !== "string" ) {
    return null;
  }

  // Support: IE 9 - 11 only
  // IE throws on parseFromString with invalid input.
  try {
    xml = ( new window.DOMParser() ).parseFromString( data , "text/xml" );
  } catch ( e ) {
    xml = undefined;
  }

  if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
    kLib.error( "Invalid XML: " + data );
  }
  return xml;
}
// Execute function by name
function executeFunctionByName(functionName, context /*, args */) {
  var args = Array.prototype.slice.call(arguments, 2);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}


/* EXTEND FUNCTION */
// Define extend prototype function
kLib.extend = kLib.pt.extend = function () {
  var options , name , src , copy , copyIsArray , clone ,
    target = arguments[ 0 ] || {} ,
    i = 1 ,
    length = arguments.length ,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;

    // Skip the boolean and the target
    target = arguments[ i ] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !isFunction( target ) ) {
    target = {};
  }

  // Extend kLib itself if only one argument is passed
  if ( i === length ) {
    target = this;
    i--;
  }

  for ( ; i < length ; i++ ) {

    // Only deal with non-null/undefined values
    if ( ( options = arguments[ i ] ) !== null ) {
      //handle chains as they have localised proprieties
      if ( isPlainObject( options ) && options.hasOwnProperty( "isKlevuChain" ) ) {
        target = kLib.chainClone( options );
        continue;
      }
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( kLib.isPlainObject( copy ) ||
          ( copyIsArray = Array.isArray( copy ) ) ) ) {

          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && Array.isArray( src ) ? src : [];

          } else {
            clone = src && kLib.isPlainObject( src ) ? src : {};
          }

          // Never move original objects, clone them
          if ( copy.hasOwnProperty( "isKlevuChain" ) ) {
            target[ name ] = kLib.chainClone( copy );
          } else {
            target[ name ] = kLib.extend( deep , clone , copy );
          }

          // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};


/* ---------------------------------- EXTERNAL MAPING ---------------------------------- */
kLib.extend( {
  /* ---------------------------------- EXTERNAL VARIABLE DECLARATIONS ---------------------------------- */
  version : version ,
  uid : "kLib-" + randomId() ,// Unique for each copy of kLib on the page
  class2type : class2type ,
  support : support ,
  settings : settings ,

  /* ---------------------------------- EXTERNAL MAPED BASE FUNCTIONS ---------------------------------- */
  type : toType ,
  toBoolean: toBoolean,
  isFunction : isFunction ,
  isWindow : isWindow ,
  isUndefined : isUndefined ,
  isPlainObject : isPlainObject ,
  isEmptyObject : isEmptyObject ,
  isEqualObj : isEqualObj ,
  isNumeric : isNumeric ,
  isString : isString ,
  isArray : Array.isArray ,
  isArrayLike : isArrayLike ,
  inArray : inArray ,
  makeArray : makeArray ,
  toUniqueArray : toUniqueArray ,
  parseJSON : JSON.parse ,
  parseXML : parseXML ,
  each : each ,
  getObjectPath : getObjectPath ,
  getObjectPathValue : getObjectPathValue ,
  getInterfaceObjectPath:getInterfaceObjectPath,
  setObjectPath : setObjectPath ,
  decode : b64DecodeUnicode ,
  encode : b64EncodeUnicode ,
  getUrlParameter : getUrlParameter ,
  getSetting : getSetting ,
  setSetting : setSetting ,
  getGlobalSetting : getGlobalSetting ,
  clean : clean ,
  randomId : randomId ,
  randomClass:randomClass,
  hashCode : hashCode ,
  getAllUrlParameters : getAllUrlParameters,
  queryString:queryString,
  globalEval:globalEval,
  executeFunctionByName:executeFunctionByName,
  randomFunctionName:randomFunctionName
} );
 
//source/core/klevuLib/modules/log.js
/* ---------------------------------- Logging functions ---------------------------------- */
// default settings
kLib.extend(true,settings,{
  console : {
    active : false ,
    errorReporting: "stats.ksearchnet.com",
    level : 1 , // 1: error | 2: warning | 3: info | 4:debug,
    type : {
      general : false ,
      ajax : false ,
      chain : false ,
      translator : false ,
      template : false ,
      event : false ,
      storage : false,
      assets: false
    }
  }
});

//image based reporting
function sendReport( e , code ) {
  new Image().src = "\/\/"+ settings.console.errorReporting +"\/" + 'error-log?type=jsv2&c='+ code + '&m=' + encodeURIComponent('{"error":"LOAD","extra": {"name":"' + e.name + '","line":"' + (e.lineNumber || e.line) + '","script":"' + (e.fileName || e.sourceURL || e.script) + '","stack":"' + (e.stackTrace || e.stack) + '","namespace":"kLib","message":"' + e.message + '"}}');
}

// log error
function log( data ) {
  if ( settings.console.active ) {
    console.log( data );
  }
}

// log any error cached
function logError( data ) {
  if ( settings.console.level >= 1 ) {
    log( data );
  }
}

// log things that do not brake but need to be careful about
function logWarning( data ) {
  if ( settings.console.level >= 2 ) {
    log( data );
  }
}

// log general call information
function logInfo( data ) {
  if ( settings.console.level >= 3 ) {
    log( data );
  }
}

// log more debug information then logInfo + data
function logDebug( data ) {
  if ( settings.console.level >= 4 ) {
    log( data );
  }
}

// Error thrower
function error( msg ) {
  
  throw new Error( msg );
}
// set
kLib.extend( {
  logError : logError ,
  logWarning : logWarning ,
  logInfo : logInfo ,
  logDebug : logDebug ,
});
// expose the support
 
//source/core/klevuLib/modules/css.js

/* ---------------------------------- CSS LIBRARY ---------------------------------- */
kLib.css = kLib.pt.css = {
  rawData : function ( css ) {
    try {
      this.data = b64DecodeUnicode( css );
    } catch ( e ) {
      // something failed
      this.data = "";
      
      sendReport( e , "CSS-Decode" );
      return;
    }
    this.insertReplace();
  } ,
  link : function ( url , name ) {
    if ( isUndefined( name ) ) name = "kLib-css";
    kLib.dom.helpers.removeElementFromDocument( "kLib-css" );
    kLib.dom.helpers.addElementToHead( { content : url , type : "css-link" , name : name } );
  } ,
  data : null ,
  origData : null ,
  insertReplace : function () {
    if ( this.data !== this.origData ) {
      kLib.dom.helpers.removeElementFromDocument( "kLib-css" );
      kLib.dom.helpers.addElementToHead( { content : this.data , type : "css" , name : "kLib-css" } );
      
      this.origData = this.data;
      return true;
    }
  }
};
// expose the support
kLib.extend(true,support,{
  css : true
}); 
//source/core/klevuLib/modules/chains.js

/* ---------------------------------- CHAIN LIBRARY ---------------------------------- */
// default settings
kLib.extend(true,settings,{
  chains : {}
});
kLib.extend( {
  chain : function ( receivedOptions ) {
    // base local variables
    var baseOptions = {
      stopOnFalse : false ,
      list : [] ,
      fireList : [] ,
      queue : [] ,
      firingIndex : -1 ,
      firing : false ,
      fired : false ,
      parameters : {} ,
      scope : {} ,
      spacer : 10
    };
    // Convert options from String-formatted to Object-formatted if needed
    var options = typeof receivedOptions === "string" ? baseOptions : kLib.extend( baseOptions , receivedOptions );

    var memory;
    // Fire callbacks
    var fire = function () {
      // Execute callbacks for all pending executions
      options.fired = options.firing = true;
      for ( ; options.queue.length ; options.firingIndex = -1 ) {
        memory = options.queue.shift();
        while ( ++options.firingIndex < options.fireList.length ) {
          // Run callback and check for early termination
          if ( options.fireList[ options.firingIndex ].apply( memory[ 0 ] , memory[ 1 ] ) === false && options.stopOnFalse ) {
            
            // Jump to end and forget the data so .add doesn't re-fire
            options.firingIndex = options.fireList.length;
            memory = false;
          }
        }
      }

      options.firing = false;
    };
    // used to generate the fire list when the main chain changes
    function regenerateFireList() {
      options.fireList = [];
      kLib.each( options.list ,
        function ( index , params ) {
          if ( !isEmptyObject( params ) && isFunction( params.func ) )
            options.fireList.push( params.func );
        }
      );
      options.firingIndex = options.fireList.length;
    };
    // return object, used as separate variable because of clarity around self.
    var selfObj = {
      // list all the callbacks in the order of execution.
      list : function () {
        var returnList = [];
        kLib.each( options.list , function ( i , data ) {
          if ( !isEmptyObject( data ) ) {
            returnList.push( { name : data.name , position : i , function : data.func } );
          }
        } );
        return returnList;
      } ,
      // find the index from the chain for given name. used to identify positions of existing callbacks
      indexOf : function ( name ) {
        var index = -1;
        kLib.each( options.list , function ( i , data ) {
          if ( !isEmptyObject( data ) && data.name === name ) {
            index = i;
            return false;
          }
        } );

        return index;
      } ,
      // find the position from the chain for given callback name
      positionOf : function ( name ) {
        var position = selfObj.indexOf( name );
        return (toType( position ) !== "boolean") ? position : false;
      } ,
      // add new callback to the chain , name and fire is a required field. can be called with multiple callbacks
      add : function () {
        if ( options.list ) {
          (function add( args ) {
            kLib.each( args , function ( _ , arg ) {
              if ( !isNumeric( arg.position ) ) {
                arg.position = options.list.length + options.spacer;
              }
              if ( isFunction( arg.fire ) ) {
                if ( selfObj.indexOf( arg.name ) !== -1 ) {
                  selfObj.remove( { name : arg.name } );
                }
                var newObject = {
                  name : arg.name ,
                  func : arg.fire
                };
                if ( isEmptyObject( options.list[ arg.position ] ) ) {
                  options.list[ arg.position ] = newObject;
                } else {
                  options.list.splice( arg.position , 0 , newObject );
                }
              }
            } );
          })( arguments );
          regenerateFireList();
        }
        return this;
      } ,
      // add new callback to the chain , before a given name
      addBefore : function ( name , objectData ) {
        var position = selfObj.indexOf( name );
        if ( position !== -1 ) {
          objectData.position = position;
          selfObj.add( objectData );
        }
        return this;
      } ,
      // add new callbacks to the chain , after a given name
      addAfter : function ( name , objectData ) {
        var position = selfObj.indexOf( name );
        if ( position !== -1 ) {
          objectData.position = position + 1;
          selfObj.add( objectData );
        }
        return this;
      } ,
      // remove callback from the chain , based on a given name
      remove : function () {

        kLib.each( arguments , function ( _ , arg ) {
          if ( !isUndefined( arg.position ) ) {
            if ( !isEmptyObject( options.list[ arg.position ] ) ) {
              options.list.splice( arg.position , 1 , {} );
            }
          } else if ( !isUndefined( arg.name ) ) {
            var position = selfObj.indexOf( arg.name );
            if ( position >= 0 ) {
              options.list.splice( position , 1 , {} );
            }
          }
        } );
        regenerateFireList();
        return this;
      } ,
      // move callback in the chain , based on a given name and a before/after name
      move : function () {
        kLib.each( arguments , function ( _ , arg ) {
          if ( !isUndefined( arg.name ) ) {
            if ( !isNumeric( arg.position ) ) {
              if ( arg.hasOwnProperty( "before" ) ) {
                arg.position = selfObj.indexOf( arg.before );
              } else if ( arg.hasOwnProperty( "after" ) ) {
                arg.position = selfObj.indexOf( arg.after ) + 1;
              }
            }
            var position = selfObj.indexOf( arg.name );
            if ( position >= 0 ) {
              var clone = kLib.extend( true , {} , options.list[ position ] );
              selfObj.remove( { position : position } );
              options.list.splice( arg.position , 0 , clone );
              regenerateFireList();
            }

          }
        } );
        return this;
      } ,
      // Call all callbacks with the given context and arguments
      fireWith : function ( context , args ) {

        args = args || [];
        args = [ context , args.slice ? args.slice() : args ];
        if ( isUndefined( args[ 1 ][ 0 ] ) ) {
          if ( selfObj.hasData() ) {
            
            args[ 1 ][ 0 ] = selfObj.getData();
            args[ 1 ].length = 1;
            if ( selfObj.hasScope() ) {
              args[ 1 ][ 1 ] = selfObj.getScope();
              args[ 1 ].length++;
            }
          } else {
            
            return this;
          }
        } else {
          options.parameters = args[ 1 ][ 0 ];
          if ( !isUndefined( args[ 1 ][ 1 ] ) ) {
            options.scope = args[ 1 ][ 1 ];
          }
        }
        
        options.queue.push( args );
        if ( !options.firing ) {
          options.firingIndex = -1;
          fire();
        }
        return this;
      } ,
      // Call all the callbacks with the given arguments
      fire : function () {
        selfObj.fireWith( this , arguments );
        return this;
      } ,
      // Clear all callbacks
      empty : function () {
        if ( options.list ) {
          options.list = [];
        }
        regenerateFireList();
        return this;
      } ,
      // check if callback has been fired
      fired : function () {
        return options.fired;
      } ,
      // set behaviour so that on a return false stop future executions
      stopOnFalse : function ( stopOnFalse ) {
        options.stopOnFalse = stopOnFalse;
        return this;
      } ,
      // check if data has been set
      hasData : function () {
        return (!isEmptyObject( options.parameters ));
      } ,
      // set new data for the chain to work with
      setData : function ( data ) {
        
        options.parameters = data;
        options.fired = false; // new data so reset fired flag
        return this;
      } ,
      // get the data set for the chain
      getData : function () {
        return options.parameters;
      } ,

      // check if scope has been set
      hasScope : function () {
        return (!isEmptyObject( options.scope ));
      } ,
      // set new scope for the chain to work with
      setScope : function ( scope ) {
        
        options.scope = scope;
        options.fired = false; // new data so reset fired flag
        return this;
      } ,
      // get the scope set for the chain
      getScope : function () {
        return options.scope;
      } ,
      regenerateFireList : regenerateFireList ,
      getOptions : function () {
        return options;
      } ,
      options : options ,
      isKlevuChain : true
    };
    return selfObj;
  } ,
  chainClone : function ( chain ) {
    var newOptions = {
      list : kLib.extend( true , [] , chain.getOptions().list ) ,
      parameters : kLib.extend( true , {} , chain.getOptions().parameters ) ,
      scope : kLib.extend( true , {} , {}),//chain.getOptions().scope ) ,
      stopOnFalse : kLib.extend( true , {} , chain.getOptions().stopOnFalse )
    };
    var localChain = kLib.chain( newOptions );
    localChain.regenerateFireList();
    return localChain;
  }
} );
// expose the support
kLib.extend(true,support,{
  chains : true
}); 
//source/core/klevuLib/modules/ajax.js

/* ---------------------------------- AJAX LIBRARY ---------------------------------- */
/* AJAX LIBRARY - Variables and setups */
var nonce = Date.now();
// AJAX XHR main setups
/* Prefilters
 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
 * 2) These are called:
 *  - BEFORE asking for a transport
 *  - AFTER param serialization (s.data is a string if s.processData is true)
 * 3) key is the dataType
 * 4) the catchall symbol "*" can be used
 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
 */
var prefilters = {};
/* Transports bindings
 * 1) key is the dataType
 * 2) the catchall symbol "*" can be used
 * 3) selection will start with transport dataType and THEN go to "*" if needed
 */
var transports = {};
// Avoid comment-prolog char sequence ; must appease lint and evade compression
var allTypes = "*/".concat( "*" );

// Anchor tag for parsing the document origin
var originAnchor = document.createElement( "a" );
originAnchor.href = location.href;
/* AJAX LIBRARY - Convertors and handlers */
/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s , klXHR , responses ) {

  var ct , type , finalDataType , firstDataType ,
    contents = s.contents ,
    dataTypes = s.dataTypes;

  // Remove auto dataType and get content-type in the process
  while ( dataTypes[ 0 ] === "*" ) {
    dataTypes.shift();
    if ( ct === undefined ) {
      ct = s.mimeType || klXHR.getResponseHeader( "Content-Type" );
    }
  }

  // Check if we're dealing with a known content-type
  if ( ct ) {
    for ( type in contents ) {
      if ( contents[ type ] && contents[ type ].test( ct ) ) {
        dataTypes.unshift( type );
        break;
      }
    }
  }

  // Check to see if we have a response for the expected dataType
  if ( dataTypes[ 0 ] in responses ) {
    finalDataType = dataTypes[ 0 ];
  } else {

    // Try convertible dataTypes
    for ( type in responses ) {
      if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
        finalDataType = type;
        break;
      }
      if ( !firstDataType ) {
        firstDataType = type;
      }
    }

    // Or just use first one
    finalDataType = finalDataType || firstDataType;
  }

  // If we found a dataType
  // We add the dataType to the list if needed
  // and return the corresponding response
  if ( finalDataType ) {
    if ( finalDataType !== dataTypes[ 0 ] ) {
      dataTypes.unshift( finalDataType );
    }
    return responses[ finalDataType ];
  }
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the klXHR instance
 */
function ajaxConvert( s , response , klXHR , isSuccess ) {
  var conv2 , current , conv , tmp , prev ,
    converters = {} ,

    // Work with a copy of dataTypes in case we need to modify it for conversion
    dataTypes = s.dataTypes.slice();

  // Create converters map with lowercased keys
  if ( dataTypes[ 1 ] ) {
    for ( conv in s.converters ) {
      converters[ conv.toLowerCase() ] = s.converters[ conv ];
    }
  }

  current = dataTypes.shift();

  // Convert to each sequential dataType
  while ( current ) {

    if ( s.responseFields[ current ] ) {
      klXHR[ s.responseFields[ current ] ] = response;
    }

    // Apply the dataFilter if provided
    if ( !prev && isSuccess && s.dataFilter ) {
      response = s.dataFilter( response , s.dataType );
    }

    prev = current;
    current = dataTypes.shift();

    if ( current ) {

      // There's only work to do if current dataType is non-auto
      if ( current === "*" ) {

        current = prev;

        // Convert response if prev dataType is non-auto and differs from current
      } else if ( prev !== "*" && prev !== current ) {

        // Seek a direct converter
        conv = converters[ prev + " " + current ] || converters[ "* " + current ];

        // If none found, seek a pair
        if ( !conv ) {
          for ( conv2 in converters ) {

            // If conv2 outputs current
            tmp = conv2.split( " " );
            if ( tmp[ 1 ] === current ) {

              // If prev can be converted to accepted input
              conv = converters[ prev + " " + tmp[ 0 ] ] ||
                converters[ "* " + tmp[ 0 ] ];
              if ( conv ) {

                // Condense equivalence converters
                if ( conv === true ) {
                  conv = converters[ conv2 ];

                  // Otherwise, insert the intermediate dataType
                } else if ( converters[ conv2 ] !== true ) {
                  current = tmp[ 0 ];
                  dataTypes.unshift( tmp[ 1 ] );
                }
                break;
              }
            }
          }
        }

        // Apply converter (if not an equivalence)
        if ( conv !== true ) {

          // Unless errors are allowed to bubble, catch and return them
          if ( conv && s.throws ) {
            response = conv( response );
          } else {
            try {
              response = conv( response );
            } catch ( e ) {
              
              return {
                state : "parsererror" ,
                error : conv ? e : "No conversion from " + prev + " to " + current
              };
            }
          }
        }
      }
    }
  }

  return { state : "success" , data : response };
}

/* A special extend for ajax options
 * that takes "flat" options (not to be deep extended)
 */
function ajaxExtend( target , src ) {
  var key , deep ,
    flatOptions = kLib.ajaxSettings.flatOptions || {};

  for ( key in src ) {
    if ( src[ key ] !== undefined ) {
      ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
    }
  }
  if ( deep ) {
    kLib.extend( true , target , deep );
  }

  return target;
};
// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

  // dataTypeExpression is optional and defaults to "*"
  return function ( dataTypeExpression , func ) {

    if ( typeof dataTypeExpression !== "string" ) {
      func = dataTypeExpression;
      dataTypeExpression = "*";
    }

    var dataType ,
      i = 0 ,
      dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

    if ( isFunction( func ) ) {

      // For each dataType in the dataTypeExpression
      while ( ( dataType = dataTypes[ i++ ] ) ) {

        // Prepend if requested
        if ( dataType[ 0 ] === "+" ) {
          dataType = dataType.slice( 1 ) || "*";
          ( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

          // Otherwise append
        } else {
          ( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
        }
      }
    }
  };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure , options , originalOptions , klXHR ) {

  var inspected = {} ,
    seekingTransport = ( structure === transports );

  function inspect( dataType ) {
    var selected;
    inspected[ dataType ] = true;
    kLib.each( structure[ dataType ] || [] , function ( _ , prefilterOrFactory ) {
      var dataTypeOrTransport = prefilterOrFactory( options , originalOptions , klXHR );
      if ( typeof dataTypeOrTransport === "string" &&
        !seekingTransport && !inspected[ dataTypeOrTransport ] ) {

        options.dataTypes.unshift( dataTypeOrTransport );
        inspect( dataTypeOrTransport );
        return false;
      } else if ( seekingTransport ) {
        return !( selected = dataTypeOrTransport );
      }
    } );
    return selected;
  }

  return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// add main ajax extension to kLib object
kLib.extend( {

  // Counter for holding the number of active queries


  // Last-Modified header cache for next request
  lastModified : {} ,
  etag : {} ,
  ajaxSettings : {
    url : location.href ,
    type : "GET" ,
    isLocal : rlocalProtocol.test( location.protocol ) ,
    global : true ,
    processData : true ,
    async : true ,
    contentType : "application/x-www-form-urlencoded; charset=UTF-8" ,
    accepts : {
      "*" : allTypes ,
      text : "text/plain" ,
      html : "text/html" ,
      xml : "application/xml, text/xml" ,
      json : "application/json, text/javascript"
    } ,
    contents : {
      xml : /\bxml\b/ ,
      html : /\bhtml/ ,
      json : /\bjson\b/
    } ,
    responseFields : {
      xml : "responseXML" ,
      text : "responseText" ,
      json : "responseJSON"
    } ,
    // Data converters
    // Keys separate source (or catchall "*") and destination types with a single space
    converters : {
      // Convert anything to text
      "* text" : String ,

      // Text to html (true = no transformation)
      "text html" : true ,

      // Evaluate text as a json expression
      "text json" : JSON.parse ,

      // Parse text as xml
      "text xml" : parseXML
    } ,
    // For options that shouldn't be deep extended:
    // you can add your own custom options here if
    // and when you create one that shouldn't be
    // deep extended (see ajaxExtend)
    flatOptions : {
      url : true ,
      context : true
    }
  } ,
  // Creates a full fledged settings object into target
  // with both ajaxSettings and settings fields.
  // If target is omitted, writes into ajaxSettings.
  ajaxSetup : function ( target , settingsAjax ) {
    
    return settingsAjax ?

      // Building a settings object
      ajaxExtend( ajaxExtend( target , kLib.ajaxSettings ) , settingsAjax ) :

      // Extending ajaxSettings
      ajaxExtend( kLib.ajaxSettings , target );
  } ,
  ajaxPrefilter : addToPrefiltersOrTransports( prefilters ) ,
  ajaxTransport : addToPrefiltersOrTransports( transports ) ,
  // Main method
  ajax : function ( url , options ) {
    //url can be optional, will use the ajaxSettings url
    if ( typeof url === "object" ) {
      options = url;
      url = undefined;
    }
    // Force options to be an object
    options = options || {};

    var transport ,

      // URL without anti-cache param
      cacheURL ,

      // Response headers
      responseHeadersString ,
      responseHeaders ,

      // timeout handle
      timeoutTimer ,

      // Url cleanup var
      urlAnchor ,

      // Request state (becomes false upon send and true upon completion)
      completed ,

      // Loop variable
      i ,

      // uncached part of the url
      uncached ,
      // Create the final options object
      s = kLib.ajaxSetup( {} , options ) ,

      // Callbacks context
      callbackContext = s.context || s ,

      // Status-dependent callbacks
      statusCode = s.statusCode || {} ,

      // Headers (they are sent all at once)
      requestHeaders = {} ,
      requestHeadersNames = {} ,

      // Default abort message
      strAbort = "canceled" ,

      // Fake xhr
      klXHR = {
        readyState : 0 ,
        callbacks : {} ,
        // Builds headers hashtable if needed
        getResponseHeader : function ( key ) {
          var match;
          if ( completed ) {
            if ( !responseHeaders ) {
              responseHeaders = {};
              while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
                responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
              }
            }
            match = responseHeaders[ key.toLowerCase() ];
          }
          return match == null ? null : match;
        } ,

        // Raw string
        getAllResponseHeaders : function () {
          return completed ? responseHeadersString : null;
        } ,

        // Caches the header
        setRequestHeader : function ( name , value ) {
          if ( completed == null ) {
            name = requestHeadersNames[ name.toLowerCase() ] =
              requestHeadersNames[ name.toLowerCase() ] || name;
            requestHeaders[ name ] = value;
          }
          return this;
        } ,

        // Overrides response content-type header
        overrideMimeType : function ( type ) {
          if ( completed == null ) {
            s.mimeType = type;
          }
          return this;
        } ,

        // Status-dependent callbacks
        statusCode : function ( map ) {
          var code;
          if ( map ) {
            if ( completed ) {
              // Execute the appropriate callbacks
              if ( isFunction( map[ klXHR.status ] ) ) {
                
                map[ klXHR.status ]( klXHR.responseObj );
              }
            } else {

              // Lazy-add the new callbacks in a way that preserves old ones
              for ( code in map ) {
                
                statusCode[ code ] = [ statusCode[ code ] , map[ code ] ];
              }
            }
          }
          return this;
        } ,

        // Cancel the request
        abort : function ( statusText ) {
          
          var finalText = statusText || strAbort;
          if ( transport ) {
            transport.abort( finalText );
          }
          done( 0 , finalText );
          return this;
        } ,
        requestDetails : s.requestDetails || {}
      };

    // Add protocol if not provided (prefilters might expect it)
    // Handle falsy url in the settings object
    // We also use the url parameter if available

    s.url = ( ( url || s.url || location.href ) + "" ).replace( rprotocol , location.protocol + "//" );

    // Alias method option to type
    s.type = options.method || options.type || s.method || s.type;

    // Extract dataTypes list
    s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

    // A cross-domain request is in order when the origin doesn't match the current origin.
    if ( s.crossDomain === null ) {
      urlAnchor = document.createElement( "a" );

      // Support: IE <=8 - 11, Edge 12 - 15
      // IE throws exception on accessing the href property if url is malformed,
      // e.g. http://example.com:80x/
      try {
        urlAnchor.href = s.url;

        // Support: IE <=8 - 11 only
        // Anchor's host property isn't correctly set when s.url is relative
        urlAnchor.href = urlAnchor.href;
        s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
          urlAnchor.protocol + "//" + urlAnchor.host;
      } catch ( e ) {

        // If there is an error parsing the URL, assume it is crossDomain,
        // it can be rejected by the transport if it is invalid
        s.crossDomain = true;
      }
    }

    // Convert data if not already a string
    if ( s.data && s.processData && typeof s.data !== "string" ) {
      s.data = kLib.param( s.data );
    }

    // Apply prefilters
    inspectPrefiltersOrTransports( prefilters , s , options , klXHR );

    // If request was aborted inside a pre-filter, stop there
    if ( completed ) {
      return klXHR;
    }

    // Uppercase the type
    s.type = s.type.toUpperCase();

    // Determine if request has content
    s.hasContent = !rnoContent.test( s.type );

    // Save the URL in case we're toying with the If-Modified-Since
    // and/or If-None-Match header later on
    // Remove hash to simplify url manipulation
    cacheURL = s.url.replace( rhash , "" );
    // More options handling for requests with no content
    if ( !s.hasContent ) {

      // Remember the hash so we can put it back
      uncached = s.url.slice( cacheURL.length );

      // If data is available and should be processed, append data to url
      if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
        cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

        // remove data so that it's not used in an eventual retry
        delete s.data;
      }

      // Add or update anti-cache param if needed
      if ( s.cache === false ) {

        cacheURL = cacheURL.replace( rantiCache , "$1" );
        uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
        
      }

      // Put hash and anti-cache on the URL that will be requested
      s.url = cacheURL + uncached;

      // Change '%20' to '+' if this is encoded form body content
    } else if ( s.data && s.processData &&
      ( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
      s.data = s.data.replace( r20 , "+" );
    }

    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    if ( s.ifModified ) {
      if ( kLib.lastModified[ cacheURL ] ) {
        klXHR.setRequestHeader( "If-Modified-Since" , kLib.lastModified[ cacheURL ] );
      }
      if ( kLib.etag[ cacheURL ] ) {
        klXHR.setRequestHeader( "If-None-Match" , kLib.etag[ cacheURL ] );
      }
    }

    // Set the correct header, if data is being sent
    if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
      klXHR.setRequestHeader( "Content-Type" , s.contentType );
    }
    // Set the Accepts header for the server, depending on the dataType

    klXHR.setRequestHeader(
      "Accept" ,
      s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
        s.accepts[ s.dataTypes[ 0 ] ] +
        ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
        s.accepts[ "*" ]
    );

    // Check for headers option
    for ( i in s.headers ) {
      klXHR.setRequestHeader( i , s.headers[ i ] );
    }

    // Allow custom headers/mimetypes and early abort
    if ( s.beforeSend &&
      ( s.beforeSend.call( callbackContext , klXHR , s ) === false || completed ) ) {

      // Abort if not done already and return
      return klXHR.abort();
    }

    // Aborting is no longer a cancellation
    strAbort = "abort";

    klXHR.callbacks.done = s.done;
    klXHR.callbacks.success = s.success;
    klXHR.callbacks.fail = s.error;

    // Get transport
    transport = inspectPrefiltersOrTransports( transports , s , options , klXHR );

    // If no transport, we auto-abort
    if ( !transport ) {
      done( -1 , "No Transport" );
    } else {
      klXHR.readyState = 1;

      // If request was aborted inside ajaxSend, stop there
      if ( completed ) {
        return klXHR;
      }

      // Timeout
      if ( s.async && s.timeout > 0 ) {
        timeoutTimer = window.setTimeout( function () {
          klXHR.abort( "timeout" );
        } , s.timeout );
      }

      try {
        completed = false;
        transport.send( requestHeaders , done );
      } catch ( e ) {

        // Rethrow post-completion exceptions
        if ( completed ) {
          throw e;
        }

        // Propagate others as results
        done( -1 , e );
      }
    }

    // Callback for when everything is done
    function done( status , nativeStatusText , responses , headers ) {
      var isSuccess , success , error , response , modified ,
        statusText = nativeStatusText;

      // Ignore repeat invocations
      if ( completed ) {
        return;
      }

      completed = true;

      // Clear timeout if it exists
      if ( timeoutTimer ) {
        window.clearTimeout( timeoutTimer );
      }

      // Dereference transport for early garbage collection
      // (no matter how long the klXHR object will be used)
      transport = undefined;

      // Cache response headers
      responseHeadersString = headers || "";

      // Set readyState
      klXHR.readyState = status > 0 ? 4 : 0;

      // Determine if successful
      isSuccess = status >= 200 && status < 300 || status === 304;

      // Get response data
      if ( responses ) {
        response = ajaxHandleResponses( s , klXHR , responses );
      }

      // Convert no matter what (that way responseXXX fields are always set)
      response = ajaxConvert( s , response , klXHR , isSuccess );

      // If successful, handle type chaining
      if ( isSuccess ) {

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {
          modified = klXHR.getResponseHeader( "Last-Modified" );
          if ( modified ) {
            kLib.lastModified[ cacheURL ] = modified;
          }
          modified = klXHR.getResponseHeader( "etag" );
          if ( modified ) {
            kLib.etag[ cacheURL ] = modified;
          }
        }

        // if no content
        if ( status === 204 || s.type === "HEAD" ) {
          statusText = "nocontent";

          // if not modified
        } else if ( status === 304 ) {
          statusText = "notmodified";

          // If we have data, let's convert it
        } else {
          statusText = response.state;
          success = response.data;
          error = response.error;
          isSuccess = !error;
        }

      } else {

        // Extract error from statusText and normalize for non-aborts
        error = statusText;
        if ( status || !statusText ) {
          statusText = "error";
          if ( status < 0 ) {
            status = 0;
          }
        }
      }

      // Set data for the fake xhr object
      klXHR.status = status;
      klXHR.statusText = ( nativeStatusText || statusText ) + "";
      klXHR.responseObj = response;
      klXHR.isSuccess = isSuccess;
      

      // Success/Error
      if ( isSuccess ) {
        if ( isFunction( klXHR.callbacks.success ) ) {
          klXHR.callbacks.success( klXHR );
        }
      } else {
        if ( isFunction( klXHR.callbacks.fail ) ) {
          klXHR.callbacks.fail( klXHR );
        }
      }

      // Status-dependent callbacks
      klXHR.statusCode( statusCode );
      statusCode = undefined;

      // Complete
      if ( isFunction( klXHR.callbacks.done ) ) {
        klXHR.callbacks.done( klXHR );
      }

    }

    return klXHR;

  } ,

  getJSON : function ( url , data , callback ) {
    return kLib.get( url , data , callback , "json" );
  } ,

  getScript : function ( url , callback ) {
    return kLib.get( url , undefined , callback , "script" );
  }
} );
// map the get and post
kLib.each( [ "get" , "post" ] , function ( i , method ) {
  kLib[ method ] = function ( url , data , callback , type ) {

    // Shift arguments if data argument was omitted
    if ( isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    // The url can be an options object (which then must have .url)
    return kLib.ajax( kLib.extend( {
      url : url ,
      type : method ,
      dataType : type ,
      data : data ,
      success : callback
    } , kLib.isPlainObject( url ) && url ) );
  };
} );

/* AJAX LIBRARY - Processors */
// Prevent auto-execution of scripts when no explicit dataType was provided
kLib.ajaxPrefilter( function ( s ) {
  if ( s.crossDomain ) {
    s.contents.script = false;
  }
} );
// Build the ajax Transport
kLib.ajaxTransport( function ( options ) {
  var callback , errorCallback;

  // Cross domain only allowed if supported through XMLHttpRequest
  if ( support.cors || xhrSupported && !options.crossDomain ) {
    return {
      send : function ( headers , complete ) {
        var i ,
          xhr = options.xhr();

        xhr.open(
          options.type ,
          options.url ,
          options.async ,
          options.username ,
          options.password
        );

        

        // Apply custom fields if provided
        if ( options.xhrFields ) {
          for ( i in options.xhrFields ) {
            xhr[ i ] = options.xhrFields[ i ];
          }
        }

        // Override mime type if needed
        if ( options.mimeType && xhr.overrideMimeType ) {
          xhr.overrideMimeType( options.mimeType );
        }

        // X-Requested-With header
        // For cross-domain requests, seeing as conditions for a preflight are
        // akin to a jigsaw puzzle, we simply never set it to be sure.
        // (it can always be set on a per-request basis or even using ajaxSetup)
        // For same-domain requests, won't change header if already provided.
        if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
          headers[ "X-Requested-With" ] = "XMLHttpRequest";
        }

        // Set headers
        for ( i in headers ) {
          xhr.setRequestHeader( i , headers[ i ] );
        }

        // Callback
        callback = function ( type ) {
          return function () {
            if ( callback ) {
              callback = errorCallback = xhr.onload =
                xhr.onerror = xhr.onabort = xhr.ontimeout =
                  xhr.onreadystatechange = null;

              if ( type === "abort" ) {
                xhr.abort();
              } else if ( type === "error" ) {

                // Support: IE <=9 only
                // On a manual native abort, IE9 throws
                // errors on any property access that is not readyState
                if ( typeof xhr.status !== "number" ) {
                  complete( 0 , "error" );
                } else {
                  complete(
                    // File: protocol always yields status 0;
                    xhr.status ,
                    xhr.statusText
                  );
                }
              } else {
                complete(
                  xhrSuccessStatus[ xhr.status ] || xhr.status ,
                  xhr.statusText ,

                  // Support: IE <=9 only
                  // IE9 has no XHR2 but throws on binary
                  // For XHR2 non-text, let the caller handle it
                  ( xhr.responseType || "text" ) !== "text" ||
                  typeof xhr.responseText !== "string" ?
                    { binary : xhr.response } :
                    { text : xhr.responseText } ,
                  xhr.getAllResponseHeaders()
                );
              }
            }
          };
        };

        // Listen to events
        xhr.onload = callback();
        errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

        // Support: IE 9 only
        // Use onreadystatechange to replace onabort
        // to handle uncaught aborts
        if ( xhr.onabort !== undefined ) {
          xhr.onabort = errorCallback;
        } else {
          xhr.onreadystatechange = function () {

            // Check readyState before timeout as it changes
            if ( xhr.readyState === 4 ) {

              // Allow onerror to be called first,
              // but that will not handle a native abort
              // Also, save errorCallback to a variable
              // as xhr.onerror cannot be accessed
              window.setTimeout( function () {
                if ( callback ) {
                  errorCallback();
                }
              } );
            }
          };
        }

        // Create the abort callback
        callback = callback( "abort" );

        try {

          // Do send the request (this may raise an exception)
          xhr.send( options.hasContent && options.data || null );
        } catch ( e ) {

          // Only rethrow if this hasn't been notified as an error yet
          if ( callback ) {
            throw e;
          }
        }
      } ,

      abort : function () {
        if ( callback ) {
          callback();
        }
      }
    };
  }
} );
// Install script dataType
kLib.ajaxSetup( {
  accepts : {
    script : "text/javascript, application/javascript, " +
    "application/ecmascript, application/x-ecmascript"
  } ,
  contents : {
    script : /\b(?:java|ecma)script\b/
  } ,
  converters : {
    "text script" : function ( text ) {
      
      globalEval( text );
      return text;
    }
  }
} );
// Handle cache's special case and crossDomain
kLib.ajaxPrefilter( "script" , function ( s ) {
  if ( s.cache === undefined ) {
    s.cache = false;
  }
  if ( s.crossDomain ) {
    s.type = "GET";
  }
} );

kLib.ajaxSettings.xhr = function () {
  try {
    return new window.XMLHttpRequest();
  } catch ( e ) {
  }
};
var xhrSuccessStatus = {
  // File protocol always yields status code 0, assume 200
  0 : 200 ,

  // Support: IE <=9 only
  // sometimes IE returns 1223 when it should be 204
  1223 : 204
};
var xhrSupported = kLib.ajaxSettings.xhr();
// expose the support
support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported; 
//source/core/klevuLib/modules/fetch.js

kLib.extend(true,settings,{
  fetchSettings : {
    url : location.href ,
    method : "GET" ,
    processData : true ,
    async : true ,
    contentType : "application/x-www-form-urlencoded; charset=UTF-8" ,
    contents : {
      xml : /\bxml\b/ ,
      html : /\bhtml/ ,
      json : /\bjson\b/
    } ,
    success: function () {},
    done: function () {},
    error: function () {}
  }
});


kLib.fetch = kLib.pt.fetch = function (requestObject,requestDetails) {

  requestObject = klevu.extend( true ,  klevu.extend( true , {} , klevu.fetchSettings ) , requestObject );

  var tempHeaders = {};
  if(!klevu.isUndefined(requestObject.mimeType)){
    tempHeaders = {
      'Content-Type':requestObject.mimeType,
    };
  }

  //check if we have extra headers in the request object
  if(!kLib.isUndefined(requestObject.extraHeaders)){
    kLib.each(requestObject.extraHeaders, function(key,value){
      tempHeaders[key] = value;
    });

  }

  tempHeaders = new Headers(tempHeaders);

  var settings = {
    method: requestObject.method,
    headers: tempHeaders
  };
  if(requestObject.method.toLowerCase() === "get"){
    var url = new URL(requestObject.url);
    if(requestObject.data !== ""){
      var params = {q:requestObject.data};
      Object.keys(params).forEach(function(key,value) {url.searchParams.append(value, params[value]);});
    }
    requestObject.url = url.toString();
  } else {
    settings.body = requestObject.data
  }
  if(requestObject.crossDomain) settings.mode= 'cors';

  var request = new Request(requestObject.url, settings);

  fetch(request).then(function(res) {
    // res instanceof Response == true.
    if (res.ok) {
      var processor = null;
      if(!klevu.isUndefined(requestObject.dataType)){
        processor = requestObject.dataType.toLowerCase();
      } else {
        if(res.headers.get("content-type") != null){
          if (res.headers.get("content-type").indexOf("json") !== -1) {// checking response header
            processor = "json";
          } else if (res.headers.get("content-type").indexOf("xml") !== -1) {// checking response header
            processor = "xml";
          }
        }
      }

      switch ( processor ) {
        case "json":
          res.json().then(function(data) {
            requestObject.success(data,requestDetails,res.status,res.ok);
          });
          break;
        case "xml":
          res.text().then(function(data) {
            requestObject.success((new window.DOMParser()).parseFromString(data, "text/xml"),requestDetails,res.status,res.ok);
          });
          break;
        default:
          res.text().then(function(data) {
            requestObject.success(data,requestDetails,res.status,res.ok);
          });
      }

    } else {
      requestObject.error(requestDetails,res.status,res.ok);
    }
  }, function(e) {
    requestObject.error(requestDetails,"0",false);
  });

}; 
//source/core/klevuLib/modules/request.js
kLib.extend(true,settings,{
  request : {
    type : "FETCH",
    method : "GET",
    crossDomain: false,
    data:"",
    success: function () {},
    done: function () {},
    error: function () {}
  }
});

kLib.request = kLib.pt.request = function (requestObject,  requestDetails) {
  if(!isUndefined(requestObject)) {
    requestObject = klevu.extend( true ,  klevu.extend( true , {} , klevu.settings.request ) , requestObject );
    if ( isUndefined( requestObject.url ) ) return false;
    if ( requestObject.type.toLowerCase() === "fetch" ) {
      delete requestObject[ "type" ];
      klevu.fetch( requestObject ,requestDetails);
    } else {
      //remove type key
      delete requestObject[ "type" ];
      kLib.setObjectPath(requestDetails,"context.requestDetails",{});
      kLib.setObjectPath(requestDetails,"context.requestObject",{});
      requestObject.requestDetails = requestDetails;

      klevu.ajax( requestObject );
    }
  }
};

kLib.get = kLib.pt.get = function (requestObject) {
  requestObject.method = "GET";
  kLib.request(requestObject);
};

kLib.post = kLib.pt.post = function (requestObject) {
  requestObject.method = "POST";
  kLib.request(requestObject);
};
 
//source/core/klevuLib/modules/file.js
kLib.extend(true,settings,{
  assets : {
    support : ["template","js","css"]
  }
});
var assetsProcessors = {
  js: function(data,options){
    kLib.dom.helpers.addElementToHead( { content : data , type : "js" , name : "kfl-" + randomId() } );
  },
  css: function(data,options){
    kLib.dom.helpers.addElementToHead( { content : data , type : "css" , name : "kfl-" + randomId() } );
  },
  template:function(data,options){
    klevu.search[options.pbid].getScope().template.setTemplate( data , options.name , true );
  },

}

kLib.assets = kLib.pt.assets = {

  /*  get a new file
   Parameters
   object
   url - url from where the file should be taken
   type - type of the object based on supported methods
   options - for diferent types some options might be needed to be send on the processors once the source has been retrived
   <other options used in processing>

   */
  getFile: function(fileObject){

    if ( !fileObject.hasOwnProperty("url") ) return false;
    if ( !fileObject.hasOwnProperty("type") ) return false;
    if ( !fileObject.hasOwnProperty("options") ) fileObject.options = {};

    fileObject.options.url = fileObject.url;
    fileObject.options.type = fileObject.type;
    switch (fileObject.options.type) {
      case "css":fileObject.options.mimeType = "text/css";  break;
      case "js":fileObject.options.mimeType = "text/javascript"; break;
      case "template": fileObject.options.mimeType = "text/plain"; break;
      default: fileObject.options.mimeType = "text/plain"; break;
    }

    var requestDetails = {
      success: function(data,options,status,isSuccess){
        
        kLib.assets.process(data,options);
        if ( options.hasOwnProperty("successCallback") ) options.successCallback(options);
      },
      error: function(data,options,status,isSuccess){
        
        if ( options.hasOwnProperty("errorCallback") ) options.errorCallback(options);
      },
      options: fileObject.options
    };
    var requestObject = {
      url: fileObject.url,
      type: "FETCH",
      method : "GET" ,
      mimeType: fileObject.options.mimeType,
      crossDomain : true
    };
    if (window.fetch) {
      //for fetch
      requestObject.success = function ( data , requestDetails , status, isSuccess ) {
          requestDetails.success(data,requestDetails.options,status,isSuccess);
        };
      requestObject.error = function ( requestDetails, status, isSuccess ) {
        requestDetails.error( {} , requestDetails.options , status , isSuccess );
      };
    } else {
      requestObject.type = "AJAX";
      // for ajax
      requestObject.success = function ( klXHR ) {
          requestDetails.success(klXHR.responseObj.data,klXHR.requestDetails.options,klXHR.status,klXHR.isSuccess);
        };
      requestObject.error = function ( klXHR ) {
          requestDetails.error({},klXHR.requestDetails.options,klXHR.status,klXHR.isSuccess);
        };
    }

    kLib.request(requestObject, requestDetails );

  },
  process: function(data,options){

    if ( !assetsProcessors.hasOwnProperty(options.type) ) {
      
      return false;
    }
    assetsProcessors[options.type](data,options);
  },
  /*  Add processor
   Parameters
   object
     type - type of the processor
     fire - function to be executed for that processor type, recieves data and options from the success process

   */
  addProcessor: function(object){
    if ( !object.hasOwnProperty("type") ) return false;
    if ( !object.hasOwnProperty("fire") ) return false;
    assetsProcessors[object.type] = object.fire;
  },
  getProcessors: function(){
    return assetsProcessors;
  }

};
// expose the support
kLib.extend(true,support,{
  assets : true
}); 
//source/core/klevuLib/modules/cache.js
/* ---------------------------------- CACHE ENGINE ---------------------------------- */
var cacheObj = {
  request : [] ,
  response : [] ,
  keys : 0
};
kLib.cache = kLib.pt.cache = function () {

  var selfObj = {
    // get cache value for a specific request
    getCache : function ( req ) {
      //find obj in request use key to select from response
      var cacheKey = selfObj.getCacheKey( req );
      if ( cacheKey >= 0 ) return cacheObj.response[ cacheKey ];
      return false;
    } ,
    //get the cache key for specific request
    getCacheKey : function ( req ) {
      //init cache key to invalid
      var keyToReturn = -1;
      //check request for cache key
      kLib.each( cacheObj.request , function ( key , value ) {
        if ( kLib.isEqualObj( req , value ) ) {
          keyToReturn = key;
          //return to brake loop
          return false;
        }
      } );
      return keyToReturn;
    } ,
    //check if cache key exists for a request
    hasCache : function ( req ) {
      return (selfObj.getCacheKey( req ) !== -1);
    } ,
    //set new cache response for a request
    setCache : function ( req , res ) {
      var cacheKey = selfObj.getCacheKey( req );
      if ( cacheKey >= 0 ) {
        cacheObj.response[ cacheKey ] = res;
      } else {
        cacheObj.request[ cacheObj.keys ] = req;
        cacheObj.response[ cacheObj.keys ] = res;
        cacheObj.keys++;
      }
      return true;
    } ,
    //get all cache map, used in debug
    getAllCache : function () {
      return cacheObj;
    }

  };
  return selfObj;
};
// expose the support
kLib.extend(true,support,{
  cache : true
}); 
//source/core/klevuLib/modules/dictionary.js

/* ---------------------------------- Dictionary ENGINE ---------------------------------- */
//hold the dictionary global dictionary
var globalDictionaryRepo = {};
kLib.extend( {
  globalDictionaryRepo : globalDictionaryRepo
} );
kLib.dictionary = kLib.pt.dictionary = function ( type ) {
  var localSettings = {
    dictionaryMap : {} ,
    type : type || "translation" ,
    storageType : null ,
    storage : null ,
    cookies : []
  };
  //init dictionary type if not defined
  if ( isUndefined( globalDictionaryRepo[ localSettings.type ] ) ) {
    globalDictionaryRepo[ localSettings.type ] = {};
  }
  function storageTest( objectName ) {
    
    var test = "test";
    try {
      window[ objectName ].setItem( test , test );
      window[ objectName ].removeItem( test );
      return true;
    } catch ( e ) {
      return false;
    }
  }

  function buildKey( key ) {
    return "klv_" + localSettings.type + "_" + key;
  }

  function decodesKey( key ) {
    return key.replace( buildKey( "" ) , "" );
  }

  function checkKey( key ) {
    return key.startsWith( buildKey( "" ) );
  }

  function getAllStorage() {
    var i = 0 ,
      output = {} ,
      sKey;
    for ( ; sKey = localSettings.storage.key( i ) ; i++ ) {
      if ( sKey === "undefined" ) break;
      var value = localSettings.storage.getItem( sKey );

      if ( value !== null ) {
        if ( checkKey( sKey ) )
          output[ decodesKey( sKey ) ] = value;
      }

    }
    return output;
  }

  function getStorage() {
    if ( localSettings.storage !== null ) return localSettings.storage;
    return false;
  };
  function getStorageType() {
    if ( localSettings.storageType !== null ) return localSettings.storageType;
    return false;
  };
  function hasStorage() {
    return (localSettings.storageType !== null);
  }

  function mergeToStorage() {
    if ( hasStorage() ) {
      //first remove the set elements
      var storageElements = getAllStorage();
      //check if the dictionary is in data protection and perform checks
      if (!kLib.dataProtection.dataCanBeTracked()){
        if((kLib.isUndefined(globalDictionaryRepo[ localSettings.type ].klvDataProtected) &&
            !kLib.isUndefined(storageElements.klvDataProtected) &&
            kLib.toBoolean(storageElements.klvDataProtected)
        ) || (!kLib.isUndefined(globalDictionaryRepo[ localSettings.type ].klvDataProtected) &&
            (kLib.toBoolean(globalDictionaryRepo[ localSettings.type ].klvDataProtected))
        )) {
          
          return false;
        }
      }

      each( storageElements , function ( key , value ) {
        try {
          localSettings.storage.removeItem( buildKey( key ) );
        } catch ( e ) {
          
          sendReport( e , "STORAGE-removeKey-" + buildKey( key ) );
        }
      } );
      //set new elements
      each( globalDictionaryRepo[ localSettings.type ] , function ( key , value ) {
        try {
          localSettings.storage.setItem( buildKey( key ) , value );
        } catch ( e ) {
          
          sendReport( e , "STORAGE-addKey-" + buildKey( key ) );
        }
      } );
    }
  }

  function mergeFromStorage() {
    if ( hasStorage() ) {
      var storageElements = getAllStorage();
      //check if the dictionary is in data protection and perform checks
      if (!kLib.dataProtection.dataCanBeTracked()){
        if((kLib.isUndefined(globalDictionaryRepo[ localSettings.type ].klvDataProtected) &&
            !kLib.isUndefined(storageElements.klvDataProtected) &&
            kLib.toBoolean(storageElements.klvDataProtected)
        ) || (!kLib.isUndefined(globalDictionaryRepo[ localSettings.type ].klvDataProtected) &&
            (kLib.toBoolean(globalDictionaryRepo[ localSettings.type ].klvDataProtected))
        )) {
          
          return false;
        }
      }
      globalDictionaryRepo[ localSettings.type ] = kLib.extend( true , globalDictionaryRepo[ localSettings.type ] , storageElements );
    }
  }

  var selfObj = {

    getGlobal : function () {
      mergeFromStorage();
      return globalDictionaryRepo[ localSettings.type ];
    } ,
    mergeToGlobal : function () {
      globalDictionaryRepo[ localSettings.type ] = kLib.extend( true , globalDictionaryRepo[ localSettings.type ] , localSettings.dictionaryMap );
      mergeToStorage();
      return this;
    } ,
    overrideGlobal : function () {
      globalDictionaryRepo[ localSettings.type ] = localSettings.dictionaryMap;
      mergeToStorage();
      return this;
    } ,
    mergeFromGlobal : function () {
      mergeFromStorage();
      localSettings.dictionaryMap = kLib.extend( true , localSettings.dictionaryMap , globalDictionaryRepo[ localSettings.type ] );
      return this;
    } ,
    setElements : function ( elements ) {
      if ( isArrayLike( elements ) ) {
        if ( elements.length > 0 ) {
          each( elements , function ( key , value ) {
            selfObj.addElement( key , value );
          } );
        }
      } else if ( isPlainObject( elements ) ) {
        each( elements , function ( key , value ) {
          selfObj.addElement( key , value );
        } );
      }
      return this;
    } ,
    getElements : function () {
      return localSettings.dictionaryMap;
    } ,
    resetElements : function () {
      localSettings.dictionaryMap = {};
      return this;
    } ,
    getElement : function ( string ) {
      if ( isUndefined( string ) ) return "";
      // trim all whitespaces
      //string = trim( string );

      // check for translation in the translation map
      if ( !isUndefined( localSettings.dictionaryMap[ string ] ) && !(localSettings.dictionaryMap[ string ] === null) ) {
        string = localSettings.dictionaryMap[ string ];
      }
      return string;
    } ,
    addElement : function ( valueDefault , valueOverride ) {
      localSettings.dictionaryMap[ valueDefault ] = valueOverride;
      return this;
    } ,
    removeElement : function ( valueDefault ) {
      delete localSettings.dictionaryMap[ valueDefault ];
      return this;
    } ,
    getAllStorage : getAllStorage ,
    setStorage : function ( storage , fallback ) {
      if ( isUndefined( fallback ) ) fallback = false;
      try {
        var skip = false;
        if ( storage === "local" && storageTest( "localStorage" ) ) {
          localSettings.storageType = storage;
          localSettings.storage = window[ "localStorage" ];
          skip = true;
        } else if ( fallback ) {
          
          storage = "cookies";
        }
        
        if ( !skip ) {
          if ( storage === "session" && storageTest( "sessionStorage" ) ) {
            localSettings.storageType = storage;
            localSettings.storage = window[ "sessionStorage" ];
          } else if ( fallback ) {
            
            storage = "cookiesSession";
          }
          
        }

        if ( storage === "cookies" || storage === "cookiesSession" ) {
          localSettings.storageType = storage;
          localSettings.storage = {
            getItem : function ( sKey ) {
              if ( !sKey || !this.hasOwnProperty( sKey ) ) {
                return null;
              }
              return decodeURI( document.cookie.replace( new RegExp( "(?:^|.*;\\s*)" + encodeURI( sKey ).replace( /[\-\.\+\*]/g , "\\$&" ) + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*" ) , "$1" ) );
            } ,
            key : function ( nKeyId ) {
              var keys = document.cookie.replace( /\s*\=(?:.(?!;))*$/ , "" ).split( /\s*\=(?:[^;](?!;))*[^;]?;\s*/ );
              var clone = kLib.extend( true , {} , keys );
              each( clone , function ( key , value ) {
                if ( value.indexOf( buildKey( "" ) ) === -1 ) {
                  keys.splice( keys.indexOf( value ) , 1 );
                }
              } );
              var key = decodeURI( keys[ nKeyId ] );
              return key;
            } ,
            setItem : function ( sKey , sValue ) {
              if ( !sKey ) {
                return;
              }
              var dateString = "";
              if ( localSettings.storageType === "cookies" ) {
                var date = new Date();
                date.setTime( date.getTime() + (7 * 24 * 60 * 60 * 1000) );
                dateString = " expires=" + date.toUTCString() + ";";
              }

              document.cookie = encodeURI( sKey ) + "=" + encodeURI( sValue ) + ";" + dateString + " path=/";
              var lengthRegex = new RegExp( buildKey( "" ) , [ "g" ] );
              this.length = (document.cookie.match( lengthRegex )).length;
            } ,
            length : 0 ,
            removeItem : function ( sKey ) {
              if ( !sKey || !this.hasOwnProperty( sKey ) ) {
                return;
              }
              document.cookie = encodeURI( sKey ) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
              this.length--;
            } ,
            hasOwnProperty : function ( sKey ) {
              return (new RegExp( "(?:^|;\\s*)" + encodeURI( sKey ).replace( /[\-\.\+\*]/g , "\\$&" ) + "\\s*\\=" )).test( document.cookie );
            }
          };
          var lengthRegex = new RegExp( buildKey( "" ) , [ "g" ] );
          localSettings.storage.length = (document.cookie.match( lengthRegex )).length;

        }
        if ( hasStorage() ) {
          mergeFromStorage();
        }
        
      } catch ( e ) {
        
        sendReport( e , "STORAGE-storageSet-" + storage );
      }

    } ,
    getStorage : getStorage ,
    getStorageType : getStorageType ,
    hasStorage : hasStorage ,
    mergeFromStorage : mergeFromStorage ,
    mergeToStorage : mergeToStorage,
    setDataProtection:function(klvDataProtected){
      selfObj.addElement("klvDataProtected",klvDataProtected);
      return this;
    }
  };
  return selfObj;
};
// expose the support
kLib.extend(true,support,{
  dictionary : true
}); 
//source/core/klevuLib/modules/currency.js

/* ---------------------------------- CURRENCY ENGINE ---------------------------------- */
// default settings
kLib.extend(true,settings,{
  currency : {
    precision : 2 ,		// default precision on numbers is 0
    grouping : 3 ,		// digit grouping
    decimal : "." ,		// decimal point separator
    thousand : "," // thousands separator
  }
});
kLib.currency = kLib.pt.currency = function () {
  var dictionaryObj = kLib.dictionary( "currency" );
  var selfObj = {
    getGlobal : dictionaryObj.getGlobal ,
    mergeToGlobal : dictionaryObj.mergeToGlobal ,
    overrideGlobal : dictionaryObj.overrideGlobal ,
    mergeFromGlobal : dictionaryObj.mergeFromGlobal ,
    setCurrencys : function ( currencyMap ) {
      if ( isPlainObject( currencyMap ) ) {
        each( currencyMap , function ( key , value ) {
          selfObj.addCurrency( key , value );
        } );
      }
      return this;
    } ,
    getCurrencys : dictionaryObj.getElements ,
    resetCurrencys : dictionaryObj.resetElements ,
    getCurrency : function ( string ) {
      var map = {};
      if ( isUndefined( string ) ) return map;
      // trim all whitespaces
      string = trim( string );

      var local = dictionaryObj.getElement( string );
      // check for translation in the translation map
      if ( local !== string ) {
        map = local;
      } else {
        map = { code : string , string : string , atEnd : true , format : "%s%s" };
      }
      return map;
    } ,
    addCurrency : function ( valueCode , valueMap ) {
      if ( !valueMap.hasOwnProperty( "format" ) ) valueMap.format = "%s%s";
      if ( !valueMap.hasOwnProperty( "atEnd" ) ) valueMap.atEnd = false;
      if ( !valueMap.hasOwnProperty( "code" ) ) valueMap.code = valueCode;
      if ( !valueMap.hasOwnProperty( "precision" ) ) {
        valueMap.precision = parseInt(settings.currency.precision);
      } else {
        valueMap.precision = parseInt(valueMap.precision);
      }
      if ( !valueMap.hasOwnProperty( "thousand" ) ) valueMap.thousand = settings.currency.thousand;
      if ( !valueMap.hasOwnProperty( "decimal" ) ) valueMap.decimal = settings.currency.decimal;
      if ( !valueMap.hasOwnProperty( "grouping" ) ) {
        valueMap.grouping = parseInt(settings.currency.grouping);
      } else {
        valueMap.grouping = parseInt(valueMap.grouping);
      }

      if ( valueMap.hasOwnProperty( "code" ) && valueMap.hasOwnProperty( "string" ) )
        dictionaryObj.addElement( valueCode , valueMap );
      return this;
    } ,
    removeCurrency : dictionaryObj.removeElement ,
    parse : function ( str ) {
      var args = [].slice.call( arguments , 1 ) ,
        i = 0;

      return str.replace( /(%s)/g , function () {
        var returnArgument = "";
        if ( !isUndefined( args[ i ] ) ) returnArgument = args[ i ];
        i++;
        return returnArgument;
      } );
    } ,
    unformatPrice : function ( price , decimal ) {
      // Fails silently (need decent errors):
      price = price || 0;

      // Return the value as-is if it's already a number:
      if ( typeof price !== "number" ) {
        decimal = decimal || settings.currency.decimal;

        // Build regex to strip out everything except digits, decimal point and minus sign:
        var regex = new RegExp( "[^0-9-" + decimal + "]" , [ "g" ] );
        price = parseFloat(
          ("" + price).replace( /\((?=\d+)(.*)\)/ , "-$1" ) // replace bracketed values with negatives
            .replace( regex , "" )     // strip out any cruft
            .replace( decimal , "." )   // make sure decimal point is standard
        );

        price = !isNaN( price ) ? price : 0;

      }
      return price;
    } ,
    /* format price
     * 1) price - first argument
     * 2) optional second argument send as object in format:
     *    precision: number - precision of the decimal
     *    grouping: number - default 3 number of characters to group numbers by
     *    decimal: string - decimal symbol
     *    thousand: string - thousand symbol
     */
    formatPrice : function ( price ) {

      var args = arguments;
      var opts = {
        precision : settings.currency.precision ,
        thousand : settings.currency.thousand ,
        decimal : settings.currency.decimal ,
        grouping : settings.currency.grouping
      };
      if ( typeof args[ 1 ] !== "undefined" ) {
        opts = (isPlainObject( args[ 1 ] ) ? kLib.extend(true,opts,args[ 1 ]) : opts);
      }
      price = selfObj.unformatPrice( price , opts.decimal );

      // Build options object from second param (if object) or all params, extending defaults:

      // Do some calc:
      var negative = price < 0 ? "-" : "" ,
        base = parseInt( (Number( Math.round( Number( selfObj.unformatPrice( Math.abs( price || 0 ) ) + "e" + opts.precision ) ) + "e-" + opts.precision ).toFixed( opts.precision )) , 10 ) + "" ,
        mod = base.length > opts.grouping ? base.length % opts.grouping : 0;

      // Format the price:
      return negative + (mod ? base.substr( 0 , mod ) + opts.thousand : "") + base.substr( mod ).replace( /(\d{3})(?=\d)/g , "$1" + opts.thousand ) + (opts.precision ? opts.decimal + (Number( Math.round( Number( selfObj.unformatPrice( Math.abs( price ) ) + "e" + opts.precision ) ) + "e-" + opts.precision ).toFixed( opts.precision )).split( "." )[ 1 ] : "");
    } ,
    processCurrency : function ( code , price ) {
      var currency = selfObj.getCurrency( code );
      // process string parser for multiple variables.
      price = selfObj.formatPrice( price , currency );
      if ( currency.atEnd ) {
        price = selfObj.parse.apply( null , [ currency.format , price , currency.string ] );
      } else {
        price = selfObj.parse.apply( null , [ currency.format , currency.string , price ] );
      }
      return price;
    }
  };
  return selfObj;
};
// expose the support
kLib.extend(true,support,{
  currency : true
}); 
//source/core/klevuLib/modules/translator.js

/* ---------------------------------- TRANSLATION ENGINE ---------------------------------- */
kLib.translator = kLib.pt.translator = function () {
  var currencyObj = false;

  var dictionaryObj = kLib.dictionary( "translation" );

  var selfObj = {
    getGlobal : dictionaryObj.getGlobal ,
    mergeToGlobal : dictionaryObj.mergeToGlobal ,
    overrideGlobal : dictionaryObj.overrideGlobal ,
    mergeFromGlobal : dictionaryObj.mergeFromGlobal ,
    setTranslations : dictionaryObj.setElements ,
    getTranslations : dictionaryObj.getElements ,
    resetTranslations : dictionaryObj.resetElements ,
    getTranslation : dictionaryObj.getElement ,
    addTranslation : dictionaryObj.addElement ,
    removeTranslation : dictionaryObj.removeElement ,
    parse : function ( str ) {
      var args = [].slice.call( arguments , 1 ) ,
        i = 0;

      return str.replace( /(%s)/g , function () {
        var returnArgument = "";
        if ( !isUndefined( args[ i ] ) ) returnArgument = args[ i ];
        i++;
        return returnArgument;
      } );
    } ,
    translate : function ( string ) {
      string = selfObj.getTranslation( string );
      if ( string.length === 0 ) return string;
      // process string parser for multiple variables.
      if ( isArrayLike( arguments ) ) {
        if ( arguments.length > 1 ) {
          var args = arguments;
          args[ 0 ] = string;
          string = selfObj.parse.apply( null , args );
        }
      }
      return string;
    } ,
    getCurrencyObject : function () {
      if ( currencyObj ) {
        return currencyObj;
      } else {
        currencyObj = kLib.currency();
      }
      return currencyObj;
    }
  };
  return selfObj;
};
// expose the support
kLib.extend(true,support,{
  translator : true
}); 
//source/core/klevuLib/modules/template.js
/* ---------------------------------- TEMPLATE ENGINE ---------------------------------- */
kLib.extend({
  template: function () {
    /* TEMPLATE ENGINE - Variables and setups */
    var templateSettings = {
      templateList: {},
      helpers: {},
      data: {},
      translator: null, // translation translator
      currency: null // translation translator
    };

    /* TEMPLATE ENGINE - core functions */
    function template(templateString, settingsTemplate) {

      // template engine regular expressions
      var templateSettingsGenerate = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
      };
      var noMatch = /(.)^/;
      var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
      var escapes = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
      };

      var escapeChar = function (match) {
        return "\\" + escapes[match];
      };

      settingsTemplate = kLib.extend({}, settingsTemplate, templateSettingsGenerate);
      
      var matcher = new RegExp([
        (settingsTemplate.escape || noMatch).source,
        (settingsTemplate.interpolate || noMatch).source,
        (settingsTemplate.evaluate || noMatch).source
      ].join("|") + "|$", "g");
      var index = 0;
      var source = "__out+='";

      templateString.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
        source += templateString.slice(index, offset).replace(escapeRegExp, escapeChar);
        index = offset + match.length;

        if (escape) {
          source += "'+\n((__temp=(" + escape + "))==null?'':encodeURIComponent(__temp))+\n'";
        } else if (interpolate) {
          source += "'+\n((__temp=(" + interpolate + "))==null?'':__temp)+\n'";
        } else if (evaluate) {
          source += "';\n" + evaluate + "\n__out+='";
        }
        return match;
      });
      source += "';\n";

      if (!settingsTemplate.variable) source = "with(data||{}){\n" + source + "}\n";

      source = "var __temp,__out='',__joiner=Array.prototype.join," +
        "print=function(){__out+=__joiner.call(arguments,'');};\n" +
        source + "return __out;\n";

      var render;
      try {
        render = new Function(settingsTemplate.variable || "data", "dataLocal", "helper", "scope", source);
      } catch (e) {
        e.source = source;
        sendReport(e, "TEMPLATE-renderError");
        throw e;
      }

      var template = function (data, dataLocal, helper, scope) {
        if (isUndefined(scope)) {
          scope = selfObj;
        }
        if (isUndefined(data)) {
          if (scope.hasData()) {
            data = templateSettings.data;
          }
        }
        if (isUndefined(dataLocal)) {
          dataLocal = data;
        }
        if (isUndefined(helper)) {
          helper = getHelpers();
        }

        return render.call(this, data, dataLocal, helper, scope);
      };
      var argument = settingsTemplate.variable || "data";
      var argumentLocal = "dataLocal";
      var helper = "helper";
      var scope = "scope";
      template.source = "function(" + argument + "," + argumentLocal + ", " + helper + ", " + scope + "){\n" + source + "}";

      return template;
    };

    function renderTemplate(name, scope, data, dataLocal, helper) {
      if (isUndefined(scope)) {
        scope = selfObj;
      }
      if (data === undefined) {
        if (scope.hasData()) {
          data = scope.getTemplateSettings().data;
        }
      }
      if (isUndefined(dataLocal)) {
        dataLocal = data;
      }
      if (isUndefined(helper)) {
        helper = scope.getHelpers();
      }
      if (isFunction(scope.getTemplateSettings().templateList[name])) {
        if(!klevu.isUndefined(klevu.getGlobalSetting( "global.templateHints" )) && klevu.getGlobalSetting( "global.templateHints" ) === 'true'){
          return "<div style=' border: 1px solid red;'><span style='color: white;background-color: red;'>"+name+ "</span>" + scope.getTemplateSettings().templateList[name](data, dataLocal, helper, scope) + "</div>";
        }
        return scope.getTemplateSettings().templateList[name](data, dataLocal, helper, scope);
      } else {
        return "";
      }
    }

    /* TEMPLATE ENGINE - Helper functions */
    function getHelpers() {
      return templateSettings.helpers;
    }

    function setHelper(name, functionSource) {
      if (isFunction(functionSource)) {
        templateSettings.helpers[name] = functionSource;
      }
      return templateSettings.helpers;
    }

    /* TEMPLATE ENGINE - translate functions */
    function initTranslator() {
      templateSettings.translator = kLib.translator();
      setHelper("translator", templateSettings.translator);
      templateSettings.translator.mergeFromGlobal();
      /* TEMPLATE ENGINE - translator and currency helper defaults */
      setHelper("translate", templateSettings.translator.translate);
      setHelper("addTranslation", templateSettings.translator.addTranslation);
      setHelper("getTranslation", templateSettings.translator.getTranslation);
      setHelper("removeTranslation", templateSettings.translator.removeTranslation);
      setHelper("setTranslations", templateSettings.translator.setTranslations);
      templateSettings.currency = templateSettings.translator.getCurrencyObject();
      templateSettings.currency.mergeFromGlobal();
      setHelper("processCurrency", templateSettings.currency.processCurrency);

      return templateSettings.translator;
    }

    initTranslator();

    function getTranslator() {
      return templateSettings.translator;
    }

    function translate() {
      return getTranslator().translate.apply(null, arguments);
    }

    function buildUrl(uri, key, value) {
      // remove the hash part before operating on the uri
      var i = uri.indexOf("#");
      uri = i === -1 ? uri : uri.substr(0, i);

      var separator = uri.indexOf("?") !== -1 ? "&" : "?";
      var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");

      var keyval = {};
      keyval[key] = value;
      keyval = kLib.param(keyval);
      if (uri.match(re)) {
        return uri.replace(re, "$1" + keyval + "$2");
      } else {
        return uri + separator + keyval;
      }
    }


    /* TEMPLATE ENGINE - helper defaults */
    setHelper("render", renderTemplate);
    setHelper("each", kLib.each);
    setHelper("buildUrl", buildUrl);
    setHelper("stripHtml", kLib.dom.helpers.stripHtml);
    setHelper("escapeHTML", kLib.dom.helpers.escapeHtml);

    var selfObj = {
      // template manager
      //templateSettings : templateSettings ,
      getTemplateSettings: function () {
        return templateSettings;
      },
      setTemplateSettings: function (settings) {
        templateSettings = settings;
        return templateSettings;
      },
      setTemplate: function (templateString, name, decoded) {
        if (templateString === undefined || name === undefined) {
          
          return false;
        }
        //assume template is decoded
        decoded = decoded || false;
        if (!decoded) {
          try {
            templateString = b64DecodeUnicode(templateString);
          } catch (e) {
            // something failed
            this.data = "";
            
            sendReport(e, "TEMPLATE-templateDecode");
            return false;
          }
        }
        templateSettings.templateList[name] = template(templateString);
        return true;
      },
      render: renderTemplate,
      list: function () {
        var returnList = [];
        kLib.each(templateSettings.templateList, function (i, data) {
          if (!isEmptyObject(data)) {
            returnList.push({
              name: i,
              function: data.source
            });
          }
        });
        return returnList;
      },
      convertTemplate: function (htmlString) {
        var div = document.createElement("div");
        div.innerHTML = trim(htmlString);
        div.className = "klevuWrap";
        // Change this to div.childNodes to support multiple top-level nodes
        return div;
      },
      insertTemplate: function (node, element) {
        node.appendChild(element);
        return node;
      },
      stripHtml: kLib.dom.helpers.stripHtml,
      // helpers
      setHelper: setHelper,
      getHelpers: getHelpers,
      // translations
      translate: translate,
      getTranslator: getTranslator,
      initTranslator: initTranslator,
      // data
      hasData: function () {
        return (!isEmptyObject(templateSettings.data));
      },
      setData: function (data) {
        
        templateSettings.data = data;
        return this;
      },
      getData: function () {
        return templateSettings.data;
      }
    };
    return selfObj;
  },
  templateClone: function (source) {
    var template = kLib.template();
    var localSettings = kLib.extend(true, {}, source.getTemplateSettings());
    template.setTemplateSettings(localSettings);
    template.initTranslator();
    return template;
  }
});
// expose the support
kLib.extend(true, support, {
  template: true
}); 
//source/core/klevuLib/modules/events.js

/* ---------------------------------- STARTUP AND EVENTS ---------------------------------- */

// default settings
kLib.extend(true,settings,{
  events : {
    maxExecutions : 100 ,
    defaultDelay : 0,
    skipFirstRun: false
  }
});
var events = {};
kLib.extend( {
  isReady : false , // Assume document is not ready
  isInteractive : false , // Assume document is not interactive
  event : {
    // attach event to target element
    attach : function ( target , event , callBack , useCapture ) {
      if ( typeof addEventListener !== "undefined" ) {
        if ( isUndefined( useCapture ) ) useCapture = false;
        target.addEventListener( event , callBack , useCapture );
      } else {
        target.attachEvent( "on" + event , callBack );
      }
    } ,
    // detach event to target element
    detach: function( target , event , callBack , useCapture){
      if ( typeof removeEventListener !== "undefined" ) {
        if ( isUndefined( useCapture ) ) useCapture = false;
        target.removeEventListener( event , callBack , useCapture );
      } else {
        target.detachEvent( "on" + event , callBack );
      }
    },
    // fire event chain for attached object/scope. only use this when execting event chains
    fireChain : function ( klevuObject , chainName , scope , data , event ) {
      var chain = kLib.getObjectPath( klevuObject , chainName );
      if ( kLib.isUndefined( chain ) || chain.list().length === 0 ) return;
      chain.setScope( scope );
      chain.setData( data );
      chain.fire();
      if ( chain.getData().preventDefault ) event.preventDefault();
      return event;
    }
  } ,
  // dynamically build event core events
  coreEvent : {
    /*  Build new event type
     Parameters
     name - event name, must be unique and will be used as reference in the attachments. building a already defined event will override fire function and can lead to unforeseen situations.
     fire - function source that returns true/false , will be used to check when event chain will fire
     delay - used to reference the delay between checks in ms. Default 0 ms
     maxCount - maximum number of repetitions until the event is abandoned. Default 100
     */
    build : function ( object ) {
      object.maxCount = object.maxCount || settings.events.maxExecutions;
      object.delay = object.delay || settings.events.defaultDelay;
      object.skipFirstRun = object.skipFirstRun || settings.events.skipFirstRun;
      if ( isUndefined( object.name ) || isUndefined( object.fire ) || !isFunction( object.fire ) ) return false;
      events[ object.name ] = {
        fire : object.fire ,
        counter : 0 ,
        delay : object.delay ,
        maxCount : object.maxCount,
        skipFirstRun: object.skipFirstRun
      };
      kLib.coreEvent.promise( name );
    } ,
    // attach function to event chain, same as promise
    attach : function ( name , object ) {
      if ( isUndefined( name ) || isUndefined( events[ name ] ) ) return false;
      kLib.coreEvent.promise( name , object );
    } ,
    /*  promise function to event chain
     Parameters
     name - event name
     fire - function source that will be executed
     data - data object to be send when chain is executed
     */
    promise : function ( name , object ) {
      if ( isUndefined( name ) || isUndefined( events[ name ] ) ) return false;
      
      if ( !settings.chains[ name + "Chain" ] ) {
        settings.chains[ name + "Chain" ] = startInterface.initChain();
        setTimeout( kLib.coreEvent.fire.bind( kLib , name ) , events[ name ].delay );
      }
      startInterface.addToChain( settings.chains[ name + "Chain" ] , object );
      if(!events[ name ].skipFirstRun){
        if ( events[ name ].fire.call( kLib ) === true ) {
          kLib.coreEvent.fire( name );
        }
      }
    } ,
    // check if event chain can be executed and if yes execute it, stop the timeout
    fire : function ( name ) {

      if ( isUndefined( name ) || isUndefined( events[ name ] ) ) return false;
      // no infinite loop
      if ( events[ name ].counter >= events[ name ].maxCount ) {
        
        return false;
      }
      events[ name ].counter++;

      if ( events[ name ].fire.call( kLib ) === true ) {
        
        startInterface.fireChainAndClear( settings.chains[ name + "Chain" ] );
        //reset counter
        events[ name ].counter = 0;
      } else {
        
        setTimeout( kLib.coreEvent.fire.bind( kLib , name ) , events[ name ].delay );
      }
    }

  }
} );

// expose the support
kLib.extend(true,support,{
  event : true,
  coreEvent: true
});
// startup interface functions
var startInterface = {
  //execute internal events chains
  fireChainAndClear : function ( chain ) {
    if ( chain.list().length > 0 && chain.hasData() ) {
      chain.fire();
      chain.empty();
      chain.setData( { counter : 0 , list : [] } );
    }
  } ,
  /* add object to chains
   Parameters
   name - event name
   fire - function source that will be executed
   data - data object to be send when chain is executed
   */
  addToChain : function ( chain , object ) {
    // check for the type of object passed
    if ( isFunction( object ) ) {
      object = { name : kLib.randomId() , fire : object };
    } else if ( !isEmptyObject( object ) ) {
      if ( !object.name ) object.name = kLib.randomId();
    }

    if ( object ) {
      // wrap function for different data pass
      if ( isFunction( object.fire ) ) {
        var internal = object.fire;
        object.fire = function ( data , scope ) {
          internal.call( this , data.list[ data.counter ] , scope );
          data.counter++;
        };
      }
      ;
      // add to chain
      chain.add( object );
      //set data
      var data = chain.getData();
      if ( !object.data ) object.data = {}; // if no data is provided then send
      data.list.push( object.data );
      chain.setData( data );
    }
  } ,
  // init internal events chains
  initChain : function () {
    var chain = kLib.chain();
    chain.setData( { counter : 0 , list : [] } );
    return chain;
  } ,
  events : {
    // document ready event check
    completedEvent : function ( event ) {
      
      // readyState === "complete" is good enough for us to call the dom ready in oldIE
      if ( event.type === "load" || document.readyState === "complete" ) {
        startInterface.events.detachEvent();
        startInterface.interactiveFire();
        startInterface.readyFire();
      } else if ( document.readyState === "interactive" ) {
        startInterface.interactiveFire();
      }
    } ,
    // document ready event remove
    detachEvent : function () {
      
      if ( document.addEventListener ) {
        document.removeEventListener( "DOMContentLoaded" , startInterface.events.completedEvent , false );
        window.removeEventListener( "load" , startInterface.events.completedEvent , false );

      } else {
        document.detachEvent( "onreadystatechange" , startInterface.events.completedEvent );
        window.detachEvent( "onload" , startInterface.events.completedEvent );
      }
    }
  } ,
  /* ready and interactive state declarations and chains
   Ready - when document is in ready state
   Interactive - when the Document enters interactive state, if possible to detect or latest when document is ready
   */
  readyFire : function () {

    // Make sure body exists, at least, in case IE gets a little overzealous ( taken from jQuery bug report #5443).
    if ( !document.body ) {
      return setTimeout( startInterface.readyFire );
    }
    

    // Remember that the DOM is ready
    kLib.isInteractive = true;
    kLib.isReady = true;
    startInterface.fireChainAndClear( settings.chains.readyChain );
  } ,
  interactiveFire : function () {
    

    // Make sure body exists, at least, in case IE gets a little overzealous ( taken from jQuery bug report #5443).
    if ( !document.body ) {
      return setTimeout( startInterface.interactiveFire );
    }
    // Remember that the DOM is interactive
    kLib.isInteractive = true;
    startInterface.fireChainAndClear( settings.chains.interactiveChain );

  } ,
  interactivePromise : function ( object ) {
    
    if ( document.readyState === "interactive" ) kLib.isInteractive = true;

    if ( !settings.chains.interactiveChain ) {
      settings.chains.interactiveChain = startInterface.initChain();
    }
    startInterface.addToChain( settings.chains.interactiveChain , object );
    if ( kLib.isInteractive ) {
      startInterface.fireChainAndClear( settings.chains.interactiveChain );
    }
  } ,
  readyPromise : function ( object ) {
    
    if ( !settings.chains.readyChain ) {
      settings.chains.readyChain = startInterface.initChain();

      // Catch cases where ready() is called after the browser event has already occurred.
      // we once tried to use readyState "interactive" here, but it caused issues
      if ( document.readyState === "complete" ) {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        setTimeout( startInterface.readyFire );

        // Standards-based browsers support DOMContentLoaded
      } else if ( document.addEventListener ) {
        // Use the handy event callback
        document.addEventListener( "DOMContentLoaded" , startInterface.events.completedEvent , false );

        // A fallback to window.onload, that will always work
        window.addEventListener( "load" , startInterface.events.completedEvent , false );

        // If IE event model is used
      } else {
        // Ensure firing before onload, maybe late but safe also for iframes
        document.attachEvent( "onreadystatechange" , startInterface.events.completedEvent );

        // A fallback to window.onload, that will always work
        window.attachEvent( "onload" , startInterface.events.completedEvent );

        // If IE and not a frame
        // continually check to see if the document is ready
        var top = false;

        try {
          top = window.frameElement === null && document.documentElement;
        } catch ( e ) {
        }

        if ( top && top.doScroll ) {
          (function doScrollCheck() {
            if ( !kLib.isReady ) {
              
              try {
                top.doScroll( "left" );
              } catch ( e ) {
                return setTimeout( doScrollCheck , 50 );
              }

              // detach all dom ready events
              startInterface.events.detachEvent();

              // and execute any waiting functions
              startInterface.readyFire();
            }
          })();
        }
      }
    }
    startInterface.addToChain( settings.chains.readyChain , object );
    if ( kLib.isReady ) {
      startInterface.fireChainAndClear( settings.chains.readyChain );
    }
  }

};

/* Expose the ready and interactive event methods
 * Ready - when document is in ready state
 * Interactive - when the Document enters interactive state, if possible to detect or latest when document is ready
 * */

kLib.extend( {
  ready : function ( object ) {
    startInterface.readyPromise( object );
  } ,
  interactive : function ( object ) {
    startInterface.interactivePromise( object );
  }

} );

// expose the support
kLib.extend(true,support,{
  ready : true,
  interactive: true
});


kLib.extend(true,{
  event: {
    eventList: {
      build:function(options){
        if ( !options.hasOwnProperty( "name" ) ) options.name = "klv"+kLib.randomFunctionName();
        if ( !options.hasOwnProperty( "global" ) ) options.global = false;
        function arrayObject () {
          let arr = Object.create(Array.prototype)

          Object.defineProperty(arr, 'length', {
            value: 0,
            enumerable: false,
            writable: true,
          })

          arr.chain = kLib.chain({stopOnFalse: true});

          for (key in arguments) {
            arr[key] = arguments[key]
            arr.length += 1
          }
          arr.push = function (element) {
            this[this.length] = element
            this.length++
            this.run();
            return 1;
          }
          arr.run = function(){
            let data = {
              action:"run",
              element:this
            };

            let chain = this.chain;
            if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
              chain.setScope( this );
              chain.setData( data );
              chain.fire();
            }
          }

          arr.pop = function () {
            this.length--
            const elementToRemove = this[this.length]
            delete this[this.length]
            return elementToRemove
          }
          arr.remove = function(elementToRemove){
            const index = this.indexOf(elementToRemove);
            if (index > -1) { // only splice array when item is found
              this.splice(index, 1); // 2nd parameter means remove one item only
              return true;
            }
            return false;
          }
          arr.filter = function (cb) {
            let result = [];

            for (let index in this) {
              if (this.hasOwnProperty(index)) {
                const element = this[index]

                if (cb(element, index)) {
                  result.push(element)
                }
              }
            }

            return result
          }

          return arr
        }

        let customEventList = arrayObject();
        kLib.event.eventList.list[options.name] = customEventList;

        if(options.global) {
          let currentObject = !kLib.isUndefined(window[options.name])?window[options.name]:[];
          if(currentObject.length > 0){
            kLib.each(currentObject,function(key,value){
              customEventList.push(value);
            });
          }
          window[options.name] = customEventList;
        }
        return customEventList;
      },
      getByName:function(name){
        if(klevu.getObjectPath(klevu.event.eventList.list,name,false)){
          return klevu.getObjectPath(klevu.event.eventList.list,name);
        } else {
          return klevu.event.eventList.build({name:name});
        }
      },
      hasByName:function(name){
        return klevu.getObjectPath(klevu.event.eventList.list,name,false);
      },
      list:{}
    }
  }
}); 
//source/core/klevuLib/modules/dom.js


/* ---------------------------------- HELPERS AND OTHERS ---------------------------------- */
kLib.extend( {
  dom : {
    find : function ( selector , node ) {

      if ( isUndefined( node ) ) node = window.document;
      if ( kLib.isString( node ) && node !== "" ) node = window.document.getElementById( node );
      if ( !kLib.dom.helpers.isHTMLNode( node ) ) {
        node = window.document;
      }

      if ( !node.querySelectorAll ) return document.querySelectorAll( node.id + " " + selector );

      return node.querySelectorAll( selector );
    } ,
    getFirst:function ( selector , node ) {
      if ( isUndefined( node ) ) node = window.document;
      var result = kLib.dom.find( selector , node );
      if ( result.length > 0 ) return result[ 0 ];
      return result;
    },
    helpers : {
      isHTMLNode : function isNode( o ) {
        return (
          typeof Node === "object" ? o instanceof Node :
            o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string"
        );
      } ,
      querySelectorAll : document.querySelectorAll ,
      getClosest : function ( node , selector ) {
        // Get the closest matching element
        for ( ; node && node !== document ; node = node.parentNode ) {
          if ( node.matches( selector ) ) return node;
        }
        return null;

      } ,
      addElementToHead : function addElementToHead( data ) { // add element of type script or style to head
        var element;
        if ( isUndefined( data ) ) return;
        if ( data.type === "css" ) {
          element = document.createElement( "style" );
          element.type = "text/css";
          element.id = data.name;
          if ( element.styleSheet ) {
            element.styleSheet.cssText = data.content;
          } else {
            element.appendChild( document.createTextNode( data.content ) );
          }
        } else if ( data.type === "js" ) {
          element = document.createElement( "script" );
          element.type = "text/javascript";
          element.id = data.name;
          element.appendChild( document.createTextNode( data.content ) );

        } else if ( data.type === "css-link" ) {
          element = document.createElement( "link" );
          element.setAttribute( "rel" , "stylesheet" );
          element.setAttribute( "type" , "text/css" );
          element.id = data.name;
          element.setAttribute( "href" , data.content );
        }

        if ( !isUndefined( element ) ) {
          document.getElementsByTagName( "head" )[ 0 ].appendChild( element );
        }

      } ,
      removeElementFromDocument : function removeElementFromDocument( id ) { // remove element from the document head by ID
        var elem = document.getElementById( id );
        if ( !isUndefined( elem ) && elem ) elem.parentNode.removeChild( elem );
      } ,
      addElementToParent : function ( parent , child , options ) {
        if ( isUndefined( parent ) || parent === null ) parent = window.document.body;
        var elem = document.createElement( child );
        for ( var option in options ) {
          if ( options.hasOwnProperty( option ) ) {
            elem.setAttribute( option , options[ option ] );
          }
        }
        parent.appendChild( elem );
        return elem;
      } ,

      getHTML : function getHTML( selector , node , offset ) {
        var listElement = kLib.dom.find( selector , node );
        if ( isUndefined( offset ) ) offset = 0;
        if ( !isNumeric( offset ) && isString( offset ) && offset !== "" ) {
          switch ( offset ) {
            case "first":
              offset = 0;
              break;
            case "last":
              offset = listElement.length - 1;
              break;
            default:
              offset = 0;
          }
        }

        if ( isNumeric( offset ) ) return kLib.dom.helpers.isHTMLNode( listElement[ offset ] ) ? listElement[ offset ].innerHTML : "";
        return "";
      },
      // helper to be used if we have html encoded string
      convertHtmlToText: function convertHtmlToText(string) {
        var klevuConvert = document.createElement('div');
        klevuConvert.innerHTML = string;
        string = klevuConvert.textContent;
        return string
      },
      // helper to be used to strip any html tags
      stripHtml: function stripHtml(string) {
        string = string.replace(/(<([^>]+)>)/ig, "");
        return string;
      },
      // helper to be used to encode html characters
      escapeHtml: function escapeHtml(string) {
        if (string && string.length) {
          var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
          };
          return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
          });
        } else {
          return string;
        }
      }

    }

  }
} );

// expose the support
kLib.extend(true,support,{
  dom : true
}); 
//source/core/klevuLib/modules/time.js
/* ---------------------------------- TIME ENGINE ---------------------------------- */
kLib.time = {
  timestamp: function(){
    return Math.floor(Date.now() / 1000);
  }
};
// expose the support
kLib.extend(true,support,{
  time : true
}); 
//source/core/klevuLib/modules/dataProtection/dataProtection.js
kLib.dataProtection =  kLib.pt.dataProtection = {
    consentSettings:kLib.dictionary("klv_consent"),
    hasUseConsent: function(){
        return !kLib.isUndefined(kLib.getGlobalSetting( "dataProtection.useConsent"));
    },
    getUseConsent: function(){
        return kLib.toBoolean(kLib.getGlobalSetting( "dataProtection.useConsent" ,false));
    },
    getUseConsentStorage:function(){
        var useConsent = kLib.dataProtection.consentSettings.getElement("useConsent");
        if(useConsent === "useConsent") useConsent = false;
        return kLib.toBoolean(useConsent);
    },
    setUseConsent: function(useConsent,settings){
        if(kLib.isUndefined(settings)) settings = kLib.settings;
        kLib.setObjectPath(settings,"dataProtection.useConsent",kLib.toBoolean(useConsent));
        kLib.dataProtection.consentSettings.addElement("useConsent",kLib.toBoolean(useConsent));
        kLib.dataProtection.saveConsentSettings();
    },
    hasConsentState:function(){
        return !kLib.isUndefined(kLib.getGlobalSetting( "dataProtection.consentState" ));
    },
    getConsentState: function(){
        return kLib.toBoolean(kLib.getGlobalSetting( "dataProtection.consentState" ,false));
    },
    getConsentStateStorage:function(){
        var consentState = kLib.dataProtection.consentSettings.getElement("consentState");
        if(consentState === "consentState") consentState = false;
        return kLib.toBoolean(consentState);
    },
    setConsentState: function(consentState,settings){
        if(kLib.isUndefined(settings)) settings = kLib.settings;
        kLib.setObjectPath(settings,"dataProtection.useConsent",kLib.toBoolean(consentState));
        kLib.dataProtection.consentSettings.addElement("consentState",kLib.toBoolean(consentState));
        kLib.dataProtection.saveConsentSettings();

    },
    dataCanBeTracked:function(){
        //if user has not set the consent protection default to true
        if(!kLib.dataProtection.hasUseConsent()) return true;
        if(kLib.dataProtection.getUseConsent()){
            if(!kLib.dataProtection.hasConsentState()) return false;
            return kLib.toBoolean(kLib.dataProtection.getConsentState());
        }
        return true;
    },
    saveConsentSettings:function(){
        var consentSettings = kLib.dataProtection.consentSettings;
        consentSettings.addElement("useConsent",kLib.dataProtection.getUseConsent());
        consentSettings.addElement("consentState",kLib.dataProtection.getConsentState());
        consentSettings.mergeToGlobal();

    },
    loadConsentSettings:function(data){
        var consentSettings = kLib.dataProtection.consentSettings;
        consentSettings.setStorage("local");
        consentSettings.mergeFromGlobal();
        var useConsent = consentSettings.getElement("useConsent");
        if(useConsent === "useConsent") useConsent = kLib.dataProtection.getUseConsent();
        var consentState = consentSettings.getElement("consentState");
        if(consentState === "consentState") consentState = kLib.dataProtection.getConsentState();
        kLib.setObjectPath(data,"dataProtection.useConsent",kLib.toBoolean(useConsent));
        kLib.setObjectPath(data,"dataProtection.consentState",kLib.toBoolean(consentState));
    }
}
kLib.extend(true,support,{
    dataProtection : true
}); 
//source/core/klevuLib/modules/init.js
/* ---------------------------------- CORE LIBRARY POWERUP ---------------------------------- */
//core build execution
coreBuild();

//add kLib to window
if ( isUndefined( window[ "klevu" ] ) ) {
  
  window[ "klevu" ] = kLib;
  kLib.reInitialize();
  //fire global init function
  if ( typeof window.klevuInit === "function" ) {
    klevuInit();
  }
} else {

  
  kLib.reInitialize();
} 
//source/core/klevuLib/modules/dataProtection/dataProtectionActivation.js
kLib.settings.chains.initChain.add(
    {
        name:"dataProtectionLoad",
        fire: function(data,scope) {
            //check if we have ever loaded consent data from storage
            if(!kLib.getObjectPath(data,"flags.dataProtection.loaded",false)) {
                kLib.dataProtection.loadConsentSettings(data);
                kLib.setObjectPath(data,"flags.dataProtection.loaded",true);
            }
        }
    }
);
kLib.settings.chains.initChain.add(
    {
        name:"dataProtectionCheck",
        fire: function(data,scope) {
            //check if use consent has changed and update in our records
            var useConsent = kLib.getObjectPath(data,"dataProtection.useConsent");
            if(!kLib.isUndefined(useConsent) && kLib.toBoolean(useConsent) !== kLib.toBoolean(kLib.dataProtection.getUseConsentStorage()))
                kLib.dataProtection.setUseConsent(useConsent,data);
            //check if use consent has changed and update in our records
            var consentState = kLib.getObjectPath(data,"dataProtection.consentState");
            if(!kLib.isUndefined(consentState) && kLib.toBoolean(consentState) !== kLib.toBoolean(kLib.dataProtection.getConsentStateStorage()))
                kLib.dataProtection.setConsentState(consentState,data);

        }
    }
); 
        return kLib;
    });
} catch (e) {
    //image based reporting
    new Image().src = "\/\/stats.ksearchnet.com\/" + 'error-log?type=jsv2&c=initError&m=' + encodeURIComponent('{"error":"LOAD","extra": {"name":"' + e.name + '","line":"' + (e.lineNumber || e.line) + '","script":"' + (e.fileName || e.sourceURL || e.script) + '","stack":"' + (e.stackTrace || e.stack) + '","namespace":"kLib","message":"' + e.message + '"}}');
    console.log(e);
};

klevu.interactive(function(){
    klevu({flags:{global:{libLoaded:true}}});
});
//kmcObject
//source/core/kmcObject/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/kmcObject/kmcObject.js
// kmcObject
var kmcInputs = {
    markAllResourcesLoaded: function () {
        // mark the resources as loaded
        klevu.search.modules.kmcInputs.hasAllResourcesLoadedJson = true;
        
        if (typeof klevu_processKMCInputData === "function") {
            klevu_processKMCInputData();
        }
        var options = {
            kmc: {
                loaded: true
            },
        };
        klevu(options);
    },
    loadCallBack: function (data, options) {
        var kmcDictionary = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcDictionary");
        var kmcDataLoaded = kmcDictionary.getElement(options.apiKey);
        //process some data
        if (!klevu.isUndefined(data.klevu_banner)) data.klevu_banner = klevu.search.modules.kmcInputs.base.removeIneligibleBanners(data.klevu_banner);
        if (!klevu.isUndefined(data.klevu_autoCorrectMap)) data.klevu_autoCorrectMap = klevu.search.modules.kmcInputs.base.sortAutocorrectMap(data.klevu_autoCorrectMap);


        if (kmcDataLoaded === options.apiKey) {
            // kmc data not there first load of first file
            kmcDataLoaded = data;
        } else {
            //kmc data there , update it
            kmcDataLoaded = klevu.extend(true, JSON.parse(kmcDataLoaded), data);
        }
        //update the load time , to be used on invalidation
        kmcDataLoaded.timeOfLoad = klevu.time.timestamp();
        //update the dictionary data
        kmcDictionary.addElement(options.apiKey, JSON.stringify(kmcDataLoaded));
        kmcDictionary.overrideGlobal();

        if (klevu.search.modules.kmcInputs.loadCounter === options.totalToLoad) {
            //check if kmc data is already set, if not set it
            var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData");
            if (klevu.isUndefined(kmcData)) {
                klevu.search.modules.kmcInputs.kmcData = JSON.parse(kmcDictionary.getElement(options.apiKey));
            }

            klevu.search.modules.kmcInputs.base.markAllResourcesLoaded();

        }
    },
    loadKmcData: function (apiKey) {
        klevu.search.modules.kmcInputs.resourceLoadInitiatedJson = true;
        klevu.search.modules.kmcInputs.loadCounter = 0;
        //reset saved kmc data , this is done to avoid leek of data
        var kmcDictionary = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcDictionary");
        kmcDictionary.removeElement(apiKey);
        kmcDictionary.overrideGlobal();


        var kmcDataURL = klevu.getSetting(klevu.settings, "settings.url.kmcData");
        if (!kmcDataURL || !kmcDataURL.length) {
            kmcDataURL = "https://js.klevu.com/klevu-js-v1/klevu-js-api/";
        };

        var importScripts = [{
                id: apiKey,
                src: kmcDataURL + apiKey + ".json",
            },
            {
                id: apiKey + "-banner",
                src: kmcDataURL + apiKey + "-banner.json",
            },
            {
                id: apiKey + "-maps",
                src: kmcDataURL + apiKey + "-maps.json",
            },
        ];

        importScripts.forEach(function (scriptObj) {
            var options = {
                url: scriptObj.src,
                type: "json",
                mimeType: "application/json",
                apiKey: apiKey,
                totalToLoad: importScripts.length
            };

            var requestDetails = {
                success: function (data, options, status, isSuccess) {
                    klevu.search.modules.kmcInputs.loadCounter++;
                    klevu.search.modules.kmcInputs.base.loadCallBack(data, options);

                },
                error: function (data, options, status, isSuccess) {
                    klevu.search.modules.kmcInputs.loadCounter++;
                    klevu.search.modules.kmcInputs.base.loadCallBack(data, options);
                },
                options: options
            };
            var requestObject = {
                url: options.url,
                type: "FETCH",
                method: "GET",
                mimeType: options.mimeType,
                crossDomain: true
            };

            //for fetch
            requestObject.success = function (data, requestDetails, status, isSuccess) {
                requestDetails.success(data, requestDetails.options, status, isSuccess);
            };
            requestObject.error = function (requestDetails, status, isSuccess) {
                requestDetails.error({}, requestDetails.options, status, isSuccess);
            };
            klevu.request(requestObject, requestDetails);
        });
    },
    removeIneligibleBanners: function (klevu_banner) {
        if (klevu_banner.length > 0) {
            var today = new Date,
                startDate, endDate, removeCurrent = false;
            today.setHours(0, 0, 0, 0);
            for (var i = 0; i < klevu_banner.length; i++) {
                startDate = new Date(klevu_banner[i].startDate);
                removeCurrent = false;
                if ('undefined' !== typeof klevu_banner[i].endDate && klevu_banner[i].endDate) {
                    endDate = new Date(klevu_banner[i].endDate);
                    removeCurrent = (startDate > today || endDate < today);
                } else {
                    removeCurrent = (startDate > today);
                }
                if (removeCurrent) {
                    klevu_banner.splice(i, 1);
                    i--;
                }
            }
        }
        return klevu_banner;
    },
    sortAutocorrectMap: function (klevu_autoCorrectMap) {
        var maxLength = 0,
            i = 0,
            len1 = 0,
            len2 = 0,
            temp, currLength = 0,
            j = 0;
        for (i = 0, len1 = klevu_autoCorrectMap.length; i < len1; i++) {
            maxLength = klevu_autoCorrectMap[i].keyword.length;
            for (j = i + 1, len2 = klevu_autoCorrectMap.length; j < len2; j++) {
                currLength = klevu_autoCorrectMap[j].keyword.length;
                if (maxLength < currLength) {
                    maxLength = currLength;
                    temp = klevu_autoCorrectMap[i];
                    klevu_autoCorrectMap[i] = klevu_autoCorrectMap[j];
                    klevu_autoCorrectMap[j] = temp;
                }
            }
        }
        return klevu_autoCorrectMap;
    },
    /**
     * general function to get data
     */
    getDataPath: function (path) {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData." + path);
        var windowData;
        if (window) {
            windowData = klevu.getInterfaceObjectPath(window, path);
        }
        return (!klevu.isUndefined(windowData)) ? windowData : kmcData;
    },

    /**
     * Function to get banner list
     * @returns
     */
    getBannerList: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_banner", []);

        return typeof klevu_banner !== "undefined" && !klevu.isEmptyObject(klevu_banner) ? klevu_banner : kmcData;
    },

    /**
     * Function to get banner list
     * @returns
     */
    getKeywordUrlMap: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_keywordUrlMap", {});

        return typeof klevu_keywordUrlMap !== "undefined" && !klevu.isEmptyObject(klevu_keywordUrlMap) ? klevu_keywordUrlMap : kmcData;
    },

    /**
     * Function to get auto suggestion max count
     * @returns
     */
    getMaxNumberOfAutoSuggestions: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_maxSuggestionsToShow", 5);
        return (typeof klevu_maxSuggestionsToShow !== "undefined" && klevu_maxSuggestionsToShow) ?
            klevu_maxSuggestionsToShow :
            kmcData;
    },

    /**
     * Function to get Quick search maximum number of category
     * @returns
     */
    getMaxNumberOfQuickSearchCategories: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_maxCategoriesToShow", 3);
        return (typeof klevu_maxCategoriesToShow !== "undefined" && klevu_maxCategoriesToShow) ?
            klevu_maxCategoriesToShow :
            kmcData;
    },

    /**
     * Function to get the maximum numbers of product suggestions
     */
    getMaxNumberOfProductSuggestions: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_productsToShowInSlimLayout", 3);
        return (typeof klevu_productsToShowInSlimLayout !== "undefined") ?
            klevu_productsToShowInSlimLayout :
            kmcData;
    },

    /**
     * Function to get the color swatches enable or disabled value
     */
    getColorSwatchesEnableValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showProductSwatches", false);

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.showProductSwatches !== "undefined" ?
            klevu_uc_userOptions.showProductSwatches :
            kmcData;
    },

    /**
     * Function to get the filter enable or disabled value
     */
    getFiltersEnableValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_filtersEnabled", true);

        return typeof klevu_filtersEnabled !== "undefined" ? klevu_filtersEnabled : kmcData;
    },

    /**
     * Function to get the landing page filter position
     */
    getLandingFilterPosition: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.landingFilterPosition", "left");

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.landingFilterPosition !== "undefined" ?
            klevu_uc_userOptions.landingFilterPosition :
            kmcData;
    },

    /**
     * Function to get the filter selection type value
     */
    getFilterMultiSelectValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_multiSelectFilters", true);

        return typeof klevu_multiSelectFilters !== "undefined" ?
            klevu_multiSelectFilters :
            kmcData;
    },

    /**
     * Function to get the if show out of stock is enabled or disabled
     */
    getShowOutOfStockValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_showOutOfStock", false);

        return typeof klevu_showOutOfStock !== "undefined" ? klevu_showOutOfStock : kmcData;
    },

    /**
     * Function to get the out of stock caption
     */
    getOutOfStockCaptionValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.outOfStockCaption", "");

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.outOfStockCaption !== "undefined" &&
            klevu_uc_userOptions.outOfStockCaption.length ?
            klevu_uc_userOptions.outOfStockCaption :
            kmcData;
    },

    /**
     * Function to get the showPopularSearches is enabled or disabled
     */
    getShowPopularSearchesValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_showPopularSearches", false);

        return typeof klevu_showPopularSearches !== "undefined" ?
            klevu_showPopularSearches :
            kmcData;
    },

    /**
     * Function to get the klevu_showRecentSerches is enabled or not
     */
    getShowRecentSearchesValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_showRecentSerches", false);

        return typeof klevu_showRecentSerches !== "undefined" ? klevu_showRecentSerches : kmcData;
    },

    /**
     * Function to get the klevu_webstorePopularTerms array
     */
    getWebstorePopularTermsValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_webstorePopularTerms", []);

        return typeof klevu_webstorePopularTerms !== "undefined" &&
            klevu_webstorePopularTerms.length ?
            klevu_webstorePopularTerms : kmcData;
    },

    /**
     * Function to get the CMS Enabled value
     */
    getCmsEnabledValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_cmsEnabled", false);

        return typeof klevu_cmsEnabled !== "undefined" ? klevu_cmsEnabled : kmcData;
    },

    /**
     * Function to get the if add to cart enabled or not
     */
    getAddToCartEnableValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_addToCartEnabled", false);

        return typeof klevu_addToCartEnabled !== "undefined" ? klevu_addToCartEnabled : kmcData;
    },

    /**
     * Function to get the add to cart button caption
     */
    getAddToCartButtonCaption: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.addToCartButton", "Add to cart");

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.addToCartButton !== "undefined" ?
            klevu_uc_userOptions.addToCartButton :
            kmcData;
    },

    /**
     * Function to get no results found object from KMC js file
     */
    getNoResultsFoundObject: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.noResultsOptions", {});

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.noResultsOptions !== "undefined" ?
            klevu_uc_userOptions.noResultsOptions : kmcData;
    },

    /**
     * Function to get the show search box on landing page attribute value
     */
    getShowSearchOnLandingPageEnableValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showSearchBoxOnLandingPage", false);

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.showSearchBoxOnLandingPage !== "undefined" ?
            klevu_uc_userOptions.showSearchBoxOnLandingPage :
            kmcData;
    },

    /**
     * Function to get the show sku on landing page product block
     */
    getSkuOnPageEnableValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_showProductCode", false);

        return typeof klevu_showProductCode !== "undefined" &&
            typeof klevu_showProductCode === "boolean" ?
            klevu_showProductCode :
            kmcData;
    },

    /**
     * Function to get noImageUrl value
     */
    getKMCUserOptionsNoImageUrl: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.noImageUrl", "/klevu-js-v1/img-1-1/place-holder.jpg");

        var isFullImageUrlProvided = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.isFullImageUrlProvided", false);

        if (!isFullImageUrlProvided) {
            kmcData = klevu.settings.url.protocol + "//" + klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_userJavascriptDomain", "js.klevu.com") + kmcData;
        }

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.noImageUrl !== "undefined" ?
            klevu_uc_userOptions.noImageUrl :
            kmcData;
    },

    /**
     * Funcion to get showRolloverImage value
     */
    getShowRolloverImageValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showRolloverImage", false);

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.showRolloverImage !== "undefined" ?
            klevu_uc_userOptions.showRolloverImage :
            kmcData;
    },

    /**
     *  Function to get VAT Caption
     */
    getVatCaption: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.vatCaption", false);

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.vatCaption !== "undefined" ?
            klevu_uc_userOptions.vatCaption :
            kmcData;
    },

    /**
     * Function to get show Prices value
     */
    getShowPrices: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_showPrices", false);

        return typeof klevu_showPrices !== "undefined" && typeof klevu_showPrices === "boolean" ?
            klevu_showPrices :
            kmcData;
    },

    /**
     * Function to get price slider value
     * @returns
     */
    getShowPriceSlider: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_showPriceSlider", false);

        return typeof klevu_showPriceSlider !== "undefined" &&
            typeof klevu_showPriceSlider === "boolean" ?
            klevu_showPriceSlider :
            kmcData;
    },

    /**
     * Function to get price interval value
     * @returns
     */
    getPriceIntervalValue: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.priceInterval", 500);

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.priceInterval !== "undefined" ?
            klevu_uc_userOptions.priceInterval :
            kmcData;
    },

    /**
     * Function to get facet range filter settings
     * @returns
     */
    getFacetRangeFilterSettings: function () {
        var rangeFilterSettings = false;
        var isPriceEnable = klevu.search.modules.kmcInputs.base.getShowPrices();
        var isPriceSliderEnable = klevu.search.modules.kmcInputs.base.getShowPriceSlider();
        var priceFilterIntervalValue = klevu.search.modules.kmcInputs.base.getPriceIntervalValue();
        if (isPriceEnable) {
            rangeFilterSettings = {
                key: "klevu_price",
            };
            if (isPriceSliderEnable) {
                rangeFilterSettings.minMax = "true";
            } else {
                rangeFilterSettings.rangeInterval = priceFilterIntervalValue;
            }
        }
        return rangeFilterSettings;
    },

    /**
     * Function to return priceFormatter Object
     */
    getPriceFormatterObject: function (productCurrency) {
        var priceFormatterFinal = {};
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.priceFormatter", undefined);

        var priceFormatter =
            typeof klevu_uc_userOptions !== "undefined" && klevu_uc_userOptions.priceFormatter ?
            klevu_uc_userOptions.priceFormatter :
            kmcData;

        if (typeof priceFormatter === "undefined" || typeof priceFormatter != "object") {
            if (
                typeof klevu_priceFormatters !== "undefined" &&
                klevu_priceFormatters[productCurrency]
            ) {
                priceFormatter = klevu_priceFormatters[productCurrency];
            } else {
                priceFormatterFinal = {
                    string: productCurrency,
                    format: "%s %s",
                };
                return priceFormatterFinal;
            }
        } else {
            if (
                typeof klevu_priceFormatters !== "undefined" &&
                klevu_priceFormatters[productCurrency]
            ) {
                var matchedGlobalPriceFormatter = klevu_priceFormatters[productCurrency];
                priceFormatter = klevu.extend(
                    true,
                    matchedGlobalPriceFormatter,
                    priceFormatter
                );
            }
        }
        if (
            typeof priceFormatter.decimalPlaces !== "undefined" &&
            priceFormatter.decimalPlaces !== ""
        ) {
            priceFormatterFinal.precision = priceFormatter.decimalPlaces;
        }

        if (
            typeof priceFormatter.thousandSeparator !== "undefined"
        ) {
            priceFormatterFinal.thousand = priceFormatter.thousandSeparator;
        }

        if (
            typeof priceFormatter.decimalSeparator !== "undefined" &&
            priceFormatter.decimalSeparator !== ""
        ) {
            priceFormatterFinal.decimal = priceFormatter.decimalSeparator;
        }

        if (
            typeof priceFormatter.currencySymbol !== "undefined" &&
            priceFormatter.currencySymbol !== ""
        ) {
            priceFormatterFinal.string = priceFormatter.currencySymbol;
        }

        if (
            typeof priceFormatter.appendCurrencyAtLast !== "undefined" &&
            priceFormatter.appendCurrencyAtLast !== ""
        ) {
            priceFormatterFinal.atEnd = priceFormatter.appendCurrencyAtLast;
        }


        if (typeof priceFormatter.format !== "undefined" &&
            priceFormatter.format !== ""
        ) {
            priceFormatterFinal.format = priceFormatter.format;
        } else {
            priceFormatterFinal.format = "%s %s";
        }

        return priceFormatterFinal;
    },

    /**
     * Function to check whether enablePersonalizationInSearch is enabled
     */
    getEnablePersonalisationInSearch: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.enablePersonalisationInSearch", false);

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.enablePersonalisationInSearch !== "undefined" ?
            klevu_uc_userOptions.enablePersonalisationInSearch :
            kmcData;
    },

    /**
     * Function to check whether enablePersonalizationInCatNav is enabled
     */
    getEnablePersonalisationInCatNav: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.enablePersonalisationInCatNav", false);

        return typeof klevu_uc_userOptions !== "undefined" &&
            typeof klevu_uc_userOptions.enablePersonalisationInCatNav !== "undefined" ?
            klevu_uc_userOptions.enablePersonalisationInCatNav :
            kmcData;
    },

    /**
     * Function to get recently viewed items details
     */
    getShowRecentlyViewedItemsValue: function () {
        var recentlyViewedItemsObject = {
            showRecentlyViewedItems: klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showRecentlyViewedItems", false),
            showRecentlyViewedItemsLimit: klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showRecentlyViewedItemsLimit", 10),
            showRecentlyViewedItemsCaption: klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showRecentlyViewedItemsCaption", ""),
        };


        if (typeof klevu_uc_userOptions !== "undefined") {
            if (typeof klevu_uc_userOptions.showRecentlyViewedItems !== "undefined") {
                recentlyViewedItemsObject.showRecentlyViewedItems =
                    klevu_uc_userOptions.showRecentlyViewedItems;
            }
            if (typeof klevu_uc_userOptions.showRecentlyViewedItemsCaption !== "undefined") {
                recentlyViewedItemsObject.showRecentlyViewedItemsCaption =
                    klevu_uc_userOptions.showRecentlyViewedItemsCaption;
            }
            if (typeof klevu_uc_userOptions.showRecentlyViewedItemsLimit !== "undefined") {
                recentlyViewedItemsObject.showRecentlyViewedItemsLimit =
                    klevu_uc_userOptions.showRecentlyViewedItemsLimit;
            }
        }
        return recentlyViewedItemsObject;
    },

    /**
     * Function to get trending products details
     */
    getShowTrendingProductsValue: function () {
        var trendingProductsObject = {
            showTrendingProducts: klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showTrendingProducts", false),
            showTrendingProductsLimit: klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showTrendingProductsLimit", 10),
            showTrendingProductsCaption: klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showTrendingProductsCaption", ""),
        };
        if (typeof klevu_uc_userOptions !== "undefined") {
            if (typeof klevu_uc_userOptions.showTrendingProducts !== "undefined") {
                trendingProductsObject.showTrendingProducts =
                    klevu_uc_userOptions.showTrendingProducts;
            }
            if (typeof klevu_uc_userOptions.showTrendingProductsCaption !== "undefined") {
                trendingProductsObject.showTrendingProductsCaption =
                    klevu_uc_userOptions.showTrendingProductsCaption;
            }
            if (typeof klevu_uc_userOptions.showTrendingProductsLimit !== "undefined") {
                trendingProductsObject.showTrendingProductsLimit =
                    klevu_uc_userOptions.showTrendingProductsLimit;
            }
        }
        return trendingProductsObject;
    },

    /**
     * Function to get quick search layout type
     * @returns
     */
    getQuickSearchLayoutType: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_layoutType", "slim");

        return (typeof klevu_layoutType !== "undefined" && klevu_layoutType !== "") ? klevu_layoutType : kmcData;
    },

    /**
     * Function to get quick search layout view
     * @returns
     */
    getQuickSearchLayoutView: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_layoutView", "grid");

        return (typeof klevu_layoutView !== "undefined" && klevu_layoutView !== "") ? klevu_layoutView : kmcData;
    },

    /**
     * Function to get check whether the quick faceted layout filter set on left or not
     * @returns
     */
    isQuickFacetedLayoutFilterOnLeft: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_filtersOnLeft", true);

        return (typeof klevu_filtersOnLeft !== "undefined") ? klevu_filtersOnLeft : kmcData;
    },

    /**
     * Function to check product rating enable/disabled in quick
     */
    showProductRatingQuick: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showRatingsOnQuickSearches", true);

        return (typeof klevu_uc_userOptions !== "undefined" && typeof klevu_uc_userOptions.showRatingsOnQuickSearches !== "undefined" ? klevu_uc_userOptions.showRatingsOnQuickSearches : kmcData)
    },

    /**
     * Function to check product rating enable/disabled in landing
     */
    showProductRatingLanding: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showRatingsOnSearchResultsLandingPage", true);

        return (typeof klevu_uc_userOptions !== "undefined" && typeof klevu_uc_userOptions.showRatingsOnSearchResultsLandingPage !== "undefined" ? klevu_uc_userOptions.showRatingsOnSearchResultsLandingPage : kmcData)
    },

    /**
     * Function to check product rating enable/disabled in catnav
     */
    showProductRatingCatnav: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showRatingsOnCategoryPage", true);

        return (typeof klevu_uc_userOptions !== "undefined" && typeof klevu_uc_userOptions.showRatingsOnCategoryPage !== "undefined" ? klevu_uc_userOptions.showRatingsOnCategoryPage : kmcData)
    },

    /**
     * Function to check product rating count enable/disabled in quick
     */
    showProductRatingCountQuick: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showRatingsCountOnQuickSearches", false);
        return (typeof klevu_uc_userOptions !== "undefined" && typeof klevu_uc_userOptions.showRatingsCountOnQuickSearches !== "undefined" ? klevu_uc_userOptions.showRatingsCountOnQuickSearches : kmcData)
    },

    /**
     * Function to check product rating count enable/disabled in landing
     */
    showProductRatingCountLanding: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showRatingsCountOnSearchResultsLandingPage", false);
        return (typeof klevu_uc_userOptions !== "undefined" && typeof klevu_uc_userOptions.showRatingsCountOnSearchResultsLandingPage !== "undefined" ? klevu_uc_userOptions.showRatingsCountOnSearchResultsLandingPage : kmcData)
    },

    /**
     * Function to check product rating count enable/disabled in catnav
     */
    showProductRatingCountCatnav: function () {
        var kmcData = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcData.klevu_uc_userOptions.showRatingsCountOnCategoryPage", false);
        return (typeof klevu_uc_userOptions !== "undefined" && typeof klevu_uc_userOptions.showRatingsCountOnCategoryPage !== "undefined" ? klevu_uc_userOptions.showRatingsCountOnCategoryPage : kmcData)
    }
}; 
//source/core/kmcObject/kmcObjectBuild.js

klevu.extend(true, klevu, {
    search: {
        modules: {
            kmcInputs: {
                base: kmcInputs,
                build: true,
                hasAllResourcesLoadedJson: false,
                resourceLoadInitiatedJson: false
            }
        }
    }
}); 
//source/core/kmcObject/kmcObjectSettings.js
//kmcDefaultSettings
var options = {

};

klevu( options );
klevu.extend(true,klevu.support,{
    kmc : true
}); 

})( klevu );
//source/core/kmcObject/kmcEvents.js

klevu.settings.chains.initChain.add(
    {
        name:"kmcPowerUp",
        fire: function(data,scope){

            var apiKey = klevu.getGlobalSetting( "search.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) ;
            if(!klevu.isUndefined(apiKey)){
                var powerUp = klevu.getGlobalSetting("powerUp.kmc");
                if((!klevu.isUndefined(powerUp) && powerUp === false)) return;

                var kmcLoaded = klevu.getObjectPath( klevu.search,"modules.kmcInputs.hasAllResourcesLoadedJson");
                if((!klevu.isUndefined(kmcLoaded) && kmcLoaded === true)) return;

                var kmcGlobalLoaded = klevu.getGlobalSetting("kmc.loaded");
                if((!klevu.isUndefined(kmcLoaded) && kmcGlobalLoaded === true)) return;

                //set the cookie constant
                // TODO: move this as it is not KMC related
                if(!klevu.getObjectPath(data,"constants.COOKIE_KLEVU_RCP",false)){
                    var apiKeyForCookie = apiKey.replace(new RegExp("-","g"), "_");
                    klevu.setObjectPath(
                        data,
                        "constants.COOKIE_KLEVU_RCP",
                        "klevu_rcp_" + apiKeyForCookie
                    );
                    
                }

                
                //check for kmc cached data
                var kmcDictionary = klevu.getObjectPath(klevu.search, "modules.kmcInputs.kmcDictionary");
                if(klevu.isUndefined(kmcDictionary)){
                    kmcDictionary = klevu.dictionary("kmcData");
                    kmcDictionary.setStorage("local");
                    kmcDictionary.mergeFromGlobal();
                    klevu.setObjectPath(klevu.search,"modules.kmcInputs.kmcDictionary",kmcDictionary);
                    
                }

                var kmcData = kmcDictionary.getElement(apiKey);
                var kmcRefresh = true;
                //check if we have data
                if(apiKey !== kmcData){
                    kmcData = JSON.parse(kmcData);
                    var timestampExpiration = kmcData.timeOfLoad  + parseInt(klevu.getGlobalSetting("kmc.invalidateInterval",600));
                    if(timestampExpiration > klevu.time.timestamp()){
                        kmcRefresh = false;
                    }
                    // even if it expired set the data , use it on current page
                    klevu.setObjectPath(klevu.search,"modules.kmcInputs.kmcData",kmcData);
                    
                }


                if(kmcRefresh){
                    var kmcLoading = klevu.getObjectPath(klevu.search, "modules.kmcInputs.resourceLoadInitiatedJson");

                    if((klevu.isUndefined(kmcLoading) || kmcLoading === false)){
                        // load the files
                        klevu.search.modules.kmcInputs.base.loadKmcData(apiKey);
                        
                    }
                } else {
                    
                    klevu.search.modules.kmcInputs.base.markAllResourcesLoaded();
                }
            }
        }
    }
);
//searchObject
//source/core/searchObject/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/searchObject/searchEvents.js
// searchEvents
klevu.extend( {
  // add event manager and event functions
  searchEvents : {
    functions : {}
  }
} );
// events for main document
klevu.extend( true , klevu.searchEvents , {
  general : {
    documentClick : function ( event ) {
      event = event || window.event;
      //remove the event path checks
      if ( klevu.isUndefined( event.target ) || !klevu.isUndefined( event.target.kObject ) ) return event;
      
      var data = { event : event , preventDefault : false };
      klevu.event.fireChain( klevu.settings.chains , "documentClick" , this , data , event );
      return event;
    } ,
    documentScroll : function ( event ) {
      event = event || window.event;
      //remove the event path checks
      if ( klevu.isUndefined( event.target ) || !klevu.isUndefined( event.target.kObject ) ) return event;
      
      var data = { event : event , preventDefault : false };
      klevu.event.fireChain( klevu.settings.chains , "documentScroll" , this , data , event );
      return event;
    }
  } ,
  functions : {
    bindAllExtraEvents : {
      name : "interactive-search-extra-events" ,
      fire : function () {
        klevu.settings.chains.documentClick = klevu.chain( { stopOnFalse : true } );
        klevu.event.detach( document , "click" , klevu.searchEvents.general.documentClick );
        klevu.event.attach( document , "click" , klevu.searchEvents.general.documentClick );
        var fullPageLayoutEnabled = klevu.getSetting( klevu.settings , "settings.search.fullPageLayoutEnabled" , false );
        if ( !klevu.isUndefined( fullPageLayoutEnabled ) && fullPageLayoutEnabled ) {
          klevu.settings.chains.documentScroll = klevu.chain( { stopOnFalse : true } );
          klevu.event.detach( window , "scroll" , klevu.searchEvents.general.documentScroll );
          klevu.event.attach( window , "scroll" , klevu.searchEvents.general.documentScroll );
        }
      }
    }
  }
} );

// events for quick search
klevu.extend( true , klevu.searchEvents , {
  box : {
    focus : function ( event ) {
      event = event || window.event;
      
      this.kScope.data = this.kObject.resetData( this );
      this.kScope.data.context.keyCode = 0;
      this.kScope.data.context.eventObject = event;
      this.kScope.data.context.event = "focus";
      this.kScope.data.context.preventDefault = false;

      klevu.search.active = this.kObject;
      klevu.event.fireChain( this.kScope , "chains.events.focus" , this , this.kScope.data , event );
      return event;
    } ,
    keyUp : function ( event ) {
      event = event || window.event;
      
      this.kScope.data = this.kObject.resetData( this );
      this.kScope.data.context.keyCode = ((event.keyCode) ? event.keyCode : event.which);
      this.kScope.data.context.eventObject = event;
      this.kScope.data.context.event = "keyUp";
      this.kScope.data.context.preventDefault = false;

      klevu.event.fireChain( this.kScope , "chains.events.keyUp" , this , this.kScope.data , event );
      return event;
    } ,
    submit : function ( event ) {
      event = event || window.event;
      //prevent the submit we will handle this in other ways

      
      this.kScope.data = this.kObject.resetData( this );
      this.kScope.data.context.keyCode = 13;
      this.kScope.data.context.eventObject = event;
      this.kScope.data.context.event = "submit";
      this.kScope.data.context.preventDefault = false;

      klevu.event.fireChain( this.kScope , "chains.events.submit" , this , this.kScope.data , event );

      return event;
    }
  } ,
  functions : {
    bindAllSearchBoxes : {
      name : "interactive-search-boxes-activate" ,
      fire : function () {
        // deactivate all search boxes
        klevu.search.active = null;
        //grab all the input boxes from the document
        var searchBoxSelector = klevu.getSetting( klevu.settings , "settings.search.searchBoxSelector" , klevu.randomId() );
        var list = klevu.dom.find( searchBoxSelector );

        // loop in the list of elements

        klevu.each( list , function ( key , element ) {
          if ( element.type === "text" || element.type === "search" || element.type === "input" ) {
            // check if klevu is already active on the search box
            if ( !klevu.isUndefined( element.kObject ) ) return true;
            // build a new klevu search object from base
            var search = klevu.searchObjectClone( klevu.search.base );
            search.getScope().element = element;
            // attach the klevu search object to input box for future reference
            element.kObject = search;
            element.kScope = element.kObject.getScope();
            element.kElem = element.kObject.getScope().element;
            // build target element
            var searchBoxTarget = klevu.getSetting( klevu.settings , "settings.search.searchBoxTarget" , false );
            if ( !searchBoxTarget ) {
              klevu.dom.helpers.addElementToParent( null , "div" , {
                id : element.kScope.id ,
                "class" : "klevu-fluid"
              } );
              klevu.setSetting( element.kScope.settings , "settings.search.searchBoxTarget" , document.getElementById( element.kScope.id ) );
            }
            searchBoxTarget = klevu.getSetting( element.kScope.settings , "settings.search.searchBoxTarget" , false );
            searchBoxTarget.kObject = element.kObject;
            searchBoxTarget.kScope = element.kScope;
            searchBoxTarget.kElem = element.kElem;
            //todo: Need extraPolyfill.js
            searchBoxTarget.classList.add( "klevuTarget" );

            // add events to element
            klevu.event.attach( search.getScope().element , "focus" , klevu.searchEvents.box.focus , true );
            klevu.event.attach( search.getScope().element , "keyup" , klevu.searchEvents.box.keyUp , true );
            klevu.event.attach( search.getScope().element , "paste" , function ( event ) {
              setTimeout( function () {
                klevu.searchEvents.box.keyUp.call( event.target , event );
              } , 10 );
            } , true );

            // add the form submit event and also attach the klevu search object to the form
            if ( element.form ) {
              element.form.kObject = search;
              element.form.kScope = element.form.kObject.getScope();
              element.form.kElem = element.form.kObject.getScope().element;
              klevu.event.attach( search.getScope().element.form , "submit" , klevu.searchEvents.box.submit , true );
            }
            // stop the autocomplete
            search.getScope().element.setAttribute( "autocomplete" , "off" );
            var maxLength = klevu.getSetting( element.kScope.settings , "settings.search.maxChars" , 128 );
            search.getScope().element.setAttribute( "maxlength" , maxLength );
            // add the search element to klevu main object for future reference
            if ( klevu.isUndefined( klevu.search[ "quick" ] ) ) klevu.extend( true , klevu.search , { quick : search } );
            klevu.search.extraSearchBox.push( search );

            return true;
          }
        } );
      }
    }
  }
} );


 
//source/core/searchObject/searchEventsActivate.js
//searchObjectActivate
//event for legacy purposes
klevu.coreEvent.build( {
  name : "buildSearch" , fire : function () {
    if ( !klevu.isInteractive ||
        klevu.isUndefined( klevu.search ) ||
        klevu.isUndefined( klevu.search.build ) ||
        !klevu.getSetting( klevu.settings , "settings.localSettings" , false )
    ) {
      return false;
    }
    return true;
  }
} );
klevu.coreEvent.attach( "buildSearch" , klevu.extend( true , {} , klevu.searchEvents.functions.bindAllSearchBoxes ) );
klevu.coreEvent.attach( "buildSearch" , klevu.extend( true , {} , klevu.searchEvents.functions.bindAllExtraEvents ) ); 
//source/core/searchObject/searchObject.js
//searchObject
klevu.extend( {
  searchObjectChains:{
    build:  klevu.chain( { stopOnFalse : true } )
  },
  searchObjectBuild : function () {
    var localVariables = {
      cache : klevu.cache() ,
      settings : {}
    };

    klevu.setObjectPath( localVariables , "id" , klevu.randomId() );
    // init the template
    klevu.setObjectPath( localVariables , "template" , klevu.template() );

    //INIT Translator & Currency
    function resetTranslator() {
      klevu.setObjectPath( localVariables , "translator" , localVariables.template.getTranslator() );
      klevu.setObjectPath( localVariables , "currency" , localVariables.translator.getCurrencyObject() );
    }

    resetTranslator();

    //actions
    klevu.setObjectPath( localVariables , "chains.actions.doSearch" , klevu.chain( { stopOnFalse : true } ) );

    // event
    klevu.setObjectPath( localVariables , "chains.events.focus" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.events.keyUp" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.events.submit" , klevu.chain( { stopOnFalse : true } ) );

    // processors
    klevu.setObjectPath( localVariables , "chains.processors.inputString" , klevu.chain( { stopOnFalse : true } ) );

    /*    REQUEST   */
    // general
    klevu.setObjectPath( localVariables , "chains.request.control" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.request.build" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.request.send" , klevu.chain( { stopOnFalse : true } ) );
    //ajax
    klevu.setObjectPath( localVariables , "chains.request.ajax.send" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.request.fetch.send" , klevu.chain( { stopOnFalse : true } ) );
    /*    RESPONSE   */
    klevu.setObjectPath( localVariables , "chains.response.success" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.response.done" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.response.fail" , klevu.chain( { stopOnFalse : true } ) );
    // ajax
    klevu.setObjectPath( localVariables , "chains.response.ajax.success" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.response.ajax.done" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.response.ajax.fail" , klevu.chain( { stopOnFalse : true } ) );

    /*    TEMPLATE   */
    klevu.setObjectPath( localVariables , "chains.template.process.success" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.template.events" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.template.handleError" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.template.render" , klevu.chain( { stopOnFalse : true } ) );


    function init() {

    }

    function resetData( scope ) {
      var tempData = buildData();
      if ( scope.kScope.data.context.termOriginal !== scope.kElem.value ) {
        scope.kScope.data.localOverrides = tempData.localOverrides;
      }
      scope.kScope.data.context = tempData.context;
      scope.kScope.data.context.term = scope.kElem.value;
      scope.kScope.data.context.termOriginal = scope.kElem.value;
      scope.kScope.data.request.current = tempData.request.current;
      scope.kScope.data.response.current = tempData.response.current;
      scope.kScope.data.template.suggestions = tempData.template.suggestions;
      scope.kScope.data.template.query = tempData.template.query;
      scope.kScope.data.template.settings = scope.kScope.data.context;
      scope.kScope.data.request.settings.object = {};
      scope.kScope.data.response.ajax.object = {};
      scope.kScope.data.response.ajax.data = {};
      scope.kScope.data.response.data = {};
      scope.kScope.data.response.object = {};
      scope.kScope.data.scope = null;
      return scope.kScope.data;
    }

    function buildData() {
      var data = {
        context : {
          landingUrl : null ,
          term : null ,
          termOriginal : null ,
          keyCode : 0 ,
          eventObject : null ,
          event : null ,
          eventAction : "" ,
          preventDefault : false ,
          status : null ,
          isSuccess : false ,
          doRequest : true
        } ,
        request : {
          settings : {
            url : null ,
            object : {}
          } ,
          last : {} ,
          current : {
            context : {} ,
            suggestions : [] ,
            recordQueries : []
          }
        } ,
        response : {
          ajax : {
            object : {} ,
            data : {}
          } ,
          current : {
            meta : {} ,
            suggestionResults : [] ,
            queryResults : []
          }
        } ,
        localOverrides : {
          suggestion : {} ,
          query : {}
        } ,
        template : {
          settings : null ,
          suggestions : {} ,
          query : {}

        }
      };
      data.template.settings = data.context;
      return data;
    }

    function setTarget( elem ) {
      klevu.setSetting( this.getScope().settings , "settings.search.searchBoxTarget" , elem );
      elem.kObject = this;
      elem.kScope = this.getScope();
      elem.kElem = this.getScope().element.kElem;
      //todo: Need extraPolyfill.js
      elem.classList.add( "klevuTarget" );

    }

    localVariables.data = buildData();

    var chain = klevu.getObjectPath(klevu.searchObjectChains, "build");
    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
      chain.setScope(localVariables);
      chain.setData(localVariables.data);
      chain.fire();
    }
    var selfObj = {
      init : init ,
      resetData : resetData ,
      buildData : buildData ,
      setTarget : setTarget ,
      // scope:localVariables,
      setScope : function ( variables ) {
        localVariables = variables;
        return localVariables;
      } ,
      getScope : function () {
        return localVariables;
      } ,
      getCache : function () {
        return localVariables.cache;
      } ,
      resetTranslator : resetTranslator
    };
    return selfObj;
  } ,
  searchObjectClone : function ( source ) {
    // special clone function
    var clone = klevu.searchObjectBuild();
    clone.setScope( klevu.extend( true , {} , source.getScope() ) );
    clone.getScope().element = document.createElement( "INPUT" );
    clone.getScope().data = clone.buildData();
    clone.getScope().id = klevu.randomId();
    clone.getScope().template = klevu.templateClone( clone.getScope().template );
    clone.resetTranslator();
    clone.getScope().element.kObject = clone;
    clone.getScope().element.kScope = clone.getScope();
    clone.getScope().element.kElem = clone.getScope().element;
    return clone;
  }
} );
 
//source/core/searchObject/searchObjectSettings.js
//searchObjectSettings
//setup defaults for search object settings
var options = {
  search : {
    searchBoxSelector : "input#klevu-search" ,
    searchBoxTarget : false ,
    minChars : 3 ,
    placeholder : "Search" ,
    showQuickOnEnter : false ,
    fullPageLayoutEnabled : false ,
    personalisation : false ,
    redirects : [] ,
    map : {
      recordQuery : {
        "id" : "" ,
        "typeOfRequest" : "" ,
        "isFallbackQuery" : false ,
        "isBoostQuery" : false ,

        "settings" : {
          "query" : {
            "term" : "" ,
            "context" : {
              "recentTerms" : [] ,
              "recentObjects" : [] ,
              "includeIds" : [] ,
              "excludeIds" : []

            }
          } ,

          "typeOfRecords" : [ "KLEVU_PRODUCT" ] ,
          "groupBy" : "" ,
          "fields" : [] ,
          "offset" : 0 ,
          "limit" : 0 ,
          "typeOfSearch" : "" ,

          "searchPrefs" : [] ,

          "sort" : "" ,
          "priceFieldSuffix" : "" ,
          "fallbackWhenCountLessThan" : 0 ,
          "fallbackQueryId" : "" ,
          "personalisation" : {
            "enablePersonalisation" : false
          }

        } ,

        "filters" : {
          "filtersToReturn" : {
            "enabled" : false ,
            "options" : {
              "order" : "" ,
              "limit" : 0 ,
              "minCount" : 0
            } ,

            "include" : [] ,
            "exclude" : [] ,
            "rangeFilterSettings" : [ {
              "key" : "" ,
              "minMax" : false ,
              "rangeInterval" : 0
            } ]
          } ,

          "applyFilters" : {
            "filters" : [ {
              "key" : "" ,
              "values" : [] ,
              "settings" : {
                "singleSelect" : false
              }
            } ]
          }
        } ,

        "boost" : {
          "filters" : [ {
            "key" : "" ,
            "values" : [] ,
            "weight" : 0
          } ] ,
          "keywords" : [ {
            "phrase" : "" ,
            "weight" : 0
          } ] ,
          "records" : [ {
            "id" : "" ,
            "weight" : 0
          } ] ,
          "boostQueryId" : ""
        }
      } ,
      suggestions : {
        "id" : "" ,
        "query" : "" ,
        "typeOfRequest" : "" ,
        "limit" : 0 ,
        "includeFilters" : false ,
        "filterLimit" : 0 ,
        "applyFilters" : []
      }
    }
  }
};

klevu( options ); 

})( klevu );
//source/core/searchObject/searchObjectBuild.js
//searchObjectBuild
// BUILD BASE CHAINS + LOAD CURRENCY AND TRANSLATIONS
(function ( klevu ) {
  var baseSearch = klevu.searchObjectBuild();

  
//source/core/searchObject/chains/events/focus.js
// chains/events.focus.js
baseSearch.getScope().chains.events.focus.add( {
  name : "check-placeholder" ,
  fire : function ( data , scope ) {
    var placeholder = klevu.getSetting( scope.kScope.settings , "settings.search.placeholder" );
    if ( data.context.term.toLowerCase() === placeholder.toLowerCase() ) {
      scope.value = "";
      return false;
    }
  }
} ); 
//source/core/searchObject/chains/events/keyUp.js
// chains/events.keyUp.js
baseSearch.getScope().chains.events.keyUp.add( {
  name : "isCharacterNotAllowed" ,
  fire : function ( data , scope ) {
    if ( (
        (data.context.keyCode >= 9 && data.context.keyCode <= 45)
        || (data.context.keyCode >= 91 && data.context.keyCode <= 93)
        || (data.context.keyCode >= 112 && data.context.keyCode <= 123)
      )
      && data.context.keyCode !== 13
      && data.context.keyCode !== 32 ) {
      return false;
    }
    if ( data.context.eventObject !== null ) {
      if ( !klevu.isUndefined( data.context.eventObject.ctrlKey ) && data.context.eventObject.ctrlKey === true ) return false;
      if ( !klevu.isUndefined( data.context.eventObject.altKey ) && data.context.eventObject.altKey === true ) return false;
    }
  }
} );
baseSearch.getScope().chains.events.keyUp.add( {
  name : "scrollToTop" ,
  fire : function ( data , scope ) {
    var fullPageLayoutEnabled = klevu.getSetting( scope.kScope.settings , "settings.search.fullPageLayoutEnabled" , false );
    if ( fullPageLayoutEnabled ) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }
} );

baseSearch.getScope().chains.events.keyUp.add( {
  name : "doSearch" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.kScope , "chains.actions.doSearch" );

    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
    }
    scope.kScope.data = data;
    if ( data.context.preventDefault === true ) return false;
  }
} ); 
//source/core/searchObject/chains/events/submit.js
// chains/events.submit.js
baseSearch.getScope().chains.events.submit.add( {
  name : "checkRedirect" ,
  fire : function ( data , scope ) {
    var redirects = klevu.getSetting( scope.kScope.settings , "settings.search.redirects" , {} );
    if ( redirects && !klevu.isUndefined(data.context.term)) {
      if ( redirects.hasOwnProperty( data.context.term.trim().toLowerCase() )) {
        data.context.preventDefault = true;
        data.context.eventObject.preventDefault();
        document.location = redirects[ data.context.term.trim().toLowerCase() ];
      }
    }
    if ( data.context.preventDefault === true ) return false;
  }
} );
baseSearch.getScope().chains.events.submit.add( {
  name : "doSearch" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.kScope , "chains.actions.doSearch" );

    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
    }
    scope.kScope.data = data;
    if ( data.context.preventDefault === true ) return false;
  }
} ); 
//source/core/searchObject/chains/actions/doSearch.js
// chains/actions/doSearch.js
baseSearch.getScope().chains.actions.doSearch.add( {
  name : "showQuickOnEnter" ,
  fire : function ( data , scope ) {
    var showQuickOnEnter = klevu.getSetting( scope.kScope.settings , "settings.search.showQuickOnEnter" , false );
    if ( data.context.keyCode === 13 && showQuickOnEnter ) {
      if ( data.context.event === "submit" ) {
        data.context.eventObject.preventDefault();
      }
    }
  }
} );
baseSearch.getScope().chains.actions.doSearch.add( {
  name : "checkInput" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.kScope , "chains.processors.inputString" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
    }
    scope.kScope.data = data;
    if ( data.context.preventDefault === true ) return false;
  }
} );

baseSearch.getScope().chains.actions.doSearch.add( {
  name : "doRequest" ,
  fire : function ( data , scope ) {
    data.context.doSearch = false;
    var chain = klevu.getObjectPath( scope.kScope , "chains.request.control" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
      scope.kScope.data = data;
    } else {
      data.context.preventDefault = true;
      scope.kScope.data = data;
      return false;
    }
  }
} );





 
//source/core/searchObject/chains/processors/inputString.js
// chains/processors/inputString.js
baseSearch.getScope().chains.processors.inputString.add( {
  name : "checkDefined" ,
  fire : function ( data , scope ) {
    if ( klevu.isUndefined( data.context.term ) ) {
      data.context.preventDefault = true;
      var chain = klevu.getObjectPath( scope.kScope , "chains.template.handleError" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.kElem );
        chain.setData( { section : "inputString" , sector : "checkDefined" } );
        chain.fire();
      }
      return false;
    }
  }
} );
baseSearch.getScope().chains.processors.inputString.add( {
  name : "trim" ,
  fire : function ( data , scope ) {
    data.context.term = data.context.term.replace( /\s{2,}/g , " " ).trim();
  }
} );

baseSearch.getScope().chains.processors.inputString.add( {
  name : "cleanDuplicatedSpaces" ,
  fire : function ( data , scope ) {
    data.context.term = data.context.term.replace( /\s\s+/g , " " );
  }
} );

baseSearch.getScope().chains.processors.inputString.add( {
  name : "checkLengthMin" ,
  fire : function ( data , scope ) {
    var minLength = klevu.getSetting( scope.kScope.settings , "settings.search.minChars" , 0 );
    if ( data.context.term.length < minLength ) {
      var chain = klevu.getObjectPath( scope.kScope , "chains.template.handleError" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.kElem );
        chain.setData( { section : "inputString" , sector : "checkLength" } );
        chain.fire();
      }
      data.context.preventDefault = true;
      return false;
    }
  }
} );

baseSearch.getScope().chains.processors.inputString.add( {
  name : "checkLengthMax" ,
  fire : function ( data , scope ) {
    var maxLength = klevu.getSetting( scope.kScope.settings , "settings.search.maxChars" , 128 );
    if ( data.context.term.length > maxLength ) {
      var chain = klevu.getObjectPath( scope.kScope , "chains.template.handleError" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.kElem );
        chain.setData( { section : "inputString" , sector : "checkLength" } );
        chain.fire();
      }
      data.context.preventDefault = true;
      return false;
    }
  }
} );
baseSearch.getScope().chains.processors.inputString.add( {
  name : "lowercase" ,
  fire : function ( data , scope ) {
    data.context.term = data.context.term.toLowerCase();
  }
} );
baseSearch.getScope().chains.processors.inputString.add( {
  name : "checkPlaceholder" ,
  fire : function ( data , scope ) {
    var placeholder = klevu.getSetting( scope.kScope.settings , "settings.search.placeholder" , "" );
    if ( data.context.term.toLowerCase() === placeholder.toLowerCase() ) {
      data.context.preventDefault = true;
      var chain = klevu.getObjectPath( scope.kScope , "chains.template.handleError" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.kElem );
        chain.setData( { section : "inputString" , sector : "checkPlaceholder" } );
        chain.fire();
      }
      return false;
    }

  }
} ); 
//source/core/searchObject/chains/request/ajax/send.js
// chains/request/ajax/makeRequest.js
baseSearch.getScope().chains.request.ajax.send.add( {
  name : "sendRequest" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction !== "searchAjax" ) return;
    data.scope = scope;
    if ( data.context.doSearch ) {

      data.context.requestObject = {
          url: data.request.settings.url,
          type: "AJAX",
          method : "POST" ,
          mimeType : "application/json; charset=UTF-8" ,
          contentType : "application/json; charset=utf-8" ,
          dataType : "json" ,
          crossDomain : true ,
          success : function ( klXHR ) {
            var chain = klevu.getObjectPath( klXHR.requestDetails.scope.kScope , "chains.response.success" );
            if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
              chain.setScope( klXHR.requestDetails.scope.kElem );
              klevu.setObjectPath(klXHR.requestDetails,"response.data",klXHR.responseObj.data);
              klevu.setObjectPath(klXHR.requestDetails,"context.status",klXHR.status);
              klevu.setObjectPath(klXHR.requestDetails,"context.isSuccess",klXHR.isSuccess);
              chain.setData( klXHR.requestDetails );
              chain.fire();
            }
          } ,
          done : function ( klXHR ) {
            var chain = klevu.getObjectPath( klXHR.requestDetails.scope.kScope , "chains.response.done" );
            if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
              chain.setScope( klXHR.requestDetails.scope.kElem );
              klevu.setObjectPath(klXHR.requestDetails,"response.data",klXHR.responseObj.data);
              klevu.setObjectPath(klXHR.requestDetails,"context.status",klXHR.status);
              klevu.setObjectPath(klXHR.requestDetails,"context.isSuccess",klXHR.isSuccess);
              chain.setData( klXHR.requestDetails );
              chain.fire();
            }
          } ,
          error : function ( klXHR ) {
            var chain = klevu.getObjectPath( klXHR.requestDetails.scope.kScope , "chains.response.fail" );
            if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
              chain.setScope( klXHR.requestDetails.scope.kElem );
              klevu.setObjectPath(klXHR.requestDetails,"response.data",{});
              klevu.setObjectPath(klXHR.requestDetails,"context.status",klXHR.status);
              klevu.setObjectPath(klXHR.requestDetails,"context.isSuccess",klXHR.isSuccess);
              chain.setData( klXHR.requestDetails );
              chain.fire();
            }
          },
          data : JSON.stringify( data.request.settings.object ) ,
      };
        data.context.requestDetails = klevu.extend( true , {} , data );

    } else {
      

    }

  }
} ); 
//source/core/searchObject/chains/request/fetch/send.js
// chains/request/ajax/makeRequest.js
baseSearch.getScope().chains.request.fetch.send.add( {
  name : "sendRequest" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction === "searchAjax" ) return;
    data.scope = scope;
    if ( data.context.doSearch ) {

      data.context.requestObject = {
        url: data.request.settings.url,
        type: "FETCH",
        method : "POST" ,
        mimeType : "application/json; charset=UTF-8" ,
        contentType : "application/json; charset=utf-8" ,
        dataType : "json" ,
        crossDomain : true ,
        success : function ( data , requestDetails , status, isSuccess ) {
          var chain = klevu.getObjectPath( requestDetails.scope.kScope , "chains.response.success" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( requestDetails.scope.kElem );
            klevu.setObjectPath(requestDetails,"response.data",data);
            klevu.setObjectPath(requestDetails,"context.status",status);
            klevu.setObjectPath(requestDetails,"context.isSuccess",isSuccess);
            chain.setData( requestDetails );
            chain.fire();
          }
        } ,
        error : function ( requestDetails, status, isSuccess ) {
          var chain = klevu.getObjectPath( requestDetails.scope.kScope , "chains.response.fail" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( requestDetails.scope.kElem );
            klevu.setObjectPath(requestDetails,"response.data",{});
            klevu.setObjectPath(requestDetails,"context.status",status);
            klevu.setObjectPath(requestDetails,"context.isSuccess",isSuccess);
            chain.setData( requestDetails );
            chain.fire();
          }
        },
        data : JSON.stringify( data.request.settings.object ) ,
      };
      data.context.requestDetails = klevu.extend( true , {} , data );

    } else {
      

    }

  }
} ); 
//source/core/searchObject/chains/request/control.js
// chains/request/control.js
baseSearch.getScope().chains.request.control.add( {
  name : "initRequest" ,
  fire : function ( data , scope ) {
    data.context.doSearch = false;
    data.request.original = {};
    var chain = klevu.getObjectPath( scope.kScope , "chains.request.build" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
      scope.kScope.data = data;
      if ( data.context.doSearch === false ) return false;
    } else {
      data.context.preventDefault = true;
      scope.kScope.data = data;
      return false;
    }

  }
} );

baseSearch.getScope().chains.request.control.add( {
  name : "setLocalOverrides" ,
  fire : function ( data , scope ) {
    var query = klevu.getObjectPath( data.localOverrides , "query" );
    if ( !klevu.isUndefined( query ) ) {
      klevu.each( query , function ( key , value ) {
        var objectToChange = data.request.current.recordQueries.filter( function ( query ) {
          return query.id == key;
        } );
        if ( objectToChange.length > 0 ) objectToChange = klevu.extend( true , objectToChange[ 0 ] , value );
      } );
    }
  }
} );
baseSearch.getScope().chains.request.control.add( {
  name: "storeOriginSuggestions",
  fire: function (data, scope) {
    var reqSuggestions = klevu.getObjectPath(data, "request.current.suggestions");
    klevu.setObjectPath(data, "request.original.suggestions", klevu.extend([], reqSuggestions));
  }
});
baseSearch.getScope().chains.request.control.add( {
  name: "storeOriginRecordQueries",
  fire: function (data, scope) {
    var reqRecordQueries = klevu.getObjectPath(data, "request.current.recordQueries");
    klevu.setObjectPath(data, "request.original.recordQueries", klevu.extend([], reqRecordQueries));
  }
});



baseSearch.getScope().chains.request.control.add( {
  name : "sanitiseRequestSuggestions" ,
  fire : function ( data , scope ) {
    var requestObj = klevu.clean( data.request.current );

    // suggestion
    data.response.current.suggestionResults = [];
    data.request.last.suggestionRequest = {};
    var suggestion = klevu.getObjectPath( requestObj , "suggestions" );
    data.request.original.suggestionResults = klevu.extend( true , {} , suggestion );
    if ( !klevu.isUndefined( suggestion ) ) {
      klevu.each( suggestion , function ( key , value ) {
        var cacheValue = scope.kScope.cache.getCache( value );
        if ( cacheValue ) {
          data.response.current.suggestionResults.push( cacheValue );
          suggestion[ key ] = {};
        } else {
          data.request.last.suggestionRequest[ value.id ] = value;
        }
      } );
    }

    data.request.settings.object = requestObj;
  }
} );
baseSearch.getScope().chains.request.control.add( {
  name : "sanitiseRequestQuery" ,
  fire : function ( data , scope ) {
    var requestObj = klevu.clean( data.request.current );

    // query
    data.response.current.queryResults = [];
    data.request.last.queryRequest = {};
    var query = klevu.getObjectPath( requestObj , "recordQueries" );
    data.request.original.queryRequest = klevu.extend( true , {} , query );
    if ( !klevu.isUndefined( query ) ) {
      var fallBackCount = 0;
      klevu.each( query , function ( key , value ) {
        var cacheValue = scope.kScope.cache.getCache( value );
        if ( cacheValue ) {

          data.response.current.queryResults.push( cacheValue );
          query[ key ] = {};
        } else {
          if ( value.isFallbackQuery == "true" || value.isFallbackQuery === true ) {
            fallBackCount = fallBackCount + 1;
          }
          data.request.last.queryRequest[ value.id ] = value;
        }
      } );
      requestObj = klevu.clean( requestObj );
      query = klevu.getObjectPath( requestObj , "recordQueries" );
      if ( !klevu.isUndefined( query ) && query.length === fallBackCount ) {
        klevu.setObjectPath( requestObj , "recordQueries" , [] );
      }
    }

    data.request.settings.object = requestObj;
  }
} );
baseSearch.getScope().chains.request.control.add( {
  name : "sanitiseRequestCheckIfAllCache" ,
  fire : function ( data , scope ) {
    var requestObj = klevu.clean( data.request.current );

    data.request.settings.object = requestObj;
    if ( klevu.isUndefined( requestObj.recordQueries ) && klevu.isUndefined( requestObj.suggestions ) ) {
      //mark as done and jump to success
      data.context.isSuccess = true;
      data.context.doSearch = false;
      data.context.status = 304;
      var chain = klevu.getObjectPath( scope.kScope , "chains.response.success" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.kElem );
        chain.setData( data );
        chain.fire();
        scope.kScope.data = data;
        if ( data.context.doSearch === false ) return false;
      }
    }

  }
} );

baseSearch.getScope().chains.request.control.add( {
  name : "generateURL" ,
  fire : function ( data , scope ) {
    var searchUrl = klevu.getSetting( scope.kScope.settings , "settings.url.search" , false );
    if ( searchUrl ) {
      data.request.settings.url = searchUrl;

    }
  }
} );
baseSearch.getScope().chains.request.control.add( {
  name : "makeRequest" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.kScope , "chains.request.send" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
      scope.kScope.data = data;
      return false;
    }
  }
} ); 
//source/core/searchObject/chains/request/build.js
// chains/request/buildRequest.js
baseSearch.getScope().chains.request.build.add( {
  name : "buildMap" ,
  fire : function ( data , scope ) {
    data.context.status = null;
    data.context.isSuccess = false;
    data.context.landingUrl = klevu.getSetting( scope.kScope.settings , "settings.url.landing" , false );
    data.request.current.context.apiKeys = [ klevu.getSetting( scope.kScope.settings , "settings.search.apiKey" , klevu.getGlobalSetting( "search.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) ) ];
    data.request.requestObject = {};
  }
} ); 
//source/core/searchObject/chains/request/send.js
// chains/request/makeRequest.js
baseSearch.getScope().chains.request.send.add( {
  name : "checkFetch" ,
  fire : function ( data , scope ) {
    if (window.fetch) {
      data.context.eventAction = "searchFetch";
    } else {
      data.context.eventAction = "searchAjax";
    }
  }
} );
baseSearch.getScope().chains.request.send.add( {
  name : "requestTypeAjax" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction === "searchAjax" ) {
      var chain = klevu.getObjectPath( scope.kScope , "chains.request.ajax.send" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.kElem );
        chain.setData( data );
        chain.fire();
        scope.kScope.data = data;
      }
    }
  }
} );
baseSearch.getScope().chains.request.send.add( {
  name : "requestTypeFetch" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction !== "searchAjax" ) {
      var chain = klevu.getObjectPath( scope.kScope , "chains.request.fetch.send" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.kElem );
        chain.setData( data );
        chain.fire();
        scope.kScope.data = data;
      }
    }
  }
} );
baseSearch.getScope().chains.request.send.add( {
  name : "requestSend" ,
  fire : function ( data , scope ) {
    klevu.request(data.context.requestObject, data.context.requestDetails );
  }
} ); 
//source/core/searchObject/chains/response/ajax/done.js
// chains/response/ajax/done.js 
//source/core/searchObject/chains/response/ajax/fail.js
// chains/response/ajax/fail.js 
//source/core/searchObject/chains/response/ajax/success.js
// chains/response/ajax/success.js



 
//source/core/searchObject/chains/response/fail.js
// chains/response/fail.js 
//source/core/searchObject/chains/response/done.js
// chains/response/done.js 
//source/core/searchObject/chains/response/success.js
// chains/response/success.js
baseSearch.getScope().chains.response.success.add( {
  name : "checkForSuccess" ,
  fire : function ( data , scope ) {
    scope.kElem.data = data;
    if ( data.context.isSuccess === false ) return false;
  }
} );
baseSearch.getScope().chains.response.success.add( {
  name : "executeAjaxResponseProcessor" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.kScope , "chains.response.ajax.success" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
    }
    scope.kScope.data = data;
  }
} );

baseSearch.getScope().chains.response.success.add( {
  name : "addResponseDataSuggestion" ,
  fire : function ( data , scope ) {
    var suggestion = klevu.getObjectPath( data.response.data , "suggestionResults" );
    if ( klevu.isUndefined( suggestion ) ) {
      suggestion = [];
    }
    //add to cache all responce
    if ( suggestion.length > 0 ) {
      klevu.each( suggestion , function ( key , value ) {
        if ( !klevu.isUndefined( data.request.last.suggestionRequest[ value.id ] ) ) {
          scope.kScope.cache.setCache( data.request.last.suggestionRequest[ value.id ] , value );
        }
      } );
    }
    data.response.current.suggestionResults = klevu.extend(
      true ,
      data.response.current.suggestionResults ,
      data.response.current.suggestionResults.concat( suggestion )
    );
  }
} );
baseSearch.getScope().chains.response.success.add( {
  name : "addResponseDataQuery" ,
  fire : function ( data , scope ) {
    var query = klevu.getObjectPath( data.response.data , "queryResults" );
    if ( klevu.isUndefined( query ) ) {
      query = [];
    }
    //add to cache all responce
    if ( query.length > 0 ) {
      klevu.each( query , function ( key , value ) {
        if ( !klevu.isUndefined( data.request.last.queryRequest[ value.id ] ) ) {
          scope.kScope.cache.setCache( data.request.last.queryRequest[ value.id ] , value );
        }
      } );
    }
    data.response.current.queryResults = klevu.extend(
      true ,
      data.response.current.queryResults ,
      data.response.current.queryResults.concat( query )
    );
  }
} );
baseSearch.getScope().chains.response.success.add( {
  name : "processSuggestions" ,
  fire : function ( data , scope ) {
    var suggestion = klevu.getObjectPath( data.response.current , "suggestionResults" );
    if ( !klevu.isUndefined( suggestion ) ) {
      var suggestionProcessed = {};
      klevu.each( suggestion , function ( key , value ) {
        suggestionProcessed[ value.id ] = value.suggestions;
      } );
      suggestion = suggestionProcessed;
    } else {
      suggestion = {};
    }
    data.template.suggestions = suggestion;
    scope.kScope.data = data;
  }
} );
baseSearch.getScope().chains.response.success.add( {
  name : "processQuery" ,
  fire : function ( data , scope ) {
    var query = klevu.getObjectPath( data.response.current , "queryResults" );
    if ( !klevu.isUndefined( query ) ) {
      var queryProcessed = {};
      klevu.each( query , function ( key , value ) {
        queryProcessed[ value.id ] = {
          meta : value.meta ,
          filters : value.filters ,
          result : value.records
        };
        klevu.setObjectPath( data , "localOverrides.query." + value.id + ".settings.typeOfSearch" , value.meta.typeOfSearch );
      } );
      query = queryProcessed;
    } else {
      query = {};
    }
    data.template.query = query;
    scope.kScope.data = data;
  }
} );
baseSearch.getScope().chains.response.success.add( {
  name : "executeTemplateResponseProcessor" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.kScope , "chains.template.process.success" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
    }
    scope.kScope.data = data;
  }
} );
baseSearch.getScope().chains.response.success.add( {
  name : "renderTemplate" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.kScope , "chains.template.render" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
    }
    scope.kScope.data = data;
  }
} );

baseSearch.getScope().chains.response.success.add( {
  name : "addEvents" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.kScope , "chains.template.events" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
    }
    scope.kScope.data = data;
  }
} ); 
//source/core/searchObject/chains/template/process/success.js
// chains/template/process/success.js 
//source/core/searchObject/chains/template/events.js
// chains/template/events.js 
//source/core/searchObject/chains/template/handleError.js
// chains/processors/inputString.js
baseSearch.getScope().chains.template.handleError.add( {
  name : "renderError" ,
  fire : function ( data , scope ) {

    return false;
  }
} ); 
//source/core/searchObject/chains/template/render.js
// chains/template/render.js
 

  //build base interaction object
  var KlevuElement = document.createElement( "INPUT" );
  KlevuElement.value = "*";
  KlevuElement.kObject = baseSearch;
  KlevuElement.kScope = KlevuElement.kObject.getScope();
  baseSearch.getScope().element = KlevuElement;
  KlevuElement.kElem = KlevuElement.kObject.getScope().element;

  klevu.extend(true, klevu, {
    search: {
      extraSearchBox : [] ,
      base : baseSearch ,
      modules : {}
    }
  });

  //Landingpage
  var landing = klevu.searchObjectClone( baseSearch );
  klevu.extend( true , klevu.search , { landing : landing } );

  klevu.search.build = true;

})( klevu );
//pageMeta
//source/core/pageMeta/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/pageMeta/pageMetaObjectBuild.js
// Page Meta
//check if pageMeta Object already exists
if(klevu.isUndefined(klevu.pageMeta)){
  klevu.extend( {
    // add pageMeta object
    pageMeta : {}
  } );

  klevu.extend( true , klevu.pageMeta , {
    settings:{
      "platform":{
      },
      "user":{
      },
      "page":{
        "pageType":"",
        "category":{
          "categoryUrl" : "",
          "categoryAbsolutePath" : "",
          "categoryPath" : "",
          "categoryName" : ""
        },
        "search": {
          "searchTerm" : "",
          "searchUrl" : "",
          "typeOfQuery" : ""
        },
        "pagination": {
          "paginationStartsFrom": false,
          "totalRecords": false,
          "limit": false
        },
        "products":[]
      },
      "filters": {
        "active" : []
      }

    },
    build: function(){
      if(!klevu.isUndefined(window.klevu_page_meta)){
        klevu.pageMeta.update(klevu_page_meta,1);
      }
      if(!klevu.isUndefined(window.klevu_meta)){
        klevu.pageMeta.update(klevu_meta,2);
      }
      return klevu.pageMeta.getAll();
    },
    updateFromV1: function(data){
      // set page type
      klevu.pageMeta.setData("page.pageType",klevu.getObjectPath(data,"pageType",""));
      if(klevu.getObjectPath(data,"apiKey",false)) klevu({global:{apiKey:klevu.getObjectPath(data,"apiKey")}});
      // check page type
      if(klevu.pageMeta.hasPageType()){
        switch (klevu.pageMeta.getPageType()){
          case "category":
            // category data
            klevu.pageMeta.setData("page.category.categoryUrl",klevu.getObjectPath(data,"categoryUrl",""));
            klevu.pageMeta.setData("page.category.categoryName",klevu.getObjectPath(data,"categoryName",""));
            klevu.pageMeta.setData("page.products",klevu.getObjectPath(data,"categoryProducts",[]));
            break;
          case 'pdp':
            // pdp data
            let product = {
              'itemName':klevu.getObjectPath(data,"itemName",""),
              'itemUrl':klevu.getObjectPath(data,"itemUrl",""),
              'itemId':klevu.getObjectPath(data,"itemId",""),
              'itemGroupId':klevu.getObjectPath(data,"itemGroupId",""),
              'itemSalePrice':klevu.getObjectPath(data,"itemSalePrice",0),
              'itemCurrency':klevu.getObjectPath(data,"itemCurrency","")
            };
            klevu.pageMeta.setData("page.products",[product]);
            break;
          case "cart":
            // cart data
            klevu.pageMeta.setData("page.products",klevu.getObjectPath(data,"cartRecords",[]));
            break;
          case 'checkout':
            // checkout data
            klevu.pageMeta.setData("page.products",klevu.getObjectPath(data,"orderItems",[]));
            break;
          default:
        }
      }
    },
    updateFromV2:function(data){
      // processor to be added
    },
    getAll: function(){
      return klevu.pageMeta.settings;
    },
    hasData:function(path){
      return !!klevu.getObjectPath(klevu.pageMeta.settings,path,false);
    },
    getData:function(path,defaultValue){
      if ( klevu.isUndefined( defaultValue ) ) defaultValue = false;
      return klevu.getObjectPath(klevu.pageMeta.settings,path,defaultValue);
    },
    setData:function(path,value){
      klevu.setObjectPath(klevu.pageMeta.settings,path,value);
      return klevu.pageMeta.settings;
    },
    // interfaces
    hasPageType:function(){
      return klevu.pageMeta.hasData("page.pageType",false);
    },
    getPageType:function(){
      return klevu.pageMeta.getData("page.pageType",false);
    },
    getApiKey:function(){
      return klevu.getGlobalSetting("global.apiKey",klevu.getGlobalSetting( "search.apiKey",klevu.getGlobalSetting( "analytics.apiKey" ) ))
    },
    getUserProfile:function(){
      return klevu.pageMeta.getData("user",false);
    },
    getItems:function(){
      if(klevu.pageMeta.hasData("page.products")){
        return klevu.pageMeta.getData("page.products",[])
      }
      return [];
    },
    hasItems:function(){
      let products = klevu.pageMeta.getItems();
      return !!(!klevu.isUndefined(products) && klevu.isArrayLike(products) && products.length > 0);

    },
    update: function (data , version){
      if(klevu.isUndefined(version)) version = 2;
      switch (version) {
        case 2:
          klevu.pageMeta.updateFromV2(data);
          break;
        default:
          klevu.pageMeta.updateFromV1(data);
          break;
      }
      var dataForChain = {
        settings : klevu.pageMeta.getAll()
      };
      var chain = klevu.pageMeta.chains.events;
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( this );
        chain.setData( dataForChain );
        chain.fire();
      }
      return klevu.pageMeta.getAll();
    },
    send : function(){
      var data = {
        settings :  klevu.pageMeta.getAll()
      };
      var chain = klevu.pageMeta.chains.send;
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( this );
        chain.setData( data );
        chain.fire();
      }
    },
    chains:{
      send: klevu.chain( { stopOnFalse : true } ),
      events: klevu.chain( { stopOnFalse : true } )
    }
  });
}


 
//source/core/pageMeta/chains/events.js
klevu.pageMeta.chains.events.add({
    name:"checkCheckout",
    fire: function(data,scope){

        if(klevu.pageMeta.getPageType() !== "checkout") return;
        if( klevu.pageMeta.hasItems()){
            var payload = {
                "event_version": "1.0.0",// to be able to amend required event type based attributes
                "event": "order_purchase", // type of the event
                "event_apikey": klevu.pageMeta.getApiKey(), //api key of the event
                "user_profile" : klevu.pageMeta.getUserProfile(),// optional
                "event_data": { // object containing event data
                    "items": klevu.pageMeta.getItems()
                }
            }
            var object = {
                payload: payload,
                type: "collect",
                url: klevu.getGlobalSetting("url.analyticsCollect", false),
                key: "checkout_order_" + klevu.randomId(),
                override: true
            };
            window["_klvCollect"] = window["_klvCollect"] || [];
            window["_klvCollect"].push(object);
        }


    }
}); 
//source/core/pageMeta/pageMetaEvent.js
klevu.settings.chains.initChain.add(
    {
      name:"pageMetaBuild",
      fire: function(data,scope) {

        var powerUp = klevu.getGlobalSetting("powerUp.pageMeta");
        if((!klevu.isUndefined(powerUp) && powerUp === false) || !klevu.isInteractive) return;

        if(klevu.getObjectPath(data,"flags.pageMeta.build",false)) return;

        klevu.setObjectPath(data,"flags.pageMeta.build",true);
        klevu.pageMeta.build();
      }
    }
); 

})( klevu );
//analyticsObject
//source/core/analyticsObject/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/analyticsObject/analyticsEvents.js
klevu.extend({
	// add event manager and event functions
	analyticsEvents: {}
});
klevu.extend(true, klevu.analyticsEvents, {
	term: function (data, kObject ) {

		
		if (klevu.isEmptyObject(kObject)) kObject = klevu.analytics.base;
		var kScope = kObject.getScope();
		kScope.data = kObject.resetData();
		kScope.data.context.eventAction = "term";
		//set up data for request
		kScope.data.request.analytics = data;
		kScope.data.context.preventDefault = false;

		klevu.event.fireChain(kScope, "chains.events.term", kScope.element, kScope.data, null);
		return kObject;
	},
	click: function (data, kObject ) {

		
		if (klevu.isEmptyObject(kObject)) kObject = klevu.analytics.base;
		var kScope = kObject.getScope();
		kScope.data = kObject.resetData();
		kScope.data.context.eventAction = "click";
		//set up data for request
		kScope.data.request.analytics = data;
		kScope.data.request.analytics.klevu_type = "clicked";
		kScope.data.context.preventDefault = false;

		klevu.event.fireChain(kScope, "chains.events.click", kScope.element, kScope.data, null);
		return kObject;
	},

	buy: function (data, kObject ) {

		
		if (klevu.isEmptyObject(kObject)) kObject = klevu.analytics.base;
		var kScope = kObject.getScope();
		kScope.data = kObject.resetData();
		kScope.data.context.eventAction = "buy";
		//set up data for request
		kScope.data.request.analytics = data;
		kScope.data.request.analytics.klevu_type = "checkout";
		kScope.data.context.preventDefault = false;

		klevu.event.fireChain(kScope, "chains.events.buy", kScope.element, kScope.data, null);
		return kObject;
	},
  catclick: function (data, kObject ) {

    
    if (klevu.isEmptyObject(kObject)) kObject = klevu.analytics.base;
    var kScope = kObject.getScope();
    kScope.data = kObject.resetData();
    kScope.data.context.eventAction = "catclick";
    //set up data for request
    kScope.data.request.analytics = data;
    kScope.data.context.preventDefault = false;

    klevu.event.fireChain(kScope, "chains.events.catclick", kScope.element, kScope.data, null);
    return kObject;
  },
  catview: function (data, kObject ) {

    
    if (klevu.isEmptyObject(kObject)) kObject = klevu.analytics.base;
    var kScope = kObject.getScope();
    kScope.data = kObject.resetData();
    kScope.data.context.eventAction = "catview";
    //set up data for request
    kScope.data.request.analytics = data;
    kScope.data.context.preventDefault = false;

    klevu.event.fireChain(kScope, "chains.events.catview", kScope.element, kScope.data, null);
    return kObject;
  },
	collect: function (data) {

		
		var kObject = klevu.analytics.base;
		var kScope = kObject.getScope();
		kScope.data = kObject.resetData();
		kScope.data.context.eventAction = "collect";
		//set up data for request
		kScope.data.request.collect = data.toSend.payload;
		kScope.data.context.collectStorage = data.toSend;
		kScope.data.context.preventDefault = false;
		if(!klevu.isUndefined(data.callbacks)){
			kScope.data.context.callbacks = data.callbacks;
		} else {
			kScope.data.context.callbacks = false;
		}


		klevu.event.fireChain(kScope, "chains.events.collect", kScope.element, kScope.data, null);
		return kObject;
	}
});
 
//source/core/analyticsObject/analyticsObject.js
//analyticsObjectBuild base function extension
klevu.extend({
	analyticsObjectBuild: function () {
		var localVariables = {
			settings: {}
		};

		klevu.setObjectPath(localVariables, "id", klevu.randomId());



		/*    AJAX   */
		klevu.setObjectPath(localVariables, "chains.actions.doAnalytics", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.actions.finalise", klevu.chain({
			stopOnFalse: true
		}));

		// event
		klevu.setObjectPath(localVariables, "chains.events.term", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.events.click", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.events.buy", klevu.chain({
			stopOnFalse: true
		}));
    klevu.setObjectPath(localVariables, "chains.events.catview", klevu.chain({
      stopOnFalse: true
    }));
    klevu.setObjectPath(localVariables, "chains.events.catclick", klevu.chain({
      stopOnFalse: true
    }));
		klevu.setObjectPath(localVariables, "chains.events.collect", klevu.chain({
			stopOnFalse: true
		}));

		/*    REQUEST   */
		// general
		klevu.setObjectPath(localVariables, "chains.request.control", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.request.build", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.request.send", klevu.chain({
			stopOnFalse: true
		}));
		//ajax
		klevu.setObjectPath(localVariables, "chains.request.ajax.send", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.request.fetch.send", klevu.chain({
			stopOnFalse: true
		}));
		/*    RESPONSE   */
		// ajax
		klevu.setObjectPath(localVariables, "chains.response.ajax.success", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.response.ajax.done", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.response.ajax.fail", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.response.success", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.response.done", klevu.chain({
			stopOnFalse: true
		}));
		klevu.setObjectPath(localVariables, "chains.response.fail", klevu.chain({
			stopOnFalse: true
		}));

		function init(selfObj) {
			localVariables.element = document.createElement("input");
			localVariables.element.kObject = selfObj;
			localVariables.element.kScope = localVariables;
			localVariables.element.kElem = localVariables.element;
		}

		function resetData() {
			var tempData = buildData();
			localVariables.data.context = tempData.context;
			localVariables.data.request = tempData.request;
			localVariables.data.response = tempData.response;
			localVariables.data.scope = null;
			return localVariables.data;
		}

		function buildData() {
			var data = {
				context: {
					event: null,
					eventAction: "",
					preventDefault: false,
					status: null,
					isSuccess: false,
					doRequest: true
				},
				request: {
					analytics: {}
				},
				response: {
					ajax: {
						object: {},
						data: {}
					},
					current: {}
				},
				scope: {}
			};
			return data;
		}
		localVariables.data = buildData();


		var selfObj = {
			init: init,
			resetData: resetData,
			buildData: buildData,
			// scope:localVariables,
			setScope: function (variables) {
				localVariables = variables;
				return localVariables;
			},
			getScope: function () {
				return localVariables;
			}
		};
		init(selfObj);
		return selfObj;
	}

}); 
//source/core/analyticsObject/analyticsObjectSettings.js
//searchObjectSettings
//setup defaults for search object settings
var options = {
  analytics : {
    url : {
      term: "n-search/search",
      click: "productTracking",
      buy: "productTracking",
      catclick: "categoryProductClickTracking",
      catview: "categoryProductViewTracking",
      collect: "collect"
    }
  },
  url:{
    analytics: klevu.settings.url.protocol + "//stats.klevu.com/analytics/",
    analyticsCat: klevu.settings.url.protocol + "//stats.ksearchnet.com/analytics/",
    analyticsCollect: klevu.settings.url.protocol + "//stats.ksearchnet.com/analytics/"
  }
};

klevu( options ); 
//source/core/analyticsObject/anaylticsUtilObject.js
/**
 * Klevu Analytics Utility
 */

(function (klevu) {

    /**
     * Function to send term analytics request from local storage
     * @param {*} dictionary 
     * @param {*} element 
     */
    function sendAnalyticsEventsFromStorage(dictionary, element) {
        var autoSug = klevu.dictionary(dictionary);
            autoSug.setStorage("local");
            autoSug.mergeFromGlobal();
            var storedEvents = autoSug.getElement(element);
            if (storedEvents && storedEvents != element) {
                storedEvents = JSON.parse(storedEvents);
                klevu.each(storedEvents, function (index, value) {
                    delete value.filters;
                    if (element == klevu.analyticsUtil.base.storage.click) {
                        klevu.analyticsEvents.click(value);
                    } else if (element == klevu.analyticsUtil.base.storage.categoryClick) {
                        //TO-DO: Send category product click event
                        //console.log(value);
                    } else {
                        klevu.analyticsEvents.term(value);
                    }
                });
                autoSug.addElement(element, "");
                autoSug.mergeToGlobal();
        }
    };

    var storageOptions = {
        dictionary: "analytics-util",
        term: "termList",
        click: "clickList",
        categoryClick: "categoryClickList",
        collect: "analyticsEvents"
    };

    klevu.extend(true,klevu,{
        analyticsUtil: {
            base: {
                storage: storageOptions,
                sendAnalyticsEventsFromStorage: sendAnalyticsEventsFromStorage
            }
        }
    });


    klevu.extend(true,klevu, {
        analytics:{
            utility : {
                dictionary:{
                    collect: "analyticsEvents"
                },
                supportedTypes:[],
                chains:{
                    sendType:klevu.chain( { stopOnFalse : true } ),
                    analyticsClick:klevu.chain( { stopOnFalse : true } ),
                    prodBuy:klevu.chain( { stopOnFalse : true } ),
                    prodClick:klevu.chain( { stopOnFalse : true } ),
                    prodView:klevu.chain( { stopOnFalse : true } ),
                    catClick:klevu.chain( { stopOnFalse : true } ),
                    catView:klevu.chain( { stopOnFalse : true } ),
                    recsClick:klevu.chain( { stopOnFalse : true } ),
                    recsView:klevu.chain( { stopOnFalse : true } )

                },
                addSupportedType:function(typeObject){
                    // add to supported type name
                    var supportedTypes = klevu.getObjectPath(klevu.analytics.utility, "supportedTypes",[]);
                    supportedTypes.push(typeObject.name);
                    klevu.setObjectPath(klevu.analytics.utility, "supportedTypes",supportedTypes);
                    var chain = klevu.getObjectPath(klevu.analytics.utility, "chains.sendType");
                    if (!klevu.isUndefined(chain)) {
                        chain.add({
                            name: "send"+typeObject.name,
                            fire: typeObject.fire
                        });
                    }

                },
                sendAnalyticsEventsFromStorage: function(dictionary){
                    if(klevu.isUndefined(dictionary)) dictionary = klevu.analytics.utility.dictionary.collect;
                    var dictionaryData = klevu.dictionary(dictionary);
                    dictionaryData.setStorage("local");
                    dictionaryData.mergeFromGlobal();
                    var storedEvents = dictionaryData.getElements();

                    klevu.each(storedEvents, function (key, value) {
                        //keep track of event status, load the event at each loop to minimise issues of fast processing
                        dictionaryData.mergeFromGlobal();
                        value = dictionaryData.getElement(key);
                        value = JSON.parse(value);
                        //remove if we dont have a type
                        if(klevu.getObjectPath(value,"type") === undefined) {
                            klevu.analytics.utility.removeAnalyticsEventsFromStorage(dictionary,key);
                            return;
                        }
                        //check if event is already expired
                        if("timestamp" in value){
                            var currentTime = klevu.time.timestamp();
                            if((currentTime - parseInt(value.timestamp)) > klevu.getGlobalSetting("analytics.maxRetryTime",21600)){
                                klevu.analytics.utility.removeAnalyticsEventsFromStorage(dictionary,key);
                                return;
                            }
                        }
                        // skip if type is not supported
                        if(!klevu.getObjectPath(klevu.analytics.utility, "supportedTypes",[]).includes(klevu.getObjectPath(value,"type"))){
                            return;
                        }
                        //if the event is sending do not send again
                        if(klevu.getObjectPath(value,"status","new") === "pending") {
                            //validate the status change is in the last 30 sec if not reset status to new and continue. This is to cover the case that some events might be added and begin execution on previous pages but not finish
                            if((klevu.time.timestamp() - klevu.getObjectPath(value,"statusTime",klevu.time.timestamp()))<klevu.getGlobalSetting("analytics.maxStatusLockTime",30)){
                                return;
                            } else {
                                klevu.analytics.utility.changeAnalyticsEventsStatus(dictionary,key,"new",true);
                            }
                        }

                        //set the status to pending
                        klevu.analytics.utility.changeAnalyticsEventsStatus(dictionary,key,"pending");
                        //send the event
                        var data = {
                            value: value,
                            dictionary:dictionary,
                            key:key
                        };
                        var scope = {data:data};
                        var chain = klevu.getObjectPath(klevu.analytics.utility, "chains.sendType");
                        if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
                            chain.setScope(scope);
                            chain.setData(data);
                            chain.fire();
                        }

                    });
                },
                removeAnalyticsEventsFromStorage:function(dictionary,key){
                    var dictionaryData = klevu.dictionary(dictionary);
                    dictionaryData.setStorage("local");
                    dictionaryData.mergeFromGlobal();
                    dictionaryData.removeElement(key);
                    dictionaryData.overrideGlobal();
                },
                addAnalyticsEventsToStorage: function(analyticsEvent){
                    var dictionary = !klevu.isUndefined(analyticsEvent.dictionary)?analyticsEvent.dictionary:klevu.analytics.utility.dictionary.collect;
                    var dictionaryData = klevu.dictionary(dictionary);
                    dictionaryData.setStorage("local");
                    dictionaryData.mergeFromGlobal();
                    //add timestamp
                    analyticsEvent.timestamp = klevu.time.timestamp();
                    //do not add duplicates on the same key
                    if(dictionaryData.getElement(analyticsEvent.key) === analyticsEvent.key){
                        if(klevu.isUndefined(analyticsEvent.status)) analyticsEvent.status = "new";
                        dictionaryData.addElement(analyticsEvent.key, JSON.stringify(analyticsEvent));
                    } else if((!klevu.isUndefined(analyticsEvent.override) && analyticsEvent.override)){
                        var analyticsKeyValue = dictionaryData.getElement(analyticsEvent.key);
                        analyticsKeyValue = JSON.parse(analyticsKeyValue);
                        //check if we need to force a overide independent of status
                        if(!klevu.isUndefined(analyticsEvent.forced) && analyticsEvent.forced){
                            if(klevu.isUndefined(analyticsEvent.status)) analyticsEvent.status = "new";
                            dictionaryData.addElement(analyticsEvent.key, JSON.stringify(analyticsEvent));
                        } else {
                            //if status is new then overide, otherwise create new event
                            if(klevu.getObjectPath(analyticsKeyValue,"status","new") === "new") {
                                //in the case the event is not in process of sending just override the event
                                dictionaryData.addElement(analyticsEvent.key, JSON.stringify(analyticsEvent));
                            } else {
                                //in the case the event is in process of sending just add a new event
                                if(klevu.isUndefined(analyticsEvent.status)) analyticsEvent.status = "new";
                                dictionaryData.addElement(analyticsEvent.key+klevu.time.timestamp(), JSON.stringify(analyticsEvent));
                            }
                        }
                    }
                    dictionaryData.mergeToGlobal();
                },
                changeAnalyticsEventsStatus: function(dictionary,key,status,forced){
                    var dictionary = !klevu.isUndefined(dictionary)?dictionary:klevu.analytics.utility.dictionary.collect;
                    if(klevu.isUndefined(forced)) forced = false;
                    var dictionaryData = klevu.dictionary(dictionary);
                    dictionaryData.setStorage("local");
                    dictionaryData.mergeFromGlobal();
                    var jsonData = dictionaryData.getElement(key);
                    jsonData = JSON.parse(jsonData);
                    jsonData.status = status;
                    jsonData.statusTime = klevu.time.timestamp();
                    jsonData.key = key;
                    jsonData.override = true;
                    if(forced) jsonData.forced = forced;
                    klevu.analytics.utility.addAnalyticsEventsToStorage(jsonData);
                }

            }
        }
    });
    //add the collect send type
    klevu.analytics.utility.addSupportedType({
        name:"collect",
        fire:function(data, scope) {
            if(data.value.type === "collect"){
                var callbacks = [];
                callbacks.push({
                    fire: klevu.analytics.utility.removeAnalyticsEventsFromStorage,
                    params: [data.dictionary,data.key]
                });
                //send the collect event
                klevu.analyticsEvents.collect({toSend:data.value,callbacks:callbacks});
            }
        }
    });

})(klevu);

/**
 * Function to fire for sending queued "click" analytics requests 
 */
klevu.coreEvent.build( {
    name : "analiticsAutosend" , fire : function () {
        if ( !klevu.isInteractive ||
            klevu.isUndefined( klevu.analytics ) ||
            klevu.isUndefined( klevu.analytics.build ) ||
            klevu.isUndefined( klevu.analytics.utility ) ) {
            return false;
        }
        return true;
    }
} );
klevu.coreEvent.attach( "analiticsAutosend" , function(){klevu.analytics.utility.sendAnalyticsEventsFromStorage("analyticsEvents")} );

// klevu.analyticsUtil.base.sendAnalyticsEventsFromStorage(
//     klevu.analyticsUtil.base.storage.dictionary,
//     klevu.analyticsUtil.base.storage.click
// );

//build new analytics global events object
klevu.settings.chains.initChain.add(
    {
        name:"analyticsCollectGlobalList",
        fire: function(data,scope) {

            var powerUp = klevu.getGlobalSetting("powerUp.klvCollect");
            if((!klevu.isUndefined(powerUp) && powerUp === false)) return;

            if(klevu.getObjectPath(data,"flags.analytics.klvCollect.poweredUp",false)) return;

            var apiKey =  klevu.getGlobalSetting( "analytics.apiKey",klevu.getGlobalSetting( "global.apiKey",false ) )
            if((!klevu.isUndefined(apiKey) && apiKey !== false)){
                klevu.setObjectPath(data,"flags.analytics.klvCollect.poweredUp",true);
                klevu.event.eventList.build({name:"_klvCollect",global:true});
                _klvCollect.chain.add({
                    name:"moveToEvents",
                    fire:function(data,scope){
                        if(data.element.length>0){
                            var listToRemove = [];
                            klevu.each(data.element,function(key,value){
                                var elementToAdd = {
                                    type: klevu.getObjectPath(value,"type","custom"),
                                    url: klevu.getObjectPath(value,"url",false),
                                    apiKey: klevu.getObjectPath(value,"apiKey",klevu.getGlobalSetting( "analytics.apiKey",klevu.getGlobalSetting( "global.apiKey",false ) )),
                                    key: klevu.getObjectPath(value,"key","customEvent-"+klevu.randomId()),
                                    override: klevu.getObjectPath(value,"override",true),
                                    payload: klevu.getObjectPath(value,"payload", {}),
                                }
                                // fix api key for events that might not have it
                                elementToAdd.payload.apiKey = klevu.getObjectPath(value,"payload.apiKey", klevu.getGlobalSetting( "analytics.apiKey",klevu.getGlobalSetting( "global.apiKey",false )));
                                //add the new event to the event storage
                                if (klevu.analytics.utility && typeof klevu.analytics.utility.addAnalyticsEventsToStorage == "function") {
                                    klevu.analytics.utility.addAnalyticsEventsToStorage(elementToAdd);
                                    listToRemove.push(value);
                                }
                            });
                            if(listToRemove.length>0){
                                klevu.each(listToRemove,function(key,value){
                                    data.element.remove(value);
                                });
                                // if there are new events to send start sending them
                                if (klevu.analytics.utility && typeof klevu.analytics.utility.sendAnalyticsEventsFromStorage == "function") {
                                    klevu.analytics.utility.sendAnalyticsEventsFromStorage();
                                }
                            };
                        }
                    }
                });
                _klvCollect.run();
            }
        }
    }
);

 

})( klevu );
//source/core/analyticsObject/analyticsObjectBuild.js
//analyticsObjectBuild base element
(function ( klevu ) {
  var baseAnalytics = klevu.analyticsObjectBuild();

  
//source/core/analyticsObject/chains/events/term.js
// chains/events.term.js
baseAnalytics.getScope().chains.events.term.add({
	name: "termRequestCheck",
	fire: function (data, scope) {
		klevu.clean(data.request.analytics);
		var analytics = data.request.analytics;
		try {
			var hasError = false;
			var errorPrefix = "";
			if (klevu.isUndefined(analytics.klevu_term)) {
				hasError = true;
				errorPrefix = "klevu_term";
			} else if (klevu.isUndefined(analytics.klevu_totalResults)) {
				hasError = true;
				errorPrefix = "klevu_totalResults";
			} else if (klevu.isUndefined(analytics.klevu_typeOfQuery)) {
				hasError = true;
				errorPrefix = "klevu_typeOfQuery";
			}
			if (hasError) {
				throw new Error(errorPrefix + " parameter is missing from the term analytics request!");
			}
		} catch (error) {
		  
			return false;
		}
	}
});
baseAnalytics.getScope().chains.events.term.add({
	name: "generateURL",
	fire: function (data, scope) {
		var analyticsUrl = klevu.getSetting(scope.kScope.settings, "settings.url.analytics", false);
		if (analyticsUrl) {
			data.context.url = analyticsUrl + klevu.getSetting(scope.kScope.settings, "settings.analytics.url.term", false);
		} else {
			return false;
		}
	}
});
baseAnalytics.getScope().chains.events.term.add({
	name: "addApiKey",
	fire: function (data, scope) {
		data.request.analytics.klevu_apiKey = klevu.getSetting( scope.kScope.settings , "settings.analytics.apiKey" , klevu.getGlobalSetting( "analytics.apiKey",klevu.getGlobalSetting( "global.apiKey" ) ) );
	}
});

baseAnalytics.getScope().chains.events.term.add({
	name: "doAnalytics",
	fire: function (data, scope) {
		var chain = klevu.getObjectPath(scope.kScope, "chains.actions.doAnalytics");

		if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
			chain.setScope(scope.kElem);
			chain.setData(data);
			chain.fire();
		}
		scope.kScope.data = data;
		if (data.context.preventDefault === true) return false;
	}
}); 
//source/core/analyticsObject/chains/events/click.js
// chains/events.click.js
baseAnalytics.getScope().chains.events.click.add({
	name: "clickRequestCheck",
	fire: function (data, scope) {
		klevu.clean(data.request.analytics);
		var analytics = data.request.analytics;
		try {
			var hasError = false;
			var errorPrefix = "";
			if (klevu.isUndefined(analytics.klevu_keywords)) {
				hasError = true;
				errorPrefix = "klevu_keywords";
			} else if (klevu.isUndefined(analytics.klevu_productId)) {
				hasError = true;
				errorPrefix = "klevu_productId";
			} else if (klevu.isUndefined(analytics.klevu_productName)) {
				hasError = true;
				errorPrefix = "klevu_productName";
			} else if (klevu.isUndefined(analytics.klevu_productUrl)) {
				hasError = true;
				errorPrefix = "klevu_productUrl";
			}
			if (hasError) {
				throw new Error(errorPrefix + " parameter is missing from the click analytics request!");
			}
		} catch (error) {
			  
			return false;
		}
	}
});
baseAnalytics.getScope().chains.events.click.add({
	name: "generateURL",
	fire: function (data, scope) {
		var analyticsUrl = klevu.getSetting(scope.kScope.settings, "settings.url.analytics", false);
		if (analyticsUrl) {
			data.context.url = analyticsUrl + klevu.getSetting(scope.kScope.settings, "settings.analytics.url.click", false);
		} else {
			return false;
		}
	}
});
baseAnalytics.getScope().chains.events.click.add({
	name: "addApiKey",
	fire: function (data, scope) {
		data.request.analytics.klevu_apiKey = klevu.getSetting( scope.kScope.settings , "settings.analytics.apiKey" , klevu.getGlobalSetting( "analytics.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) );
	}
});
baseAnalytics.getScope().chains.events.click.add({
	name: "doAnalytics",
	fire: function (data, scope) {
		var chain = klevu.getObjectPath(scope.kScope, "chains.actions.doAnalytics");

		if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
			chain.setScope(scope.kElem);
			chain.setData(data);
			chain.fire();
		}
		scope.kScope.data = data;
		if (data.context.preventDefault === true) return false;
	}
}); 
//source/core/analyticsObject/chains/events/buy.js
// chains/events.buy.js
baseAnalytics.getScope().chains.events.buy.add({
	name: "buyRequestCheck",
	fire: function (data, scope) {
		klevu.clean(data.request.analytics);
		var analytics = data.request.analytics;
		try {
			var hasError = false;
			var errorPrefix = "";
			if (klevu.isUndefined(analytics.klevu_productId)) {
				hasError = true;
				errorPrefix = "klevu_productId";
			} else if (klevu.isUndefined(analytics.klevu_unit)) {
				hasError = true;
				errorPrefix = "klevu_unit";
			} else if (klevu.isUndefined(analytics.klevu_salePrice)) {
				hasError = true;
				errorPrefix = "klevu_salePrice";
			} else if (klevu.isUndefined(analytics.klevu_currency)) {
				hasError = true;
				errorPrefix = "klevu_currency";
			}
			if (hasError) {
				throw new Error(errorPrefix + " parameter is missing from the buy analytics request!");
			}
		} catch (error) {
			  
			return false;
		}
	}
});
baseAnalytics.getScope().chains.events.buy.add({
	name: "generateURL",
	fire: function (data, scope) {
		var analyticsUrl = klevu.getSetting(scope.kScope.settings, "settings.url.analytics", false);
		if (analyticsUrl) {
			data.context.url = analyticsUrl + klevu.getSetting(scope.kScope.settings, "settings.analytics.url.buy", false);
		} else {
			return false;
		}
	}
});
baseAnalytics.getScope().chains.events.buy.add({
	name: "addApiKey",
	fire: function (data, scope) {
		data.request.analytics.klevu_apiKey = klevu.getSetting( scope.kScope.settings , "settings.analytics.apiKey" , klevu.getGlobalSetting( "analytics.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) );
	}
});
baseAnalytics.getScope().chains.events.buy.add({
	name: "doAnalytics",
	fire: function (data, scope) {
		var chain = klevu.getObjectPath(scope.kScope, "chains.actions.doAnalytics");

		if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
			chain.setScope(scope.kElem);
			chain.setData(data);
			chain.fire();
		}
		scope.kScope.data = data;
		if (data.context.preventDefault === true) return false;
	}
}); 
//source/core/analyticsObject/chains/events/catclick.js
// chains/events.click.js
baseAnalytics.getScope().chains.events.catclick.add({
  name: "clickRequestCheck",
  fire: function (data, scope) {
    klevu.clean(data.request.analytics);
    var analytics = data.request.analytics;
    try {
      var hasError = false;
      var errorPrefix = "";
      if (klevu.isUndefined(analytics.klevu_categoryName)) {
        hasError = true;
        errorPrefix = "klevu_categoryName";
      } else if (klevu.isUndefined(analytics.klevu_categoryPath)) {
        hasError = true;
        errorPrefix = "klevu_categoryPath";
      } else if (klevu.isUndefined(analytics.klevu_productId)) {
        hasError = true;
        errorPrefix = "klevu_productId";
      } else if (klevu.isUndefined(analytics.klevu_productName)) {
        hasError = true;
        errorPrefix = "klevu_productName";
      } else if (klevu.isUndefined(analytics.klevu_productUrl)) {
        hasError = true;
        errorPrefix = "klevu_productUrl";
      }
      if (hasError) {
        throw new Error(errorPrefix + " parameter is missing from the click analytics request!");
      }
    } catch (error) {
      
      return false;
    }
  }
});
baseAnalytics.getScope().chains.events.catclick.add({
  name: "generateURL",
  fire: function (data, scope) {
    var analyticsUrl = klevu.getSetting(scope.kScope.settings, "settings.url.analyticsCat", false);
    if (analyticsUrl) {
      data.context.url = analyticsUrl + klevu.getSetting(scope.kScope.settings, "settings.analytics.url.catclick", false);
    } else {
      return false;
    }
  }
});
baseAnalytics.getScope().chains.events.catclick.add({
  name: "addApiKey",
  fire: function (data, scope) {
    data.request.analytics.klevu_apiKey = klevu.getSetting( scope.kScope.settings , "settings.analytics.apiKey" , klevu.getGlobalSetting( "analytics.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) );
  }
});

baseAnalytics.getScope().chains.events.catclick.add({
  name: "doAnalytics",
  fire: function (data, scope) {
    var chain = klevu.getObjectPath(scope.kScope, "chains.actions.doAnalytics");

    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
      chain.setScope(scope.kElem);
      chain.setData(data);
      chain.fire();
    }
    scope.kScope.data = data;
    if (data.context.preventDefault === true) return false;
  }
}); 
//source/core/analyticsObject/chains/events/catview.js
// chains/events.term.js
baseAnalytics.getScope().chains.events.catview.add({
  name: "viewRequestCheck",
  fire: function (data, scope) {
    klevu.clean(data.request.analytics);
    var analytics = data.request.analytics;
    try {
      var hasError = false;
      var errorPrefix = "";
      if (klevu.isUndefined(analytics.klevu_categoryName)) {
        hasError = true;
        errorPrefix = "klevu_categoryName";
      } else if (klevu.isUndefined(analytics.klevu_categoryPath)) {
        hasError = true;
        errorPrefix = "klevu_categoryPath";
      } else if (klevu.isUndefined(analytics.klevu_productIds)) {
        hasError = true;
        errorPrefix = "klevu_productIds";
      }
      if (hasError) {
        throw new Error(errorPrefix + " parameter is missing from the term analytics request!");
      }
    } catch (error) {
      
      return false;
    }
  }
});
baseAnalytics.getScope().chains.events.catview.add({
  name: "generateURL",
  fire: function (data, scope) {
    var analyticsUrl = klevu.getSetting(scope.kScope.settings, "settings.url.analyticsCat", false);
    if (analyticsUrl) {
      data.context.url = analyticsUrl + klevu.getSetting(scope.kScope.settings, "settings.analytics.url.catview", false);
    } else {
      return false;
    }
  }
});
baseAnalytics.getScope().chains.events.catview.add({
  name: "addApiKey",
  fire: function (data, scope) {
    data.request.analytics.klevu_apiKey = klevu.getSetting( scope.kScope.settings , "settings.analytics.apiKey" , klevu.getGlobalSetting( "analytics.apiKey",klevu.getGlobalSetting( "global.apiKey" ) ) );
  }
});

baseAnalytics.getScope().chains.events.catview.add({
  name: "doAnalytics",
  fire: function (data, scope) {
    var chain = klevu.getObjectPath(scope.kScope, "chains.actions.doAnalytics");

    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
      chain.setScope(scope.kElem);
      chain.setData(data);
      chain.fire();
    }
    scope.kScope.data = data;
    if (data.context.preventDefault === true) return false;
  }
}); 
//source/core/analyticsObject/chains/events/collect.js
// chains/events.term.js
baseAnalytics.getScope().chains.events.collect.add({
  name: "collectRequestClean",
  fire: function (data, scope) {
    klevu.clean(data.request.collect);
  }
});
baseAnalytics.getScope().chains.events.collect.add({
  name: "generateURL",
  fire: function (data, scope) {
    if(klevu.getObjectPath(scope.kScope,"data.context.collectStorage.url",false)){
      data.context.url = klevu.getObjectPath(scope.kScope,"data.context.collectStorage.url")+ klevu.getSetting(scope.kScope.settings, "settings.analytics.url.collect", false);
    } else {
      var analyticsUrl = klevu.getSetting(scope.kScope.settings, "settings.url.analyticsCollect", false);
      if (analyticsUrl) {
        data.context.url = analyticsUrl + klevu.getSetting(scope.kScope.settings, "settings.analytics.url.collect", false);
      } else {
        return false;
      }
    }

  }
});

baseAnalytics.getScope().chains.events.collect.add({
  name: "doAnalytics",
  fire: function (data, scope) {
    var chain = klevu.getObjectPath(scope.kScope, "chains.actions.doAnalytics");

    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
      chain.setScope(scope.kElem);
      chain.setData(data);
      chain.fire();
    }
    scope.kScope.data = data;
    if (data.context.preventDefault === true) return false;
  }
}); 
//source/core/analyticsObject/chains/actions/doAnalytics.js
// chains/actions/doAnalytics.js

baseAnalytics.getScope().chains.actions.doAnalytics.add( {
  name : "doRequest" ,
  fire : function ( data , scope ) {
    data.context.doRequest = false;
    var chain = klevu.getObjectPath( scope.kScope , "chains.request.control" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
      scope.kScope.data = data;
    } else {
      data.context.preventDefault = true;
      scope.kScope.data = data;
      return false;
    }
  }
} );





 
//source/core/analyticsObject/chains/request/ajax/send.js
// chains/request/ajax/makeRequest.js
baseAnalytics.getScope().chains.request.ajax.send.add( {
  name : "sendRequest" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction !== "analyticsAjaxV1" ) return;
    data.scope = scope;
    if ( data.context.doRequest ) {

      klevu.ajax( data.context.url , {
        method : "GET" ,
        data : klevu.queryString( data.request.analytics ) ,
        dataType : "xml" ,
        crossDomain : true ,
        success : function ( klXHR ) {
          var chain = klevu.getObjectPath( klXHR.requestDetails.scope.kScope , "chains.response.ajax.success" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( klXHR.requestDetails.scope.kElem );
            klXHR.requestDetails.response.ajax.object = klXHR;
            klXHR.requestDetails.response.ajax.data = klXHR.responseObj.data;
            klXHR.requestDetails.context.status = klXHR.status;
            klXHR.requestDetails.context.isSuccess = klXHR.isSuccess;
            chain.setData( klXHR.requestDetails );
            chain.fire();
          }
        } ,
        done : function ( klXHR ) {
          var chain = klevu.getObjectPath( klXHR.requestDetails.scope.kScope , "chains.response.ajax.done" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( klXHR.requestDetails.scope.kElem );
            klXHR.requestDetails.response.ajax.object = klXHR;
            klXHR.requestDetails.response.ajax.data = klXHR.responseObj.data;
            klXHR.requestDetails.context.status = klXHR.status;
            klXHR.requestDetails.context.isSuccess = klXHR.isSuccess;
            chain.setData( klXHR.requestDetails );
            chain.fire();
          }
        } ,
        error : function ( klXHR ) {
          var chain = klevu.getObjectPath( klXHR.requestDetails.scope.kScope , "chains.response.ajax.fail" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( klXHR.requestDetails.scope.kElem );
            klXHR.requestDetails.response.ajax.object = klXHR;
            klXHR.requestDetails.response.ajax.data = {};
            klXHR.requestDetails.context.status = klXHR.status;
            klXHR.requestDetails.context.isSuccess = klXHR.isSuccess;
            chain.setData( klXHR.requestDetails );
            chain.fire();
          }
        } ,
        requestDetails : data
      } );
    } else {
      

    }

  }
} ); 
//source/core/analyticsObject/chains/request/fetch/send.js
// chains/request/ajax/makeRequest.js
baseAnalytics.getScope().chains.request.fetch.send.add( {
  name : "sendRequest" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction !== "analyticsFetchV1" ) return;
      data.scope = scope;
      data.context.requestObject = {
        url: data.context.url,
        type: "FETCH",
        method : "POST" ,
        mimeType : "application/json; charset=UTF-8" ,
        contentType : "application/json; charset=utf-8" ,
        //dataType : "json" ,
        crossDomain : true ,
        success : function ( data , requestDetails , status, isSuccess ) {
          var chain = klevu.getObjectPath( requestDetails.scope.kScope , "chains.response.success" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( requestDetails.scope.kElem );
            klevu.setObjectPath(requestDetails,"response.data",data);
            klevu.setObjectPath(requestDetails,"context.status",status);
            klevu.setObjectPath(requestDetails,"context.isSuccess",isSuccess);
            chain.setData( requestDetails );
            chain.fire();
          }
        } ,
        error : function ( requestDetails, status, isSuccess ) {
          var chain = klevu.getObjectPath( requestDetails.scope.kScope , "chains.response.fail" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( requestDetails.scope.kElem );
            klevu.setObjectPath(requestDetails,"response.data",{});
            klevu.setObjectPath(requestDetails,"context.status",status);
            klevu.setObjectPath(requestDetails,"context.isSuccess",isSuccess);
            chain.setData( requestDetails );
            chain.fire();
          }
        },
        data : "["+JSON.stringify( data.request.collect )+"]"
      };
      data.context.requestDetails = klevu.extend( true , {} , data );
  }
} ); 
//source/core/analyticsObject/chains/request/control.js
// chains/request/control.js
baseAnalytics.getScope().chains.request.control.add( {
  name : "initRequest" ,
  fire : function ( data , scope ) {
    data.context.doRequest = false;
    var chain = klevu.getObjectPath( scope.kScope , "chains.request.build" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
      scope.kScope.data = data;
      if ( data.context.doRequest === false ) return false;
    } else {
      data.context.preventDefault = true;
      scope.kScope.data = data;
      return false;
    }
  }
} );


baseAnalytics.getScope().chains.request.control.add( {
  name : "makeRequest" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.kScope , "chains.request.send" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.kElem );
      chain.setData( data );
      chain.fire();
      scope.kScope.data = data;
      return false;
    }
  }
} ); 
//source/core/analyticsObject/chains/request/build.js
// chains/request/buildRequest.js
baseAnalytics.getScope().chains.request.build.add( {
  name : "buildMap" ,
  fire : function ( data , scope ) {
    data.context.status = null;
    data.context.isSuccess = false;
    data.context.doRequest = true;
  }
} ); 
//source/core/analyticsObject/chains/request/send.js
// chains/request/makeRequest.js
baseAnalytics.getScope().chains.request.send.add({
	name: "requestTypeAjaxV1",
	fire: function (data, scope) {
		if (data.context.eventAction === "term" ||
			data.context.eventAction === "click" ||
			data.context.eventAction === "buy" ||
      data.context.eventAction === "catclick" ||
      data.context.eventAction === "catview")
		  data.context.eventAction = "analyticsAjaxV1";
	}
});
baseAnalytics.getScope().chains.request.send.add({
	name: "requestTypeFetchV1",
	fire: function (data, scope) {
		if (data.context.eventAction === "collect")
			data.context.eventAction = "analyticsFetchV1";
	}
});
baseAnalytics.getScope().chains.request.send.addAfter("requestTypeAjaxV1", {
	name: "requestEncodeAjaxV1",
	fire: function (data, scope) {
		if (data.context.eventAction === "analyticsAjaxV1") {
			var termData = data.request.analytics.klevu_term;
			if (termData) {
				data.request.analytics.klevu_term = encodeURIComponent(termData);
			}
			var keywordsData = data.request.analytics.klevu_keywords;
			if (keywordsData) {
				data.request.analytics.klevu_keywords = encodeURIComponent(keywordsData);
			}
		}
	}
});

baseAnalytics.getScope().chains.request.send.add({
	name: "requestTypeAjaxSendV1",
	fire: function (data, scope) {
		if (data.context.eventAction === "analyticsAjaxV1") {
			var chain = klevu.getObjectPath(scope.kScope, "chains.request.ajax.send");
			if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
				chain.setScope(scope.kElem);
				chain.setData(data);
				chain.fire();
				scope.kScope.data = data;
				return false;
			}
		}
	}
});
baseAnalytics.getScope().chains.request.send.add({
	name: "requestTypeFetchSendV1",
	fire: function (data, scope) {
		if (data.context.eventAction === "analyticsFetchV1") {
			var chain = klevu.getObjectPath(scope.kScope, "chains.request.fetch.send");
			if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
				chain.setScope(scope.kElem);
				chain.setData(data);
				chain.fire();
				scope.kScope.data = data;
			}
		}
	}
});
baseAnalytics.getScope().chains.request.send.add({
	name : "requestSend" ,
	fire : function ( data , scope ) {
		if (data.context.eventAction === "analyticsFetchV1") {
			klevu.request(data.context.requestObject, data.context.requestDetails);
		}
	}
} ); 
//source/core/analyticsObject/chains/response/ajax/done.js
// chains/response/done.js 
//source/core/analyticsObject/chains/response/ajax/fail.js
// chains/response/failResponse.js 
//source/core/analyticsObject/chains/response/ajax/success.js
// chains/response/successResponse.js
baseAnalytics.getScope().chains.response.ajax.success.add( {
  name : "checkForSuccess" ,
  fire : function ( data , scope ) {
    scope.kScope.data = data;
    if ( data.context.isSuccess === false ) {
      
      return false;
    }
    data.response.current = data.response.ajax.data;
    
  }
} );
 
//source/core/analyticsObject/chains/response/success.js
// chains/response/success.js
baseAnalytics.getScope().chains.response.success.add( {
    name : "checkForSuccess" ,
    fire : function ( data , scope ) {
        scope.kScope.data = data;
        if ( data.context.isSuccess === false ) {
            return false;
        }
        data.response.current = data.response.ajax.data;
    }
} );
baseAnalytics.getScope().chains.response.success.add( {
    name : "removeFromDictionary" ,
    fire : function ( data , scope ) {

            if ( data.context.callbacks !== false ) {
                klevu.each(data.context.callbacks , function(key,callbackObject){
                    callbackObject.fire.apply(this, callbackObject.params);
                });
            }



    }
} );
 
//source/core/analyticsObject/chains/response/fail.js
// chains/response/fail.js
baseAnalytics.getScope().chains.response.fail.add( {
    name : "removeFromDictionary" ,
    fire : function ( data , scope ) {

        if ( data.context.callbacks !== false ) {
            klevu.each(data.context.callbacks , function(key,callbackObject){
                callbackObject.fire.apply(this, callbackObject.params);
            });
        }



    }
} );
 


  klevu.extend(true,klevu, {
    analytics:{
      base : baseAnalytics,
      build: true
    }
  });

})( klevu );
//kmcModulesLoader
//source/core/kmcModulesLoader/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/kmcModulesLoader/kmcModulesLoaderObject.js
// abTestObject
    var kmcModulesLoader = {
        listOfModules: klevu.chain({stopOnFalse:true}),
        addProcessors: function(){
            var processors = klevu.assets.getProcessors();
            if(klevu.isUndefined(processors.jsModule)){
                klevu.assets.addProcessor({
                    type: "jsKmcModule",
                    fire: function (data, options) {
                        klevu.extensions.kmcModulesLoader.loadCounter++;
                        var processors = klevu.assets.getProcessors();
                        var returns = processors.js(data, options);
                        if (klevu.extensions.kmcModulesLoader.loadCounter === options.totalToLoad) {
                            klevu.extensions.kmcModulesLoader.resourcesLoaded = true;
                        }
                        return returns;

                    }
                });
            }
        },
        loadKmcModules: function(apiKey){

            klevu.extensions.kmcModulesLoader.addProcessors();

            klevu.extensions.kmcModulesLoader.resourceLoadInitiated = true;
            klevu.extensions.kmcModulesLoader.loadCounter = 0;

            var scope = {makeRequests:true};
            var data = {
                scriptList:[],
                apiKey:apiKey,

            };
            var chain = klevu.extensions.kmcModulesLoader.listOfModules;
            if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
                chain.setScope(scope);
                chain.setData(data);
                chain.fire();
            }

            data.scriptList.forEach(function (scriptObj) {

                klevu.assets.getFile({
                    url: scriptObj.src,
                    type: "jsKmcModule",
                    totalToLoad: data.scriptList.length
                });
            });

        },
        build: true,
        resourcesLoaded: false,
        resourceLoadInitiated: false
    };




 
//source/core/kmcModulesLoader/kmcModulesLoaderObjectBuild.js

klevu.extend(true, klevu, {
    extensions: {
        kmcModulesLoader: kmcModulesLoader,
    }
}); 
//source/core/kmcModulesLoader/kmcModulesLoaderModules.js
klevu.extensions.kmcModulesLoader.listOfModules.add({
    name:"klaviyoScript",
    fire:function(data,scope){
        var klaviyoEnabled = klevu.search.modules.kmcInputs.base.getDataPath("klevu_connectors.klaviyo.enabled",false);
        if(!klaviyoEnabled) return;

        var componentDomain = klevu.getGlobalSetting("url.componentUrl",false);
        var scriptToLoad = {
            src: (componentDomain?componentDomain:"https://js.klevu.com/components/") + "klaviyo/v2/klaviyo.js"
        }
        data.scriptList.push(scriptToLoad);
    }
});
klevu.extensions.kmcModulesLoader.listOfModules.add({
    name:"shopifyScript",
    fire:function(data,scope){
        var ShopifyEnabled = klevu.search.modules.kmcInputs.base.getDataPath("klevu_connectors.shopify.enabled",false);
        if(!klevu.isUndefined(window.Shopify)) ShopifyEnabled = true;
        if(!ShopifyEnabled) return;

        var componentDomain = klevu.getGlobalSetting("url.componentUrl",false);
        var scriptToLoad = {
            src: (componentDomain?componentDomain:"https://js.klevu.com/components/") + "shopify/v2/shopify.js"
        }
        data.scriptList.push(scriptToLoad);
    }
}) 
//source/core/kmcModulesLoader/kmcModulesLoaderObjectSettings.js
 

})( klevu );
//source/core/kmcModulesLoader/kmcModulesLoaderEvents.js
klevu.settings.chains.initChain.add(
    {
        name:"kmcModulesLoaderKmcCheck",
        fire: function(data,scope) {

            var powerUp = klevu.getGlobalSetting("powerUp.kmcModulesLoader");
            if((!klevu.isUndefined(powerUp) && powerUp === false)) return;

            var kmcGlobalLoaded = klevu.getGlobalSetting("kmc.loaded");
            if((!klevu.isUndefined(kmcGlobalLoaded) && kmcGlobalLoaded === true)){
                klevu.setObjectPath(data,"powerUp.kmcModulesLoader",true);
            }
        }
    }
);
klevu.settings.chains.initChain.add(
    {
        name:"kmcModulesLoaderPowerUp",
        fire: function(data,scope){

            var apiKey = klevu.getGlobalSetting( "search.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) ;
            if(!klevu.isUndefined(apiKey)){
                var powerUp = klevu.getGlobalSetting("powerUp.kmcModulesLoader");
                if((!klevu.isUndefined(powerUp) && powerUp === false)) return;

                if(powerUp !== true) return;

                klevu.setObjectPath(data,"powerUp.kmcModulesLoader",false);

                var kmcModulesLoader = klevu.getObjectPath( klevu.extensions,"kmcModulesLoader.resourcesLoaded");
                if((!klevu.isUndefined(kmcModulesLoader) && kmcModulesLoader === true)) return;

                klevu.extensions.kmcModulesLoader.loadKmcModules(apiKey);

            }
        }
    }
);
//moiObject
//source/core/moiObject/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/moiObject/moiEvents/moiEvents.js
/* ---------------------------------- MOI EVENTS ---------------------------------- */
klevu.extend({
  moiEvents: {
    filters:{
      moiFiltersClick: function (value,scope){
        klevu.event.attach( value , "click" , function ( event ) {
          event = event || window.event;
          var data = {
            elem: this,
            event: event
          };
          var chain = klevu.moiEvents.filters.moiFiltersClickChain;
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( scope );
            chain.setData( data );
            chain.fire();
          }
        } );
      },
      moiFiltersClickChain: klevu.chain( { stopOnFalse : true } )
    },
    product:{
      moiProductIntent: function (value,scope){
        klevu.event.attach(value, "click", function (event) {
          event = event || window.event;
          var data = {
            elem: this,
            event: event
          };
          var chain = klevu.moiEvents.product.moiProductIntentChain;
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( scope );
            chain.setData( data );
            chain.fire();
          }
        } );
      },
      moiProductIntentChain: klevu.chain( { stopOnFalse : true } ),
      moiProductClick: function (value,scope){
        klevu.event.attach(value, "click", function (event) {
          event = event || window.event;
          var data = {
            elem: this,
            event: event
          };
          var chain = klevu.moiEvents.product.moiProductClickChain;
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( scope );
            chain.setData( data );
            chain.fire();
          }
        });
      },
      moiProductClickChain: klevu.chain( { stopOnFalse : true } )
    },
    menu:{
      moiMenuClick: function (value,scope){
        klevu.event.attach(value, "click", function (event) {
          event = event || window.event;
          var data = {
            elem: this,
            event:event
          };
          var chain = klevu.moiEvents.menu.moiMenuClickChain;
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( scope );
            chain.setData( data );
            chain.fire();
          }
        });
      },
      moiMenuClickChain: klevu.chain( { stopOnFalse : true } ),
      toggleMoiMenu : function( event ) {
        event = event || window.event;
        event.preventDefault();
        if(this.classList.contains(klevu.getSetting(this.moiScope.settings, "settings.moi.activeClass"))){
          klevu.moiEvents.menu.closeMoiMenu(this);
        } else {
          klevu.moiEvents.menu.openMoiMenu(this);
        }
      },
      openMoiMenu: function(scope){
        var element = klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.menuBox"),scope.moiScope.target);
        var clickItem  =  klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.menuBoxButton"),scope.moiScope.target);
        element.classList.add(klevu.getSetting(scope.moiScope.settings, "settings.moi.activeClass"));
        clickItem.classList.add(klevu.getSetting(scope.moiScope.settings, "settings.moi.activeClass"));
      },
      closeMoiMenu: function(scope){
        var element = klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.menuBox"),scope.moiScope.target);
        var clickItem  =  klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.menuBoxButton"),scope.moiScope.target);
        element.classList.remove(klevu.getSetting(scope.moiScope.settings, "settings.moi.activeClass"));
        clickItem.classList.remove(klevu.getSetting(scope.moiScope.settings, "settings.moi.activeClass"));
      },
    },
    buttons:{
      moiButtonsClick: function (value,scope){
        klevu.event.attach(value, "click", function (event) {
          event = event || window.event;
          var data = {
            elem: this,
            event:event
          };
          var chain = klevu.moiEvents.menu.moiMenuClickChain;
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( scope );
            chain.setData( data );
            chain.fire();
          }
        });
      },
      moiButtonsClickChain: klevu.chain( { stopOnFalse : true } )
    },
    forms:{
      moiFormSubmit: function (value,scope){
        klevu.event.attach(value, "submit", function (event) {
          event = event || window.event;
          var dataForChain = {
            elem: this,
            event: event,

          };
          var chain = klevu.moiEvents.forms.moiFormSubmitChain;
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( scope );
            chain.setData( dataForChain );
            chain.fire();
          }
        });
      },
      moiFormSubmitChain: klevu.chain( { stopOnFalse : true } )
    },
    display:{
      fixView:function(scope){
        var chain = klevu.moiEvents.display.fixViewChain;
        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( scope );
          chain.setData( {resize:true} );
          chain.fire();
        }
      },
      fixViewChain:klevu.chain( { stopOnFalse : true } ),
      scrollToBottom:function (event) {
        var container = klevu.dom.getFirst(klevu.getSetting(this.moiScope.settings, "settings.moi.chatList"),this.moiScope.target);
        container.scrollTop = container.scrollHeight;
      },
      openMoi : function( event ) {
        event = event || window.event;
        event.preventDefault();
        var element = this.moiScope.target;
        element.classList.add(klevu.getSetting(this.moiScope.settings, "settings.moi.activeClass"));
        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.display) && !klevu.isUndefined(klevu.moiEvents.display.fixView)) klevu.moiEvents.display.fixView(this.moiScope.element);
      },
      forceOpenMoi: function() {
        var element = klevu.getGlobalSetting("moi.container").moiScope.target;
        element.classList.add(klevu.getSetting(klevu.getGlobalSetting("moi.container").moiScope.settings, "settings.moi.activeClass"));
        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.display) && !klevu.isUndefined(klevu.moiEvents.display.fixView)) klevu.moiEvents.display.fixView(klevu.getGlobalSetting("moi.container").moiScope.element);


        var eventType = "onfocusin" in element ? "focusin" : "focus",
            bubbles = "onfocusin" in element,
            event;

        if ("createEvent" in document) {
          event = document.createEvent("Event");
          event.initEvent(eventType, bubbles, true);
        }
        else if ("Event" in window) {
          event = new Event(eventType, { bubbles: bubbles, cancelable: true });
        }
        if(klevu.getSetting(klevu.getGlobalSetting("moi.container").moiScope.settings, "settings.moi.focusOnActive",false)){
          klevu.dom.getFirst("#message",element).focus();
          klevu.dom.getFirst("#message",element).dispatchEvent(event);
        }
        klevu.moiEvents.init.setState(true);
        klevu.moiEvents.init.setOverrideFocus(true);

      },
      closeMoi: function( event ) {
        event = event || window.event;
        event.preventDefault();
        var element = this.moiScope.target;
        element.classList.remove(klevu.getSetting(this.moiScope.settings, "settings.moi.activeClass"));
      },
      forceCloseMoi:function( ) {
        var element = klevu.getGlobalSetting("moi.container").moiScope.target;
        element.classList.remove(klevu.getSetting(klevu.getGlobalSetting("moi.container").moiScope.settings, "settings.moi.activeClass"));
        klevu.moiEvents.init.setState(false);
        klevu.moiEvents.init.setOverrideFocus(false);
      },
      safeCloseMoi:function( ) {
        klevu.moiEvents.init.setState(false);
        var element = klevu.getGlobalSetting("moi.container").moiScope.target;
        element.classList.remove(klevu.getSetting(klevu.getGlobalSetting("moi.container").moiScope.settings, "settings.moi.activeClass"));
      },
    },
    overlay:{
      init: function(type,renderData,scope){
        renderData = klevu.extend(true,renderData,{settings:{imageLocation:klevu.getGlobalSetting("moi.imageLocation","https://js.klevu.com/components/moi/v2/images")}})
        if(type == "product"){
          klevu.moiEvents.overlay.renderProduct(renderData,scope);
          if(!klevu.isUndefined(klevu.moiEvents.overlay.productShortDesc)) klevu.moiEvents.overlay.productShortDesc(scope);
        }
        if(type == "customerSupport"){
          klevu.moiEvents.overlay.renderCustomerSupport(renderData,scope);
        }
        if(type == "feedback"){
          klevu.moiEvents.overlay.renderFeedback(renderData,scope);
        }
        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.overlay)) klevu.moiEvents.overlay.cancelLink(scope);
        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.overlay)) klevu.moiEvents.overlay.show(scope);
      },
      renderProduct: function(renderData,scope){
        var productContent = klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.productBlockContent" ),renderData);
        scope.moiScope.template.setData( { product : renderData.dataset["id"] } );
        var tpl = scope.moiScope.template.convertTemplate( scope.moiScope.template.render( "productOverlay" ) );
        klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlayProductBlock" ),tpl).innerHTML = productContent.innerHTML;
        klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlayContent" ),scope.moiScope.target).innerHTML = tpl.innerHTML;
        klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.productDirectLink"), klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlayContent" ),scope.moiScope.target)), function (key, value) {
          if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.product)) klevu.moiEvents.product.moiProductClick(value,scope);
        });


      },
      renderCustomerSupport: function(renderData,scope){
        scope.moiScope.template.setData( renderData );
        var tpl = scope.moiScope.template.convertTemplate( scope.moiScope.template.render("customerSupportOverlay") );
        klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlayContent" ),scope.moiScope.target).innerHTML = tpl.innerHTML;
        klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayForm"), klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlayContent" ),scope.moiScope.target)), function (key, value) {
          //fake submit form
          if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.forms)) klevu.moiEvents.forms.moiFormSubmit(value,scope);
        });

      },
      renderFeedback: function(renderData,scope){
        scope.moiScope.template.setData( renderData );
        var tpl = scope.moiScope.template.convertTemplate( scope.moiScope.template.render("feedbackOverlay") );
        klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlayContent" ),scope.moiScope.target).innerHTML = tpl.innerHTML;
        klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayForm"), klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlayContent" ),scope.moiScope.target)), function (key, value) {
          //fake submit form
          if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.forms)) klevu.moiEvents.forms.moiFormSubmit(value,scope);
        });

      },
      cancelLink: function(scope){
        klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayClose"), klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlay" ),scope.moiScope.target)), function (key, value) {
          klevu.event.attach(value, "click", function (event) {
            event.preventDefault();
            if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.overlay)) klevu.moiEvents.overlay.hide(scope);
          });
        });
      },
      hide: function(scope){
        klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlay" ),scope.moiScope.target).style.display ="none";
      },
      show:function(scope){
        klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.overlay" ),scope.moiScope.target).style.display ="block";
      }
    },
    message:{
      submitMessage : function ( event ) {
        event = event || window.event;

        var dataForChain = {
          elem: this,
          event: event,

        };
        var chain = klevu.moiEvents.message.submitMessageChain;
        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( this.moiScope.element );
          chain.setData( dataForChain );
          chain.fire();
        }

      },
      submitMessageChain:klevu.chain( { stopOnFalse : true } ),
      keyUp : function ( event ) {
        event = event || window.event;

        var dataForChain = {
          elem: this,
          event: event,

        };
        var chain = klevu.moiEvents.message.keyUpChain;
        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( this.moiScope.element );
          chain.setData( dataForChain );
          chain.fire();
        }
      } ,
      keyUpChain:klevu.chain( { stopOnFalse : true } ),
    },
    init:{
      setState:function(state){
        klevu({component:{moi:{state:state}}});
        klevu.moiEvents.init.saveStateToStorage(state);
      },
      setOverrideFocus:function(state){
        klevu({component:{moi:{overrideFocus:state}}});
        klevu.moiEvents.init.saveOverrideFocusToStorage(state);
      },
      getState:function(){
        return klevu.getGlobalSetting("component.moi.state",false);
      },
      getOverrideFocus:function(){
        return klevu.getGlobalSetting("component.moi.overrideFocus",false);
      },
      loadDataFromStorage: function(){
        var moiDictionary = klevu.dictionary("moiData");
        moiDictionary.setStorage("session");
        moiDictionary.mergeFromGlobal();
        return moiDictionary;
      },
      saveStateToStorage: function(state){
        var moiDictionary =klevu.moiEvents.init.loadDataFromStorage();
        moiDictionary.addElement("state", state);
        moiDictionary.overrideGlobal();
      },
      saveOverrideFocusToStorage: function(state){
        var moiDictionary =klevu.moiEvents.init.loadDataFromStorage();
        moiDictionary.addElement("overrideFocus", state);
        moiDictionary.overrideGlobal();
      },
      bindTyping: function(moiObject){
        var elementInput = moiObject.getScope().element;
        // bind events of focus in and out
        klevu.event.attach( elementInput , "focus" , klevu.moiEvents.display.scrollToBottom , true );
        klevu.event.attach( elementInput , "blur" , klevu.moiEvents.display.scrollToBottom , true );
        // bind events of key press and paste
        /*
         klevu.event.attach( elementInput , "keyup" , klevu.moiEvents.message.keyUp , true );
         klevu.event.attach( elementInput , "paste" , function ( event ) {
         setTimeout( function () {
         klevu.moiEvents.message.keyUp.call( event.target , event );
         } , 10 );
         } , true );
         */
        if ( elementInput.form ) {
          elementInput.form.moiObject = moiObject;
          elementInput.form.moiScope = elementInput.form.moiObject.getScope();
          elementInput.form.moiElem = elementInput.form.moiObject.getScope().element;
          klevu.event.attach( moiObject.getScope().element.form , "submit" , klevu.moiEvents.message.submitMessage , true );
          //init chat
          klevu.moiEvents.init.initChatHistory(moiObject);
        }
      },
      initChatHistory:function (moiObject){
        var moiHistory = moiObject.getScope().history.getElement("chat");
        if(moiHistory === "chat"){
          moiHistory = new Array();
        } else {
          moiHistory = JSON.parse(moiHistory);
        }
        if(moiHistory.length == 0){
          //make a blank request to get generic message
          klevu.event.fireChain(moiObject.getScope().element.moiScope , "chains.events.send" , moiObject.getScope().element , moiObject.getScope().element.moiScope.data , null );
        } else {
          //start loading the history
          var chain = klevu.getObjectPath( moiObject.getScope().element.moiScope , "chains.process.processLine" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( moiObject.getScope().element );
            klevu.each(moiHistory, function (key, value) {
              if(value.type=="message"){
                var displayData = value.data;
                displayData.fromHistory = true;
                klevu.event.fireChain( moiObject.getScope().element.moiScope , "chains.process.display" , moiObject.getScope().element , displayData , null );
              } else if(value.type=="filter" || value.type=="products"){

                //set up the display data for chain
                value.data.fromHistory = true;
                var lineData =  value.data;
                chain.setData( lineData );
                chain.fire();
              }
            });
          }
          //load the menu last version
          var menuOptions = moiObject.getScope().history.getElement("menuOptions");
          if(menuOptions !== "menuOptions"){
            menuOptions = JSON.parse(menuOptions);
            //set up the display data for chain
            menuOptions.line.fromHistory = true;
            var lineData =  menuOptions;
            chain.setData( lineData );
            chain.fire();
          }
          //load the genericOptions last version
          genericOptions = moiObject.getScope().history.getElement("genericOptions");
          if(genericOptions !== "genericOptions"){
            genericOptions = JSON.parse(genericOptions);
            //set up the display data for chain
            genericOptions.line.fromHistory = true;
            var lineData =  genericOptions;
            chain.setData( lineData );
            chain.fire();
          }

        }
      }
    }
  }
});
 
//source/core/moiObject/moiEvents/moiChains.js
/* ---------------------------------- MOI EVENT CHAINS ---------------------------------- */
klevu.moiEvents.filters.moiFiltersClickChain.add( {
  name : "preverntDefaultSubmission" ,
  fire : function ( data , scope ) {
    data.event.preventDefault();
  }
} );
klevu.moiEvents.filters.moiFiltersClickChain.add( {
  name : "activateFilter" ,
  fire : function ( data , scope ) {
    //activate or deactivate filter so it can be picked up in data collection
    data.elem.classList.toggle( klevu.getSetting(scope.moiScope.settings, "settings.moi.activeClass"));
  }
} );
klevu.moiEvents.filters.moiFiltersClickChain.add( {
  name : "collectData" ,
  fire : function ( data , scope ) {
    scope.moiScope.data = scope.moiObject.resetData();
    var filterValues = [];
    var filterNames = [];
    //extract filter data
    klevu.each( klevu.dom.find( klevu.getSetting( scope.moiScope.settings , "settings.moi.filterAction" ) + ".active" , klevu.dom.helpers.getClosest( data.elem , klevu.getSetting( scope.moiScope.settings , "settings.moi.filters" ) ) ) , function ( key , element ) {
      filterValues.push( element.dataset.value );
      filterNames.push( element.innerHTML );
    } );

    // set up variables in the global options
    scope.moiScope.data.request.filter.value = filterValues.join( ";" );
    // if no options are selected change message
    if ( !scope.moiScope.data.request.filter.value ) {
      scope.moiScope.data.request.message = klevu.dom.helpers.getClosest( data.elem , klevu.getSetting( scope.moiScope.settings , "settings.moi.filters" ) ).dataset[ "chatEmpty" ];
    } else {
      //set message for api
      scope.moiScope.data.request.message = klevu.dom.helpers.getClosest( data.elem , klevu.getSetting( scope.moiScope.settings , "settings.moi.filters" ) ).dataset[ "chat" ].replace( klevu.getSetting( scope.moiScope.settings , "settings.moi.filterSearchReplace" ) , filterNames.join( klevu.getSetting( scope.moiScope.settings , "settings.moi.filterDelimiterWord" ) ) );
    }
    scope.moiScope.data.context.preventDefault = false;
  }
} );
klevu.moiEvents.filters.moiFiltersClickChain.add( {
  name : "printMessage" ,
  fire : function ( data , scope ) {
    //print out message
    var displayData = { displayType : "message" , type : klevu.getSetting( scope.moiScope.settings , "settings.moi.rightClass" ) , message: scope.moiScope.data.request.message , tpl : null };
    klevu.event.fireChain( scope.moiScope , "chains.process.display" , scope.moiScope.element , displayData , data.event );

  }
} );
klevu.moiEvents.filters.moiFiltersClickChain.add( {
  name : "addLoading" ,
  fire : function ( data , scope ) {
    //print out message
    var displayData = { displayType : "loading" , type : klevu.getSetting( scope.moiScope.settings , "settings.moi.leftClass" ) , message: "loading" , tpl : null };
    klevu.event.fireChain( scope.moiScope , "chains.process.display" , scope.moiScope.element , displayData , data.event );
  }
} );
klevu.moiEvents.filters.moiFiltersClickChain.add( {
  name : "send" ,
  fire : function ( data , scope ) {
    //send data to server
    klevu.event.fireChain( scope.moiScope , "chains.events.send" , scope.moiScope.element , scope.moiScope.data , data.event );
  }
} );

klevu.moiEvents.product.moiProductIntentChain.add( {
  name : "preverntDefaultSubmission" ,
  fire : function ( data , scope ) {
    data.event.preventDefault();
  }
} );
klevu.moiEvents.product.moiProductIntentChain.add( {
  name : "quickviewIntent" ,
  fire : function ( data , scope ) {
    if(data.elem.dataset["intent"] === "quick-view"){
      if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.overlay)) klevu.moiEvents.overlay.init("product",klevu.dom.helpers.getClosest( data.elem , klevu.getSetting( scope.moiScope.settings , "settings.moi.productBlock" ) ),scope);
      return false;
    }
  }
} );
klevu.moiEvents.product.moiProductIntentChain.add( {
  name : "collectData" ,
  fire : function ( data , scope ) {
    scope.moiScope.data = scope.moiObject.resetData();
    scope.moiScope.data.request.message = data.elem.dataset["chat"];
    var prodUrl = klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.productDirectLink" ),klevu.dom.helpers.getClosest( data.elem , klevu.getSetting( scope.moiScope.settings , "settings.moi.productBlock" ) ));
    var productBlock = klevu.dom.helpers.getClosest( data.elem , klevu.getSetting( scope.moiScope.settings , "settings.moi.productBlock" ) );
    scope.moiScope.data.request.product = {
      id: productBlock.dataset["id"],
      intent: data.elem.dataset["intent"],
      context: {url:prodUrl.getAttribute('href')}
    };
    scope.moiScope.data.context.preventDefault = false;
  }
} );
klevu.moiEvents.product.moiProductIntentChain.add( {
  name : "printMessage" ,
  fire : function ( data , scope ) {
    //print out message
    var displayData = { displayType : "message" , type : klevu.getSetting( scope.moiScope.settings , "settings.moi.rightClass" ) , message: scope.moiScope.data.request.message , tpl : null };
    klevu.event.fireChain( scope.moiScope , "chains.process.display" , scope.moiScope.element , displayData , data.event );
  }
} );
klevu.moiEvents.product.moiProductIntentChain.add( {
  name : "addLoading" ,
  fire : function ( data , scope ) {
    //print out message
    var displayData = { displayType : "loading" , type : klevu.getSetting( scope.moiScope.settings , "settings.moi.leftClass" ) , message: "loading" , tpl : null };
    klevu.event.fireChain( scope.moiScope , "chains.process.display" , scope.moiScope.element , displayData , data.event );
  }
} );
klevu.moiEvents.product.moiProductIntentChain.add( {
  name : "send" ,
  fire : function ( data , scope ) {
    //send data to server
    klevu.event.fireChain( scope.moiScope , "chains.events.send" , scope.moiScope.element , scope.moiScope.data , data.event );
  }
} );


klevu.moiEvents.product.moiProductClickChain.add( {
  name : "preverntDefaultSubmission" ,
  fire : function ( data , scope ) {
    data.event.preventDefault();
  }
} );
klevu.moiEvents.product.moiProductClickChain.add( {
  name : "collectData" ,
  fire : function ( data , scope ) {
    scope.moiScope.data = scope.moiObject.resetData();
    var prodUrl = klevu.dom.getFirst(klevu.getSetting( scope.moiScope.settings , "settings.moi.productDirectLink" ),klevu.dom.helpers.getClosest( data.elem , klevu.getSetting( scope.moiScope.settings , "settings.moi.productBlock" ) ));
    var productBlock = klevu.dom.helpers.getClosest( data.elem , klevu.getSetting( scope.moiScope.settings , "settings.moi.productBlock" ) );
    scope.moiScope.data.request.product = {
      id: productBlock.dataset["id"],
      intent: "redirect",
      context: {url:prodUrl.getAttribute('href')}
    };
    scope.moiScope.data.context.preventDefault = false;
  }
} );
klevu.moiEvents.product.moiProductClickChain.add( {
  name : "overlayClose" ,
  fire : function ( data , scope ) {
    //overlay close
    if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.overlay)) klevu.moiEvents.overlay.hide(scope);
  }
} );
klevu.moiEvents.product.moiProductClickChain.add( {
  name : "send" ,
  fire : function ( data , scope ) {
    //send data to server
    klevu.event.fireChain( scope.moiScope , "chains.events.send" , scope.moiScope.element , scope.moiScope.data , data.event );
  }
} );

klevu.moiEvents.forms.moiFormSubmitChain.add( {
  name : "preverntDefaultSubmission" ,
  fire : function ( data , scope ) {
    data.event.preventDefault();
  }
} );
klevu.moiEvents.forms.moiFormSubmitChain.add( {
  name : "validation" ,
  fire : function ( data , scope ) {
    var validationPass = true;
    klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayFormItem"), data.elem), function (key, item) {
      item.classList.remove(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayFormInvalid"));
      if(item.dataset.validations !== ""){
        var validations = item.dataset.validations.split("");
        klevu.each(validations, function (key, validation) {
          switch(validation) {
            case "R":
              if(item.value === ""){
                item.classList.add(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayFormInvalid"));
                validationPass = false;
              }
              // not in use because of translation issues
              //klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayFormError"),klevu.dom.getClosest(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayForm"),item)).appendChild("<div class='moiFormError'></div>");
              break;
            case "N":
              if(!klevu.isNumeric(item.value)) {
                item.classList.add(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayFormInvalid"));
                validationPass = false;
              }
              break;
            case "E":
              //language=JSRegexp
              var check = /\S+@\S+\.\S+/;
              if(!check.test(item.value)) {
                item.classList.add(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayFormInvalid"));
                validationPass = false;
              }
              break;
            default:break;
          }
        });

      }

    });
    if(!validationPass) return false;
  }
} );
klevu.moiEvents.forms.moiFormSubmitChain.add( {
  name : "collectData" ,
  fire : function ( data , scope ) {
    scope.moiScope.data = scope.moiObject.resetData();
    var formData = {
      type: data.elem.dataset["type"],
      params:[]
    };
    klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.overlayFormItem"), data.elem), function (key, item) {
      var addElement = true;
      if(item.type == "radio" && item.checked === false) addElement = false;
      if(addElement) {
        formData.params.push({
          key: item.name,
          value: item.value
        });
      }
    });
    scope.moiScope.data.request.form = formData;
    scope.moiScope.data.context.preventDefault = false;
  }
} );
klevu.moiEvents.forms.moiFormSubmitChain.add( {
  name : "closeOverlay" ,
  fire : function ( data , scope ) {
    //overlay close
    if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.overlay)) klevu.moiEvents.overlay.hide(scope);
  }
} );
klevu.moiEvents.forms.moiFormSubmitChain.add( {
  name : "closeMoiMenu" ,
  fire : function ( data , scope ) {
    //menu close
    if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.menu)) klevu.moiEvents.menu.closeMoiMenu(scope);
  }
} );
klevu.moiEvents.forms.moiFormSubmitChain.add( {
  name : "send" ,
  fire : function ( data , scope ) {
    //send data to server
    klevu.event.fireChain( scope.moiScope , "chains.events.send" , scope.moiScope.element , scope.moiScope.data , event );
  }
} );

klevu.moiEvents.display.fixViewChain.add( {
  name : "resizeChat" ,
  fire : function ( data , scope ) {
    // get the buttons and the chat list to calculate the size of the chat window
    var buttonsBox = klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.buttonsBox"),scope.moiScope.target);
    var container = klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.chatList"),scope.moiScope.target);
    if(container.nodeType == 1) {

      container.style.cssText = "min-height: calc(100% - "+buttonsBox.offsetHeight+"px);height: calc(100% - "+buttonsBox.offsetHeight+"px);";
      container.scrollTop = container.scrollHeight;
    }
  }
} );

klevu.moiEvents.menu.moiMenuClickChain.add( {
  name : "preverntDefaultSubmission" ,
  fire : function ( data , scope ) {
    data.event.preventDefault();
  }
} );
klevu.moiEvents.menu.moiMenuClickChain.add( {
  name : "message" ,
  fire : function ( data , scope ) {
    if(data.elem.dataset.action === "message"){
      scope.moiScope.data = scope.moiObject.resetData();
      scope.moiScope.data.request.message = data.elem.dataset["chat"];
      scope.moiScope.data.context.preventDefault = false;
      //print out message
      var displayData = { displayType : "message" , type : klevu.getSetting( scope.moiScope.settings , "settings.moi.rightClass" ) , message: scope.moiScope.data.request.message , tpl : null };
      klevu.event.fireChain( scope.moiScope , "chains.process.display" , scope.moiScope.element , displayData , data.event );
      var displayDataLoading = { displayType : "loading" , type : klevu.getSetting( scope.moiScope.settings , "settings.moi.leftClass" ) , message: scope.moiScope.data.request.message , tpl : null };
      klevu.event.fireChain( scope.moiScope , "chains.process.display" , scope.moiScope.element , displayDataLoading , data.event );
      klevu.event.fireChain( scope.moiScope , "chains.events.send" , scope.moiScope.element , scope.moiScope.data , data.event );
    }
  }
} );
klevu.moiEvents.menu.moiMenuClickChain.add( {
  name : "clearChat" ,
  fire : function ( data , scope ) {
    if(data.elem.dataset.action === "clearChat"){
      scope.moiScope.data = scope.moiObject.resetData();
      scope.moiScope.data.request.message = data.elem.dataset["chat"];
      //print out message
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.actions" );

      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );
        var actionData = { type : "clearChat" , context : {value:true} };
        chain.setData( actionData );
        chain.fire();

      }
    }
  }
} );
klevu.moiEvents.menu.moiMenuClickChain.add( {
  name : "customerSupport" ,
  fire : function ( data , scope ) {
    if(data.elem.dataset.action === "customerSupport"){
      var options = JSON.parse(decodeURIComponent(data.elem.dataset.options));
      var dataToSend = {
        chat: data.elem.dataset.chat,
        type: data.elem.dataset.action
      };
      if(klevu.isArray(options) && options.length >0){
        klevu.each(options,function(index,line) {
          if(line.key){
            dataToSend[line.key] = {
              value: line.value,
              validations: line.validations,
              key: line.key
            }
          }
        });

        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.overlay)) klevu.moiEvents.overlay.init("customerSupport",dataToSend,scope);

      }

    }
  }
} );
klevu.moiEvents.menu.moiMenuClickChain.add( {
  name : "feedback" ,
  fire : function ( data , scope ) {
    if(data.elem.dataset.action === "feedback"){
      var options = JSON.parse(decodeURIComponent(data.elem.dataset.options));
      var dataToSend = {
        chat: data.elem.dataset.chat,
        type: data.elem.dataset.action
      };
      if(klevu.isArray(options) && options.length >0){
        klevu.each(options,function(index,line) {
          if(line.key){
            dataToSend[line.key] = {
              value: line.value,
              validations: line.validations,
              key: line.key
            }
          }
        });

        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.overlay)) klevu.moiEvents.overlay.init("feedback",dataToSend,scope);

      }

    }
  }
} );
klevu.moiEvents.menu.moiMenuClickChain.add( {
  name : "closeMenu" ,
  fire : function ( data , scope ) {
    if(data.elem.dataset.action !== "feedback" && data.elem.dataset.action !== "customerSupport"){
      if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.menu)) klevu.moiEvents.menu.closeMoiMenu(scope);
    }
  }
} );




klevu.moiEvents.buttons.moiButtonsClickChain.add( {
  name : "preverntDefaultSubmission" ,
  fire : function ( data , scope ) {
    data.event.preventDefault();
  }
} );
klevu.moiEvents.buttons.moiButtonsClickChain.add( {
  name : "collectData" ,
  fire : function ( data , scope ) {
    scope.moiScope.data = scope.moiObject.resetData();
    scope.moiScope.data.request.message = data.elem.dataset["chat"];
    scope.moiScope.data.context.preventDefault = false;
  }
} );
klevu.moiEvents.buttons.moiButtonsClickChain.add( {
  name : "printMessage" ,
  fire : function ( data , scope ) {
    //print out message
    var displayData = { displayType : "message" , type : klevu.getSetting( scope.moiScope.settings , "settings.moi.rightClass" ) , message: scope.moiScope.data.request.message , tpl : null };
    klevu.event.fireChain( scope.moiScope , "chains.process.display" , scope.moiScope.element , displayData , data.event );
  }
} );
klevu.moiEvents.buttons.moiButtonsClickChain.add( {
  name : "message" ,
  fire : function ( data , scope ) {
    if(data.elem.dataset.action === "message"){
      klevu.event.fireChain( scope.moiScope , "chains.events.send" , scope.moiScope.element , scope.moiScope.data , data.event );
    }
  }
} );
klevu.moiEvents.buttons.moiButtonsClickChain.add( {
  name : "clearChat" ,
  fire : function ( data , scope ) {
    if(data.elem.dataset.action === "clearChat"){
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.actions" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );
        var actionData = { type : "clearChat" , context : {value:true} };
        chain.setData( actionData );
        chain.fire();

      }
    }
  }
} );




klevu.moiEvents.message.submitMessageChain.add( {
  name : "preverntDefaultSubmission" ,
  fire : function ( data , scope ) {
    data.event.preventDefault();
  }
} );
klevu.moiEvents.message.submitMessageChain.add( {
  name : "closeOverlay" ,
  fire : function ( data , scope ) {
    if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.overlay)) klevu.moiEvents.overlay.hide(scope);
  }
} );
klevu.moiEvents.message.submitMessageChain.add( {
  name : "checkForEmpty" ,
  fire : function ( data , scope ) {
    if(data.elem.moiScope.element.value === "") return false;
  }
} );
klevu.moiEvents.message.submitMessageChain.add( {
  name : "collectData" ,
  fire : function ( data , scope ) {
    scope.moiScope.data = scope.moiObject.resetData();
    scope.moiScope.data.request.message = data.elem.moiScope.element.value;
    scope.moiScope.data.context.preventDefault = false;
    scope.moiScope.element.value = "";
  }
} );
klevu.moiEvents.message.submitMessageChain.add( {
  name : "printMessage" ,
  fire : function ( data , scope ) {
    //print out message
    var displayData = { displayType : "message" , type : klevu.getSetting( scope.moiScope.settings , "settings.moi.rightClass" ) , message: scope.moiScope.data.request.message , tpl : null };
    klevu.event.fireChain( scope.moiScope , "chains.process.display" , scope.moiScope.element , displayData , data.event );
  }
} );
klevu.moiEvents.message.submitMessageChain.add( {
  name : "addLoading" ,
  fire : function ( data , scope ) {
    //print out message
    var displayData = { displayType : "loading" , type : klevu.getSetting( scope.moiScope.settings , "settings.moi.leftClass" ) , message: "loading" , tpl : null };
    klevu.event.fireChain( scope.moiScope , "chains.process.display" , scope.moiScope.element , displayData , data.event );
  }
} );
klevu.moiEvents.message.submitMessageChain.add( {
  name : "send" ,
  fire : function ( data , scope ) {
    //send data to server
    klevu.event.fireChain( scope.moiScope , "chains.events.send" , scope.moiScope.element , scope.moiScope.data , data.event );
  }
} );

 
//source/core/moiObject/moiObject.js
//moiObjectBuild base function extension
klevu.extend({
  moiObjectBuild:function () {
    var localVariables = {
      settings:{}
    };

    klevu.setObjectPath(localVariables,"id",klevu.randomId());
    //
    klevu.setObjectPath(localVariables,"history",klevu.dictionary("moiCache"));
    localVariables.history.setStorage("session");
    localVariables.history.mergeFromGlobal();
    klevu.setSetting( localVariables.settings , "settings.moi.lastMessage" , (klevu.time.timestamp() - 3600) );
    //get session from storage
    if(localVariables.history.getElement("sessionId") !== "sessionId") klevu.setSetting( localVariables.settings , "settings.moi.sessionId" , localVariables.history.getElement("sessionId") );

    // init the template
    klevu.setObjectPath( localVariables , "template" , klevu.template() );

    /*    AJAX   */
    klevu.setObjectPath( localVariables , "chains.actions.doMoi" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.actions.finalise" , klevu.chain( { stopOnFalse : true } ) );

    // event
    klevu.setObjectPath( localVariables , "chains.events.send" , klevu.chain( { stopOnFalse : true } ) );

    /*    REQUEST   */
    // general
    klevu.setObjectPath( localVariables , "chains.request.control" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.request.build" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.request.send" , klevu.chain( { stopOnFalse : true } ) );
    //ajax
    klevu.setObjectPath( localVariables , "chains.request.ajax.send" , klevu.chain( { stopOnFalse : true } ) );
    /*    RESPONSE   */
    // ajax
    klevu.setObjectPath( localVariables , "chains.response.success" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.response.done" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.response.fail" , klevu.chain( { stopOnFalse : true } ) );
    /*    Processors   */
    //
    klevu.setObjectPath( localVariables , "chains.process.display" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.process.events" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.process.processLine" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.process.render" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.process.actions" , klevu.chain( { stopOnFalse : true } ) );


    function init(selfObj){
      localVariables.element = document.createElement("input");
      localVariables.element.moiObject = selfObj;
      localVariables.element.moiScope = localVariables;
      localVariables.element.moiElem = localVariables.element;
    }
    function resetData(){
      var tempData = buildData();
      localVariables.data.context = tempData.context;
      localVariables.data.request = tempData.request;
      localVariables.data.response = tempData.response;
      localVariables.data.scope = null;
      return localVariables.data;
    }
    function buildData(){
      var data = {
        context:{
          klevuApiKey:null
        },
        request: {
          context:{
            sessionId:null,
            klevuApiKey:null
          },
          message : null ,
          filter : {} ,
          product : {},
          form:{}
        },
        response:{
          current : {
          }
        },
        scope:{}
      };
      return data;
    }
    localVariables.data = buildData();


    var selfObj = {
      init:init,
      resetData:resetData,
      buildData:buildData,
      // scope:localVariables,
      setScope:function(variables){
        localVariables = variables;
        return localVariables;
      },
      getScope:function(){
        return localVariables;
      }
    };
    init(selfObj);
    return selfObj;
  }

});
 
//source/core/moiObject/moiObjectSettings.js
//moiObjectSettings
//setup defaults for moi object settings
var options = {
  moi : {
    dateDelay: 900,
    redirectDelay:2000,
    focusOnActive:false,
    moiTarget: '.moiContainer',
    chatList: '#chat',
    inputBox: '#message',
    buttonsBox: '.moiButtons',
    activateButton: '.toggleMoi',
    menuBox: '.moiMenu',
    menuBoxButton: '.toggleMoiMenu',
    products:'div.moiProductSlider',
    productAction: 'a.action',
    productBlock: '.moiProductBlock',
    productBlockContent: '.moiProductContent',
    productDirectLink: 'a.kumoiProductitem',
    productLink: '.moiProductlinks',
    productSlider: '.moiProductSlidesContainer',
    productSlide: '.moiSlides',
    productSliderArrow: '.moiSliderArrowNav',
    productSliderDots: '.moiSliderdot',
    filters:'div.kumoifilterList',
    filterAction: 'a.kumoifiltername',
    buttonAction: 'a.kumoifiltername',
    menuAction: 'a.moi-menuOption',
    leftClass: 'fromkumoi',
    rightClass: 'fromUser',
    filterDelimiterWord: ' and ',
    filterSearchReplace: "$VALUE$",
    overlay: '.kumoiOverlay',
    overlayContent: '.kumoiOverlayContent',
    overlayProductBlock: '.moiQuickViewProductBlock',
    overlayClose: '.kumoiOverlayClose',
    closeChat: '.Kumoi-Closeicon',
    cancelChat: '.ksMoiCancelIcon',
    overlayForm: '.moiQuickViewFormContent',
    overlayFormItem: '.moiQuickViewFormField',
    overlayFormError: '.moiQuickViewFormErrors',
    overlayFormInvalid: 'invalid',
    overlayProductShortDesc:".moiProductShortDesc",
    overlayProductShortDescActive:"ksMoiOpenText",
    activeClass:'active',
    inactiveClass:'inactive',
    disabledClass:'disabled',
  }
};

klevu( options ); 
//source/core/moiObject/moiEvents/moiEventsActivate.js
//moiObjectActivate
klevu.extensions.kmcModulesLoader.listOfModules.add({
  name:"moiScript",
  fire:function(data,scope){
    var moiEnabled = klevu.search.modules.kmcInputs.base.getDataPath("klevu_moi.enabled",false);
    if(!moiEnabled) return;
    var moiTheme =  klevu.getGlobalSetting("moi.theme",false);
    if(!moiTheme){
      var componentDomain = klevu.getGlobalSetting("url.componentUrl",false);
      var scriptToLoad = {
        src: (componentDomain?componentDomain:"https://js.klevu.com/components/") + "moi/v2/moi.js"
      }
      data.scriptList.push(scriptToLoad);
    } else {
      var scriptToLoad = {
        src: moiTheme
      }
      data.scriptList.push(scriptToLoad);
    }

  }
}); 

})( klevu );
//source/core/moiObject/moiObjectBuild.js
//moiObjectBuild base element
(function ( klevu ) {
  var baseMoi = klevu.moiObjectBuild();

  
//source/core/moiObject/chains/actions/doMoi.js
// chains/actions/doMoi.js

baseMoi.getScope().chains.actions.doMoi.add( {
  name : "doRequest" ,
  fire : function ( data , scope ) {
    data.context.doRequest = false;
    var chain = klevu.getObjectPath( scope.moiScope , "chains.request.control" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.moiElem );
      chain.setData( data );
      chain.fire();
      scope.moiScope.data = data;
    } else {
      data.context.preventDefault = true;
      scope.moiScope.data = data;
      return false;
    }
  }
} );

 
//source/core/moiObject/chains/events/send.js


// chains/events/send.js
baseMoi.getScope().chains.events.send.add({
  name: "generateURL",
  fire: function (data, scope) {
    var moiUrl = klevu.getSetting(scope.moiScope.settings, "settings.url.moi", false);
    if (moiUrl) {
      data.context.url = moiUrl;
    } else {
      return false;
    }
  }
});
baseMoi.getScope().chains.events.send.add({
  name: "addApiKey",
  fire: function (data, scope) {
    var apiKey = klevu.getSetting(scope.moiScope.settings, "settings.moi.apiKey",klevu.getGlobalSetting( "moi.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )));
    if (!klevu.isUndefined(apiKey)) {
      data.context.apiKey = apiKey;
      data.request.context.klevuApiKey = apiKey;
    } else {
      return false;
    }
    var sessionKey = klevu.getSetting(scope.moiScope.settings, "settings.moi.sessionId", false);
    if (sessionKey) {
      data.request.context.sessionId = sessionKey;
    }
  }
});


baseMoi.getScope().chains.events.send.add({
  name: "doMoi",
  fire: function (data, scope) {
    var chain = klevu.getObjectPath(scope.moiScope, "chains.actions.doMoi");

    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
      chain.setScope(scope.moiElem);
      chain.setData(data);
      chain.fire();
    }
    scope.moiScope.data = data;
    if (data.context.preventDefault === true) return false;
  }
});

 
//source/core/moiObject/chains/request/ajax/send.js

// chains/request/ajax/send.js
baseMoi.getScope().chains.request.ajax.send.add( {
  name : "sendRequest" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction !== "moiAjaxV1" ) return;
    data.scope = scope;
    if ( data.context.doRequest ) {
      klevu.ajax({
        url: data.context.url,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        type : "POST",
        data: JSON.stringify(data.request),
        crossDomain : true ,
        success : function ( klXHR ) {
          var chain = klevu.getObjectPath( klXHR.requestDetails.scope.moiScope , "chains.response.success" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( klXHR.requestDetails.scope.moiElem );
            klXHR.requestDetails.response = klXHR.responseObj.data.data;
            klXHR.requestDetails.context.status = klXHR.status;
            klXHR.requestDetails.context.isSuccess = klXHR.isSuccess;
            chain.setData( klXHR.requestDetails );
            chain.fire();
          }
        } ,
        done : function ( klXHR ) {
          var chain = klevu.getObjectPath( klXHR.requestDetails.scope.moiScope , "chains.response.done" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( klXHR.requestDetails.scope.moiElem );
            klXHR.requestDetails.response = klXHR.responseObj.data.data;
            klXHR.requestDetails.context.status = klXHR.status;
            klXHR.requestDetails.context.isSuccess = klXHR.isSuccess;
            chain.setData( klXHR.requestDetails );
            chain.fire();
          }
        } ,
        error : function ( klXHR ) {
          var chain = klevu.getObjectPath( klXHR.requestDetails.scope.moiScope , "chains.response.fail" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( klXHR.requestDetails.scope.moiElem );
            klXHR.requestDetails.response = {};
            klXHR.requestDetails.context.status = klXHR.status;
            klXHR.requestDetails.context.isSuccess = klXHR.isSuccess;
            chain.setData( klXHR.requestDetails );
            chain.fire();
          }
        } ,
        requestDetails : data
      });
    } else {
      

    }

  }
} );



 
//source/core/moiObject/chains/request/control.js

// chains/request/control.js
baseMoi.getScope().chains.request.control.add( {
  name : "initRequest" ,
  fire : function ( data , scope ) {
    data.context.doRequest = false;
    var chain = klevu.getObjectPath( scope.moiScope , "chains.request.build" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.moiElem );
      chain.setData( data );
      chain.fire();
      scope.moiScope.data = data;
      if ( data.context.doRequest === false ) return false;
    } else {
      data.context.preventDefault = true;
      scope.moiScope.data = data;
      return false;
    }
  }
} );

baseMoi.getScope().chains.request.control.add( {
  name : "sanitiseRequestSuggestions" ,
  fire : function ( data , scope ) {
    var requestObj = klevu.clean( data.request );


    data.request = requestObj;
  }
} );

baseMoi.getScope().chains.request.control.add( {
  name : "makeRequest" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.moiScope , "chains.request.send" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.moiElem );
      chain.setData( data );
      chain.fire();
      scope.moiScope.data = data;
      return false;
    }
  }
} );
 
//source/core/moiObject/chains/request/build.js
// chains/request/buildRequest.js
baseMoi.getScope().chains.request.build.add( {
  name : "buildMap" ,
  fire : function ( data , scope ) {
    data.context.status = null;
    data.context.isSuccess = false;
    data.context.doRequest = true;
  }
} );
 
//source/core/moiObject/chains/request/send.js
// chains/request/send.js
baseMoi.getScope().chains.request.send.add({
  name: "requestTypeAjaxV1",
  fire: function (data, scope) {
    data.context.eventAction = "moiAjaxV1";
  }
});


baseMoi.getScope().chains.request.send.add({
  name: "requestTypeAjaxSendV1",
  fire: function (data, scope) {
    if (data.context.eventAction === "moiAjaxV1") {
      var chain = klevu.getObjectPath(scope.moiScope, "chains.request.ajax.send");
      if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
        chain.setScope(scope.moiElem);
        chain.setData(data);
        chain.fire();
        scope.moiScope.data = data;
        return false;
      }
    }
  }
}); 
//source/core/moiObject/chains/response/success.js
// chains/response/success.js
baseMoi.getScope().chains.response.success.add( {
  name : "checkForSuccess" ,
  fire : function ( data , scope ) {
    scope.moiScope.data = data;
    if ( data.context.isSuccess === false ) {
      
      return false;
    }
    data.response = data.response;
    
  }
} );

baseMoi.getScope().chains.response.success.add( {
  name : "removeLoading" ,
  fire : function ( data , scope ) {
    if(typeof klevu.dom.getFirst(".loadingRow",scope.moiScope.target).innerHTML !== "undefined"){
      klevu.dom.helpers.getClosest(klevu.dom.getFirst(".loadingRow",scope.moiScope.target),".klevuWrap").remove()
    }

  }
} );
baseMoi.getScope().chains.response.success.add( {
  name : "processByType" ,
  fire : function ( data , scope ) {

    var buttonsBox = klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.buttonsBox"),scope.moiScope.target);
    if(buttonsBox.nodeType == 1) {
      buttonsBox.innerHTML = "";
    }
    var menuBox = klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.menuBox"),scope.moiScope.target);
    if(menuBox.nodeType == 1) {
      menuBox.innerHTML = "";
    }

    klevu.each(data.response,function(index,line) {
      if(typeof line === 'object') {

        //get the display chain
        var chain = klevu.getObjectPath( scope.moiScope , "chains.process.processLine" );

        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( scope.moiElem );
          //set up the display data for chain
          var lineData = {
            line: line
          };
          chain.setData( lineData );
          chain.fire();
        }

      }
    });
  }
} );

 
//source/core/moiObject/chains/process/actions.js
// chains/process/actions.js
baseMoi.getScope().chains.process.actions.add( {
  name : "clearChat" ,
  fire : function ( data , scope ) {
    if(data.type === "clearChat"){
      if(data.context.value == true){
        var targetElements = klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.chatList")+"> div",scope.moiScope.target);
        klevu.each(targetElements,function (key, elem) {
          elem.parentNode.removeChild(elem);
        });
      }
    }
  }
} );


baseMoi.getScope().chains.process.actions.add( {
  name : "redirectToUrl" ,
  fire : function ( data , scope ) {
    if(data.type === "redirectToUrl"){
      if(data.context.link !== null){
        setTimeout(function() {
          window.location.href = data.context.link;
        }, klevu.getSetting(scope.moiScope.settings, "settings.moi.redirectDelay",2000));
      }
    }
  }
} );

baseMoi.getScope().chains.process.actions.add( {
  name : "openMenu" ,
  fire : function ( data , scope ) {
    if(data.type === "openMenu"){
      if(data.context.value == true){
        klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.menuBoxButton"),scope.moiScope.target).click();
      }
    }
  }
} );


baseMoi.getScope().chains.process.actions.add( {
  name : "closeChat" ,
  fire : function ( data , scope ) {
    if(data.type === "closeChat"){
      if(data.context.value == true){
        klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.closeChat"),scope.moiScope.target).click();
      }
    }
  }
} );

baseMoi.getScope().chains.process.actions.add( {
  name : "purgeHistory" ,
  fire : function ( data , scope ) {
    if(data.type === "purgeHistory"){
      if(data.context.value == true){
        var moiHistory = scope.moiScope.history.getElement("chat");
        //check if history exists
        if(moiHistory === "chat"){
          moiHistory = new Array();
        } else {
          moiHistory = JSON.parse(moiHistory);
        }
        moiHistory = moiHistory.slice(0,2);
        scope.moiScope.history.addElement("chat",JSON.stringify(moiHistory));
        scope.moiScope.history.mergeToGlobal();
        var targetElements = klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.chatList")+"> div",scope.moiScope.target);
        var elementSize = targetElements.length;
        klevu.each(targetElements,function (key, elem) {
          if((elementSize-2) > key){
            elem.parentNode.removeChild(elem);
          }
        });
      }
    }
  }
} );



 
//source/core/moiObject/chains/process/display.js
// chains/process/display.js
baseMoi.getScope().chains.process.display.add( {
  name : "displayDate" ,
  fire : function ( data , scope ) {
    if ( data.displayType === "message" || data.displayType === "filter" || data.displayType === "product") {
      //get date of last message
      var lastMessage = klevu.getSetting( scope.moiScope.settings , "settings.moi.lastMessage",0);
      if(!("date" in data)) {
        data.date = klevu.time.timestamp();
      }
      //set the last message date to current message date
      klevu.setSetting( scope.moiScope.settings , "settings.moi.lastMessage",data.date);
      if ( (lastMessage+klevu.getSetting( scope.moiScope.settings , "settings.moi.dateDelay")) <  (data.date) ) {
        //init the date object
        var messageDate = new Date(data.date *1000);
        //data for the template
        scope.moiScope.template.setData( {  message : messageDate.toLocaleDateString("default",{
            month: "short",
            day: "numeric",
            year: "numeric"
          }) + " "+ messageDate.toLocaleTimeString() } );
        //generate template and prepare data for render
        var renderData = {
          type : "line" ,
          tpl : scope.moiScope.template.convertTemplate( scope.moiScope.template.render( "date" ) )
        };
        // render the line
        var chain = klevu.getObjectPath( scope.moiScope , "chains.process.render" );

        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( scope.moiElem );

          chain.setData( renderData );
          chain.fire();
        }
      }
    }
  }
} );
baseMoi.getScope().chains.process.display.add( {
  name : "displayMessage" ,
  fire : function ( data , scope ) {
    if ( data.displayType === "message" ) {
      //data for the template
      scope.moiScope.template.setData( { className : data.type , message : data.message,note: data.note } );
      //generate template and prepare data for render
      var renderData = {
        type : "line" ,
        tpl : scope.moiScope.template.convertTemplate( scope.moiScope.template.render( "message" ) )
      };
      // render the line
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.render" );

      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );

        chain.setData( renderData );
        chain.fire();
      }
    }

  }
} );
baseMoi.getScope().chains.process.display.add( {
  name : "displayLoading" ,
  fire : function ( data , scope ) {
    if ( data.displayType === "loading" ) {
      //data for the template
      scope.moiScope.template.setData( { className : data.type , message : data.message } );
      //generate template and prepare data for render
      var renderData = {
        type : "line" ,
        tpl : scope.moiScope.template.convertTemplate( scope.moiScope.template.render( "loading" ) )
      };
      // render the line
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.render" );

      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );

        chain.setData( renderData );
        chain.fire();
      }
    }

  }
} );
baseMoi.getScope().chains.process.display.add( {
  name : "displayFilters" ,
  fire : function ( data , scope ) {
    if ( data.displayType === "filter" ) {
      //data for the template
      scope.moiScope.template.setData( {
        className : klevu.getSetting( scope.moiScope.settings , "settings.moi.leftClass" , false ) ,
        message : data.filter.settings.label ,
        options : data.filter.options ,
        chatValue : data.filter.settings[ "chatFormat" ] ,
        chatEmptyValue : data.filter.settings[ "chatFormatEmpty" ],
        note: data.note
      } );
      //generate template and prepare data for render
      var renderData = {
        type : "line" ,
        tpl : scope.moiScope.template.convertTemplate( scope.moiScope.template.render( "filters" ) )
      };
      // render the line
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.render" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );
        chain.setData( renderData );
        chain.fire();
      }
      data.tpl = renderData.tpl;

    }

  }
} );
baseMoi.getScope().chains.process.display.add( {
  name : "displayProducts" ,
  fire : function ( data , scope ) {
    if ( data.displayType === "product" ) {
      //data for the template
      scope.moiScope.template.setData( {
        className : klevu.getSetting( scope.moiScope.settings , "settings.moi.leftClass" , false ) ,
        products:data.products,
        note: data.note
      } );
      //generate template and prepare data for render
      var renderData = {
        type : "line" ,
        tpl : scope.moiScope.template.convertTemplate( scope.moiScope.template.render( "product" ) )
      };

      //if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.slider)) klevu.moiEvents.slider.init(renderData,scope);

      // render the line
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.render" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );

        chain.setData( renderData );
        chain.fire();
      }
      data.tpl = renderData.tpl;

    }

  }
} );
baseMoi.getScope().chains.process.display.add( {
  name : "displayMenu" ,
  fire : function ( data , scope ) {
    if ( data.displayType === "menu" ) {
      //data for the template
      scope.moiScope.template.setData({
        buttons:data.options
      });
      //generate template and prepare data for render
      var renderData = {
        type : "menu" ,
        optionCount: data.options.length,
        tpl : scope.moiScope.template.convertTemplate( scope.moiScope.template.render( "menu" ) )
      };
      // render the line
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.render" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );

        chain.setData( renderData );
        chain.fire();
      }
      data.tpl = renderData.tpl;

    }
  }
} );
baseMoi.getScope().chains.process.display.add( {
  name : "displayButtons" ,
  fire : function ( data , scope ) {
    if ( data.displayType === "buttons" ) {
      //data for the template
      scope.moiScope.template.setData({
        buttons:data.options
      });
      //generate template and prepare data for render
      var renderData = {
        type : "buttons" ,
        optionCount: data.options.length,
        tpl : scope.moiScope.template.convertTemplate( scope.moiScope.template.render( "buttons" ) )
      };
      // render the line
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.render" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );

        chain.setData( renderData );
        chain.fire();
      }
      data.tpl = renderData.tpl;

    }
  }
} );
baseMoi.getScope().chains.process.display.add( {
  name : "saveHistory" ,
  fire : function ( data , scope ) {
    if(data.fromHistory !== true ){
      if ( data.displayType === "message" ) {
        var moiHistory = scope.moiScope.history.getElement("chat");
        //check if history exist
        if(moiHistory === "chat"){
          moiHistory = new Array();
        } else {
          moiHistory = JSON.parse(moiHistory);
        }
        data.date = klevu.time.timestamp();
        moiHistory.push({type:"message",from: data.type,data:data});
        scope.moiScope.history.addElement("chat",JSON.stringify(moiHistory));
        scope.moiScope.history.mergeToGlobal();
      }
    }
  }
} ); 
//source/core/moiObject/chains/process/events.js
// chains/process/events.js
baseMoi.getScope().chains.process.events.add( {
  name : "filters" ,
  fire : function ( data , scope ) {
    if ( data.eventType === "filter" ) {
      // save the session value for future use
      klevu.each( klevu.dom.find( klevu.getSetting( scope.moiScope.settings , "settings.moi.filterAction" ) , data.tpl ) , function ( key , value ) {
        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.filters)) klevu.moiEvents.filters.moiFiltersClick(value,scope);
      } );
    }
  }
} );
baseMoi.getScope().chains.process.events.add( {
  name : "products" ,
  fire : function ( data , scope ) {
    if ( data.eventType === "product" ) {
      // link product intents
      klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.productAction"), data.tpl), function (key, value) {
        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.product)) klevu.moiEvents.product.moiProductIntent(value,scope);
      });
      //link product clicks
      klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.productDirectLink"), data.tpl), function (key, value) {
        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.product)) klevu.moiEvents.product.moiProductClick(value,scope);
      });
    }
  }
} );
baseMoi.getScope().chains.process.events.add( {
  name : "menu" ,
  fire : function ( data , scope ) {
    if ( data.eventType === "menu" ) {
      // save the session value for future use
      klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.menuAction"), data.tpl), function (key, value) {
        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.menu)) klevu.moiEvents.menu.moiMenuClick(value,scope);
      });
    }
  }
} );
baseMoi.getScope().chains.process.events.add( {
  name : "buttons" ,
  fire : function ( data , scope ) {
    if ( data.eventType === "buttons" ) {
      // save the session value for future use
      klevu.each(klevu.dom.find(klevu.getSetting(scope.moiScope.settings, "settings.moi.buttonAction"), data.tpl), function (key, value) {
        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.buttons)) klevu.moiEvents.buttons.moiButtonsClick(value,scope);
      });
    }
  }
} ); 
//source/core/moiObject/chains/process/render.js
// chains/process/render.js
baseMoi.getScope().chains.process.render.add( {
  name : "renderLine" ,
  fire : function ( data , scope ) {
    if(data.type === "line"){
      var container = klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.chatList"),scope.moiScope.target);
      if(container.nodeType == 1) {
        container.appendChild(data.tpl);
        container.scrollTop = container.scrollHeight;
        return true;
      }
      return false;
    }

  }
} );
baseMoi.getScope().chains.process.render.add( {
  name : "renderMenu" ,
  fire : function ( data , scope ) {
    if(data.type === "menu"){
      var menuBox = klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.menuBox"),scope.moiScope.target);
      var menuBoxButton = klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.menuBoxButton"),scope.moiScope.target);
      if(menuBox.nodeType == 1) {
        if(data.optionCount==0) {
          menuBoxButton.classList.add(klevu.getSetting(scope.moiScope.settings, "settings.moi.disabledClass"));
        } else {
          menuBoxButton.classList.remove(klevu.getSetting(scope.moiScope.settings, "settings.moi.disabledClass"));
        }
        menuBox.appendChild(data.tpl);
        data.tpl = menuBox;
      }
    }

  }
} );
baseMoi.getScope().chains.process.render.add( {
  name : "renderButtons" ,
  fire : function ( data , scope ) {
    if(data.type === "buttons"){
      var buttonsBox = klevu.dom.getFirst(klevu.getSetting(scope.moiScope.settings, "settings.moi.buttonsBox"),scope.moiScope.target);
      if(buttonsBox.nodeType == 1) {
        if(data.optionCount>0) {
          buttonsBox.classList.add(klevu.getSetting(scope.moiScope.settings, "settings.moi.activeClass"));
        } else {
          buttonsBox.classList.remove(klevu.getSetting(scope.moiScope.settings, "settings.moi.activeClass"));
        }
        buttonsBox.appendChild(data.tpl);
        if(!klevu.isUndefined(klevu.moiEvents) && !klevu.isUndefined(klevu.moiEvents.display) && !klevu.isUndefined(klevu.moiEvents.display.fixView)) klevu.moiEvents.display.fixView(scope);
        data.tpl = buttonsBox;
      }
    }

  }
} );
 
//source/core/moiObject/chains/process/processLine.js
// chains/process/processLine.js
baseMoi.getScope().chains.process.processLine.add( {
  name : "initDate" ,
  fire : function ( data , scope ) {
    // save the session value for future use
    if(!("date" in data.line)) data.line.date = klevu.time.timestamp();

  }
} );



baseMoi.getScope().chains.process.processLine.add( {
  name : "context" ,
  fire : function ( data , scope ) {
    if ("context" in  data.line) {
      // save the session value for future use
      if ( !klevu.isUndefined( data.line.context.sessionId ) ) {
        klevu.setSetting( scope.moiScope.settings , "settings.moi.sessionId" , data.line.context.sessionId );
      }
    }
  }
} );

baseMoi.getScope().chains.process.processLine.add( {
  name : "message" ,
  fire : function ( data , scope ) {
    if ("message" in  data.line) {
      // render the response line
      if ( data.line.message.type === "text" ) {
        //get the display chain
        var chain = klevu.getObjectPath( scope.moiScope , "chains.process.display" );

        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( scope.moiElem );
          //init date

          //set up the display data for chain
          var displayData = {
            displayType : "message" ,
            type : klevu.getSetting( scope.moiScope.settings , "settings.moi.leftClass" ) ,
            message : data.line.message.value ,
            note: data.line.message.note,
            date: data.line.date,
            tpl : null
          };
          chain.setData( displayData );
          chain.fire();
        }
      }
    }
  }
} );

baseMoi.getScope().chains.process.processLine.add( {
  name : "filter" ,
  fire : function ( data , scope ) {
    if ("filter" in  data.line) {
      //render the filter response
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.display" );

      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );
        //set up the display data for chain
        var displayData = {
          displayType : "filter" ,
          filter : data.line.filter ,
          note: data.line.filter.note,
          date: data.line.date,
          tpl : null
        };
        chain.setData( displayData );
        chain.fire();

        chain = klevu.getObjectPath( scope.moiScope , "chains.process.events" );

        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( scope.moiElem );
          var eventData = { eventType : "filter" , filter : data.line.filter , tpl : displayData.tpl };
          chain.setData( eventData );
          chain.fire();

        }
      }

    }
  }
} );


baseMoi.getScope().chains.process.processLine.add( {
  name : "products" ,
  fire : function ( data , scope ) {
    if ("productData" in  data.line) {
      //render the filter response
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.display" );

      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );
        //set up the display data for chain
        var displayData = {
          displayType : "product" ,
          products : data.line.productData.products ,
          note: data.line.productData.note,
          date: data.line.date,
          tpl : null
        };
        chain.setData( displayData );
        chain.fire();

        chain = klevu.getObjectPath( scope.moiScope , "chains.process.events" );

        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( scope.moiElem );
          var eventData = { eventType : "product" , products : data.line.productData.products , tpl : displayData.tpl };
          chain.setData( eventData );
          chain.fire();

        }
      }

    }
  }
} );


baseMoi.getScope().chains.process.processLine.add( {
  name : "menu" ,
  fire : function ( data , scope ) {
    if ("menuOptions" in  data.line) {
      //render the filter response
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.display" );

      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );
        //set up the display data for chain
        var displayData = { displayType : "menu" , options : data.line.menuOptions.options , tpl : null };
        chain.setData( displayData );
        chain.fire();

        chain = klevu.getObjectPath( scope.moiScope , "chains.process.events" );

        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( scope.moiElem );
          var eventData = { eventType : "menu" , options : data.line.menuOptions.options , tpl : displayData.tpl };
          chain.setData( eventData );
          chain.fire();

        }
      }

    }
  }
} );

baseMoi.getScope().chains.process.processLine.add( {
  name : "buttons" ,
  fire : function ( data , scope ) {
    if ("genericOptions" in  data.line) {
      //render the filter response
      var chain = klevu.getObjectPath( scope.moiScope , "chains.process.display" );

      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.moiElem );
        //set up the display data for chain
        var displayData = { displayType : "buttons" , options : data.line.genericOptions.options , tpl : null };
        chain.setData( displayData );
        chain.fire();

        chain = klevu.getObjectPath( scope.moiScope , "chains.process.events" );

        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( scope.moiElem );
          var eventData = { eventType : "buttons" , options : data.line.genericOptions.options , tpl : displayData.tpl };
          chain.setData( eventData );
          chain.fire();

        }
      }

    }
  }
} );

baseMoi.getScope().chains.process.processLine.add( {
  name : "actions" ,
  fire : function ( data , scope ) {
    if ("actions" in  data.line) {
      //render the filter response
      if(data.line.actions.actions.length) { //todo: remove double actions
        klevu.each(data.line.actions.actions,function(index,line) {
          var chain = klevu.getObjectPath( scope.moiScope , "chains.process.actions" );

          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( scope.moiElem );
            var actionData = { type : line.type , context : line.context };
            chain.setData( actionData );
            chain.fire();

          }
        });
      }
    }
  }
} );





baseMoi.getScope().chains.process.processLine.add( {
  name : "saveHistory" ,
  fire : function ( data , scope ) {
    //check history length
    if(data.fromHistory !== true ){
      var moiHistory = scope.moiScope.history.getElement("chat");
      //check if history exists
      if(moiHistory === "chat"){
        moiHistory = new Array();
      } else {
        moiHistory = JSON.parse(moiHistory);
      }
      if ("context" in  data.line) {
        // save the session value for future use
        if ( !klevu.isUndefined( data.line.context.sessionId ) ) {
          scope.moiScope.history.addElement("sessionId",data.line.context.sessionId);
        }
      }
      if ("menuOptions" in  data.line) {
        scope.moiScope.history.addElement("menuOptions",JSON.stringify(data));
      }
      if ("genericOptions" in  data.line) {
        scope.moiScope.history.addElement("genericOptions",JSON.stringify(data));
      }
      if ("filter" in  data.line) {
        moiHistory.push({type:"filter",from:  klevu.getSetting( scope.moiScope.settings , "settings.moi.leftClass" ),data:data});
      }
      if ("productData" in  data.line) {
        moiHistory.push({type:"products",from:  klevu.getSetting( scope.moiScope.settings , "settings.moi.leftClass" ),data:data});
      }
      if(moiHistory.length > 100) moiHistory.splice(0,10);
      scope.moiScope.history.addElement("chat",JSON.stringify(moiHistory));
      scope.moiScope.history.mergeToGlobal();
    }
  }
} );

 

  klevu.moi = {
    base : baseMoi
  };

  klevu.moi.build = true;

})( klevu );
//nlpObject
//source/core/nlpObject/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/nlpObject/nlpObject.js
klevu.extend(true,klevu, {
    component:{
        nlp: {
            varsion: "1.0.0",
            utility: {
                /**
                 *  NLP requester for annotations - interface
                 *   @param {object} data - main object containing the request details
                 *   @param {object} data.settings - contains settings that will be used to build the request
                 *   @param {string} data.settings.url - url to be called
                 *   @param {string} data.settings.apiKey - apiKey to be used
                 *   @param {object} data.data - main object containing the request payload to be send
                 *   @param {object} data.callbacks - main object containing the request callbacks
                 *   @param {array} data.callbacks.success - array of callbacks in object format {fire:function(){}}
                 *   @param {array} data.callbacks.fail - array of callbacks in object format {fire:function(){}}
                 */
                sendAnnotationsRequest: function(data){
                    data.type = "annotations";
                    klevu.component.nlp.utility.getByType(data);
                },
                /**
                 *  NLP requester global list
                 *   @param {object} settings - main object containing the request details
                 *   @param {object} settings.settings - contains settings that will be used to build the request
                 *   @param {string} settings.settings.url - url to be called
                 *   @param {string} settings.settings.apiKey - apiKey to be used
                 *   @param {object} settings.data - main object containing the request payload to be send
                 *   @param {object} settings.callbacks - main object containing the request callbacks
                 *   @param {array} settings.callbacks.success - array of callbacks in object format {fire:function(){}}
                 *   @param {array} settings.callbacks.fail - array of callbacks in object format {fire:function(){}}
                 */
                getByType: function(settings){
                    var chain = klevu.getObjectPath(klevu.component.nlp,"utility.chains.getByType");
                    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
                        chain.setScope({});
                        chain.setData(settings);
                        chain.fire();
                    }

                },
                chains:{
                    getByType: klevu.chain({stopOnFalse:true})
                }
            }
        }
    }
});
klevu.extend(true,klevu.support,{
    nlp : true
}); 
//source/core/nlpObject/chains/annotations.js
klevu.component.nlp.utility.chains.getByType.add(
    {
        name:"getAnnotationsData",
        /**
         *  NLP requester for annotations - processor
         *  @param {object} scope - scope of the execution
         *   @param {object} data - main object containing the request details
         *   @param {object} data.settings - contains settings that will be used to build the request
         *   @param {string} data.settings.url - url to be called
         *   @param {string} data.settings.apiKey - apiKey to be used
         *   @param {object} data.data - main object containing the request payload to be send
         *   @param {object} data.callbacks - main object containing the request callbacks
         *   @param {array} data.callbacks.success - array of callbacks in object format {fire:function(){}}
         *   @param {array} data.callbacks.fail - array of callbacks in object format {fire:function(){}}
         */
        fire: function(data,scope) {

            if(data.type === "annotations"){
                // we extract api key from source data
                var apiKey = klevu.getObjectPath(data,"settings.apiKey",klevu.getGlobalSetting("search.apiKey",klevu.getGlobalSetting( "global.apiKey" ,false)));
                // if no api key is found we can not continue
                if(!apiKey) return;
                // get url from settings or default url
                var url = klevu.getObjectPath(data,"settings.url","https://nlp-services.ksearchnet.com/"+apiKey+"/annotations");

                // validate that required data is added
                if(klevu.isUndefined(data.data) || klevu.isUndefined(data.data.query) ) {
                    
                    return;
                }
                if(klevu.isUndefined(data.data) || klevu.isUndefined(data.data.title) ) {
                    
                    return;
                }
                if(klevu.isUndefined(data.data) || klevu.isUndefined(data.data.category) ) {
                    
                    return;
                }
                if(klevu.isUndefined(data.data) || klevu.isUndefined(data.data.languageCode) ) {
                    
                    return;
                }
                // build the options for request
                var options = {
                    url: url,
                    data:{
                        "query":encodeURIComponent(data.data.query),
                        "title":encodeURIComponent(data.data.title),
                        "category":encodeURIComponent(data.data.category),
                        "languageCode":data.data.languageCode
                    }

                };
                // add callbacks if any where send
                if(!klevu.isUndefined(data.callbacks)){
                    options.callbacks = data.callbacks;
                }
                // build request details( to be send back once the request completes
                var requestDetails = {
                    options: options,
                    settings:data.settings,
                    callbacks:{
                        success:function (data, requestDetails, status, isSuccess) {
                            
                            var params = [{
                                status:status,
                                isSuccess:isSuccess,
                                requestDetails:requestDetails,
                                data:data
                            }];
                            if ( klevu.getObjectPath(requestDetails.options,"callbacks.success",[]).length>0 ) {
                                klevu.each(requestDetails.options.callbacks.success, function(key,callbackObject){
                                    callbackObject.fire.apply(this, params);
                                });
                            }
                        },
                        error:function (requestDetails, status, isSuccess) {
                            
                            var params = [{
                                status:status,
                                isSuccess:isSuccess,
                                requestDetails:requestDetails
                            }];
                            if ( klevu.getObjectPath(requestDetails.options,"callbacks.error",[]).length>0 ) {
                                klevu.each(requestDetails.options.callbacks.error , function(key,callbackObject){
                                    callbackObject.fire.apply(this, params);
                                });
                            }
                        }
                    }
                };

                // build the fetch request object
                var requestObject = {
                    url: options.url+"?"+klevu.queryString( options.data ),
                    type: klevu.getGlobalSetting("component.nlp.annotations.sendMethod","FETCH"),
                    method: "GET",
                    crossDomain: true,
                    mimeType : "application/json; charset=UTF-8" ,
                    contentType : "application/json; charset=utf-8"
                };

                // for fetch
                requestObject.success = requestDetails.callbacks.success;
                requestObject.error = requestDetails.callbacks.error;
                
                klevu.request(requestObject, requestDetails);


            }



        }
    }
); 

})( klevu );
//abTest
//source/core/abTest/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/abTest/abObject.js
// abTestObject
    var abTest = {
        markAllResourcesLoaded: function (setOnPage){
            if ( klevu.isUndefined( setOnPage ) ) setOnPage = true;
            // mark the resources as loaded
            klevu.extensions.abTest.resourcesLoaded = true;
            
            if (typeof klevu_processABTestInputData === "function") {
                klevu_processABTestInputData();
            }

            if(setOnPage) klevu.extensions.abTest.base.processData();
        },
        processData:function(){
            var apiKey = klevu.getGlobalSetting( "search.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) ;
            var abTestDictionary = klevu.getObjectPath(klevu.extensions, "abTest.abtestDictionary");
            var abTestDataLoaded = JSON.parse(abTestDictionary.getElement(apiKey));

            // abtest catnav
            var catNav = {};
            if(!klevu.isEmptyObject(abTestDataLoaded["CAT_NAV"])){
                klevu.each(abTestDataLoaded["CAT_NAV"],function(key,value){
                    catNav[value["sourceId"].toLowerCase()] = value;
                });
            }
            klevu.extensions.abTest.catnav = catNav;
        },
        loadCallBack: function (data,options) {
            var abTestDictionary = klevu.getObjectPath(klevu.extensions, "abTest.abtestDictionary");
            var abTestDataLoaded = abTestDictionary.getElement(options.apiKey);

            if(!klevu.isUndefined(data.assigned) && data.assigned.length >0){
                data = data.assigned;
                var newData = {
                    "CAT_NAV": {},
                    "RECS":{},
                    "SEARCH":{}
                };
                klevu.each(data,function(key,value){
                    value["clicked"] = false;
                    value["send"] = false;
                    switch (value["type"]){
                        case "CAT_NAV": newData["CAT_NAV"][value["abTestId"]+value["sourceId"].toLowerCase()] = value;
                            break;
                        case "RECS": newData["RECS"][value["abTestId"]+value["sourceId"]] = value;
                            break;
                        case "SEARCH": newData["SEARCH"][value["abTestId"]+value["sourceId"]] = value;
                            break;
                    }
                });
                if(abTestDataLoaded === options.apiKey){
                    // abTest data not there first load of first file
                    abTestDataLoaded = newData;
                } else {
                    // abTest there , update it
                    abTestDataLoaded = JSON.parse(abTestDataLoaded);
                    //first keep the status of clicks
                    if(!klevu.isEmptyObject(abTestDataLoaded["CAT_NAV"])){
                        klevu.each(abTestDataLoaded["CAT_NAV"],function(key,value){
                            if(!klevu.isUndefined(value["clicked"]) && value["clicked"] === true && !klevu.isUndefined(newData["CAT_NAV"][value["abTestId"]+value["sourceId"].toLowerCase()])){
                                newData["CAT_NAV"][value["abTestId"]+value["sourceId"].toLowerCase()]["clicked"] = value["clicked"];
                                newData["CAT_NAV"][value["abTestId"]+value["sourceId"].toLowerCase()]["abTestVariantId"] = value["abTestVariantId"];
                            }
                            if(!klevu.isUndefined(value["send"]) && value["send"] === true && !klevu.isUndefined(newData["CAT_NAV"][value["abTestId"]+value["sourceId"].toLowerCase()])){
                                newData["CAT_NAV"][value["abTestId"]+value["sourceId"].toLowerCase()]["send"] = value["send"];
                            }
                        });
                    }
                    if(!klevu.isEmptyObject(abTestDataLoaded["RECS"])){
                        klevu.each(abTestDataLoaded["RECS"],function(key,value){
                            if(!klevu.isUndefined(value["clicked"]) && value["clicked"] === true && !klevu.isUndefined(newData["RECS"][value["abTestId"]+value["sourceId"]])){
                                newData["RECS"][value["abTestId"]+value["sourceId"]]["clicked"] = value["clicked"];
                                newData["RECS"][value["abTestId"]+value["sourceId"]]["abTestVariantId"] = value["abTestVariantId"];
                            }
                            if(!klevu.isUndefined(value["send"]) && value["send"] === true && !klevu.isUndefined(newData["RECS"][value["abTestId"]+value["sourceId"]])){
                                newData["RECS"][value["abTestId"]+value["sourceId"]]["send"] = value["send"];
                            }
                        });
                    }
                    if(!klevu.isEmptyObject(abTestDataLoaded["SEARCH"])){
                        klevu.each(abTestDataLoaded["SEARCH"],function(key,value){
                            if(!klevu.isUndefined(value["clicked"]) && value["clicked"] === true && !klevu.isUndefined(newData["SEARCH"][value["abTestId"]+value["sourceId"]])){
                                newData["SEARCH"][value["abTestId"]+value["sourceId"]]["clicked"] = value["clicked"];
                                newData["SEARCH"][value["abTestId"]+value["sourceId"]]["abTestVariantId"] = value["abTestVariantId"];
                            }
                            if(!klevu.isUndefined(value["send"]) && value["send"] === true && !klevu.isUndefined(newData["SEARCH"][value["abTestId"]+value["sourceId"]])){
                                newData["SEARCH"][value["abTestId"]+value["sourceId"]]["send"] = value["send"];
                            }
                        });
                    }

                    abTestDataLoaded = newData;
                }
            }
            //update the load time , to be used on invalidation
            abTestDataLoaded.timeOfLoad = klevu.time.timestamp();
            //update the dictionary data
            abTestDictionary.addElement(options.apiKey,JSON.stringify(abTestDataLoaded));
            abTestDictionary.overrideGlobal();

            if (klevu.extensions.abTest.loadCounter === options.totalToLoad) {
                //check if abTest data is already set, if not set it
                var abTestData = klevu.getObjectPath(klevu.extensions,"abTest.abTestData");
                if(klevu.isUndefined(abTestData)){
                    klevu.extensions.abTest.abTestData = JSON.parse(abTestDictionary.getElement(options.apiKey));
                }

                klevu.extensions.abTest.base.markAllResourcesLoaded(false);
            }
        },
        loadAbTestData: function(apiKey){
            klevu.extensions.abTest.resourceLoadInitiated = true;
            klevu.extensions.abTest.loadCounter = 0;

            var abTestDataURL = klevu.search.modules.kmcInputs.base.getDataPath("klevu_apiDomain");
            if(klevu.isUndefined(abTestDataURL)){ return; }
            var importScripts = [{
                id: apiKey,
                src: "https://" +abTestDataURL +"/abtest/public/allocation/" + apiKey,
            }
            ];

            importScripts.forEach(function (scriptObj) {
                var options = {
                    url: scriptObj.src,
                    type: "json",
                    mimeType: "application/json",
                    apiKey: apiKey,
                    totalToLoad: importScripts.length
                };

                var requestDetails = {
                    success: function (data, options, status, isSuccess) {
                        klevu.extensions.abTest.loadCounter++;
                        klevu.extensions.abTest.base.loadCallBack(data,options);

                    },
                    error: function (data, options, status, isSuccess) {
                        klevu.extensions.abTest.loadCounter++;
                        klevu.extensions.abTest.base.loadCallBack(data,options);
                    },
                    options: options
                };
                var requestObject = {
                    url: options.url,
                    type: "FETCH",
                    method: "POST",
                    mimeType: options.mimeType,
                    crossDomain: true
                };

                //for fetch
                requestObject.success = function (data, requestDetails, status, isSuccess) {
                    requestDetails.success(data, requestDetails.options, status, isSuccess);
                };
                requestObject.error = function (requestDetails, status, isSuccess) {
                    requestDetails.error({}, requestDetails.options, status, isSuccess);
                };
                klevu.request(requestObject, requestDetails);
            });
        },
        /**
         * general function to get data
         */
        getDataPath: function (path){
            var abTestData = klevu.getObjectPath(klevu.extensions,"abTest.abTestData."+path);
            var windowData;
            if(window){
                windowData = klevu.getInterfaceObjectPath(window,path);
            }
           return (!klevu.isUndefined(windowData))?windowData:abTestData;
        },
        setClickedEvent: function(abTestString,type){
            var apiKey = klevu.getGlobalSetting( "search.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) ;
            var abTestDictionary = klevu.getObjectPath(klevu.extensions, "abTest.abtestDictionary");
            var abTestDataLoaded = JSON.parse(abTestDictionary.getElement(apiKey));
            if( !klevu.isUndefined(abTestDataLoaded[type]) && !klevu.isEmptyObject(abTestDataLoaded[type]) && !klevu.isUndefined(abTestDataLoaded[type][abTestString])){
                abTestDataLoaded[type][abTestString]["clicked"] = true;
                abTestDictionary.addElement(apiKey,JSON.stringify(abTestDataLoaded));
                abTestDictionary.overrideGlobal();
            }
        },
        usageTrack:function(abTestString,type){
            var apiKey = klevu.getGlobalSetting( "search.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) ;
            var abTestDictionary = klevu.getObjectPath(klevu.extensions, "abTest.abtestDictionary");
            var abTestDataLoaded = JSON.parse(abTestDictionary.getElement(apiKey));
            var dataToSend = {};
            if( !klevu.isUndefined(abTestDataLoaded[type]) && !klevu.isEmptyObject(abTestDataLoaded[type]) && !klevu.isUndefined(abTestDataLoaded[type][abTestString]) && abTestDataLoaded[type][abTestString]["send"] === false && abTestDataLoaded[type][abTestString]["clicked"] === true){
                dataToSend = {
                    "sourceId": abTestDataLoaded[type][abTestString]["sourceId"],
                    "abTestId": abTestDataLoaded[type][abTestString]["abTestId"],
                    "abTestVariantId": abTestDataLoaded[type][abTestString]["abTestVariantId"],
                    "type": abTestDataLoaded[type][abTestString]["type"],
                };

            } else {
                return;
            }
            var abTestDataURL = klevu.search.modules.kmcInputs.base.getDataPath("klevu_apiDomain");
            if(klevu.isUndefined(abTestDataURL)){ return; }
            var options = {
                url: "https://" + abTestDataURL + "/abtest/public/usage/" + apiKey,
                type: "json",
                mimeType: "application/json",
                data:JSON.stringify( dataToSend ) ,
            };

            var requestDetails = {
                success: function (data, options, status, isSuccess) {
                    //set flag to already send

                    var apiKey = klevu.getGlobalSetting( "search.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) ;
                    var abTestDictionary = klevu.getObjectPath(klevu.extensions, "abTest.abtestDictionary");
                    var abTestDataLoaded = JSON.parse(abTestDictionary.getElement(apiKey));
                    var dataSend = JSON.parse(options.data);
                    if( !klevu.isUndefined(abTestDataLoaded[dataSend.type]) && !klevu.isEmptyObject(abTestDataLoaded[dataSend.type]) && !klevu.isUndefined(abTestDataLoaded[dataSend.type][dataSend.abTestId+dataSend.sourceId.toLowerCase()])){
                        if(parseInt(status) === 204){
                            delete abTestDataLoaded[dataSend.type][dataSend.abTestId+dataSend.sourceId.toLowerCase()];
                            if(klevu.getObjectPath(klevu.extensions,"abTest.catnav."+(dataSend.sourceId.toLowerCase()), false) !== false){
                                delete klevu.extensions.abTest.catnav[dataSend.sourceId.toLowerCase()];
                            }
                        } else {
                            abTestDataLoaded[dataSend.type][dataSend.abTestId+dataSend.sourceId.toLowerCase()]["send"] = true;
                        }
                        abTestDictionary.addElement(apiKey,JSON.stringify(abTestDataLoaded));
                        abTestDictionary.overrideGlobal();

                    }
                    
                },
                error: function (data, options, status, isSuccess) {
                    
                },
                options: options
            };
            var requestObject = {
                url: options.url,
                type: "FETCH",
                method: "POST",
                data:options.data,
                mimeType: options.mimeType,
                crossDomain: true
            };

            //for fetch
            requestObject.success = function (data, requestDetails, status, isSuccess) {
                requestDetails.success(data, requestDetails.options, status, isSuccess);
            };
            requestObject.error = function (requestDetails, status, isSuccess) {
                requestDetails.error({}, requestDetails.options, status, isSuccess);
            };
            klevu.request(requestObject, requestDetails);

        }
    };




 
//source/core/abTest/abObjectBuild.js

klevu.extend(true, klevu, {
    extensions: {
        abTest: {
            base: abTest,
            build: true,
            resourcesLoaded: false,
            resourceLoadInitiated: false
        }
    }
}); 
//source/core/abTest/abObjectSettings.js
//abTestDefaultSettings
var options = {

};

klevu( options );
klevu.extend(true,klevu.support,{
    abTest : true
}); 

})( klevu );
//source/core/abTest/abEvents.js
klevu.settings.chains.initChain.add(
    {
        name:"abTestKmcCheck",
        fire: function(data,scope) {

            var powerUp = klevu.getGlobalSetting("powerUp.abTest");
            if((!klevu.isUndefined(powerUp) && powerUp === false)) return;

            var kmcGlobalLoaded = klevu.getGlobalSetting("kmc.loaded");
            if((!klevu.isUndefined(kmcGlobalLoaded) && kmcGlobalLoaded === true)){
                var kmcAbFlag = klevu.search.modules.kmcInputs.base.getDataPath("klevu_abTestActive");
                if(typeof kmcAbFlag !== 'undefined' && (JSON.parse(kmcAbFlag) === true)){
                    klevu.setObjectPath(data,"powerUp.abTest",true);
                } else {
                    var abtestDictionary = klevu.dictionary("abTest");
                    abtestDictionary.setStorage("local");
                    abtestDictionary.overrideGlobal();
                }
            }
        }
    }
);
klevu.settings.chains.initChain.add(
    {
        name:"abTestPowerUp",
        fire: function(data,scope){

            var apiKey = klevu.getGlobalSetting( "search.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) ;
            if(!klevu.isUndefined(apiKey)){
                var powerUp = klevu.getGlobalSetting("powerUp.abTest");
                if((!klevu.isUndefined(powerUp) && powerUp === false)) return;

                if(powerUp !== true) return;

                var abLoaded = klevu.getObjectPath( klevu.extensions,"abTest.resourcesLoaded");
                if((!klevu.isUndefined(abLoaded) && abLoaded === true)) return;


                
                //check for abTest cached data
                var abtestDictionary = klevu.getObjectPath(klevu.extensions,"abTest.abtestDictionary");
                if(klevu.isUndefined(abtestDictionary)){
                    abtestDictionary = klevu.dictionary("abTest");
                    abtestDictionary.setStorage("local");
                    abtestDictionary.mergeFromGlobal();
                    klevu.setObjectPath(klevu.extensions,"abTest.abtestDictionary",abtestDictionary);
                    
                }

                var abTestData = abtestDictionary.getElement(apiKey);
                var abTestRefresh = true;
                //check if we have data
                if(apiKey !== abTestData){
                    abTestData = JSON.parse(abTestData);
                    var timestampExpiration = abTestData.timeOfLoad  + parseInt(klevu.getGlobalSetting("abTest.invalidateInterval",1200));
                    if(timestampExpiration > klevu.time.timestamp()){
                        //set a refresh
                        abTestRefresh = false;
                    } else {
                        // use loaded data
                        klevu.extensions.abTest.base.processData();
                    }
                    // even if it expired set the data , use it on current page
                    klevu.setObjectPath(klevu.extensions,"abTest.abTestData",abTestData);
                    
                }


                if(abTestRefresh){
                    var abTestLoading = klevu.getObjectPath(klevu.extensions,"abTest.resourceLoadInitiated");

                    if((klevu.isUndefined(abTestLoading) || abTestLoading === false)){
                        // load the files
                        klevu.extensions.abTest.base.loadAbTestData(apiKey);
                        
                    }
                } else {
                    
                    klevu.extensions.abTest.base.markAllResourcesLoaded();
                }
            }
        }
    }
);

klevu.analytics.base.getScope().chains.events.catview.addBefore("viewRequestCheck",{
    name: "addABTest",
    fire: function (data, scope) {
        var abTest = klevu.getObjectPath(data.request.analytics,"klevu_abTestId",false);
        var abTestSource = klevu.getObjectPath(data.request.analytics,"klevu_abTestSource",false);
        delete data.request.analytics['klevu_abTestSource'];
        if(abTest && abTestSource){
          klevu.extensions.abTest.base.usageTrack(abTest+abTestSource,"CAT_NAV");
        }

    }
});
//imageUpload
//source/core/imageUpload/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/imageUpload/imageUploadObject.js
// image Upload object
var imageUpload = {
    submit: function(settings){
        var chain = klevu.getObjectPath(klevu.modules,"imageUpload.base.chains.submitFormChain");
        if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
            chain.setScope({});
            chain.setData(settings);
            chain.fire();
        }

    },
    chains:{
        submitChain: klevu.chain({stopOnFalse:true}),
        submitFormChain: klevu.chain({stopOnFalse:true}),
    }
};




 
//source/core/imageUpload/imageUploadObjectBuild.js
klevu.extend(true, klevu, {
    modules: {
        imageUpload: {
            base: imageUpload
        }
    }
}); 
//source/core/imageUpload/chains/submit.js
klevu.modules.imageUpload.base.chains.submitChain.add(
    {
        name:"submitController",
        fire: function(data,scope) {

            var type = klevu.getObjectPath(data,"type","");
            switch (type) {
                case "form":
                    var chain = klevu.modules.imageUpload.base.submitFormChain;
                    if (!klevu.isUndefined(chain) && chain.list().length !== 0) {
                        chain.setScope(scope);
                        chain.setData(data);
                        chain.fire();
                    }
                    break;
                default: break;
            }
        }
    }
); 
//source/core/imageUpload/chains/submitForm.js
klevu.modules.imageUpload.base.chains.submitFormChain.add(
    {
        name:"submitForm",
        fire: function(data,scope) {

            var url = klevu.getGlobalSetting("url.imageUpload","https://api.ksearchnet.com/image/store/");
            var apiKey = klevu.getGlobalSetting( "search.apiKey" ,klevu.getGlobalSetting( "global.apiKey" ));
            var options = {
                url: url+apiKey,
                data:data
            };

            var requestDetails = {
                options: options,
                callbacks:{
                    success:function (data, requestDetails, status, isSuccess) {
                        var successCallback = klevu.getObjectPath(requestDetails.options,"data.callbacks.success",false);
                        var scope = klevu.getObjectPath(requestDetails.options,"data.scope",false);

                        data.status = status;
                        data.isSuccess = isSuccess;
                        if(successCallback && scope && !klevu.isUndefined(data.url)){
                            var chainSuccess = klevu.getObjectPath( scope.kScope , successCallback );
                            if (!klevu.isUndefined(chainSuccess) && chainSuccess.list().length !== 0) {
                                chainSuccess.setScope(scope.kElem);
                                chainSuccess.setData(data);
                                chainSuccess.fire();
                            }
                        } else {
                            var errorCallback = klevu.getObjectPath(requestDetails.options,"data.callbacks.error",false);

                            if(errorCallback && scope){
                                var chainError = klevu.getObjectPath( scope.kScope , errorCallback );
                                if (!klevu.isUndefined(chainError) && chainError.list().length !== 0) {
                                    chainError.setScope(scope.kElem);
                                    chainError.setData(data);
                                    chainError.fire();
                                }
                            }
                        }
                    },
                    error:function (requestDetails, status, isSuccess) {
                        var errorCallback = klevu.getObjectPath(requestDetails.options,"data.callbacks.error",false);
                        var scope = klevu.getObjectPath(requestDetails.options,"data.scope",false);

                        data.status = status;
                        data.isSuccess = isSuccess;
                        if(errorCallback && scope){
                            var chainError = klevu.getObjectPath( scope.kScope , errorCallback );
                            if (!klevu.isUndefined(chainError) && chainError.list().length !== 0) {
                                chainError.setScope(scope.kElem);
                                chainError.setData(data);
                                chainError.fire();
                            }
                        }
                    }
                }
            };

            var formData = new FormData();
            formData.append('image', data.source.files[0]);

            var requestObject = {
                url: options.url,
                type: "FETCH",
                method: "POST",
                crossDomain: true,
                processData:false,
                contentType:false,
                data:formData
            };

            //for fetch
            requestObject.success = requestDetails.callbacks.success;
            requestObject.error = requestDetails.callbacks.error;
            klevu.request(requestObject, requestDetails);
        }
    }
); 
//source/core/imageUpload/imageUploadObjectSettings.js
klevu.extend(true, klevu, {
    modules: {
        imageUpload: {
            build: true
        }
    }
});

var options = {
    modules:{
        imageUpload: {
            build: true
        }
    }
};
klevu( options );
klevu.extend(true,klevu.support,{
    imageUpload : true
}); 

})( klevu );
//source/core/imageUpload/imageUploadEvents.js
klevu.settings.chains.initChain.add(
    {
        name:"imageUploadKmcCheck",
        fire: function(data,scope) {

            var powerUp = klevu.getGlobalSetting("powerUp.imageUpload");
            if(!klevu.isUndefined(powerUp)) return;

            var kmcGlobalLoaded = klevu.getGlobalSetting("kmc.loaded");
            if((!klevu.isUndefined(kmcGlobalLoaded) && kmcGlobalLoaded === true)){
                var kmcImageSearchFlag = klevu.search.modules.kmcInputs.base.getDataPath("klevu_imageSearchActive");
                if(typeof kmcImageSearchFlag !== 'undefined' && (JSON.parse(kmcImageSearchFlag) === true)){
                    //set flags if the browser does support form data and fetch
                    if(typeof FormData === "function" && window.fetch) {
                        klevu.setObjectPath(data,"powerUp.imageUpload",true);
                        klevu.setObjectPath(data,"theme.modules.imageSearch.enable",true);
                        return;
                    }
                    //stop powerup if  browser does not support form data and fetch
                    klevu.setObjectPath(data,"powerUp.imageUpload",false);
                    klevu.setObjectPath(data,"theme.modules.imageSearch.enable",false);

                }
            }
        }
    }
);
//pagebuildObject
//source/core/pagebuildObject/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/pagebuildObject/pagebuildEvents.js
klevu.extend({
  pbEvents: {}
});
klevu.extend(true, klevu.pbEvents, {
  init:{

    build:{
      name : "init-pb" ,
      fire : function () {
        var data = {
          elem: klevu.pb.base
        };
        var chain = klevu.pbEvents.init.buildChain;
        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( klevu.pb.base.getScope().element );
          chain.setData( data );
          chain.fire();
        }
      }
    },
    buildChain: klevu.chain( { stopOnFalse : true } )
  },
  request:{
    done: function(options){
      options.scope.pbObject.removeActiveFile();
      var filesLeft = klevu.getSetting(options.scope.pbScope.settings, "settings.pagebuild.activeFiles",0);
      if(filesLeft===0){
        klevu.event.fireChain( options.scope.pbScope , options.scope.pbScope.data.executeAfter , options.scope.pbScope.element , options.scope.pbScope.data , null );
      }

    }

  }
}); 
//source/core/pagebuildObject/pagebuildEventsChains.js
klevu.pbEvents.init.buildChain.add( {
  name : "checkUrlOverides" ,
  fire : function ( data , scope ) {
    // check for overrides from the url
    var overrideSettings = klevu.getAllUrlParameters();
    if ( overrideSettings.length > 0 ) {
      klevu.each( overrideSettings , function ( key , elem ) {
        if ( elem.name.startsWith( "klib_" ) ) {
          elem.name = elem.name.replace( "klib_" , "" ).replace( new RegExp( /_/ , "g" ) , "." );
          klevu.setSetting( scope.pbScope.settings , "settings."+elem.name , elem.value );
        }
      } );
    }
  }
} );
klevu.pbEvents.init.buildChain.add( {
  name : "powerUp" ,
  fire : function ( data , scope ) {
    klevu.event.fireChain( scope.pbScope , "chains.coreLoad" , scope.pbScope.element , scope.pbScope.data , null );
  }
} ); 
//source/core/pagebuildObject/pagebuildEventsActivate.js
klevu.coreEvent.build( {
  name : "buildPb" , fire : function () {

    return !(!klevu.getSetting( klevu.settings , "settings.pagebuild.activate" , false ) || !klevu.getSetting( klevu.settings , "settings.localSettings" , false ) || !klevu.getSetting( klevu.settings , "settings.powerUp.pageBuilder" , false ));
  }
} );
klevu.coreEvent.attach( "buildPb" , klevu.extend( true , {} , klevu.pbEvents.init.build ) ); 
//source/core/pagebuildObject/pagebuildObject.js
klevu.extend( {
  pbObjectBuild : function () {
    var localVariables = {
      settings : {
      }
    };

    klevu.setObjectPath( localVariables , "id" , klevu.randomId() );

    // executed on load
    klevu.setObjectPath( localVariables , "chains.coreLoad" , klevu.chain( { stopOnFalse : true } ) );
    klevu.setObjectPath( localVariables , "chains.extraLoad" , klevu.chain( { stopOnFalse : true } ) );

    // executed after load
    klevu.setObjectPath( localVariables , "chains.interactive" , klevu.chain( { stopOnFalse : true } ) );

    function init(selfObj){
      localVariables.element = document.createElement("div");
      localVariables.element.pbObject = selfObj;
      localVariables.element.pbScope = localVariables;
      localVariables.element.pbElem = localVariables.element;
    }
    function buildData(){
      return {
        apiKey : false ,
        pageId : false ,
        version : false ,
        url : false ,
        executeAfter : false
      };
    }
    localVariables.data = buildData();
    var selfObj = {
      init : init ,
      // scope:localVariables,
      setScope : function ( variables ) {
        localVariables = variables;
        return localVariables;
      } ,
      getScope : function () {
        return localVariables;
      },
      addActiveFile: function(){
        localVariables.settings.settings.pagebuild.activeFiles++;
      },
      removeActiveFile: function(){
        localVariables.settings.settings.pagebuild.activeFiles--;
      }
    };
    init(selfObj);
    return selfObj;
  } ,
  pbObjectClone : function ( source ) {
    // special clone function
    var clone = klevu.pbObjectBuild();
    clone.setScope( klevu.extend( true , {} , source.getScope() ) );
    clone.getScope().id = klevu.randomId();
    return clone;
  }
} ); 
//source/core/pagebuildObject/pagebuildObjectSettings.js
var options = {
  url:{
    pbSource:  '//js.klevu.com/klevu-js-v2/pagebuilder/'
  },
  pagebuild :{
    active:false,
    version: "published",
    nocache: false,
    activeFiles:0
  },
  console:{
    type:{
      pb:false
    }
  }
};

klevu( options ); 

})( klevu );
//source/core/pagebuildObject/pagebuildObjectBuild.js
// BUILD BASE CHAINS
(function ( klevu ) {
  var basePb = klevu.pbObjectBuild();

  
//source/core/pagebuildObject/chains/coreLoad.js
basePb.getScope().chains.coreLoad.add( {
  name : "resetActiveFiles" ,
  fire : function ( data , scope ) {
    var filesLeft = klevu.getSetting(scope.pbScope.settings, "settings.pagebuild.activeFiles",0);
    if(filesLeft > 0) {
      
    }
    klevu.setSetting( scope.pbScope.settings , "settings.pagebuild.activeFiles" ,0 );
  }
} );
basePb.getScope().chains.coreLoad.add( {
  name : "getPageId" ,
  fire : function ( data , scope ) {
    data.pageId = klevu.getSetting(scope.pbScope.settings, "settings.pagebuild.pageId", false);
    if(!data.pageId){
      
      return false;
    }
  }
} );
basePb.getScope().chains.coreLoad.add( {
  name : "getApikey" ,
  fire : function ( data , scope ) {
    data.apiKey = klevu.getSetting(scope.pbScope.settings, "settings.pagebuild.apiKey", klevu.getSetting(scope.pbScope.settings, "settings.search.apiKey", false));
    if(!data.apiKey){
      
      return false;
    }
  }
} );
basePb.getScope().chains.coreLoad.add( {
  name : "getVersion" ,
  fire : function ( data , scope ) {
    data.version = klevu.getSetting(scope.pbScope.settings, "settings.pagebuild.version");
    if(!data.version){
      
      return false;
    }
  }
} );
basePb.getScope().chains.coreLoad.add( {
  name : "getHostUrl" ,
  fire : function ( data , scope ) {
    data.url = klevu.settings.url.protocol + klevu.getSetting(scope.pbScope.settings, "settings.url.pbSource") + data.apiKey +  "/" + data.pageId +  "/" + data.version;
  }
} );
basePb.getScope().chains.coreLoad.add( {
  name : "getCache" ,
  fire : function ( data , scope ) {
    data.nocache = klevu.getSetting(scope.pbScope.settings, "settings.pagebuild.nocache",false);
    if(data.nocache == 'true'){
      
      var randomnumber = Math.floor(Math.random() * (1000000000 - 100000000 + 1)) + 100000000;
      data.nocache = "?"+randomnumber;
    } else {
      data.nocache = "";
    }
  }
} );
basePb.getScope().chains.coreLoad.add( {
  name : "setChainAfter" ,
  fire : function ( data , scope ) {
    data.executeAfter = "chains.extraLoad";
  }
} );
basePb.getScope().chains.coreLoad.add( {
  name : "loadJs" ,
  fire : function ( data , scope ) {
    scope.pbObject.addActiveFile();
    klevu.assets.getFile(
      {
        url: data.url + ".js"+data.nocache,
        type:"js",
        options:{
          scope:scope,
          successCallback: klevu.pbEvents.request.done,
          errorCallback: klevu.pbEvents.request.done,
        }
      });

  }
} );
basePb.getScope().chains.coreLoad.add( {
  name : "loadCss" ,
  fire : function ( data , scope ) {
    scope.pbObject.addActiveFile();
    klevu.assets.getFile(
      {
        url: data.url + ".css"+data.nocache,
        type:"css",
        options:{
          scope:scope,
          successCallback: klevu.pbEvents.request.done,
          errorCallback: klevu.pbEvents.request.done
        }
      });
  }
} );
 
//source/core/pagebuildObject/chains/extraLoad.js
basePb.getScope().chains.extraLoad.add( {
  name : "setChainAfter" ,
  fire : function ( data , scope ) {
    data.executeAfter = "chains.interactive";
  }
} ); 
//source/core/pagebuildObject/chains/interactive.js
 

  //build base interaction object
  klevu.pb = {
    base : basePb
  };

  klevu.pb.build = true;

})( klevu );
//recsObject
//source/core/recsObject/activate.js

//source/general/wrapper.js
// templates/wrapper.js
(function ( klevu ) {

  
//source/core/recsObject/recsEvents.js
klevu.extend(true,klevu,{
  recs:{
    events: {}
  }
});
klevu.extend(true, klevu.recs.events, {
  init:{

    build:{
      name : "init-recs" ,
      fire : function () {
        var data = {
          elem: klevu.recs.base
        };
        var chain = klevu.recs.events.init.buildChain;
        if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
          chain.setScope( klevu.recs.base.getScope().element );
          chain.setData( data );
          chain.fire();
        }
      }
    },
    buildChain: klevu.chain( { stopOnFalse : true } )
  },
  request:{
    done: function(options){
      options.scope.recsObject.removeActiveFile();
      var filesLeft = klevu.getSetting(options.scope.recsScope.settings, "settings.recs.activeFiles",0);
      if(filesLeft===0){
        klevu.event.fireChain( options.scope.recsScope , options.scope.recsScope.data.powerUp.executeAfter , options.scope.recsScope.element , options.scope.recsScope.data , null );
      }

    }

  }
}); 
//source/core/recsObject/recsEventsChains.js
klevu.recs.events.init.buildChain.add( {
  name : "checkUrlOverides" ,
  fire : function ( data , scope ) {
    // check for overrides from the url
    var overrideSettings = klevu.getAllUrlParameters();
    if ( overrideSettings.length > 0 ) {
      klevu.each( overrideSettings , function ( key , elem ) {
        if ( elem.name.startsWith( "klib_" ) ) {
          elem.name = elem.name.replace( "klib_" , "" ).replace( new RegExp( /_/ , "g" ) , "." );
          klevu.setSetting( scope.recsScope.settings , "settings."+elem.name , elem.value );
        }
      } );
    }
  }
} );
klevu.recs.events.init.buildChain.add( {
  name : "powerUp" ,
  fire : function ( data , scope ) {
    klevu.event.fireChain( scope.recsScope , "chains.core.coreLoad" , scope.recsScope.element , scope.recsScope.data , null );
  }
} ); 
//source/core/recsObject/recsEventsActivate.js
klevu.coreEvent.build( {
  name : "buildRecs" , fire : function () {

    return !(!klevu.getSetting( klevu.settings , "settings.recs.activate" , false ));
  }
} );
klevu.coreEvent.attach( "buildRecs" , klevu.extend( true , {} , klevu.recs.events.init.build ) ); 
//source/core/recsObject/recsObject.js
klevu.extend(true,klevu, {
  recs:{
    list:[],
    build : function () {
      var localVariables = {
        settings : {
        }
      };

      klevu.setObjectPath( localVariables , "id" , klevu.randomId() );

      // executed on load
      klevu.setObjectPath( localVariables , "chains.core.coreLoad" , klevu.chain( { stopOnFalse : true } ) );
      klevu.setObjectPath( localVariables , "chains.core.extraLoad" , klevu.chain( { stopOnFalse : true } ) );

      // executed after load
      klevu.setObjectPath( localVariables , "chains.core.interactive" , klevu.chain( { stopOnFalse : true } ) );

      //actions
      klevu.setObjectPath( localVariables , "chains.actions.load" , klevu.chain( { stopOnFalse : true } ) );
      // processors
      klevu.setObjectPath( localVariables , "chains.processors.settings" , klevu.chain( { stopOnFalse : true } ) );
      // general
      klevu.setObjectPath( localVariables , "chains.request.control" , klevu.chain( { stopOnFalse : true } ) );
      klevu.setObjectPath( localVariables , "chains.request.build" , klevu.chain( { stopOnFalse : true } ) );
      klevu.setObjectPath( localVariables , "chains.request.send" , klevu.chain( { stopOnFalse : true } ) );
      //ajax
      klevu.setObjectPath( localVariables , "chains.request.ajax.send" , klevu.chain( { stopOnFalse : true } ) );
      //fetch
      klevu.setObjectPath( localVariables , "chains.request.fetch.send" , klevu.chain( { stopOnFalse : true } ) );
      /*    RESPONSE   */
      klevu.setObjectPath( localVariables , "chains.response.success" , klevu.chain( { stopOnFalse : true } ) );
      klevu.setObjectPath( localVariables , "chains.response.done" , klevu.chain( { stopOnFalse : true } ) );
      klevu.setObjectPath( localVariables , "chains.response.fail" , klevu.chain( { stopOnFalse : true } ) );
      //ajax
      klevu.setObjectPath( localVariables , "chains.response.ajax.success" , klevu.chain( { stopOnFalse : true } ) );
      klevu.setObjectPath( localVariables , "chains.response.ajax.done" , klevu.chain( { stopOnFalse : true } ) );
      klevu.setObjectPath( localVariables , "chains.response.ajax.fail" , klevu.chain( { stopOnFalse : true } ) );
      //fetch
      klevu.setObjectPath( localVariables , "chains.response.fetch.success" , klevu.chain( { stopOnFalse : true } ) );
      klevu.setObjectPath( localVariables , "chains.response.fetch.done" , klevu.chain( { stopOnFalse : true } ) );
      klevu.setObjectPath( localVariables , "chains.response.fetch.fail" , klevu.chain( { stopOnFalse : true } ) );
      //search object
      klevu.setObjectPath( localVariables , "chains.search.control" , klevu.chain( { stopOnFalse : true } ) );

      function init(selfObj,element){
        localVariables.element = element;
        localVariables.element.recsObject = selfObj;
        localVariables.element.recsScope = localVariables;
        localVariables.element.recsElem = localVariables.element;
      }
      function buildData(){
        var data = {
          powerUp:{
            apiKey: false,
            url : false ,
            executeAfter : false,
          },
          context : {
            eventAction : "" ,
            preventDefault : false ,
            status : null ,
            isSuccess : false,
            apiKey: null,
            recId: null
          } ,
          request : {
            settings : {
              url : null
            }
          } ,
          response : {

          }

        };
        return data;

      }
      localVariables.data = buildData();
      var selfObj = {
        init : init ,
        // scope:localVariables,
        setScope : function ( variables ) {
          localVariables = variables;
          return localVariables;
        } ,
        getScope : function () {
          return localVariables;
        },
        addActiveFile: function(){
          localVariables.settings.settings.recs.activeFiles++;
        },
        removeActiveFile: function(){
          localVariables.settings.settings.recs.activeFiles--;
        },
        powerUp:function(){
          var chain = klevu.getObjectPath( localVariables , "chains.actions.load" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( localVariables.element );
            chain.setData( localVariables.data );
            chain.fire();
          }
        }
      };
      return selfObj;
    } ,
    clone : function ( settings ) {
      // special clone function
      var source = klevu.recs.base;
      var clone = klevu.recs.build();
      clone.setScope( klevu.extend( true , {} , source.getScope() ) );
      clone.init(clone,settings.element);
      //do some reseting
      klevu.setSetting( clone.getScope().element.recsScope.settings , "settings.recs.apiKey" , settings.apiKey );
      klevu.setSetting( clone.getScope().element.recsScope.settings , "settings.recs.recId" , settings.recId );
      clone.getScope().id = klevu.randomId();
      clone.getScope().searchObject = null;
      clone.getScope().kmcData = null;

      klevu.recs.list.push(clone);
      return clone;
    }
  }

} ); 
//source/core/recsObject/recsObjectSettings.js
var options = {
  url:{
    recsSource:  '//js.klevu.com/recs/',
    recsEndpoint: '//config-cdn.ksearchnet.com/recommendations/'
  },
  recs :{
    active:false,
    nocache: false,
    activeFiles:0
  },
  console:{
    type:{
      recs:false
    }
  }
};

klevu( options ); 

})( klevu );
//source/core/recsObject/recsObjectBuild.js
// BUILD BASE CHAINS
(function ( klevu ) {
  var baseRecs = klevu.recs.build();

  
//source/core/recsObject/chains/core/coreLoad.js
baseRecs.getScope().chains.core.coreLoad.add({
  name: "resetActiveFiles",
  fire: function (data, scope) {
    var filesLeft = klevu.getSetting(scope.recsScope.settings, "settings.recs.activeFiles", 0);
    if (filesLeft > 0) {
      
    }
    klevu.setSetting(scope.recsScope.settings, "settings.recs.activeFiles", 0);
  }
});
baseRecs.getScope().chains.core.coreLoad.add({
  name: "getApikey",
  fire: function (data, scope) {
    data.apiKey = klevu.getSetting(scope.recsScope.settings, "settings.recs.apiKey", klevu.getSetting(scope.recsScope.settings, "settings.search.apiKey",klevu.getGlobalSetting( "global.apiKey" )));
    if (!data.apiKey) {
      
      return false;
    }
  }
});
baseRecs.getScope().chains.core.coreLoad.add({
  name: "getHostUrl",
  fire: function (data, scope) {
    data.url = "https:" + klevu.getSetting(scope.recsScope.settings, "settings.url.recsSource") + data.apiKey + "/";
  }
});
baseRecs.getScope().chains.core.coreLoad.add({
  name: "getCache",
  fire: function (data, scope) {
    data.nocache = klevu.getSetting(scope.recsScope.settings, "settings.recs.nocache", false);
    if (data.nocache == 'true') {
      
      var randomnumber = Math.floor(Math.random() * (1000000000 - 100000000 + 1)) + 100000000;
      data.nocache = "?" + randomnumber;
    } else {
      data.nocache = "";
    }
  }
});
baseRecs.getScope().chains.core.coreLoad.add({
  name: "setChainAfter",
  fire: function (data, scope) {
    data.powerUp.executeAfter = "chains.core.extraLoad";
  }
});
baseRecs.getScope().chains.core.coreLoad.add({
  name: "loadJs",
  fire: function (data, scope) {
    scope.recsObject.addActiveFile();
    klevu.assets.getFile({
      url: data.url + ".js" + data.nocache,
      type: "js",
      options: {
        scope: scope,
        successCallback: klevu.recs.events.request.done,
        errorCallback: klevu.recs.events.request.done,
      }
    });

  }
}); 
//source/core/recsObject/chains/core/extraLoad.js
baseRecs.getScope().chains.core.extraLoad.add( {
  name : "setChainAfter" ,
  fire : function ( data , scope ) {
    data.powerUp.executeAfter = "chains.core.interactive";
  }
} ); 
//source/core/recsObject/chains/core/interactive.js
 
//source/core/recsObject/chains/actions/load.js
// chains/actions/load.js
baseRecs.getScope().chains.actions.load.add( {
  name : "checkSettings" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.recsScope , "chains.processors.settings" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.recsElem );
      chain.setData( data );
      chain.fire();
    }
    scope.recsScope.data = data;
    if ( data.context.preventDefault === true ) return false;
  }
} );

baseRecs.getScope().chains.actions.load.add( {
  name : "doRequest" ,
  fire : function ( data , scope ) {
    data.context.doCall = false;
    var chain = klevu.getObjectPath( scope.recsScope , "chains.request.control" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.recsElem );
      chain.setData( data );
      chain.fire();
      scope.recsScope.data = data;
    } else {
      data.context.preventDefault = true;
      scope.recsScope.data = data;
      return false;
    }
  }
} );





 
//source/core/recsObject/chains/processors/settings.js
// chains/processors/settings.js
baseRecs.getScope().chains.processors.settings.add( {
  name : "checkDefinedApi" ,
  fire : function ( data , scope ) {
    if ( klevu.isUndefined( data.context.recId ) ) {
      data.context.preventDefault = true;
      //todo: decide what to do if the recid is not defined
      return false;
    }
  }
} ); 
//source/core/recsObject/chains/request/ajax/send.js
// chains/request/ajax/makeRequest.js
baseRecs.getScope().chains.request.ajax.send.add( {
  name : "sendRequest" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction !== "recsAjax" ) return;
    data.scope = scope;
    if ( data.context.doCall ) {

      data.context.requestObject = {
          url: data.request.settings.url,
          type: "AJAX",
          method : "GET" ,
          mimeType : "application/json; charset=UTF-8" ,
          contentType : "application/json; charset=utf-8" ,
          dataType : "json" ,
          crossDomain : true ,
          success : function ( klXHR ) {
            var chain = klevu.getObjectPath( klXHR.requestDetails.scope.recsScope , "chains.response.success" );
            if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
              chain.setScope( klXHR.requestDetails.scope.recsElem );
              klevu.setObjectPath(klXHR.requestDetails,"response.data",klXHR.responseObj.data);
              klevu.setObjectPath(klXHR.requestDetails,"context.status",klXHR.status);
              klevu.setObjectPath(klXHR.requestDetails,"context.isSuccess",klXHR.isSuccess);
              chain.setData( klXHR.requestDetails );
              chain.fire();
            }
          } ,
          done : function ( klXHR ) {
            var chain = klevu.getObjectPath( klXHR.requestDetails.scope.recsScope , "chains.response.done" );
            if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
              chain.setScope( klXHR.requestDetails.scope.recsElem );
              klevu.setObjectPath(klXHR.requestDetails,"response.data",klXHR.responseObj.data);
              klevu.setObjectPath(klXHR.requestDetails,"context.status",klXHR.status);
              klevu.setObjectPath(klXHR.requestDetails,"context.isSuccess",klXHR.isSuccess);
              chain.setData( klXHR.requestDetails );
              chain.fire();
            }
          } ,
          error : function ( klXHR ) {
            var chain = klevu.getObjectPath( klXHR.requestDetails.scope.recsScope , "chains.response.fail" );
            if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
              chain.setScope( klXHR.requestDetails.scope.recsElem );
              klevu.setObjectPath(klXHR.requestDetails,"response.data",{});
              klevu.setObjectPath(klXHR.requestDetails,"context.status",klXHR.status);
              klevu.setObjectPath(klXHR.requestDetails,"context.isSuccess",klXHR.isSuccess);
              chain.setData( klXHR.requestDetails );
              chain.fire();
            }
          },
          data :"" ,
      };
      data.context.requestDetails = data;

    } else {
      

    }

  }
} ); 
//source/core/recsObject/chains/request/fetch/send.js
// chains/request/ajax/makeRequest.js
baseRecs.getScope().chains.request.fetch.send.add( {
  name : "sendRequest" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction !== "recsFetch" ) return;
    data.scope = scope;
    if ( data.context.doCall ) {

      data.context.requestObject = {
        url: data.request.settings.url,
        type: "FETCH",
        method : "GET" ,
        mimeType : "application/json; charset=UTF-8" ,
        contentType : "application/json; charset=utf-8" ,
        dataType : "json" ,
        crossDomain : true ,
        success : function ( data , requestDetails , status, isSuccess ) {
          var chain = klevu.getObjectPath( requestDetails.scope.recsScope , "chains.response.success" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( requestDetails.scope.recsElem );
            klevu.setObjectPath(requestDetails,"response.data",data);
            klevu.setObjectPath(requestDetails,"context.status",status);
            klevu.setObjectPath(requestDetails,"context.isSuccess",isSuccess);
            chain.setData( requestDetails );
            chain.fire();
          }
        } ,
        error : function ( requestDetails, status, isSuccess ) {
          var chain = klevu.getObjectPath( requestDetails.scope.recsScope , "chains.response.fail" );
          if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
            chain.setScope( requestDetails.scope.recsElem );
            klevu.setObjectPath(requestDetails,"response.data",{});
            klevu.setObjectPath(requestDetails,"context.status",status);
            klevu.setObjectPath(requestDetails,"context.isSuccess",isSuccess);
            chain.setData( requestDetails );
            chain.fire();
          }
        },
        data : "" ,
      };
      data.context.requestDetails = klevu.extend( true , {} , data );

    } else {
      

    }

  }
} ); 
//source/core/recsObject/chains/request/control.js
// chains/request/control.js
baseRecs.getScope().chains.request.control.add( {
  name : "initRequest" ,
  fire : function ( data , scope ) {
    data.context.doCall = true;
    var chain = klevu.getObjectPath( scope.recsScope , "chains.request.build" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.recsElem );
      chain.setData( data );
      chain.fire();
      scope.recsScope.data = data;
      if ( data.context.doCall === false ) return false;
    } else {
      data.context.preventDefault = true;
      scope.recsScope.data = data;
      return false;
    }

  }
} );
baseRecs.getScope().chains.request.control.add( {
  name : "generateURL" ,
  fire : function ( data , scope ) {
    var recsUrl = klevu.getSetting( scope.recsScope.settings , "settings.url.recsEndpoint" , false );
    if ( recsUrl ) {
      data.request.settings.url = klevu.settings.url.protocol + recsUrl + data.context.apiKey + "/settings/"+ data.context.recId;
    }
  }
} );
baseRecs.getScope().chains.request.control.add( {
  name : "addQueryParamsToUrl" ,
  fire : function ( data , scope ) {
    var recsUrl = klevu.getObjectPath( data.request , "settings.url" , false );
    if ( recsUrl ) {
      var queryParams = [];
      if (typeof klevu_page_meta !== "undefined") {
        if(klevu_page_meta.categoryName) queryParams.push("cp="+encodeURIComponent(klevu.dom.helpers.convertHtmlToText(klevu_page_meta.categoryName)));
        if(klevu_page_meta.itemGroupId) queryParams.push("gpid="+encodeURIComponent(klevu_page_meta.itemGroupId));
        if(klevu_page_meta.itemId) queryParams.push("pid="+encodeURIComponent(klevu_page_meta.itemId));
      }

      if(queryParams.length >0){
        recsUrl = recsUrl+"?"+queryParams.join('&');
        data.request.settings.url = recsUrl;
      }
    }
  }
} );
baseRecs.getScope().chains.request.control.add( {
  name : "makeRequest" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.recsScope , "chains.request.send" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.recsElem );
      chain.setData( data );
      chain.fire();
      scope.recsScope.data = data;
      return false;
    }
  }
} ); 
//source/core/recsObject/chains/request/build.js
// chains/request/buildRequest.js
baseRecs.getScope().chains.request.build.add( {
  name : "buildMap" ,
  fire : function ( data , scope ) {
    data.context.status = null;
    data.context.isSuccess = false;
    data.context.apiKey = klevu.getSetting( scope.recsScope.settings , "settings.recs.apiKey" , klevu.getGlobalSetting( "search.apiKey" ,klevu.getGlobalSetting( "global.apiKey" )) );
    data.context.recId = klevu.getSetting( scope.recsScope.settings , "settings.recs.recId" , null );
    data.request.requestObject = {};
  }
} ); 
//source/core/recsObject/chains/request/send.js
// chains/request/makeRequest.js
baseRecs.getScope().chains.request.send.add( {
  name : "checkFetch" ,
  fire : function ( data , scope ) {
    if (window.fetch) {
      data.context.eventAction = "recsFetch";
    } else {
      data.context.eventAction = "recsAjax";
    }
  }
} );
baseRecs.getScope().chains.request.send.add( {
  name : "requestTypeAjax" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction === "searchAjax" ) {
      var chain = klevu.getObjectPath( scope.recsScope , "chains.request.ajax.send" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.recsElem );
        chain.setData( data );
        chain.fire();
        scope.recsScope.data = data;
      }
    }
  }
} );
baseRecs.getScope().chains.request.send.add( {
  name : "requestTypeFetch" ,
  fire : function ( data , scope ) {
    if ( data.context.eventAction !== "searchAjax" ) {
      var chain = klevu.getObjectPath( scope.recsScope , "chains.request.fetch.send" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.recsElem );
        chain.setData( data );
        chain.fire();
        scope.recsScope.data = data;
      }
    }
  }
} );
baseRecs.getScope().chains.request.send.add( {
  name : "requestSend" ,
  fire : function ( data , scope ) {
    klevu.request(data.context.requestObject, data.context.requestDetails );
  }
} ); 
//source/core/recsObject/chains/response/ajax/done.js
// chains/response/ajax/done.js 
//source/core/recsObject/chains/response/ajax/fail.js
// chains/response/ajax/fail.js 
//source/core/recsObject/chains/response/ajax/success.js
// chains/response/ajax/success.js



 
//source/core/recsObject/chains/response/fetch/done.js
// chains/response/fetch/done.js 
//source/core/recsObject/chains/response/fetch/fail.js
// chains/response/fetch/fail.js 
//source/core/recsObject/chains/response/fetch/success.js
// chains/response/fetch/success.js



 
//source/core/recsObject/chains/response/fail.js
// chains/response/fail.js 
//source/core/recsObject/chains/response/done.js
// chains/response/done.js 
//source/core/recsObject/chains/response/success.js
// chains/response/success.js
baseRecs.getScope().chains.response.success.add( {
  name : "checkForSuccess" ,
  fire : function ( data , scope ) {
    scope.recsElem.data = data;
    if ( data.context.isSuccess === false ) return false;
  }
} );
baseRecs.getScope().chains.response.success.add( {
  name : "executeAjaxResponseProcessor" ,
  fire : function ( data , scope ) {
    if(data.context.eventAction === "recsAjax"){
      var chain = klevu.getObjectPath( scope.recsScope , "chains.response.ajax.success" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.recsElem );
        chain.setData( data );
        chain.fire();
      }
      scope.recsScope.data = data;
    }
  }
} );
baseRecs.getScope().chains.response.success.add( {
  name : "executeFetchResponseProcessor" ,
  fire : function ( data , scope ) {
    if(data.context.eventAction === "recsFetch"){
      var chain = klevu.getObjectPath( scope.recsScope , "chains.response.fetch.success" );
      if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
        chain.setScope( scope.recsElem );
        chain.setData( data );
        chain.fire();
      }
      scope.recsScope.data = data;
    }
  }
} );
baseRecs.getScope().chains.response.success.add( {
  name : "buildTheSearchObject" ,
  fire : function ( data , scope ) {
    scope.recsScope.searchObject = klevu.searchObjectClone( klevu.search.base );
  }
} );
baseRecs.getScope().chains.response.success.add( {
  name : "saveSettings" ,
  fire : function ( data , scope ) {
    scope.recsScope.kmcData = klevu.getObjectPath( data.response , "data" );
  }
} );
baseRecs.getScope().chains.response.success.add( {
  name : "executeSearchObjectPowerUp" ,
  fire : function ( data , scope ) {
    var chain = klevu.getObjectPath( scope.recsScope , "chains.search.control" );
    if ( !klevu.isUndefined( chain ) && chain.list().length !== 0 ) {
      chain.setScope( scope.recsElem );
      chain.setData( data );
      chain.fire();
    }
    scope.recsScope.data = data;
  }
} ); 
//source/core/recsObject/chains/search/control.js
// chains/search/control.js
 

  //build base interaction object
  klevu.extend(true,klevu, {
    recs:{
      base : baseRecs,
      baseBuild: true
    }
  });


})( klevu );
//klevu
