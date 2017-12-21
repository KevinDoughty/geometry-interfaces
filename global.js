var __geometryInterfaces__ = (function (exports) {
'use strict';

// A reusable array, to avoid allocating new arrays during multiplication.
// in column-major order:
const scratch = [
    /*m11*/0, /*m12*/0, /*m13*/0, /*m14*/0,
    /*m21*/0, /*m22*/0, /*m23*/0, /*m24*/0,
    /*m31*/0, /*m32*/0, /*m33*/0, /*m34*/0,
    /*m41*/0, /*m42*/0, /*m43*/0, /*m44*/0 ];

function multiplyAndApply(A, B, target) {

    //XXX: Are the following calculations faster hard coded (current), or as a loop?

    scratch[0]  = (A.m11 * B.m11) + (A.m21 * B.m12) + (A.m31 * B.m13) + (A.m41 * B.m14);
    scratch[4]  = (A.m11 * B.m21) + (A.m21 * B.m22) + (A.m31 * B.m23) + (A.m41 * B.m24);
    scratch[8]  = (A.m11 * B.m31) + (A.m21 * B.m32) + (A.m31 * B.m33) + (A.m41 * B.m34);
    scratch[12] = (A.m11 * B.m41) + (A.m21 * B.m42) + (A.m31 * B.m43) + (A.m41 * B.m44);

    scratch[1]  = (A.m12 * B.m11) + (A.m22 * B.m12) + (A.m32 * B.m13) + (A.m42 * B.m14);
    scratch[5]  = (A.m12 * B.m21) + (A.m22 * B.m22) + (A.m32 * B.m23) + (A.m42 * B.m24);
    scratch[9]  = (A.m12 * B.m31) + (A.m22 * B.m32) + (A.m32 * B.m33) + (A.m42 * B.m34);
    scratch[13] = (A.m12 * B.m41) + (A.m22 * B.m42) + (A.m32 * B.m43) + (A.m42 * B.m44);

    scratch[2]  = (A.m13 * B.m11) + (A.m23 * B.m12) + (A.m33 * B.m13) + (A.m43 * B.m14);
    scratch[6]  = (A.m13 * B.m21) + (A.m23 * B.m22) + (A.m33 * B.m23) + (A.m43 * B.m24);
    scratch[10] = (A.m13 * B.m31) + (A.m23 * B.m32) + (A.m33 * B.m33) + (A.m43 * B.m34);
    scratch[14] = (A.m13 * B.m41) + (A.m23 * B.m42) + (A.m33 * B.m43) + (A.m43 * B.m44);

    scratch[3]  = (A.m14 * B.m11) + (A.m24 * B.m12) + (A.m34 * B.m13) + (A.m44 * B.m14);
    scratch[7]  = (A.m14 * B.m21) + (A.m24 * B.m22) + (A.m34 * B.m23) + (A.m44 * B.m24);
    scratch[11] = (A.m14 * B.m31) + (A.m24 * B.m32) + (A.m34 * B.m33) + (A.m44 * B.m34);
    scratch[15] = (A.m14 * B.m41) + (A.m24 * B.m42) + (A.m34 * B.m43) + (A.m44 * B.m44);

    applyArrayValuesToDOMMatrix(scratch, target);
}

function applyArrayValuesToDOMMatrix(array, matrix) {
    const length = array.length;

    if (length === 6) {
        matrix.m11 = array[0];
        matrix.m12 = array[1];
        matrix.m21 = array[2];
        matrix.m22 = array[3];
        matrix.m41 = array[4];
        matrix.m42 = array[5];
    }
    else if (length === 16) {
        matrix.m11 = array[0];
        matrix.m12 = array[1];
        matrix.m13 = array[2];
        matrix.m14 = array[3];
        matrix.m21 = array[4];
        matrix.m22 = array[5];
        matrix.m23 = array[6];
        matrix.m24 = array[7];
        matrix.m31 = array[8];
        matrix.m32 = array[9];
        matrix.m33 = array[10];
        matrix.m34 = array[11];
        matrix.m41 = array[12];
        matrix.m42 = array[13];
        matrix.m43 = array[14];
        matrix.m44 = array[15];
    }
}

function rotateAxisAngleArray(x, y, z, angle) {
    var sin = Math.sin;
    var cos = Math.cos;
    var pow = Math.pow;

    const halfAngle = degreesToRadians(angle/2);

    // TODO: should we provide a 6-item array here to signify 2D when the
    // rotation is about the Z axis (for example when calling rotateSelf)?
    // TODO: Performance can be improved by first detecting when x, y, or z of
    // the axis are zero or 1, and using a pre-simplified version of the
    // folowing math based on that condition.
    // TODO: Performance can be improved by using different equations (use trig
    // identities to find alternate formulas).
    return [
        1-2*(y*y + z*z)*pow(sin(halfAngle), 2),                           2*(x*y*pow(sin(halfAngle), 2) + z*sin(halfAngle)*cos(halfAngle)), 2*(x*z*pow(sin(halfAngle), 2) - y*sin(halfAngle)*cos(halfAngle)), 0,
        2*(x*y*pow(sin(halfAngle), 2) - z*sin(halfAngle)*cos(halfAngle)), 1-2*(x*x + z*z)*pow(sin(halfAngle), 2),                           2*(y*z*pow(sin(halfAngle), 2) + x*sin(halfAngle)*cos(halfAngle)), 0,
        2*(x*z*pow(sin(halfAngle), 2) + y*sin(halfAngle)*cos(halfAngle)), 2*(y*z*pow(sin(halfAngle), 2) - x*sin(halfAngle)*cos(halfAngle)), 1-2*(x*x + y*y)*pow(sin(halfAngle), 2),                           0,
        0,                                                                0,                                                                0,                                                                1 ]
}

function degreesToRadians(degrees) {
    return Math.PI/180 * degrees
}

// This matrix is represented internally in row-major format so that it is easy
// to look at visually. In a pair of coordinates (as in "m23") the first number
// is the column and the second is the row (so "m23" means column 2 row 3).
const identity = [
    /*m11*/1, /*m21*/0, /*m31*/0, /*m41*/0,
    /*m12*/0, /*m22*/1, /*m32*/0, /*m42*/0,
    /*m13*/0, /*m23*/0, /*m33*/1, /*m43*/0,
    /*m14*/0, /*m24*/0, /*m34*/0, /*m44*/1 ];

exports.DOMMatrixReadOnly = null;

function initDOMMatrixReadOnly() {
    if (exports.DOMMatrixReadOnly) { return }

    exports.DOMMatrixReadOnly = (function () {
        function DOMMatrixReadOnly(numberSequence) {
        if ( numberSequence === void 0 ) numberSequence = [];

            if (!(this instanceof DOMMatrix))
                { throw new TypeError("DOMMatrixReadOnly can't be instantiated directly. Use DOMMatrix instead.") }

            var length = numberSequence.length;

            if (length === undefined || !(length === 6 || length === 16))
                { throw new TypeError('DOMMatrix constructor argument "numberSequence" must be an array-like with 6 or 16 numbers.') }

            this._matrix = new Float64Array(identity);
            this._isIdentity = true;
            this._is2D = length === 6 ? true : false;

            applyArrayValuesToDOMMatrix(numberSequence, this);
        }

        var prototypeAccessors = { is2D: {},isIdentity: {},a: {},b: {},c: {},d: {},e: {},f: {},m11: {},m12: {},m13: {},m14: {},m21: {},m22: {},m23: {},m24: {},m31: {},m32: {},m33: {},m34: {},m41: {},m42: {},m43: {},m44: {} };

        // Immutable transform methods -------------------------------------------

        DOMMatrixReadOnly.prototype.translate = function translate (tx, ty, tz) {
            if ( tz === void 0 ) tz = 0;

            return new DOMMatrix(this).translateSelf(tx, ty, tz)
        };

        DOMMatrixReadOnly.prototype.scale = function scale (scale$1, originX, originY) {
            if ( originX === void 0 ) originX = 0;
            if ( originY === void 0 ) originY = 0;

            return new DOMMatrix(this).scaleSelf(scale$1, originX, originY)
        };

        DOMMatrixReadOnly.prototype.scale3d = function scale3d (scale, originX, originY, originZ) {
            if ( originX === void 0 ) originX = 0;
            if ( originY === void 0 ) originY = 0;
            if ( originZ === void 0 ) originZ = 0;

            return new DOMMatrix(this).scale3dSelf(scale, originX, originY, originZ)
        };

        DOMMatrixReadOnly.prototype.scaleNonUniform = function scaleNonUniform (scaleX, scaleY, scaleZ, originX, originY, originZ) {
            if ( scaleY === void 0 ) scaleY = 1;
            if ( scaleZ === void 0 ) scaleZ = 1;
            if ( originX === void 0 ) originX = 0;
            if ( originY === void 0 ) originY = 0;
            if ( originZ === void 0 ) originZ = 0;

            return new DOMMatrix(this).scaleNonUniformSelf(scaleX, scaleY, scaleZ, originX, originY, originZ)
        };

        DOMMatrixReadOnly.prototype.rotate = function rotate (angle, originX, originY) {
            if ( originX === void 0 ) originX = 0;
            if ( originY === void 0 ) originY = 0;

            return new DOMMatrix(this).rotateSelf(angle, originX, originY)
        };

        // TODO
        DOMMatrixReadOnly.prototype.rotateFromVector = function rotateFromVector (x, y) {
            throw new Error('rotateFromVector is not implemented yet.')
        };

        DOMMatrixReadOnly.prototype.rotateAxisAngle = function rotateAxisAngle (x, y, z, angle) {
            return new DOMMatrix(this).rotateAxisAngleSelf(x, y, z, angle)
        };

        DOMMatrixReadOnly.prototype.skewX = function skewX (sx) {
            throw new Error('skewX is not implemented yet.')
        };
        DOMMatrixReadOnly.prototype.skewY = function skewY (sy) {
            throw new Error('skewY is not implemented yet.')
        };

        DOMMatrixReadOnly.prototype.multiply = function multiply (other) {
            return new DOMMatrix(this).multiplySelf(other)
        };

        DOMMatrixReadOnly.prototype.flipX = function flipX () {
            throw new Error('flipX is not implemented yet.')
        };
        DOMMatrixReadOnly.prototype.flipY = function flipY () {
            throw new Error('flipY is not implemented yet.')
        };
        DOMMatrixReadOnly.prototype.inverse = function inverse () {
            throw new Error('inverse is not implemented yet.')
        };

        DOMMatrixReadOnly.prototype.transformPoint = function transformPoint (/*optional DOMPointInit*/ point) {
            throw new Error('transformPoint is not implemented yet.')
        };

        DOMMatrixReadOnly.prototype.toFloat32Array = function toFloat32Array () {
            return Float32Array.from(this._matrix)
        };
        DOMMatrixReadOnly.prototype.toFloat64Array = function toFloat64Array () {
            return Float64Array.from(this._matrix)
        };

        //stringifier() {} // What's this?

        prototypeAccessors.is2D.get = function () {
            return this._is2D
        };

        /*
         * TODO: make sure this matches the spec.
         * TODO: Instead of calculating here, perhaps calculate and set
         * this._isIdentity in other operations, and simply return the internal one
         * here.
         */
        prototypeAccessors.isIdentity.get = function () {
            var this$1 = this;

            for (var i = 0, len = this._matrix.length; i < len; i+=1) {
                if (this$1._matrix[i] != identity[i])
                    { return (this$1._isIdentity = false) }
            }

            return (this._isIdentity = true)
        };

        prototypeAccessors.a.get = function () { return this.m11 };
        prototypeAccessors.b.get = function () { return this.m12 };
        prototypeAccessors.c.get = function () { return this.m21 };
        prototypeAccessors.d.get = function () { return this.m22 };
        prototypeAccessors.e.get = function () { return this.m41 };
        prototypeAccessors.f.get = function () { return this.m42 };

        prototypeAccessors.m11.get = function () { return this._matrix[0]  };
        prototypeAccessors.m12.get = function () { return this._matrix[4]  };
        prototypeAccessors.m13.get = function () { return this._matrix[8]  };
        prototypeAccessors.m14.get = function () { return this._matrix[12] };

        prototypeAccessors.m21.get = function () { return this._matrix[1]  };
        prototypeAccessors.m22.get = function () { return this._matrix[5]  };
        prototypeAccessors.m23.get = function () { return this._matrix[9]  };
        prototypeAccessors.m24.get = function () { return this._matrix[13] };

        prototypeAccessors.m31.get = function () { return this._matrix[2]  };
        prototypeAccessors.m32.get = function () { return this._matrix[6]  };
        prototypeAccessors.m33.get = function () { return this._matrix[10] };
        prototypeAccessors.m34.get = function () { return this._matrix[14] };

        prototypeAccessors.m41.get = function () { return this._matrix[3]  };
        prototypeAccessors.m42.get = function () { return this._matrix[7]  };
        prototypeAccessors.m43.get = function () { return this._matrix[11] };
        prototypeAccessors.m44.get = function () { return this._matrix[15] };

        Object.defineProperties( DOMMatrixReadOnly.prototype, prototypeAccessors );

        return DOMMatrixReadOnly;
    }());
}

initDOMMatrixReadOnly();

initDOMMatrixReadOnly();

var DOMMatrix = (function (DOMMatrixReadOnly$$1) {
    function DOMMatrix(arg) {
        const numArgs = arguments.length;
        if (numArgs === 0) {
            DOMMatrixReadOnly$$1.call(this, [1, 0, 0, 1, 0, 0]);
        }
        else if (numArgs === 1) {
            if (typeof arg == 'string') {
                throw new Error('CSS transformList arg not yet implemented.')
                // TODO validate that syntax of transformList matches transform-list (http://www.w3.org/TR/css-transforms-1/#typedef-transform-list).
            }
            else if (arg instanceof DOMMatrix) {
                DOMMatrixReadOnly$$1.call(this, arg._matrix);
            }
            else if (arg instanceof Float32Array || arg instanceof Float64Array || arg instanceof Array) {
                DOMMatrixReadOnly$$1.call(this, arg);
            }
        }
        else {
            throw new Error('Wrong number of arguments to DOMMatrix constructor.')
        }
    }

    if ( DOMMatrixReadOnly$$1 ) DOMMatrix.__proto__ = DOMMatrixReadOnly$$1;
    DOMMatrix.prototype = Object.create( DOMMatrixReadOnly$$1 && DOMMatrixReadOnly$$1.prototype );
    DOMMatrix.prototype.constructor = DOMMatrix;

    var prototypeAccessors = { a: {},b: {},c: {},d: {},e: {},f: {},m11: {},m12: {},m13: {},m14: {},m21: {},m22: {},m23: {},m24: {},m31: {},m32: {},m33: {},m34: {},m41: {},m42: {},m43: {},m44: {} };

    // Mutable transform methods
    DOMMatrix.prototype.multiplySelf = function multiplySelf (other) {
        if (!(other instanceof DOMMatrix))
            { throw new Error('The argument to multiplySelf must be an instance of DOMMatrix') }

        // TODO: avoid creating a new array, just apply values directly.
        multiplyAndApply(this, other, this);

        if (!other.is2D) { this._is2D = false; }

        return this
    };

    DOMMatrix.prototype.preMultiplySelf = function preMultiplySelf (other) {
        if (!(other instanceof DOMMatrix))
            { throw new Error('The argument to multiplySelf must be an instance of DOMMatrix') }

        // TODO: avoid creating a new array, just apply values directly.
        multiplyAndApply(other, this, this);

        if (!other.is2D) { this._is2D = false; }

        return this
    };

    DOMMatrix.prototype.translateSelf = function translateSelf (tx, ty, tz) {
        if ( tz === void 0 ) tz = 0;

        // TODO: check args are numbers

        if (arguments.length === 1)
            { throw new Error('The first two arguments (X and Y translation values) are required (the third, Z translation, is optional).') }

        // http://www.w3.org/TR/2012/WD-css3-transforms-20120911/#Translate3dDefined
        const translationMatrix = new DOMMatrix([
            // column-major:
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx,ty,tz,1 ]);

        this.multiplySelf(translationMatrix);

        if (tz != 0) {
            this._is2D = false;
        }

        return this
    };

    DOMMatrix.prototype.scaleSelf = function scaleSelf (scale, originX, originY) {
        if ( originX === void 0 ) originX = 0;
        if ( originY === void 0 ) originY = 0;

        this.translateSelf(originX, originY);

        this.multiplySelf(new DOMMatrix([
            // 2D:
            /*a*/scale, /*b*/0,
            /*c*/0,     /*d*/scale,
            /*e*/0,     /*f*/0 ]));

        this.translateSelf(-originX, -originY);
        return this
    };

    DOMMatrix.prototype.scale3dSelf = function scale3dSelf (scale, originX, originY, originZ) {
        if ( originX === void 0 ) originX = 0;
        if ( originY === void 0 ) originY = 0;
        if ( originZ === void 0 ) originZ = 0;

        this.translateSelf(originX, originY, originZ);

        this.multiplySelf(new DOMMatrix([
            // 3D
            scale, 0,     0,     0,
            0,     scale, 0,     0,
            0,     0,     scale, 0,
            0,     0,     0,     1 ]));

        this.translateSelf(-originX, -originY, -originZ);
        return this
    };

    DOMMatrix.prototype.scaleNonUniformSelf = function scaleNonUniformSelf (scaleX, scaleY, scaleZ, originX, originY, originZ) {
        if ( scaleY === void 0 ) scaleY = 1;
        if ( scaleZ === void 0 ) scaleZ = 1;
        if ( originX === void 0 ) originX = 0;
        if ( originY === void 0 ) originY = 0;
        if ( originZ === void 0 ) originZ = 0;

        this.translateSelf(originX, originY, originZ);

        this.multiplySelf(new DOMMatrix([
            // 3D
            scaleX, 0,      0,      0,
            0,      scaleY, 0,      0,
            0,      0,      scaleZ, 0,
            0,      0,      0,      1 ]));

        this.translateSelf(-originX, -originY, -originZ);

        if (scaleZ !== 1 || originZ !== 0) { this._is2D = false; }

        return this
    };

    DOMMatrix.prototype.rotateSelf = function rotateSelf (angle, originX, originY) {
        if ( originX === void 0 ) originX = 0;
        if ( originY === void 0 ) originY = 0;

        this.translateSelf(originX, originY);

        // axis of rotation
        var ref = [0,0,1];
        var x = ref[0];
        var y = ref[1];
        var z = ref[2]; // We're rotating around the Z axis.

        this.rotateAxisAngleSelf(x, y, z, angle);

        this.translateSelf(-originX, -originY);
        return this
    };

    // TODO
    DOMMatrix.prototype.rotateFromVectorSelf = function rotateFromVectorSelf (x, y) {
        throw new Error('rotateFromVectorSelf is not implemented yet.')
    };

    DOMMatrix.prototype.rotateAxisAngleSelf = function rotateAxisAngleSelf (x, y, z, angle) {
        const rotationMatrix = new DOMMatrix(rotateAxisAngleArray(x,y,z,angle));
        this.multiplySelf(rotationMatrix);
        return this
    };

    DOMMatrix.prototype.skewXSelf = function skewXSelf (sx) {
        throw new Error('skewXSelf is not implemented yet.')
    };

    DOMMatrix.prototype.skewYSelf = function skewYSelf (sy) {
        throw new Error('skewYSelf is not implemented yet.')
    };

    DOMMatrix.prototype.invertSelf = function invertSelf () {
        throw new Error('invertSelf is not implemented yet.')
    };

    DOMMatrix.prototype.setMatrixValue = function setMatrixValue (/*DOMString*/ transformList) {
        throw new Error('setMatrixValue is not implemented yet.')
    };

    prototypeAccessors.a.get = function () { return this.m11 };
    prototypeAccessors.b.get = function () { return this.m12 };
    prototypeAccessors.c.get = function () { return this.m21 };
    prototypeAccessors.d.get = function () { return this.m22 };
    prototypeAccessors.e.get = function () { return this.m41 };
    prototypeAccessors.f.get = function () { return this.m42 };

    prototypeAccessors.m11.get = function () { return this._matrix[0]  };
    prototypeAccessors.m12.get = function () { return this._matrix[4]  };
    prototypeAccessors.m13.get = function () { return this._matrix[8]  };
    prototypeAccessors.m14.get = function () { return this._matrix[12] };

    prototypeAccessors.m21.get = function () { return this._matrix[1]  };
    prototypeAccessors.m22.get = function () { return this._matrix[5]  };
    prototypeAccessors.m23.get = function () { return this._matrix[9]  };
    prototypeAccessors.m24.get = function () { return this._matrix[13] };

    prototypeAccessors.m31.get = function () { return this._matrix[2]  };
    prototypeAccessors.m32.get = function () { return this._matrix[6]  };
    prototypeAccessors.m33.get = function () { return this._matrix[10] };
    prototypeAccessors.m34.get = function () { return this._matrix[14] };

    prototypeAccessors.m41.get = function () { return this._matrix[3]  };
    prototypeAccessors.m42.get = function () { return this._matrix[7]  };
    prototypeAccessors.m43.get = function () { return this._matrix[11] };
    prototypeAccessors.m44.get = function () { return this._matrix[15] };

    prototypeAccessors.a.set = function (value) { this.m11 = value; };
    prototypeAccessors.b.set = function (value) { this.m12 = value; };
    prototypeAccessors.c.set = function (value) { this.m21 = value; };
    prototypeAccessors.d.set = function (value) { this.m22 = value; };
    prototypeAccessors.e.set = function (value) { this.m41 = value; };
    prototypeAccessors.f.set = function (value) { this.m42 = value; };

    prototypeAccessors.m11.set = function (value) { this._matrix[0]  = value; };
    prototypeAccessors.m12.set = function (value) { this._matrix[4]  = value; };
    prototypeAccessors.m13.set = function (value) { this._matrix[8]  = value; };
    prototypeAccessors.m14.set = function (value) { this._matrix[12] = value; };

    prototypeAccessors.m21.set = function (value) { this._matrix[1]  = value; };
    prototypeAccessors.m22.set = function (value) { this._matrix[5]  = value; };
    prototypeAccessors.m23.set = function (value) { this._matrix[9]  = value; };
    prototypeAccessors.m24.set = function (value) { this._matrix[13] = value; };

    prototypeAccessors.m31.set = function (value) { this._matrix[2]  = value; };
    prototypeAccessors.m32.set = function (value) { this._matrix[6]  = value; };
    prototypeAccessors.m33.set = function (value) { this._matrix[10] = value; };
    prototypeAccessors.m34.set = function (value) { this._matrix[14] = value; };

    prototypeAccessors.m41.set = function (value) { this._matrix[3]  = value; };
    prototypeAccessors.m42.set = function (value) { this._matrix[7]  = value; };
    prototypeAccessors.m43.set = function (value) { this._matrix[11] = value; };
    prototypeAccessors.m44.set = function (value) { this._matrix[15] = value; };

    Object.defineProperties( DOMMatrix.prototype, prototypeAccessors );

    return DOMMatrix;
}(exports.DOMMatrixReadOnly));

let privatesMap;
const _ = function (o) {
    if (!privatesMap) {
        privatesMap = new WeakMap;
        let privates = {};
        privatesMap.set(o, privates);
        return privates
    }
    else {
        let privates = privatesMap.get(o);

        if (privates === undefined) {
            privates = {};
            privatesMap.set(o, privates);
        }

        return privates
    }
};

var DOMPointReadOnly = function DOMPointReadOnly(x,y,z,w) {
    if (arguments.length === 1) {
        if (!isDOMPointInit(x))
            { throw new TypeError('Expected an object with x, y, z, and w properties') }

        _(this).x = x.x;
        _(this).y = x.y;
        _(this).z = x.z;
        _(this).w = x.w;
    }
    else if (arguments.length === 4)  {
        _(this).x = x || 0;
        _(this).y = y || 0;
        _(this).z = z || 0;
        _(this).w = w || 0;
    }
    else {
        throw new TypeError('Expected 1 or 4 arguments')
    }
};

var prototypeAccessors = { x: {},y: {},z: {},w: {} };

prototypeAccessors.x.get = function () { return _(this).x };
prototypeAccessors.y.get = function () { return _(this).y };
prototypeAccessors.z.get = function () { return _(this).z };
prototypeAccessors.w.get = function () { return _(this).w };

DOMPointReadOnly.prototype.matrixTransform = function matrixTransform (matrix) {
    let result = new this.constructor(this);
    // TODO
    //const x
    //const y
    //const z
    //const w

    return result
};

DOMPointReadOnly.fromPoint = function fromPoint (other) {
    return new this(other)
};

Object.defineProperties( DOMPointReadOnly.prototype, prototypeAccessors );

var DOMPoint = (function (DOMPointReadOnly) {
    function DOMPoint () {
        DOMPointReadOnly.apply(this, arguments);
    }

    if ( DOMPointReadOnly ) DOMPoint.__proto__ = DOMPointReadOnly;
    DOMPoint.prototype = Object.create( DOMPointReadOnly && DOMPointReadOnly.prototype );
    DOMPoint.prototype.constructor = DOMPoint;

    var prototypeAccessors$1 = { x: {},y: {},z: {},w: {} };

    prototypeAccessors$1.x.set = function (value) { _(this).x = value; };
    prototypeAccessors$1.y.set = function (value) { _(this).y = value; };
    prototypeAccessors$1.z.set = function (value) { _(this).z = value; };
    prototypeAccessors$1.w.set = function (value) { _(this).w = value; };

    Object.defineProperties( DOMPoint.prototype, prototypeAccessors$1 );

    return DOMPoint;
}(DOMPointReadOnly));

function isDOMPointInit(o) {
    if (typeof o != 'object') { return false }

    if (
        'x' in o &&
        'y' in o &&
        'z' in o &&
        'w' in o
    ) { return true }

    return false
}

let _global = null;

// browser
if (typeof window != 'undefined') {
    _global = window;
}
else if (typeof global != 'undefined') {
    _global = global;
}

if (_global) {
    _global.DOMMatrix = DOMMatrix;
    _global.DOMMatrixReadOnly = exports.DOMMatrixReadOnly;
    _global.DOMPoint = DOMPoint;
    _global.DOMPointReadOnly = DOMPointReadOnly;
}

exports.DOMMatrix = DOMMatrix;
exports.DOMPoint = DOMPoint;
exports.DOMPointReadOnly = DOMPointReadOnly;

return exports;

}({}));
