import * as core from '@actions/core';
import { createReadStream, existsSync, readFileSync } from 'fs';
import { InputType, InputDefinition, InputTypeReturnType } from './Input';



export function get_input<Inp extends InputType>(input_def: InputDefinition<Inp>): InputTypeReturnType[Inp] | undefined {
    const input_value = core.getInput(input_def.name);

    if (!input_value) {
        if (input_def.required)
            throw new Error(`Input ${input_def.name} is required`);

        return undefined;
    }

    switch (input_def.type) {
        case InputType.String:
            return input_value as InputTypeReturnType[Inp];

        case InputType.Boolean:
            return (input_value === 'true') as InputTypeReturnType[Inp];

        case InputType.Number:
            return parseFloat(input_value) as InputTypeReturnType[Inp];

        case InputType.Json:
            return JSON.parse(input_value) as InputTypeReturnType[Inp];

        case InputType.File:
            if (!existsSync(input_value)) {
                throw new Error(`${input_def.name} File was not found at "${input_value}"`);
            }

            return readFileSync(input_value) as InputTypeReturnType[Inp];

        case InputType.Stream:
            // return input_value as InputTypeReturnType[Inp];
            if (!existsSync(input_value)) {
                throw new Error(`File "${input_value}" does not exist`);
            }

            return createReadStream(input_value) as InputTypeReturnType[Inp];

        case InputType.JsonFile:
            if (!existsSync(input_value)) {
                throw new Error(`${input_def.name} File was not found at "${input_value}"`);
            }

            const json = readFileSync(input_value).toString('utf8');
            return JSON.parse(json) as InputTypeReturnType[Inp];

        case InputType.Url:
            return input_value as InputTypeReturnType[Inp];

        case InputType.Timestamp:
            const da = new Date(input_value);
            return da as InputTypeReturnType[Inp];

        case InputType.Color:
            return input_value as InputTypeReturnType[Inp];
    }
}
