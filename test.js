
function log(s) {
    if (!global.hasOwnProperty("window")) {
	print(s);
    }
}

var testCount = 0;
function eq(value, expected, msg) {
    testCount++;
    if (value !== expected) {
	var s = "ERROR";
	s = "got: " + value + " expected: " + expected + " | " + msg;
	log(s);
    }
}

function testFakePresence(expected) {
    log("testFakePresence");
    var x = new ArrayBuffer(5);
    eq(x.hasOwnProperty("_backingArray"), expected);
}

function testArrayBuffer() {
    var obj = new ArrayBuffer(5);
    eq(obj.byteLength, 5, ArrayBuffer);
}

function testUint8Array() {
    log("testUint8Array");
    var obj = new Uint8Array(5);
    eq(obj.length, 5);
    eq(obj.byteLength, 5);
    eq(obj.byteOffset, 0);

    eq(obj[0], 0);
    eq(obj[2], 0);

    obj = new Uint8Array([1,2,3,4,5]);
    eq(obj.length, 5);
    eq(obj.byteLength, 5);
    eq(obj.byteOffset, 0);

    eq(obj[0], 1);
    eq(obj[1], 2);
    eq(obj[2], 3);
    eq(obj[3], 4);
    eq(obj[4], 5);

    eq(obj.toString(), "[object Uint8Array]");

    var obj2 = new Uint8Array(obj);
    eq(obj2.length, 5);
    eq(obj2.byteLength, 5);
    eq(obj2.byteOffset, 0);
    
    eq(obj2[0], 1);
    eq(obj2[1], 2);
    eq(obj2[2], 3);
    eq(obj2[3], 4);
    eq(obj2[4], 5);
    
    var b = new ArrayBuffer(6);

    var obj3 = new Uint8Array(b, 2);
    eq(obj3.length, 4);
    eq(obj3.byteLength, 4);
    eq(obj3.byteOffset, 2);

    obj3[0] = 120;
    obj3[1] = 121;
    obj3[2] = 122;
    obj3[3] = 123;

    var obj4 = new Uint8Array(obj3.buffer, 3, 3);
    eq(obj4.length, 3);
    eq(obj4.byteLength, 3);
    eq(obj4.byteOffset, 3);

    eq(obj4[0], 121);
    eq(obj4[1], 122);
    eq(obj4[2], 123);

    var s = "";
    for (x in obj4)
	s = s + x;
    eq(s, "012");

    var obj5 = new Uint8Array([1,2,3,4]);
    var obj6 = new Uint8Array([5,6,7]);
    obj5.set(obj6, 1);
    eq(obj5[0], 1);
    eq(obj5[1], 5);
    eq(obj5[2], 6);
    eq(obj5[3], 7);

    obj5[0] = 666;
    obj5[1] = 12345;
    obj5[2] = 3;
    obj5[3] = 1023;
    eq(obj5[0], 154);
    eq(obj5[1], 57);
    eq(obj5[2], 3);
    eq(obj5[3], 255);

    obj5[0] = 666.4;
    eq(obj5[0], 154);

    obj5[0] = "666";
    eq(obj5[0], 154);

    obj5[0] = "666.1234";
    eq(obj5[0], 154);

    var obj7 = new Uint8Array([6,5,4,3,2,1]);
    obj7.set([128,666.4], 1);
    eq(obj7[1], 128);
    eq(obj7[2], 154);
    obj7.set([5,4], 1); // back to the way it was
    
    var obj8 = obj7.subarray(0, obj7.length - 1);
    eq(obj8.length, 5);
    eq(obj8[0], 6);
    eq(obj8[4], 2);
}

function testInt8Array() {
    log("testInt8Array");
    var obj = new Int8Array([1,2,3]);
    eq(obj[1], 2);

    obj[0] = 128;
    eq(obj[0], -128);
    obj[1] = 129;
    eq(obj[1], -127);
    obj[2] = 127;
    eq(obj[2], 127);

    obj[0] = 1234;
    eq(obj[0], -46);
}

