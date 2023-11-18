import Parser from "./frontend/parser";
import { createGlobalEnv } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";

import * as readline from 'readline/promises';
import { readFileSync } from "fs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const file = process.argv[2];

if (file) {
    run(file);
} else {
    repl();
}

function run(filename: string) {
    const parser = new Parser();
    const env = createGlobalEnv();

    let input = readFileSync(filename, 'utf-8');

    const program = parser.produceAST(input);
    const result = evaluate(program, env);
}

async function repl() {
    const parser = new Parser();
    const env = createGlobalEnv();

    console.log("Byte v1.0");

    while (true) {
        try {
            const input = await rl.question("> ");

            if (!input || input.includes("exit")) {
                process.exit(1);
            }

            const program = parser.produceAST(input);

            const result = evaluate(program, env);
            // @ts-ignore
            console.log(result.value);
        } catch (error) {
            console.error(`Error processing input: ${error.message}`);
        }
    }
}
