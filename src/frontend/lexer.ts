export enum TokenType {
    // Literal Types
    Number,
    Identifier,
    String,
    Array,
    // Keywords
    Def,
    Const,
    Func,
    If,
    Else,
    For,

    // Grouping * Operators
    BinaryOperator,
    Equals, // =
    Comma, // ,
    Colon, // :
    Semicolon, // ;
    Dot, // .
    OpenParen, // (
    CloseParen, // )
    OpenBrace, // {
    CloseBrace, // }
    OpenBracket, // [
    CloseBracket, // ]
    Quotation, // "
    Greater, // >
    Lesser, // <
    EqualsCompare, // ==
    NotEqualsCompare, // !=
    Exclamation, // !
    And, // &&
    Ampersand, // &
    Bar, // |
    EOF, // Signified the end of file.
}

const KEYWORDS: Record<string, TokenType> = {
    def: TokenType.Def,
    const: TokenType.Const,
    func: TokenType.Func,
    if: TokenType.If,
    else: TokenType.Else,
    for: TokenType.For,
    array: TokenType.Array,
};

export interface Token {
    value: string;
    type: TokenType;
}

// Returns a token of a given type and value
function token(value = "", type: TokenType): Token {
    return { value, type };
}

/**
 * Returns whether the character passed in alphabetic -> [a-zA-Z] and _
 */
function isalpha(src: string, isFirstChar: boolean = false) {
    if (isFirstChar) {
        return /^[A-Za-z_]+$/.test(src);
    }
    return /^[A-Za-z0-9_]+$/.test(src);
}

/**
 * Returns true if the character is whitespace like -> [\s, \t, \n]
 */
function isskippable(str: string) {
    return str == " " || str == "\n" || str == "\t" || str == '\r';
}

/**
 Return whether the character is a valid integer -> [0-9]
 */
function isint(str: string) {
    const c = str.charCodeAt(0);
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return c >= bounds[0] && c <= bounds[1];
}

/**
 * Given a string representing source code: Produce tokens and handles
 * possible unidentified characters.
 *
 * - Returns a array of tokens.
 * - Does not modify the incoming string.
 */
export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    // produce tokens until the EOF is reached.
    while (src.length > 0) {

        switch(src[0]){
            // BEGIN PARSING ONE CHARACTER TOKENS
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
            // HANDLE BINARY OPERATORS
            case "+":
            case "-":
            case "*":
            case "%":
            case "/":
                tokens.push(token(src.shift(), TokenType.BinaryOperator));
                break;
            // Handle Conditional & Assignment Tokens
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
                    let num = "";
                    while (src.length > 0 && isint(src[0])) {
                        num += src.shift();
                    }
        
                    // append new numeric token.
                    tokens.push(token(num, TokenType.Number));
                } else {

                    switch(src[0]) {
                        case "=":
                            src.shift()
                            if (src[0] == '=') {
                                src.shift()
                                tokens.push(token("==", TokenType.EqualsCompare));
                            } else {
                                tokens.push(token("=", TokenType.Equals));
                            }
                            break;
                        case "&":
                            src.shift()
                            if (src[0] == '&') {
                                src.shift()
                                tokens.push(token("&&", TokenType.And));
                            } else {
                                tokens.push(token("&", TokenType.Ampersand));
                            }
                            break;
                        case "!":
                            src.shift();
                            if (String(src[0]) == '=') {
                                src.shift()
                                tokens.push(token("!=", TokenType.NotEqualsCompare));
                            } else {
                                tokens.push(token("!", TokenType.Exclamation));
                            }
                            break;
                        case '"':
                            let str = "";
                            src.shift();
                
                            while (src.length > 0 && src[0] !== '"') {
                                str += src.shift();
                            }
                
                            src.shift();
                
                            // append new string token.
                            tokens.push(token(str, TokenType.String));
                            break;
                        
                        // arrays
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
                            let ident = "";
                              ident += src.shift();  // Add first character which is alphabetic or underscore
                        
                              while (src.length > 0 && isalpha(src[0])) {
                                ident += src.shift();  // Subsequent characters can be alphanumeric or underscore
                            }
                            
                            // CHECK FOR RESERVED KEYWORDS
                              const reserved = KEYWORDS[ident];
                              // If value is not undefined then the identifier is
                                // recognized keyword
                            if (typeof reserved == "number") {
                                tokens.push(token(ident, reserved));
                            } else {
                                // Unrecognized name must mean user-defined symbol.
                                tokens.push(token(ident, TokenType.Identifier));
                               }
                           } else if (isskippable(src[0])) {
                             // Skip unneeded chars.
                              src.shift();
                          } else {
                              // Handle unrecognized characters.
                               // TODO: Implement better errors and error recovery.

                            console.error(
                                "Unrecognized character found in source: ",
                                src[0].charCodeAt(0),
                                src[0]
                               );
                            process.exit(1);
                        }
                         break;
                    }
                }
                break;
        }
    }

    tokens.push({ type: TokenType.EOF, value: 'EndOfFile' })

    return tokens;
}