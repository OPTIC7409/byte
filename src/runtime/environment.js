"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGlobalEnv = void 0;
var values_1 = require("./values");
function createGlobalEnv() {
    var env = new Environment();
    env.declareVar("true", (0, values_1.MK_BOOL)(true), true);
    env.declareVar("false", (0, values_1.MK_BOOL)(false), true);
    env.declareVar("null", (0, values_1.MK_NULL)(), true);
    env.declareVar("print", (0, values_1.MK_NATIVE_FN)(function (args, scope) {
        console.log.apply(console, args);
        return (0, values_1.MK_NULL)();
    }), true);
    function timeFunction(_args, _env) {
        return (0, values_1.MK_NUMBER)(Date.now());
    }
    env.declareVar("time", (0, values_1.MK_NATIVE_FN)(timeFunction), true);
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