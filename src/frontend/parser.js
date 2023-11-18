"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("./lexer");
var Parser = (function () {
    function Parser() {
        this.tokens = [];
    }
    Parser.prototype.not_eof = function () {
        return this.tokens[0].type != lexer_1.TokenType.EOF;
    };
    Parser.prototype.at = function () {
        return this.tokens[0];
    };
    Parser.prototype.eat = function () {
        var prev = this.tokens.shift();
        return prev;
    };
    Parser.prototype.expect = function (type, err) {
        var prev = this.tokens.shift();
        if (!prev || prev.type != type) {
            console.error("Parser error:\n", err, prev, "Expecting: ", type);
            process.exit(1);
        }
        return prev;
    };
    Parser.prototype.produceAST = function (sourceCode) {
        this.tokens = (0, lexer_1.tokenize)(sourceCode);
        var program = {
            kind: "Program",
            body: [],
        };
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }
        return program;
    };
    Parser.prototype.parse_stmt = function () {
        switch (this.at().type) {
            case lexer_1.TokenType.Def:
            case lexer_1.TokenType.Const:
                return this.parse_var_declaration();
            case lexer_1.TokenType.Func:
                return this.parse_function_declaration();
            case lexer_1.TokenType.If:
                return this.parse_if_statement();
            case lexer_1.TokenType.For:
                return this.parse_for_statement();
            default:
                return this.parse_expr();
        }
    };
    Parser.prototype.parse_block_statement = function () {
        this.expect(lexer_1.TokenType.OpenBrace, "Opening brace expected.");
        var body = [];
        while (this.not_eof() && this.at().type !== lexer_1.TokenType.CloseBrace) {
            var stmt = this.parse_stmt();
            body.push(stmt);
        }
        this.expect(lexer_1.TokenType.CloseBrace, "Closing brace expected.");
        return body;
    };
    Parser.prototype.parse_for_statement = function () {
        this.eat();
        this.expect(lexer_1.TokenType.OpenParen, "Expected opening parenthesis in while.");
        var init = this.parse_var_declaration();
        var test = this.parse_expr();
        this.expect(lexer_1.TokenType.Semicolon, "Expected semicolon following test expression in for statement");
        var update = this.parse_assignment_expr();
        this.expect(lexer_1.TokenType.CloseParen, "Expected closing paranthesis following additive expression in for statement");
        var body = this.parse_block_statement();
        return {
            kind: 'ForStatement',
            init: init,
            test: test,
            update: update,
            body: body,
        };
    };
    Parser.prototype.parse_if_statement = function () {
        this.eat();
        this.expect(lexer_1.TokenType.OpenParen, "Expected opening parenthesis following if keyword");
        var test = this.parse_expr();
        this.expect(lexer_1.TokenType.CloseParen, "Expected closing parenthesis following if keyword");
        var body = this.parse_block_statement();
        var alternate;
        if (this.at().type == lexer_1.TokenType.Else) {
            this.eat();
            if (this.at().type == lexer_1.TokenType.If) {
                alternate = [this.parse_if_statement()];
            }
            else {
                alternate = this.parse_block_statement();
            }
        }
        return {
            kind: 'IfStatement',
            body: body,
            test: test,
            alternate: alternate
        };
    };
    Parser.prototype.parse_function_declaration = function () {
        this.eat();
        var name = this.expect(lexer_1.TokenType.Identifier, "Expected function name following func keyword").value;
        var args = this.parse_args();
        var params = [];
        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
            var arg = args_1[_i];
            if (arg.kind !== "Identifier") {
                throw "Inside function declaration expected parameters to be of type String";
            }
            params.push(arg.symbol);
        }
        var body = this.parse_block_statement();
        var fn = {
            body: body,
            name: name,
            parameters: params, kind: "FunctionDeclaration"
        };
        return fn;
    };
    Parser.prototype.parse_var_declaration = function () {
        var isConstant = this.eat().type == lexer_1.TokenType.Const;
        var identifier = this.expect(lexer_1.TokenType.Identifier, "Expected identifier name following def/const keywords.").value;
        if (this.at().type == lexer_1.TokenType.Semicolon) {
            this.eat();
            if (isConstant)
                throw "Must assign value to constant expression. No value provided.";
            return { kind: "VarDeclaration", identifier: identifier, constant: false, value: undefined };
        }
        this.expect(lexer_1.TokenType.Equals, "Expected equals token following identifier in var declaration.");
        var declaration = { kind: "VarDeclaration", value: this.parse_expr(), constant: isConstant, identifier: identifier };
        if (this.at().type == lexer_1.TokenType.String)
            this.eat();
        this.expect(lexer_1.TokenType.Semicolon, "Variable declaration statement must end in semicolon (\";\")");
        return declaration;
    };
    Parser.prototype.parse_expr = function () {
        return this.parse_assignment_expr();
    };
    Parser.prototype.parse_assignment_expr = function () {
        var left = this.parse_object_expr();
        if (this.at().type == lexer_1.TokenType.Equals) {
            this.eat();
            var value = this.parse_assignment_expr();
            return { value: value, assigne: left, kind: "AssignmentExpr" };
        }
        return left;
    };
    Parser.prototype.parse_and_statement = function () {
        var left = this.parse_additive_expr();
        if (["&&", "|"].includes(this.at().value)) {
            var operator = this.eat().value;
            var right = this.parse_additive_expr();
            left = {
                kind: "BinaryExpr",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_try_catch_expr = function () {
        if (this.at().value !== 'try') {
            return this.parse_and_statement();
        }
        this.eat();
        var body = this.parse_block_statement();
        if (this.at().value !== 'catch')
            throw "Try statement must include a catch statement.";
        this.eat();
        var alternate = this.parse_block_statement();
        return {
            kind: "TryCatchStatement",
            body: body,
            alternate: alternate,
        };
    };
    Parser.prototype.parse_object_expr = function () {
        if (this.at().type !== lexer_1.TokenType.OpenBrace) {
            return this.parse_try_catch_expr();
        }
        this.eat();
        var properties = new Array();
        while (this.not_eof() && this.at().type != lexer_1.TokenType.CloseBrace) {
            var key = this.expect(lexer_1.TokenType.Identifier, "Object literal missing key.").value;
            if (this.at().type == lexer_1.TokenType.Comma) {
                this.eat();
                properties.push({ key: key, kind: "Property" });
                continue;
            }
            else if (this.at().type == lexer_1.TokenType.CloseBrace) {
                properties.push({ key: key, kind: "Property" });
                continue;
            }
            this.expect(lexer_1.TokenType.Colon, "Missing colon following identifier in object expression. (\",\")");
            var value = this.parse_expr();
            properties.push({ key: key, value: value, kind: "Property" });
            if (this.at().type != lexer_1.TokenType.CloseBrace) {
                this.expect(lexer_1.TokenType.Comma, "Expected comma or closing brace following property");
            }
        }
        this.expect(lexer_1.TokenType.CloseBrace, "Object literal missing closed brace. (\"}\")");
        return { kind: "ObjectLiteral", properties: properties };
    };
    Parser.prototype.parse_additive_expr = function () {
        var left = this.parse_multiplicative_expr();
        while (["+", "-", "==", "!=", "<", ">"].includes(this.at().value)) {
            var operator = this.eat().value;
            var right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_multiplicative_expr = function () {
        var left = this.parse_call_member_expr();
        while (["/", "*", "%"].includes(this.at().value)) {
            var operator = this.eat().value;
            var right = this.parse_call_member_expr();
            left = {
                kind: "BinaryExpr",
                left: left,
                right: right,
                operator: operator
            };
        }
        return left;
    };
    Parser.prototype.parse_call_member_expr = function () {
        var member = this.parse_member_expr();
        if (this.at().type == lexer_1.TokenType.OpenParen) {
            return this.parse_call_expr(member);
        }
        return member;
    };
    Parser.prototype.parse_call_expr = function (caller) {
        var call_expr = {
            kind: "CallExpr",
            caller: caller,
            args: this.parse_args(),
        };
        if (this.at().type == lexer_1.TokenType.OpenParen) {
            call_expr = this.parse_call_expr(call_expr);
        }
        return call_expr;
    };
    Parser.prototype.parse_args = function () {
        this.expect(lexer_1.TokenType.OpenParen, "Expected open parenthesis");
        var args = this.at().type == lexer_1.TokenType.CloseParen
            ? []
            : this.parse_args_list();
        this.expect(lexer_1.TokenType.CloseParen, "Missing closing parenthesis inside args list");
        return args;
    };
    Parser.prototype.parse_args_list = function () {
        var args = [this.parse_assignment_expr()];
        while (this.at().type == lexer_1.TokenType.Comma && this.eat()) {
            args.push(this.parse_assignment_expr());
        }
        return args;
    };
    Parser.prototype.parse_member_expr = function () {
        var object = this.parse_primary_expr();
        while (this.at().type == lexer_1.TokenType.Dot || this.at().type == lexer_1.TokenType.OpenBracket) {
            var operator = this.eat();
            var property = void 0;
            var computed = void 0;
            if (operator.type == lexer_1.TokenType.Dot) {
                computed = false;
                property = this.parse_primary_expr();
                if (property.kind !== "Identifier") {
                    throw "Cannot use dot operator without right hand side being an identifier";
                }
            }
            else {
                computed = true;
                property = this.parse_expr();
                this.expect(lexer_1.TokenType.CloseBracket, "Missing closing bracket in computed value.");
            }
            object = {
                kind: "MemberExpr",
                object: object,
                property: property,
                computed: computed
            };
        }
        return object;
    };
    Parser.prototype.parse_primary_expr = function () {
        var tk = this.at().type;
        switch (tk) {
            case lexer_1.TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value };
            case lexer_1.TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.eat().value)
                };
            case lexer_1.TokenType.String:
                return {
                    kind: "StringLiteral",
                    value: this.eat().value
                };
            case lexer_1.TokenType.Array:
                return this.parse_array_literal();
            case lexer_1.TokenType.OpenParen:
                this.eat();
                var value = this.parse_expr();
                this.expect(lexer_1.TokenType.CloseParen, "Unexpected token inside () expr. Expected \")\"");
                return value;
            default:
                console.error("Unexpected token found during parsing!", this.at());
                process.exit(1);
        }
    };
    Parser.prototype.parse_array_literal = function () {
        this.eat();
        var elements = [];
        while (this.at().type != lexer_1.TokenType.CloseBracket) {
            elements.push(this.parse_expr());
            if (this.at().type != lexer_1.TokenType.CloseBracket) {
                this.expect(lexer_1.TokenType.Comma, "Missing comma in array literal.");
            }
        }
        this.expect(lexer_1.TokenType.CloseBracket, "Missing closing bracket in array literal.");
        return {
            kind: "ArrayLiteral",
            elements: elements
        };
    };
    return Parser;
}());
exports.default = Parser;
//# sourceMappingURL=parser.js.map