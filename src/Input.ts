import { Stream } from 'stream';
import { ColorResolvable } from 'discord.js';


export interface InputDefinition<Inp extends InputType> {
    name: string;
    required: boolean;
    type: Inp;
}

export enum InputType {
    String  = 'string',
    Boolean = 'boolean',
    Number  = 'number',
    Json    = 'json',
    JsonFile= 'json-file',
    File    = 'file',
    Stream  = 'stream',
    Url     = 'url',

    /**
     * ISO8601 formatted date string
     * @example new Date().toISOString()
     */
    Timestamp = 'timestamp',

    /**
     * Color input in hex format string
     * Or a number that can be parsed as a hex string
     */
    Color = 'color',
}

export type InputTypeReturnType = {
    [InputType.String]   : string,
    [InputType.Boolean]  : boolean,
    [InputType.Number]   : number,
    [InputType.Json]     : any,
    [InputType.JsonFile] : any,
    [InputType.File]     : string,
    [InputType.Stream]   : Stream,
    [InputType.Url]      : string,
    [InputType.Timestamp]: Date,
    [InputType.Color]    : ColorResolvable,
}