function testUint16Array() {
    log("testUint16Array");
    var obj = new Uint16Array([35334,35335,35336,1,2]);
    eq(obj[0], 35334);
    eq(obj[1], 35335);
    eq(obj[2], 35336);

    var obj2 = new Uint16Array(obj);
    eq(obj2.length, 5);
    eq(obj2.byteLength, 10);
    eq(obj2.byteOffset, 0);
    
    eq(obj2[0], 35334);
    eq(obj2[1], 35335);
    eq(obj2[2], 35336);
    eq(obj2[3], 1);
    eq(obj2[4], 2);
    
    var b = new ArrayBuffer(12);

    var obj3 = new Uint16Array(b, 2);
    eq(obj3.length, 5, "obj3 length");
    eq(obj3.byteLength, 10, "obj3 byteLength");
    eq(obj3.byteOffset, 2, "obj3 byteOffset");

    obj3[0] = 120;
    obj3[1] = 121;
    obj3[2] = 122;
    obj3[3] = 123;
    obj3[4] = 124;

    var obj4 = new Uint16Array(obj3.buffer, 6, 3);
    eq(obj4.length, 3);
    eq(obj4.byteLength, 6);
    eq(obj4.byteOffset, 6, "obj4 byteOffset");

    eq(obj4[0], 122, "obj4[0]");
    eq(obj4[1], 123, "obj4[1]");
    eq(obj4[2], 124, "obj4[2]");

    var s = "";
    for (x in obj4)
	s = s + x;
    eq(s, "012");

    var obj5 = new Uint16Array([1,2,3,4]);
    var obj6 = new Uint16Array([5,6,7]);
    obj5.set(obj6, 1);
    eq(obj5[0], 1);
    eq(obj5[1], 5);
    eq(obj5[2], 6);
    eq(obj5[3], 7);

    obj5[0] = 666;
    obj5[1] = 12345;
    obj5[2] = 3;
    obj5[3] = 1023;
    eq(obj5[0], 666);
    eq(obj5[1], 12345);
    eq(obj5[2], 3);
    eq(obj5[3], 1023);

    obj5[0] = 666.4;
    eq(obj5[0], 666);

    obj5[0] = "666";
    eq(obj5[0], 666);

    obj5[0] = "666.1234";
    eq(obj5[0], 666);

    var obj7 = new Uint16Array([6,5,4,3,2,1]);
    obj7.set([128,666.4], 1);
    eq(obj7[1], 128);
    eq(obj7[2], 666);
    obj7.set([5,4], 1); // back to the way it was
    
    var obj8 = obj7.subarray(0, obj7.length - 1);
    eq(obj8.length, 5);
    eq(obj8[0], 6);
    eq(obj8[4], 2);  
}

function testInt16Array() {
    log("testInt16Array")
    var obj = new Int16Array([1,2,3]);
    eq(obj[1], 2);

    obj[0] = 32768;
    eq(obj[0], -32768);
    obj[1] = 32769;
    eq(obj[1], -32767);
    obj[2] = 32767;
    eq(obj[2], 32767);

    obj[0] = 32800;
    eq(obj[0], -32736);
}

