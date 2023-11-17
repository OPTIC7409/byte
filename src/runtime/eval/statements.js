"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eval_function_declaration = exports.eval_var_declaration = exports.eval_program = void 0;
var interpreter_1 = require("../interpreter");
var values_1 = require("../values");
function eval_program(program, env) {
    var lastEvaluated = (0, values_1.MK_NULL)();
    for (var _i = 0, _a = program.body; _i < _a.length; _i++) {
        var statement = _a[_i];
        lastEvaluated = (0, interpreter_1.evaluate)(statement, env);
    }
    return lastEvaluated;
}
exports.eval_program = eval_program;
function eval_var_declaration(declaration, env) {
    var value = declaration.value
        ? (0, interpreter_1.evaluate)(declaration.value, env)
        : (0, values_1.MK_NULL)();
    return env.declareVar(declaration.identifier, value, declaration.constant);
}
exports.eval_var_declaration = eval_var_declaration;
function eval_function_declaration(declaration, env) {
    var func = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declarationEnv: env,
        body: declaration.body,
    };
    return env.declareVar(declaration.name, func, true);
}
exports.eval_function_declaration = eval_function_declaration;
//# sourceMappingURL=statements.js.map