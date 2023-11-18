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
			console.log(...args);
			return MK_NULL();
		}),
		true
	);

	function timeFunction(_args: RuntimeVal[], _env: Environment) {
		return MK_NUMBER(Date.now());
	}

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

	env.declareVar("time", MK_NATIVE_FN(timeFunction), true);
	env.declareVar("len", MK_NATIVE_FN(lenFunction), true);
	
	// string manipulation functions
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
