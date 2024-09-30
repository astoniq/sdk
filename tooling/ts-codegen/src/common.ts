import {Schema} from "@astoniq/sdk-jtd-utils";
import {pascalCase} from "scule";


export interface TsProperty {
    typeName: string;
    content: string;
}

export interface CodegenContext {
    typePrefix: string;
    generatedTypes: string[];
    instancePath: string;
    schemaPath: string;
    discriminatorParent: string;
    discriminatorKey: string;
    discriminatorValue: string;
}

export const removeDisallowedChars = (
    input: string,
    disallowedChars: string,
) => {
    let result = input;
    for (const char of disallowedChars) {
        if (result.includes(char)) {
            result = result.split(char).join("");
        }
    }
    return result;
};

export const stringStartsWithNumber = (input: string): boolean =>
    input.length !== 0 && !Number.isNaN(Number(input.charAt(0)));

const illegalChars = "!#^&*()-+=?/][{}|\\~`'\"";

export function validVarName(name: string): string {
    if (stringStartsWithNumber(name)) {
        return `_${removeDisallowedChars(name, illegalChars)}`;
    }
    return removeDisallowedChars(name, illegalChars);
}

export function getTsTypeName(schema: Schema, context: CodegenContext): string {
    if (schema.metadata?.id) {
        const name = pascalCase(schema.metadata.id, { normalize: true });
        return validVarName(name);
    }
    if (context.discriminatorParent && context.discriminatorValue) {
        const name = pascalCase(
            `${context.discriminatorParent}_${context.discriminatorValue}`,
            { normalize: true },
        );
        return validVarName(name);
    }
    const name = pascalCase(context.instancePath.split("/").join("_"), {
        normalize: true,
    });
    return validVarName(name);
}
