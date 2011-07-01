"use strict";

function createFakeArrays(scope) {

    function defineFixedProperty(obj, name, val) {
	return Object.defineProperty(obj, name, {value:val, writeable:false, configurable: false, enumerablue:false});
    }

    scope.FakeArrayBuffer = (function() {
	function constructor(length) {
	    defineFixedProperty(this, "byteLength", length || 0);
	    defineFixedProperty(this, "_backingArray", new Array(this.byteLength));
	    for (var i=0; i < this._backingArray.length; i++)
		this._backingArray[i] = 0;
	}
	return constructor;
    })();

    var FakeTypedArray = (function() {
	function constructor(a, b, c) {
	    function init(buffer, byteOffset, byteLength) {
		defineFixedProperty(this, "buffer", buffer);
    		defineFixedProperty(this, "byteOffset", byteOffset);
		defineFixedProperty(this, "byteLength", byteLength);
		defineFixedProperty(this, "length", this.byteLength / this.BYTES_PER_ELEMENT);
		function makeGetter(index) { return function () { return this.indexGetter(index); }; };
		function makeSetter(index) { return function (val) { return this.indexSetter(index, val) }; };
		for (var i=0; i < this.length; i++)
		    Object.defineProperty(this, i, {get: makeGetter(i), set: makeSetter(i), enumerable: true});
	    }

	    if (typeof a == "number") {
		var n = Math.round(a);
		init.call(this, new FakeArrayBuffer(n * this.BYTES_PER_ELEMENT), 0, n * this.BYTES_PER_ELEMENT);
	    } else if (a instanceof FakeArrayBuffer) {
		var byteOffset = 0;
		var len = a.byteLength;
		if (arguments.length >= 2)
		    byteOffset = Number(b);
		if (arguments.length >= 3) {
		    len = Number(c);
		} else {
		    len = a.byteLength - byteOffset;
		    len = len / this.BYTES_PER_ELEMENT;
		}
		
		if ((byteOffset % this.BYTES_PER_ELEMENT) != 0)
		    throw new Error("Bad byteOffset");
		if ((byteOffset + len) > a.length)
		    throw new Error("Area beyond end of ArrayBuffer referenced.");
		if  ((arguments.length < 3) && (((a.byteLength - byteOffset) % this.BYTES_PER_ELEMENT) != 0)) {
		    var msg = "Length of the ArrayBuffer minus the byteOffset must be a multiple of ";
		    msg = msg + this.BYTES_PER_ELEMENT;
		    throw new Error(msg);
		}
		init.call(this, a, byteOffset, len * this.BYTES_PER_ELEMENT);
	    } else if (Array.isArray(a) || a instanceof FakeTypedArray) {
		init.call(this, new FakeArrayBuffer(a.length * this.BYTES_PER_ELEMENT), 0, a.length * this.BYTES_PER_ELEMENT);
		for (var i=0; i < a.length; i++)
		    this.indexSetter(i, a[i]);
	    } else {
		throw new Error("Bad arguments to TypedArray Constructor");
	    }
	}

	function set(a, b) {
	    if (!(a instanceof FakeTypedArray || Array.isArray(a)))
		throw new Error("invalid arguments.");
	    var offset = 0;
	    if (arguments.length > 1)
		offset = Math.round(Number(b));
	    if ((offset + a.length) > this.length)
		throw new Error("Offset + input length is larger than TypedArray");
	    var f = Array.isArray(a) ? this.setArray : this.setTypedArray;
	    return f.call(this, a, offset);
	};

	function setArray(a, offset) {
	    for (var i=0; i < a.length; i++)
		this.indexSetter(offset + i, a[i]);
	}

	function setTypedArray(a, offset) {
	    var isSameBuffer = (a.buffer === this.buffer);
	    var target = isSameBuffer ? new this.constructor(this) : this;
	    for (var i=0; i < a.length; i++)
		target.indexSetter(offset + i, a[i]);
	    if (isSameBuffer)
		this.setTypedArray(target, offset);
	}
	
	function subarray(begin, end) {
	    var start = Math.round(Number(begin));
	    var finish = (arguments.length > 1) ? Math.round(Number(end)) : this.length;
	    
	    function sanitize(param) {
		if (param < 0)
		    param = this.length + start;
		if (param < 0)
		    param = 0;
		if (param > this.length)
		    param = this.length;
		return param;
	    }
	
	    start = sanitize.call(this, start);
	    finish = sanitize.call(this, finish);
	    
	    if ((finish - start) <= 0)
		return new this.constructor(this.buffer, 0, 0);

	    return new this.constructor(this.buffer, start * this.BYTES_PER_ELEMENT,
					finish - start);
	}
	
	function indexSetter(index, val) {
	    for (var i=0; i < this.BYTES_PER_ELEMENT; i++)
		this.buffer._backingArray[(this.byteOffset + (index * this.BYTES_PER_ELEMENT)) + i] = (val >> (i * 8)) & 255;
	}
	
	function indexGetter(index, val) {
	    var start = this.byteOffset + (index * this.BYTES_PER_ELEMENT);
	    return this.getterFixup(this.buffer._backingArray.slice(start, start + this.BYTES_PER_ELEMENT));
	}
	
	constructor.prototype = {};
	defineFixedProperty(constructor.prototype, "set", set);
	defineFixedProperty(constructor.prototype, "setArray", setArray);
	defineFixedProperty(constructor.prototype, "setTypedArray", setTypedArray);
	defineFixedProperty(constructor.prototype, "subarray", subarray);
	defineFixedProperty(constructor.prototype, "indexSetter", indexSetter);
	defineFixedProperty(constructor.prototype, "indexGetter", indexGetter);

	return constructor;
    })();

    function createTypedArrayType(name, bytesPerElement, getFunc) {
	return (function() {
	    function constructor(a, b, c) {
		defineFixedProperty(this, "constructor", scope["Fake" + name]);
		defineFixedProperty(this, "BYTES_PER_ELEMENT", bytesPerElement);
		FakeTypedArray.apply(this, arguments);
	    }
	    constructor.prototype = Object.create(FakeTypedArray.prototype);
	    defineFixedProperty(constructor.prototype, "getterFixup", getFunc);
	    defineFixedProperty(constructor.prototype, "toString", function(){ return "[object " + name + "]"; });	
	return constructor;
	})();
    }

    // Uint8Array
    var Uint8Get = function (n) { return n[0]; };
    scope.FakeUint8Array = createTypedArrayType("Uint8Array", 1, Uint8Get);

    // Int8Array
    var Int8Get = function (n) { return (n[0] < 128) ? n[0] : n[0] - 256; };
    scope.FakeInt8Array = createTypedArrayType("Int8Array", 1, Int8Get);

    // Uint16Array
    var Uint16Get = function (n) { return n[0] | n[1] << 8; };
    scope.FakeUint16Array = createTypedArrayType("Uint16Array", 2, Uint16Get);

    // Int16Array
    var Int16Get = function (n) {
	var n = n[0] | n[1] << 8; 
	return (n < 32768) ? n : n - 65536;
    };
    scope.FakeInt16Array = createTypedArrayType("Int16Array", 2, Int16Get);
    
    // Uint32Array
    var Uint32Get = function (n) {
	// have to do it this way because JS bitwise operators convert to signed int32s
	return  (n[1] | n[2] << 8 | n[3] << 16) * 256 + n[0];
    };
    scope.FakeUint32Array = createTypedArrayType("Uint32Array", 4, Uint32Get);

    // Int32Array
    var Int32Get = function (n) { return  n[0] | n[1] << 8 | n[2] << 16 | n[3] << 24; };
    scope.FakeInt32Array = createTypedArrayType("Int32Array", 4, Int32Get);
}

function swapInFakeArrays(target, force) {
    if (force || !target.Uint16Array) {
	createFakeArrays(target);
	target.ArrayBuffer = target.FakeArrayBuffer;
	target.Uint8Array = target.FakeUint8Array;
	target.Int8Array = target.FakeInt8Array;
	target.Uint16Array = target.FakeUint16Array;
	target.Int16Array = target.FakeInt16Array;
	target.Uint32Array = target.FakeUint32Array;
	target.Int32Array = target.FakeInt32Array;
    }
}