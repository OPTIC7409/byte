"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eval_try_catch_statement = exports.eval_if_statement = exports.eval_call_expr = exports.eval_object_expr = exports.eval_assignment = exports.eval_identifier = exports.eval_binary_expr = void 0;
var environment_1 = require("../environment");
var interpreter_1 = require("../interpreter");
var values_1 = require("../values");
var statements_1 = require("./statements");
function eval_numeric_binary_expr(lhs, rhs, operator) {
    var result;
    if (operator == "+") {
        result = lhs.value + rhs.value;
    }
    else if (operator == "-") {
        result = lhs.value - rhs.value;
    }
    else if (operator == "*") {
        result = lhs.value * rhs.value;
    }
    else if (operator == "/") {
        result = lhs.value / rhs.value;
    }
    else {
        result = lhs.value % rhs.value;
    }
    return { value: result, type: "number" };
}
function eval_binary_expr(binop, env) {
    var lhs = (0, interpreter_1.evaluate)(binop.left, env);
    var rhs = (0, interpreter_1.evaluate)(binop.right, env);
    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs, rhs, binop.operator);
    }
    return (0, values_1.MK_NULL)();
}
exports.eval_binary_expr = eval_binary_expr;
function eval_identifier(ident, env) {
    var val = env.lookupVar(ident.symbol);
    return val;
}
exports.eval_identifier = eval_identifier;
function eval_assignment(node, env) {
    if (node.assigne.kind !== "Identifier") {
        throw "Invalid LHS inaide assignment expr ".concat(JSON.stringify(node.assigne));
    }
    var varname = node.assigne.symbol;
    return env.assignVar(varname, (0, interpreter_1.evaluate)(node.value, env));
}
exports.eval_assignment = eval_assignment;
function eval_object_expr(obj, env) {
    var object = { type: "object", properties: new Map() };
    for (var _i = 0, _a = obj.properties; _i < _a.length; _i++) {
        var _b = _a[_i], key = _b.key, value = _b.value;
        var runtimeVal = value == undefined ? env.lookupVar(key) : (0, interpreter_1.evaluate)(value, env);
        object.properties.set(key, runtimeVal);
    }
    return object;
}
exports.eval_object_expr = eval_object_expr;
function eval_call_expr(expr, env) {
    var args = expr.args.map(function (arg) { return (0, interpreter_1.evaluate)(arg, env); });
    var fn = (0, interpreter_1.evaluate)(expr.caller, env);
    if (fn.type == "native-fn") {
        var result = fn.call(args, env);
        return result;
    }
    if (fn.type == "function") {
        var func = fn;
        var scope = new environment_1.default(func.declarationEnv);
        for (var i = 0; i < func.parameters.length; i++) {
            var varname = func.parameters[i];
            scope.declareVar(varname, args[i], false);
        }
        var result = (0, values_1.MK_NULL)();
        for (var _i = 0, _a = func.body; _i < _a.length; _i++) {
            var stmt = _a[_i];
            result = (0, interpreter_1.evaluate)(stmt, scope);
        }
        return result;
    }
    throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}
exports.eval_call_expr = eval_call_expr;
function eval_if_statement(node, env) {
    var testResult = (0, interpreter_1.evaluate)(node.test, env);
    if (testResult.value) {
        return (0, statements_1.eval_program)({ kind: "Program", body: node.body }, env);
    }
    else if (node.alternate) {
        return (0, statements_1.eval_program)({ kind: "Program", body: node.alternate }, env);
    }
    return (0, values_1.MK_NULL)();
}
exports.eval_if_statement = eval_if_statement;
function eval_try_catch_statement(node, env) {
    try {
        return (0, statements_1.eval_program)({ kind: "Program", body: node.body }, env);
    }
    catch (error) {
        return (0, statements_1.eval_program)({ kind: "Program", body: node.alternate }, env);
    }
}
exports.eval_try_catch_statement = eval_try_catch_statement;
//# sourceMappingURL=expressions.js.map