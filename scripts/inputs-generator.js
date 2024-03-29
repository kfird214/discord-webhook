const { parse, stringify } = require('yaml');
const { readFileSync, writeFileSync, read } = require('fs');

const action_path = './action.yaml';
const inputs_path = './inputs.yaml';

const action = parse(readFileSync(action_path, 'utf8'));
const inputs = parse(readFileSync(inputs_path, 'utf8'));

// generate action
const new_action_inputs = Object.fromEntries(Object.entries(inputs).map(([name, input]) => ([name, {
    description: input.description,
    required: input.required,
}])));


let input_count_changed = Object.keys(new_action_inputs).length != Object.keys(action.inputs).length;

if (!input_count_changed) {
    for (const [name, input] of Object.entries(new_action_inputs)) {
        if (JSON.stringify(input) != JSON.stringify(action.inputs[name])) {
            input_count_changed = true;
            break;
        }
    }
}

if (input_count_changed) {
    action.inputs = new_action_inputs;
    writeFileSync(action_path, stringify(action));
}
else {
    console.log('action.yaml inputs are already up to date');
}

/**
 * @see https://shadocs.netlify.app/markdown/escaping_character/#:~:text=To%20escape%20characters%2C%20prefix%20them,be%20escaped%20is%20available%20below).
 * @param {string} value 
 * @returns {string}
 */
function escape_markdown(value) {
    value = value.replaceAll('|', '\\|');
    value = value.replaceAll('*', '\\*');
    value = value.replaceAll('_', '\\_');
    value = value.replaceAll('`', '\\`');
    value = value.replaceAll('{', '\\{');
    value = value.replaceAll('}', '\\}');
    value = value.replaceAll('[', '\\[');
    value = value.replaceAll(']', '\\]');
    value = value.replaceAll('(', '\\(');
    value = value.replaceAll(')', '\\)');
    value = value.replaceAll('#', '\\#');
    value = value.replaceAll('+', '\\+');
    // value = value.replaceAll('.', '\\.');
    value = value.replaceAll('.!', '\\.!');
    // value = value.replaceAll('.|', '\\.|');
    value = value.replaceAll('\n', '<br>');
    // value = value.replaceAll('\\', '\\\\');
    return value;
}

// generate README
const readme = readFileSync('./README.md', 'utf8');
const INPUTS_SEPARATOR = '<!-- inputs -->';
const readmeParts = readme.split(INPUTS_SEPARATOR);
let inputs_markdown_table = Object.entries(inputs).map(([name, input]) =>
    `| ${escape_markdown(name)} | ${escape_markdown(input.description)} | ${input.required ? 'yes' : 'no'} |`
).join('\n');

inputs_markdown_table = "| name | description | required |\n| - | - | - |\n" + inputs_markdown_table;

if (inputs_markdown_table.trim() != readmeParts[1].trim()) {
    const newReadme = `${readmeParts[0]}<!-- inputs -->\n${inputs_markdown_table}\n<!-- inputs -->${readmeParts[2]}`;
    writeFileSync('./README.md', newReadme);
}
else {
    console.log('README.md is already up to date');
}

// generate inputs.ts

/**
 * Create a JSDoc comment
 * @param {string} message 
 * @returns {string}
 */
function jsdoc_comment(message) {
    const message_lines = message.split('\n');
    const message_lines_indented = message_lines.map(line => ` * ${line}`);
    return `/**\n${message_lines_indented.join('\n')}\n */\n`;
}

let generated_input_definitions_ts = jsdoc_comment("@file This file is generated by scripts/inputs-generator.js.\n@author Kfir Nisan Darshani <kfir214@gmail.com>");
generated_input_definitions_ts += "import { InputDefinition, InputType } from '../Input';\n\n";

Object.entries(inputs).forEach(([name, input]) => {
    const var_name = name.replaceAll(/-/g, "_").toUpperCase();

    let input_type = input.type.split('-').map(i => i[0].toUpperCase() + i.slice(1).toLowerCase()).join('');
    const input_type_enum = `InputType.${input_type}`;

    const export_var_line = `export const ${var_name}: InputDefinition<${input_type_enum}> = { name: "${name}", type: ${input_type_enum}, required: ${input.required} };`;
    const jsdoc = jsdoc_comment(input.description);
    generated_input_definitions_ts += jsdoc + export_var_line + "\n\n";
});

writeFileSync('./src/models/input-definitions.ts', generated_input_definitions_ts);

