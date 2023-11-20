import Parser from "./frontend/parser";
import { createGlobalEnv } from "./runtime/environment";
import { evaluate } from "./runtime/interpreter";

import * as readline from 'readline/promises';
import { promises as fs } from "fs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const parser = new Parser();
const env = createGlobalEnv();

const file = process.argv[2];

if (file) {
    run(file);
} else {
    repl();
}

async function run(filename: string) {
    try {
        const input = await fs.readFile(filename, 'utf-8');
        const program = parser.produceAST(input);
        const result = evaluate(program, env);
    } catch (error) {
        console.error(`Error reading or processing file: ${error.message}`);
    }
}

async function repl() {
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
