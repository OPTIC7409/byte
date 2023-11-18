"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGlobalEnv = void 0;
var values_1 = require("./values");
function createGlobalEnv() {
    var env = new Environment();
    env.declareVar("true", (0, values_1.MK_BOOL)(true), true);
    env.declareVar("false", (0, values_1.MK_BOOL)(false), true);
    env.declareVar("null", (0, values_1.MK_NULL)(), true);
    env.declareVar("console", (0, values_1.MK_NATIVE_FN)(function (args, scope) {
        console.log.apply(console, args);
        return (0, values_1.MK_NULL)();
    }), true);
    function lenFunction(_args, _env) {
        return (0, values_1.MK_NUMBER)(String(_args[0].value).length);
    }
    function lowercaseFunction(_args, _env) {
        var result = String(_args[0].value).toLowerCase();
        return (0, values_1.MK_STRING)(result);
    }
    function uppercaseFunction(_args, _env) {
        var result = String(_args[0].value).toUpperCase();
        return (0, values_1.MK_STRING)(result);
    }
    function substringFunction(_args, _env) {
        var str = String(_args[0].value);
        var start = _args[1].value;
        var end = _args[2].value;
        var result = str.substring(start, end);
        return (0, values_1.MK_STRING)(result);
    }
    function concatStringsFunction(_args, _env) {
        var result = _args.map(function (arg) { return String(arg.value); }).join('');
        return (0, values_1.MK_STRING)(result);
    }
    function replaceSubstringFunction(_args, _env) {
        var str = String(_args[0].value);
        var search = String(_args[1].value);
        var replacement = String(_args[2].value);
        var result = str.replace(new RegExp(search, 'g'), replacement);
        return (0, values_1.MK_STRING)(result);
    }
    function trimWhitespaceFunction(_args, _env) {
        var str = String(_args[0].value);
        var result = str.trim();
        return (0, values_1.MK_STRING)(result);
    }
    function startsWithFunction(_args, _env) {
        var str = String(_args[0].value);
        var prefix = String(_args[1].value);
        var result = str.startsWith(prefix);
        return (0, values_1.MK_BOOL)(result);
    }
    function endsWithFunction(_args, _env) {
        var str = String(_args[0].value);
        var suffix = String(_args[1].value);
        var result = str.endsWith(suffix);
        return (0, values_1.MK_BOOL)(result);
    }
    function splitStringFunction(_args, _env) {
        var str = String(_args[0].value);
        var delimiter = String(_args[1].value);
        var result = str.split(delimiter);
        return (0, values_1.MK_ARRAY)(result.map(function (value) { return (0, values_1.MK_STRING)(value); }));
    }
    function sqrtFunction(_args, _env) {
        var result = Math.sqrt(_args[0].value);
        return (0, values_1.MK_NUMBER)(result);
    }
    function absFunction(_args, _env) {
        var result = Math.abs(_args[0].value);
        return (0, values_1.MK_NUMBER)(result);
    }
    function sinFunction(_args, _env) {
        var result = Math.sin(_args[0].value);
        return (0, values_1.MK_NUMBER)(result);
    }
    function cosFunction(_args, _env) {
        var result = Math.cos(_args[0].value);
        return (0, values_1.MK_NUMBER)(result);
    }
    function openFileFunction(_args, _env) {
        return (0, values_1.MK_STRING)("File opened successfully");
    }
    function closeFileFunction(_args, _env) {
        return (0, values_1.MK_STRING)("File closed successfully");
    }
    function readFileFunction(_args, _env) {
        return (0, values_1.MK_STRING)("File content: ...");
    }
    function writeFileFunction(_args, _env) {
        var content = String(_args[1].value);
        return (0, values_1.MK_STRING)("File written successfully");
    }
    function mallocFunction(_args, _env) {
        var size = _args[0].value;
        return (0, values_1.MK_STRING)("Memory allocated successfully");
    }
    function freeMemoryFunction(_args, _env) {
        return (0, values_1.MK_STRING)("Memory freed successfully");
    }
    function arrayPushFunction(_args, _env) {
        var array = _args[0].value;
        var element = _args[1];
        array.push(element);
        return (0, values_1.MK_STRING)("Element pushed to array successfully");
    }
    function listAppendFunction(_args, _env) {
        var list = _args[0].value;
        var element = _args[1];
        return (0, values_1.MK_STRING)("Element appended to list successfully");
    }
    function dictGetFunction(_args, _env) {
        var dictionary = _args[0].value;
        var key = _args[1].value;
        return (0, values_1.MK_STRING)("Value retrieved from dictionary");
    }
    function throwErrorFunction(_args, _env) {
        var errorMessage = String(_args[0].value);
        throw new Error(errorMessage);
    }
    function sleepFunction(_args, _env) {
        var milliseconds = _args[0].value;
        return (0, values_1.MK_STRING)("Sleep completed");
    }
    function timeFunction(_args, _env) {
        return (0, values_1.MK_NUMBER)(Date.now());
    }
    function dateFunction(_args, _env) {
        return (0, values_1.MK_STRING)("Date retrieved");
    }
    function dayFunction(_args, _env) {
        return (0, values_1.MK_STRING)("Day retrieved");
    }
    function monthFunction(_args, _env) {
        return (0, values_1.MK_STRING)("Month retrieved");
    }
    function yearFunction(_args, _env) {
        return (0, values_1.MK_STRING)("Year retrieved");
    }
    env.declareVar("concat", (0, values_1.MK_NATIVE_FN)(concatStringsFunction), true);
    env.declareVar("substring", (0, values_1.MK_NATIVE_FN)(substringFunction), true);
    env.declareVar("upper", (0, values_1.MK_NATIVE_FN)(uppercaseFunction), true);
    env.declareVar("lower", (0, values_1.MK_NATIVE_FN)(lowercaseFunction), true);
    env.declareVar("replace", (0, values_1.MK_NATIVE_FN)(replaceSubstringFunction), true);
    env.declareVar("trim", (0, values_1.MK_NATIVE_FN)(trimWhitespaceFunction), true);
    env.declareVar("startsWith", (0, values_1.MK_NATIVE_FN)(startsWithFunction), true);
    env.declareVar("endsWith", (0, values_1.MK_NATIVE_FN)(endsWithFunction), true);
    env.declareVar("split", (0, values_1.MK_NATIVE_FN)(splitStringFunction), true);
    env.declareVar("sqrt", (0, values_1.MK_NATIVE_FN)(sqrtFunction), true);
    env.declareVar("abs", (0, values_1.MK_NATIVE_FN)(absFunction), true);
    env.declareVar("sin", (0, values_1.MK_NATIVE_FN)(sinFunction), true);
    env.declareVar("cos", (0, values_1.MK_NATIVE_FN)(cosFunction), true);
    env.declareVar("openFile", (0, values_1.MK_NATIVE_FN)(openFileFunction), true);
    env.declareVar("closeFile", (0, values_1.MK_NATIVE_FN)(closeFileFunction), true);
    env.declareVar("readFile", (0, values_1.MK_NATIVE_FN)(readFileFunction), true);
    env.declareVar("writeFile", (0, values_1.MK_NATIVE_FN)(writeFileFunction), true);
    env.declareVar("malloc", (0, values_1.MK_NATIVE_FN)(mallocFunction), true);
    env.declareVar("freeMemory", (0, values_1.MK_NATIVE_FN)(freeMemoryFunction), true);
    env.declareVar("arrayPush", (0, values_1.MK_NATIVE_FN)(arrayPushFunction), true);
    env.declareVar("listAppend", (0, values_1.MK_NATIVE_FN)(listAppendFunction), true);
    env.declareVar("dictGet", (0, values_1.MK_NATIVE_FN)(dictGetFunction), true);
    env.declareVar("throwError", (0, values_1.MK_NATIVE_FN)(throwErrorFunction), true);
    env.declareVar("sleep", (0, values_1.MK_NATIVE_FN)(sleepFunction), true);
    env.declareVar("time", (0, values_1.MK_NATIVE_FN)(timeFunction), true);
    env.declareVar("date", (0, values_1.MK_NATIVE_FN)(dateFunction), true);
    env.declareVar("day", (0, values_1.MK_NATIVE_FN)(dayFunction), true);
    env.declareVar("month", (0, values_1.MK_NATIVE_FN)(monthFunction), true);
    env.declareVar("year", (0, values_1.MK_NATIVE_FN)(yearFunction), true);
    return env;
}
exports.createGlobalEnv = createGlobalEnv;
var Environment = (function () {
    function Environment(parentENV) {
        var global = parentENV ? true : false;
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();
    }
    Environment.prototype.declareVar = function (varname, value, constant) {
        if (this.variables.has(varname)) {
            throw "Cannot declare variable ".concat(varname, ". As it already is defined.");
        }
        this.variables.set(varname, value);
        if (constant) {
            this.constants.add(varname);
        }
        return value;
    };
    Environment.prototype.assignVar = function (varname, value) {
        var env = this.resolve(varname);
        if (env.constants.has(varname)) {
            throw "Cannot reasign to variable ".concat(varname, " as it was declared constant.");
        }
        env.variables.set(varname, value);
        return value;
    };
    Environment.prototype.lookupVar = function (varname) {
        var env = this.resolve(varname);
        return env.variables.get(varname);
    };
    Environment.prototype.resolve = function (varname) {
        if (this.variables.has(varname)) {
            return this;
        }
        if (this.parent == undefined) {
            throw "Cannot resolve '".concat(varname, "' as it does not exist.");
        }
        return this.parent.resolve(varname);
    };
    return Environment;
}());
exports.default = Environment;
//# sourceMappingURL=environment.js.map