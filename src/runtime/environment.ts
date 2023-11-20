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
    // Create Default Global Environment
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);

	function declareStringFunction(
        name: string,
        func: (args: RuntimeVal[], env: Environment) => RuntimeVal
    ) {
        env.declareVar(name, MK_NATIVE_FN(func), true);
    }

    // Define a native builtin method
    env.declareVar(
        "console",
        MK_NATIVE_FN((args, scope) => {
            for (const arg of args) {
                // @ts-ignore
                console.log(arg.value);
            }
            return MK_NULL();
        }),
        true
    );

	declareStringFunction("concat", (args) =>
		// @ts-ignore
        MK_STRING(args.map((arg) => String(arg.value)).join(""))
    );
    declareStringFunction("substring", (args) => {
		// @ts-ignore
        const str = String(args[0].value);
		// @ts-ignore
        const start = args[1].value;
		// @ts-ignore
        const end = args[2].value;
        return MK_STRING(str.substring(start, end));
    });
    declareStringFunction("upper", (args) =>
    	// @ts-ignore
		MK_STRING(String(args[0].value).toUpperCase())
    );
    declareStringFunction("lower", (args) =>
		// @ts-ignore
        MK_STRING(String(args[0].value).toLowerCase())
    );
    declareStringFunction("replace", (args) => {
        // @ts-ignore
		const str = String(args[0].value);
		// @ts-ignore
		const search = String(args[1].value);
		// @ts-ignore
        const replacement = String(args[2].value);
        return MK_STRING(str.replace(new RegExp(search, "g"), replacement));
    });
    declareStringFunction("trim", (args) =>
        // @ts-ignore
		MK_STRING(String(args[0].value).trim())
    );
    declareStringFunction("startsWith", (args) => {
        // @ts-ignore
		const str = String(args[0].value);
		// @ts-ignore
        const prefix = String(args[1].value);
        return MK_BOOL(str.startsWith(prefix));
    });
    declareStringFunction("endsWith", (args) => {
        // @ts-ignore
		const str = String(args[0].value);
        // @ts-ignore
		const suffix = String(args[1].value);
        return MK_BOOL(str.endsWith(suffix));
    });
	// @ts-ignoreqr
    declareStringFunction("split", (args) => {
		// @ts-ignore
        const str = String(args[0].value);
		// @ts-ignore
        const delimiter = String(args[1].value);
        return MK_ARRAY(str.split(delimiter).map((value) => MK_STRING(value)));
    });

    // Math functions
	// @ts-ignore
    env.declareVar("sqrt", MK_NATIVE_FN((args) => MK_NUMBER(Math.sqrt(args[0].value))), true);
    // @ts-ignore
	env.declareVar("abs", MK_NATIVE_FN((args) => MK_NUMBER(Math.abs(args[0].value))), true);
    // @ts-ignore
	env.declareVar("sin", MK_NATIVE_FN((args) => MK_NUMBER(Math.sin(args[0].value))), true);
	// @ts-ignore
    env.declareVar("cos", MK_NATIVE_FN((args) => MK_NUMBER(Math.cos(args[0].value))), true);

    // File System functions
    declareStringFunction("openFile", (args) =>
        MK_STRING("File opened successfully")
    );
    declareStringFunction("closeFile", (args) =>
        MK_STRING("File closed successfully")
    );
    declareStringFunction("readFile", (args) =>
        MK_STRING("File content: ...")
    );
    declareStringFunction("writeFile", (args) =>
        MK_STRING("File written successfully")
    );

    // Memory Management functions
    declareStringFunction("malloc", (args) =>
        MK_STRING("Memory allocated successfully")
    );
    declareStringFunction("freeMemory", (args) =>
        MK_STRING("Memory freed successfully")
    );

    // Data Structure functions
    declareStringFunction("arrayPush", (args) =>
        MK_STRING("Element pushed to array successfully")
    );
    declareStringFunction("listAppend", (args) =>
        MK_STRING("Element appended to list successfully")
    );
    declareStringFunction("dictGet", (args) =>
        MK_STRING("Value retrieved from dictionary")
    );

    // Error Handling functions
    declareStringFunction("throwError", (args) => {
		// @ts-ignore
        const errorMessage = String(args[0].value);
        throw new Error(errorMessage);
    });

    // Time and Date functions
    declareStringFunction("sleep", (args) =>
        MK_STRING("Sleep completed")
    );
    env.declareVar("time", MK_NATIVE_FN((args) => MK_NUMBER(Date.now())), true);
    declareStringFunction("date", (args) =>
        MK_STRING("Date retrieved")
    );
    declareStringFunction("day", (args) =>
        MK_STRING("Day retrieved")
    );
    declareStringFunction("month", (args) =>
        MK_STRING("Month retrieved")
    );
    declareStringFunction("year", (args) =>
        MK_STRING("Year retrieved")
    );

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
