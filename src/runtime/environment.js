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
    function timeFunction(_args, _env) {
        return (0, values_1.MK_NUMBER)(Date.now());
    }
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
    env.declareVar("time", (0, values_1.MK_NATIVE_FN)(timeFunction), true);
    env.declareVar("len", (0, values_1.MK_NATIVE_FN)(lenFunction), true);
    env.declareVar("concat", (0, values_1.MK_NATIVE_FN)(concatStringsFunction), true);
    env.declareVar("substring", (0, values_1.MK_NATIVE_FN)(substringFunction), true);
    env.declareVar("upper", (0, values_1.MK_NATIVE_FN)(uppercaseFunction), true);
    env.declareVar("lower", (0, values_1.MK_NATIVE_FN)(lowercaseFunction), true);
    env.declareVar("replace", (0, values_1.MK_NATIVE_FN)(replaceSubstringFunction), true);
    env.declareVar("trim", (0, values_1.MK_NATIVE_FN)(trimWhitespaceFunction), true);
    env.declareVar("startsWith", (0, values_1.MK_NATIVE_FN)(startsWithFunction), true);
    env.declareVar("endsWith", (0, values_1.MK_NATIVE_FN)(endsWithFunction), true);
    env.declareVar("split", (0, values_1.MK_NATIVE_FN)(splitStringFunction), true);
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