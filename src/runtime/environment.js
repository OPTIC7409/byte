"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGlobalEnv = void 0;
var values_1 = require("./values");
function createGlobalEnv() {
    var env = new Environment();
    env.declareVar("true", (0, values_1.MK_BOOL)(true), true);
    env.declareVar("false", (0, values_1.MK_BOOL)(false), true);
    env.declareVar("null", (0, values_1.MK_NULL)(), true);
    function declareStringFunction(name, func) {
        env.declareVar(name, (0, values_1.MK_NATIVE_FN)(func), true);
    }
    env.declareVar("console", (0, values_1.MK_NATIVE_FN)(function (args, scope) {
        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
            var arg = args_1[_i];
            console.log(arg.value);
        }
        return (0, values_1.MK_NULL)();
    }), true);
    declareStringFunction("concat", function (args) {
        return (0, values_1.MK_STRING)(args.map(function (arg) { return String(arg.value); }).join(""));
    });
    declareStringFunction("substring", function (args) {
        var str = String(args[0].value);
        var start = args[1].value;
        var end = args[2].value;
        return (0, values_1.MK_STRING)(str.substring(start, end));
    });
    declareStringFunction("upper", function (args) {
        return (0, values_1.MK_STRING)(String(args[0].value).toUpperCase());
    });
    declareStringFunction("lower", function (args) {
        return (0, values_1.MK_STRING)(String(args[0].value).toLowerCase());
    });
    declareStringFunction("replace", function (args) {
        var str = String(args[0].value);
        var search = String(args[1].value);
        var replacement = String(args[2].value);
        return (0, values_1.MK_STRING)(str.replace(new RegExp(search, "g"), replacement));
    });
    declareStringFunction("trim", function (args) {
        return (0, values_1.MK_STRING)(String(args[0].value).trim());
    });
    declareStringFunction("startsWith", function (args) {
        var str = String(args[0].value);
        var prefix = String(args[1].value);
        return (0, values_1.MK_BOOL)(str.startsWith(prefix));
    });
    declareStringFunction("endsWith", function (args) {
        var str = String(args[0].value);
        var suffix = String(args[1].value);
        return (0, values_1.MK_BOOL)(str.endsWith(suffix));
    });
    declareStringFunction("split", function (args) {
        var str = String(args[0].value);
        var delimiter = String(args[1].value);
        return (0, values_1.MK_ARRAY)(str.split(delimiter).map(function (value) { return (0, values_1.MK_STRING)(value); }));
    });
    env.declareVar("sqrt", (0, values_1.MK_NATIVE_FN)(function (args) { return (0, values_1.MK_NUMBER)(Math.sqrt(args[0].value)); }), true);
    env.declareVar("abs", (0, values_1.MK_NATIVE_FN)(function (args) { return (0, values_1.MK_NUMBER)(Math.abs(args[0].value)); }), true);
    env.declareVar("sin", (0, values_1.MK_NATIVE_FN)(function (args) { return (0, values_1.MK_NUMBER)(Math.sin(args[0].value)); }), true);
    env.declareVar("cos", (0, values_1.MK_NATIVE_FN)(function (args) { return (0, values_1.MK_NUMBER)(Math.cos(args[0].value)); }), true);
    declareStringFunction("openFile", function (args) {
        return (0, values_1.MK_STRING)("File opened successfully");
    });
    declareStringFunction("closeFile", function (args) {
        return (0, values_1.MK_STRING)("File closed successfully");
    });
    declareStringFunction("readFile", function (args) {
        return (0, values_1.MK_STRING)("File content: ...");
    });
    declareStringFunction("writeFile", function (args) {
        return (0, values_1.MK_STRING)("File written successfully");
    });
    declareStringFunction("malloc", function (args) {
        return (0, values_1.MK_STRING)("Memory allocated successfully");
    });
    declareStringFunction("freeMemory", function (args) {
        return (0, values_1.MK_STRING)("Memory freed successfully");
    });
    declareStringFunction("arrayPush", function (args) {
        return (0, values_1.MK_STRING)("Element pushed to array successfully");
    });
    declareStringFunction("listAppend", function (args) {
        return (0, values_1.MK_STRING)("Element appended to list successfully");
    });
    declareStringFunction("dictGet", function (args) {
        return (0, values_1.MK_STRING)("Value retrieved from dictionary");
    });
    declareStringFunction("throwError", function (args) {
        var errorMessage = String(args[0].value);
        throw new Error(errorMessage);
    });
    declareStringFunction("sleep", function (args) {
        return (0, values_1.MK_STRING)("Sleep completed");
    });
    env.declareVar("time", (0, values_1.MK_NATIVE_FN)(function (args) { return (0, values_1.MK_NUMBER)(Date.now()); }), true);
    declareStringFunction("date", function (args) {
        return (0, values_1.MK_STRING)("Date retrieved");
    });
    declareStringFunction("day", function (args) {
        return (0, values_1.MK_STRING)("Day retrieved");
    });
    declareStringFunction("month", function (args) {
        return (0, values_1.MK_STRING)("Month retrieved");
    });
    declareStringFunction("year", function (args) {
        return (0, values_1.MK_STRING)("Year retrieved");
    });
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