function testUint32Array() {
    log("uint32");
    var obj = new Uint32Array([35334,35335,35336,1,2]);
    eq(obj[0], 35334);
    eq(obj[1], 35335, "obj[1] u32");
    eq(obj[2], 35336);

    var obj2 = new Uint32Array(obj);
    eq(obj2.length, 5);
    eq(obj2.byteLength, 20);
    eq(obj2.byteOffset, 0);
    
    eq(obj2[0], 35334);
    eq(obj2[1], 35335);
    eq(obj2[2], 35336);
    eq(obj2[3], 1);
    eq(obj2[4], 2);
    
    var b = new ArrayBuffer(24);

    var obj3 = new Uint32Array(b, 4);
    eq(obj3.length, 5, "obj3 length 32");
    eq(obj3.byteLength, 20, "obj3 byteLength");
    eq(obj3.byteOffset, 4, "obj3 byteOffset");

    obj3[0] = 120;
    obj3[1] = 121;
    obj3[2] = 122;
    obj3[3] = 123;
    obj3[4] = 124;

    var obj4 = new Uint32Array(obj3.buffer, 12, 3);
    eq(obj4.length, 3);
    eq(obj4.byteLength, 12);
    eq(obj4.byteOffset, 12, "obj4 byteOffset");

    eq(obj4[0], 122, "obj4[0]");
    eq(obj4[1], 123, "obj4[1]");
    eq(obj4[2], 124, "obj4[2]");

    var s = "";
    for (x in obj4)
	s = s + x;
    eq(s, "012");

    var obj5 = new Uint32Array([1,2,3,4]);
    var obj6 = new Uint32Array([5,6,7]);
    obj5.set(obj6, 1);
    eq(obj5[0], 1);
    eq(obj5[1], 5);
    eq(obj5[2], 6);
    eq(obj5[3], 7);

    obj5[0] = 666;
    obj5[1] = 12345;
    obj5[2] = 3;
    obj5[3] = 1023;
    eq(obj5[0], 666);
    eq(obj5[1], 12345);
    eq(obj5[2], 3);
    eq(obj5[3], 1023);

    obj5[0] = 666.4;
    eq(obj5[0], 666);

    obj5[0] = "666";
    eq(obj5[0], 666);

    obj5[0] = "666.1234";
    eq(obj5[0], 666);

    var obj7 = new Uint32Array([6,5,4,3,2,1]);
    obj7.set([128,666.4], 1);
    eq(obj7[1], 128);
    eq(obj7[2], 666);
    obj7.set([5,4], 1); // back to the way it was
    
    var obj8 = obj7.subarray(0, obj7.length - 1);
    eq(obj8.length, 5);
    eq(obj8[0], 6);
    eq(obj8[4], 2);

    var obj9 = new Uint32Array([1,2,3]);
    eq(obj9[2], 3);

    obj9[0] = 1073741823;
    eq(obj9[0], 1073741823);

    obj9[0] = 2147483646;
    eq(obj9[0], 2147483646);

    obj9[0] = 2147483647;
    eq(obj9[0], 2147483647);

    obj9[0] = 2147483648;
    eq(obj9[0], 2147483648);


    obj9[0] = 4294967293;
    eq(obj9[0], 4294967293);

    obj9[0] = 4294967294;
    eq(obj9[0], 4294967294);

    obj9[0] = 4294967295;
    eq(obj9[0], 4294967295);

    obj9[0] = 4294967296;
    eq(obj9[0], 0);

    obj9[0] = 4294967297;
    eq(obj9[0], 1)
}

function testInt32Array() {
    log("int32 array");
    var obj = new Int32Array([1,2,3]);
    eq(obj[1], 2);

    obj[0] = 2147483647;
    eq(obj[0], 2147483647);
    obj[1] = 2147483648;
    eq(obj[1], -2147483648);
    obj[2] = 2147483649;
    eq(obj[2], -2147483647);

    obj[0] = 2147483700;
    eq(obj[0], -2147483596);

    obj[0] = 4294967296;
    eq(obj[0], 0);
}

var global = this;
function test() {
    var tests = [testArrayBuffer,
		 testUint8Array, testInt8Array,
		 testUint16Array, testInt16Array,
		 testUint32Array, testInt32Array];

    for (var i = 0; i < tests.length; i++)
        tests[i]();

    testFakePresence(false);
    log("swapping in fakes");
    swapInFakeArrays(global, true);
    testFakePresence(true);
    for (var i = 0; i < tests.length; i++)
	tests[i]();

    log("test count: " + testCount);
}

test();