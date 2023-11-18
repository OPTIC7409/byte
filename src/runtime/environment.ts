import {
	MK_BOOL,
	MK_NATIVE_FN,
	MK_NULL,
	MK_NUMBER,
	MK_STRING,
	MK_ARRAY,
	RuntimeVal,
} from "./values";

export function createGlobalEnv() {
	const env = new Environment();
	// Create Default Global Enviornment
	env.declareVar("true", MK_BOOL(true), true);
	env.declareVar("false", MK_BOOL(false), true);
	env.declareVar("null", MK_NULL(), true);

	// Define a native builtin method
	env.declareVar(
		"console",
		MK_NATIVE_FN((args, scope) => {
			for (const arg of args) {
				if (arg.type === "string") {
					// @ts-ignore
					console.log(arg.value);
				} else {
					// @ts-ignore
					console.log(arg.value);
				}
			}
			return MK_NULL();
		}),
		true
	);
	

	

	function lenFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		return MK_NUMBER(String(_args[0].value).length);
	}

	function lowercaseFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const result = String(_args[0].value).toLowerCase();
		return MK_STRING(result);
	}

	function uppercaseFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const result = String(_args[0].value).toUpperCase();
		return MK_STRING(result);
	}

	function substringFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const str = String(_args[0].value);
		// @ts-ignore
		const start = _args[1].value;
		// @ts-ignore
		const end = _args[2].value;
		const result = str.substring(start, end);
		return MK_STRING(result);
	}

	function concatStringsFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const result = _args.map(arg => String(arg.value)).join('');
		return MK_STRING(result);
	}	

	function replaceSubstringFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const str = String(_args[0].value);
		// @ts-ignore
		const search = String(_args[1].value);
		// @ts-ignore
		const replacement = String(_args[2].value);
		const result = str.replace(new RegExp(search, 'g'), replacement);
		return MK_STRING(result);
	}

	function trimWhitespaceFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const str = String(_args[0].value);
		const result = str.trim();
		return MK_STRING(result);
	}

	function startsWithFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const str = String(_args[0].value);
		// @ts-ignore
		const prefix = String(_args[1].value);
		const result = str.startsWith(prefix);
		return MK_BOOL(result);
	}

	function endsWithFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const str = String(_args[0].value);
		// @ts-ignore
		const suffix = String(_args[1].value);
		const result = str.endsWith(suffix);
		return MK_BOOL(result);
	}

	function splitStringFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const str = String(_args[0].value);
		// @ts-ignore
		const delimiter = String(_args[1].value);
		const result = str.split(delimiter);
		return MK_ARRAY(result.map(value => MK_STRING(value)));
	}

	// math functions

	function sqrtFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const result = Math.sqrt(_args[0].value);
		return MK_NUMBER(result);
	}

	function absFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const result = Math.abs(_args[0].value);
		return MK_NUMBER(result);
	}

	function sinFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const result = Math.sin(_args[0].value);
		return MK_NUMBER(result);
	}
	
	function cosFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const result = Math.cos(_args[0].value);
		return MK_NUMBER(result);
	}

	// file opening
	function openFileFunction(_args: RuntimeVal[], _env: Environment) {
		// Implement file opening logic
		// ...
	
		return MK_STRING("File opened successfully");
	}

	function closeFileFunction(_args: RuntimeVal[], _env: Environment) {
		// Implement file closing logic
		// ...
	
		return MK_STRING("File closed successfully");
	}

	function readFileFunction(_args: RuntimeVal[], _env: Environment) {
		// Implement file reading logic
		// ...
	
		return MK_STRING("File content: ...");
	}

	function writeFileFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const content = String(_args[1].value);
		// Implement file writing logic
		// ...
	
		return MK_STRING("File written successfully");
	}

	// memory management functions
	function mallocFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const size = _args[0].value;
		// Implement dynamic memory allocation logic
		// ...
	
		return MK_STRING("Memory allocated successfully");
	}

	function freeMemoryFunction(_args: RuntimeVal[], _env: Environment) {
		// Implement memory deallocation logic
		// ...
	
		return MK_STRING("Memory freed successfully");
	}

	// data structures functions
	function arrayPushFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const array = _args[0].value;
		// @ts-ignore
		const element = _args[1];
		array.push(element);
		return MK_STRING("Element pushed to array successfully");
	}

	function listAppendFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const list = _args[0].value;
		// @ts-ignore
		const element = _args[1];
		// Implement list append logic
		// ...
	
		return MK_STRING("Element appended to list successfully");
	}

	
	function dictGetFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const dictionary = _args[0].value;
		// @ts-ignore
		const key = _args[1].value;
		// Implement dictionary get logic
		// ...
	
		return MK_STRING("Value retrieved from dictionary");
	}

	function throwErrorFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const errorMessage = String(_args[0].value);
		throw new Error(errorMessage);
	}
	
	// time and date functions
	function sleepFunction(_args: RuntimeVal[], _env: Environment) {
		// @ts-ignore
		const milliseconds = _args[0].value;
		// Implement sleep logic
		// ...
	
		return MK_STRING("Sleep completed");
	}

	function timeFunction(_args: RuntimeVal[], _env: Environment) {
		return MK_NUMBER(Date.now());
	}

	// date functions
	function dateFunction(_args: RuntimeVal[], _env: Environment) {
		// Implement date logic
		// ...
	
		return MK_STRING("Date retrieved");
	}

	function dayFunction(_args: RuntimeVal[], _env: Environment) {
		// Implement day logic
		// ...
	
		return MK_STRING("Day retrieved");
	}

	function monthFunction(_args: RuntimeVal[], _env: Environment) {
		// Implement month logic
		// ...
	
		return MK_STRING("Month retrieved");
	}

	function yearFunction(_args: RuntimeVal[], _env: Environment) {
		// Implement year logic
		// ...
	
		return MK_STRING("Year retrieved");
	}

	// String manipulation functions
    env.declareVar("concat", MK_NATIVE_FN(concatStringsFunction), true);
    env.declareVar("substring", MK_NATIVE_FN(substringFunction), true);
    env.declareVar("upper", MK_NATIVE_FN(uppercaseFunction), true);
    env.declareVar("lower", MK_NATIVE_FN(lowercaseFunction), true);
    env.declareVar("replace", MK_NATIVE_FN(replaceSubstringFunction), true);
    env.declareVar("trim", MK_NATIVE_FN(trimWhitespaceFunction), true);
    env.declareVar("startsWith", MK_NATIVE_FN(startsWithFunction), true);
    env.declareVar("endsWith", MK_NATIVE_FN(endsWithFunction), true);
	// @ts-ignore
    env.declareVar("split", MK_NATIVE_FN(splitStringFunction), true);

    // Math functions
    env.declareVar("sqrt", MK_NATIVE_FN(sqrtFunction), true);
    env.declareVar("abs", MK_NATIVE_FN(absFunction), true);
    env.declareVar("sin", MK_NATIVE_FN(sinFunction), true);
    env.declareVar("cos", MK_NATIVE_FN(cosFunction), true);

    // File System functions
    env.declareVar("openFile", MK_NATIVE_FN(openFileFunction), true);
    env.declareVar("closeFile", MK_NATIVE_FN(closeFileFunction), true);
    env.declareVar("readFile", MK_NATIVE_FN(readFileFunction), true);
    env.declareVar("writeFile", MK_NATIVE_FN(writeFileFunction), true);

    // Memory Management functions
    env.declareVar("malloc", MK_NATIVE_FN(mallocFunction), true);
    env.declareVar("freeMemory", MK_NATIVE_FN(freeMemoryFunction), true);

    // Data Structure functions
    env.declareVar("arrayPush", MK_NATIVE_FN(arrayPushFunction), true);
    env.declareVar("listAppend", MK_NATIVE_FN(listAppendFunction), true);
    env.declareVar("dictGet", MK_NATIVE_FN(dictGetFunction), true);

    // Error Handling functions
	// @ts-ignore
    env.declareVar("throwError", MK_NATIVE_FN(throwErrorFunction), true);

    // Time and Date functions
    env.declareVar("sleep", MK_NATIVE_FN(sleepFunction), true);
    env.declareVar("time", MK_NATIVE_FN(timeFunction), true);
    env.declareVar("date", MK_NATIVE_FN(dateFunction), true);
    env.declareVar("day", MK_NATIVE_FN(dayFunction), true);
    env.declareVar("month", MK_NATIVE_FN(monthFunction), true);
    env.declareVar("year", MK_NATIVE_FN(yearFunction), true);

	return env;
}

