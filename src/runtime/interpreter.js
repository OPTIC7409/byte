"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
var statements_1 = require("./eval/statements");
var expressions_1 = require("./eval/expressions");
function evaluate(astNode, env) {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                value: astNode.value,
                type: "number",
            };
        case "Identifier":
            return (0, expressions_1.eval_identifier)(astNode, env);
        case "ObjectLiteral":
            return (0, expressions_1.eval_object_expr)(astNode, env);
        case "CallExpr":
            return (0, expressions_1.eval_call_expr)(astNode, env);
        case "AssignmentExpr":
            return (0, expressions_1.eval_assignment)(astNode, env);
        case "BinaryExpr":
            return (0, expressions_1.eval_binary_expr)(astNode, env);
        case "Program":
            return (0, statements_1.eval_program)(astNode, env);
        case "StringLiteral":
            return {
                value: astNode.value,
                type: "string",
            };
        case "VarDeclaration":
            return (0, statements_1.eval_var_declaration)(astNode, env);
        case "FunctionDeclaration":
            return (0, statements_1.eval_function_declaration)(astNode, env);
        case "IfStatement":
            return (0, expressions_1.eval_if_statement)(astNode, env);
        case "TryCatchStatement":
            return (0, expressions_1.eval_try_catch_statement)(astNode, env);
        default:
            console.error("This AST Node has not yet been setup for interpretation.\n", astNode);
            process.exit(0);
    }
}
exports.evaluate = evaluate;
//# sourceMappingURL=interpreter.js.map