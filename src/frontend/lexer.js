"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["String"] = 2] = "String";
    TokenType[TokenType["Array"] = 3] = "Array";
    TokenType[TokenType["Def"] = 4] = "Def";
    TokenType[TokenType["Const"] = 5] = "Const";
    TokenType[TokenType["Func"] = 6] = "Func";
    TokenType[TokenType["If"] = 7] = "If";
    TokenType[TokenType["Else"] = 8] = "Else";
    TokenType[TokenType["For"] = 9] = "For";
    TokenType[TokenType["BinaryOperator"] = 10] = "BinaryOperator";
    TokenType[TokenType["Equals"] = 11] = "Equals";
    TokenType[TokenType["Comma"] = 12] = "Comma";
    TokenType[TokenType["Colon"] = 13] = "Colon";
    TokenType[TokenType["Semicolon"] = 14] = "Semicolon";
    TokenType[TokenType["Dot"] = 15] = "Dot";
    TokenType[TokenType["OpenParen"] = 16] = "OpenParen";
    TokenType[TokenType["CloseParen"] = 17] = "CloseParen";
    TokenType[TokenType["OpenBrace"] = 18] = "OpenBrace";
    TokenType[TokenType["CloseBrace"] = 19] = "CloseBrace";
    TokenType[TokenType["OpenBracket"] = 20] = "OpenBracket";
    TokenType[TokenType["CloseBracket"] = 21] = "CloseBracket";
    TokenType[TokenType["Quotation"] = 22] = "Quotation";
    TokenType[TokenType["Greater"] = 23] = "Greater";
    TokenType[TokenType["Lesser"] = 24] = "Lesser";
    TokenType[TokenType["EqualsCompare"] = 25] = "EqualsCompare";
    TokenType[TokenType["NotEqualsCompare"] = 26] = "NotEqualsCompare";
    TokenType[TokenType["Exclamation"] = 27] = "Exclamation";
    TokenType[TokenType["And"] = 28] = "And";
    TokenType[TokenType["Ampersand"] = 29] = "Ampersand";
    TokenType[TokenType["Bar"] = 30] = "Bar";
    TokenType[TokenType["EOF"] = 31] = "EOF";
})(TokenType || (exports.TokenType = TokenType = {}));
var KEYWORDS = {
    def: TokenType.Def,
    const: TokenType.Const,
    func: TokenType.Func,
    if: TokenType.If,
    else: TokenType.Else,
    for: TokenType.For,
    array: TokenType.Array,
};
function token(value, type) {
    if (value === void 0) { value = ""; }
    return { value: value, type: type };
}
function isalpha(src, isFirstChar) {
    if (isFirstChar === void 0) { isFirstChar = false; }
    if (isFirstChar) {
        return /^[A-Za-z_]+$/.test(src);
    }
    return /^[A-Za-z0-9_]+$/.test(src);
}
function isskippable(str) {
    return str == " " || str == "\n" || str == "\t" || str == '\r';
}
function isint(str) {
    var c = str.charCodeAt(0);
    var bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}
function tokenize(sourceCode) {
    var tokens = new Array();
    var src = sourceCode.split("");
    while (src.length > 0) {
        switch (src[0]) {
            case "(":
                tokens.push(token(src.shift(), TokenType.OpenParen));
                break;
            case ")":
                tokens.push(token(src.shift(), TokenType.CloseParen));
                break;
            case "{":
                tokens.push(token(src.shift(), TokenType.OpenBrace));
                break;
            case "}":
                tokens.push(token(src.shift(), TokenType.CloseBrace));
                break;
            case "[":
                tokens.push(token(src.shift(), TokenType.OpenBracket));
                break;
            case "]":
                tokens.push(token(src.shift(), TokenType.CloseBracket));
                break;
            case "+":
            case "-":
            case "*":
            case "%":
            case "/":
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
                break;
            case "<":
                tokens.push(token(src.shift(), TokenType.Lesser));
                break;
            case ">":
                tokens.push(token(src.shift(), TokenType.Greater));
                break;
            case ".":
                tokens.push(token(src.shift(), TokenType.Dot));
                break;
            case ";":
                tokens.push(token(src.shift(), TokenType.Semicolon));
                break;
            case ":":
                tokens.push(token(src.shift(), TokenType.Colon));
                break;
            case ",":
                tokens.push(token(src.shift(), TokenType.Comma));
                break;
            case "|":
                tokens.push(token(src.shift(), TokenType.Bar));
                break;
            default:
                if (isint(src[0])) {
                    var num = "";
                    while (src.length > 0 && isint(src[0])) {
                        num += src.shift();
                    }
                    tokens.push(token(num, TokenType.Number));
                }
                else {
                    switch (src[0]) {
                        case "=":
                            src.shift();
                            if (src[0] == '=') {
                                src.shift();
                                tokens.push(token("==", TokenType.EqualsCompare));
                            }
                            else {
                                tokens.push(token("=", TokenType.Equals));
                            }
                            break;
                        case "&":
                            src.shift();
                            if (src[0] == '&') {
                                src.shift();
                                tokens.push(token("&&", TokenType.And));
                            }
                            else {
                                tokens.push(token("&", TokenType.Ampersand));
                            }
                            break;
                        case "!":
                            src.shift();
                            if (String(src[0]) == '=') {
                                src.shift();
                                tokens.push(token("!=", TokenType.NotEqualsCompare));
                            }
                            else {
                                tokens.push(token("!", TokenType.Exclamation));
                            }
                            break;
                        case '"':
                            var str = "";
                            src.shift();
                            while (src.length > 0 && src[0] !== '"') {
                                str += src.shift();
                            }
                            src.shift();
                            tokens.push(token(str, TokenType.String));
                            break;
                        case "[":
                            src.shift();
                            tokens.push(token("[", TokenType.OpenBracket));
                            break;
                        case "]":
                            src.shift();
                            tokens.push(token("]", TokenType.CloseBracket));
                            break;
                        default:
                            if (isalpha(src[0], true)) {
                                var ident = "";
                                ident += src.shift();
                                while (src.length > 0 && isalpha(src[0])) {
                                    ident += src.shift();
                                }
                                var reserved = KEYWORDS[ident];
                                if (typeof reserved == "number") {
                                    tokens.push(token(ident, reserved));
                                }
                                else {
                                    tokens.push(token(ident, TokenType.Identifier));
                                }
                            }
                            else if (isskippable(src[0])) {
                                src.shift();
                            }
                            else {
                                console.error("Unrecognized character found in source: ", src[0].charCodeAt(0), src[0]);
                                process.exit(1);
                            }
                            break;
                    }
                }
                break;
        }
    }
    tokens.push({ type: TokenType.EOF, value: 'EndOfFile' });
    return tokens;
}
exports.tokenize = tokenize;
//# sourceMappingURL=lexer.js.map