export default class Environment {
	private parent?: Environment;
	private variables: Map<string, RuntimeVal>;
	private constants: Set<string>;

	constructor(parentENV?: Environment) {
		const global = parentENV ? true : false;
		this.parent = parentENV;
		this.variables = new Map();
		this.constants = new Set();
	}

	public declareVar(
		varname: string,
		value: RuntimeVal,
		constant: boolean
	): RuntimeVal {
		if (this.variables.has(varname)) {
			throw `Cannot declare variable ${varname}. As it already is defined.`;
		}

		this.variables.set(varname, value);
		if (constant) {
			this.constants.add(varname);
		}
		return value;
	}

	public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
		const env = this.resolve(varname);

		// Cannot assign to constant
		if (env.constants.has(varname)) {
			throw `Cannot reasign to variable ${varname} as it was declared constant.`;
		}

		env.variables.set(varname, value);
		return value;
	}

	public lookupVar(varname: string): RuntimeVal {
		const env = this.resolve(varname);
		return env.variables.get(varname) as RuntimeVal;
	}

	public resolve(varname: string): Environment {
		if (this.variables.has(varname)) {
			return this;
		}

		if (this.parent == undefined) {
			throw `Cannot resolve '${varname}' as it does not exist.`;
		}

		return this.parent.resolve(varname);
	}
}
