$# Byte Programming Language

$**Introduction**

Byte is a minimalist esoteric programming language designed to be concise and challenging. This guide will help you get started with Byte, including basic syntax, data types, control flow, and some special features.

$**Running Byte Programs**

To run a Byte program, use the following command:
```bash
npm run byte <FILENAME>
$Hello, World!

Let's start with a simple "Hello, World!" program in Byte:

byte
Copy code
print("Hello, World!")
$Variables

Byte supports variables with the var keyword:

byte
Copy code
var x = 42;
print(x);
$Data Types

Numbers: Byte supports numeric values.

byte
Copy code
var num = 3.14;
Strings: Represented with double quotes.

byte
Copy code
var message = "Hello, Byte!";
Booleans: true or false.

byte
Copy code
var isTrue = true;
$Control Flow

$If Statement

byte
Copy code
if (condition) {
    // code to execute if condition is true
} else {
    // code to execute if condition is false
}
$While Loop

byte
Copy code
var i = 0;
while (i < 5) {
    print(i);
    i = i + 1;
}
$For Loop

byte
Copy code
for (var i = 0; i < 5; i = i + 1) {
    print(i);
}
$Functions

Define functions using the function keyword:

byte
Copy code
function add(a, b) {
    return a + b;
}

var result = add(3, 4);
print(result);
$Comments

Byte supports single-line comments with //:

byte
Copy code
// This is a comment
$Error Handling

Byte includes basic error handling with try and catch:

byte
Copy code
try {
    // code that might throw an error
} catch (error) {
    // handle the error
    print("Error occurred:", error);
}
$Advanced Features

Bytecode Manipulation: Byte allows direct manipulation of its bytecode for advanced users.
Metaprogramming: Modify the program's structure during runtime.
$Credits

Byte is inspired by esolangs.org.
Special thanks to the Byte community for their contributions.
Happy coding in Byte!