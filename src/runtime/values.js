"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MK_NATIVE_FN = exports.MK_ARRAY = exports.MK_STRING = exports.MK_NUMBER = exports.MK_BOOL = exports.MK_NULL = void 0;
function MK_NULL() {
    return { type: "null", value: null };
}
exports.MK_NULL = MK_NULL;
function MK_BOOL(b) {
    if (b === void 0) { b = true; }
    return { type: "boolean", value: b };
}
exports.MK_BOOL = MK_BOOL;
function MK_NUMBER(n) {
    if (n === void 0) { n = 0; }
    return { type: "number", value: n };
}
exports.MK_NUMBER = MK_NUMBER;
function MK_STRING(n) {
    if (n === void 0) { n = ""; }
    return { type: "string", value: n };
}
exports.MK_STRING = MK_STRING;
function MK_ARRAY(n) {
    if (n === void 0) { n = []; }
    return { type: "array", value: n };
}
exports.MK_ARRAY = MK_ARRAY;
function MK_NATIVE_FN(call) {
    return { type: "native-fn", call: call };
}
exports.MK_NATIVE_FN = MK_NATIVE_FN;
//# sourceMappingURL=values.js.map