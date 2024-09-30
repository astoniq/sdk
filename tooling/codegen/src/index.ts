import {SchemaFormDiscriminator, SchemaFormProperties} from "@astoniq/sdk-jtd-utils";


export interface AppGenerator<TOptions extends Record<string, any>> {
    generator: (def: AppDefinition) => any;
    options: TOptions;
}

export type GeneratorPlugin<TOptions extends Record<string, any>> =
    (options: TOptions) => AppGenerator<TOptions>;

export interface AppDefinition {
    definitions: Record<string, SchemaFormProperties | SchemaFormDiscriminator>
}