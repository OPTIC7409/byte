import { NumberVal, RuntimeVal, StringVal } from "./values";
import {
	AssignmentExpr,
	BinaryExpr,
	CallExpr,
	FunctionDeclaration,
	Identifier,
	NumericLiteral,
	ObjectLiteral,
	TryCatchStatement,
	IfStatement,
	StringLiteral,
	Program,
	Stmt,
	VarDeclaration,
} from "../frontend/ast";
import Environment from "./environment";
import {
	eval_function_declaration,
	eval_program,
	eval_var_declaration,
} from "./eval/statements";
import {
	eval_assignment,
	eval_binary_expr,
	eval_call_expr,
	eval_identifier,
	eval_if_statement,
	eval_try_catch_statement,
	eval_object_expr,
} from "./eval/expressions";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
	switch (astNode.kind) {
		case "NumericLiteral":
			return {
				value: (astNode as NumericLiteral).value,
				type: "number",
			} as NumberVal;
		case "Identifier":
			return eval_identifier(astNode as Identifier, env);
		case "ObjectLiteral":
			return eval_object_expr(astNode as ObjectLiteral, env);
		case "CallExpr":
			return eval_call_expr(astNode as CallExpr, env);
		case "AssignmentExpr":
			return eval_assignment(astNode as AssignmentExpr, env);
		case "BinaryExpr":
			return eval_binary_expr(astNode as BinaryExpr, env);
		case "Program":
			return eval_program(astNode as Program, env);
		// Handle statements
		case "StringLiteral":
			return {
				value: (astNode as StringLiteral).value,
				type: "string",
			} as StringVal;
		case "VarDeclaration":
			return eval_var_declaration(astNode as VarDeclaration, env);
		case "FunctionDeclaration":
			return eval_function_declaration(astNode as FunctionDeclaration, env);
		case "IfStatement":
			return eval_if_statement(astNode as IfStatement, env);
		case "TryCatchStatement":
			return eval_try_catch_statement(astNode as TryCatchStatement, env);
		default:
			console.error(
				"This AST Node has not yet been setup for interpretation.\n",
				astNode
			);
			process.exit(0);
	}
}
