import {SchemaFormType} from "@astoniq/sdk-jtd-utils";
import {TsProperty} from "./common.js";


export function tsStringFromSchema(
    schema: SchemaFormType,
): TsProperty {
    const typeName = schema.nullable ? "string | null" : "string";
    return {
        typeName,
        content: "",
    };
}

export function tsBooleanFromSchema(
    schema: SchemaFormType,
): TsProperty {
    const typeName = schema.nullable ? `boolean | null` : "boolean";
    return {
        typeName,
        content: "",
    };
}

export function tsDateFromSchema(
    schema: SchemaFormType,
): TsProperty {
    const typeName = schema.nullable ? `Date | null` : "Date";
    return {
        typeName,
        content: "",
    };
}

export function tsFloatFromSchema(
    schema: SchemaFormType,
): TsProperty {
    const typeName = schema.nullable ? "number | null" : "number";
    return {
        typeName,
        content: "",
    };
}

export function tsIntFromSchema(
    schema: SchemaFormType,
): TsProperty {
    const typeName = schema.nullable ? "number | null" : "number";
    return {
        typeName,
        content: "",
    };
}

export function tsBigIntFromSchema(
    schema: SchemaFormType,
): TsProperty {
    const typeName = schema.nullable ? `bigint | null` : `bigint`;
    return {
        typeName,
        content: "",
    };
}