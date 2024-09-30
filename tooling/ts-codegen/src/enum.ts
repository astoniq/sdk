import {SchemaFormEnum} from "@astoniq/sdk-jtd-utils";
import {CodegenContext, getTsTypeName, TsProperty} from "./common.js";


export function tsEnumFromSchema(
    schema: SchemaFormEnum,
    context: CodegenContext
): TsProperty {
    if (schema.enum.length === 0)
        throw new Error(
            `Error at ${context.schemaPath}. Enum schemas must have at least one enum value.`,
        );

    const enumName = getTsTypeName(schema, context);
    const prefixedEnumName = `${context.typePrefix}${enumName}`;

    const typeName = schema.nullable
        ? `${prefixedEnumName} | null`
        : prefixedEnumName;


    const result: TsProperty = {
        typeName,
        content: ""
    }

    if (context.generatedTypes.includes(enumName)) {
        return result;
    }

    const name = `${context.typePrefix}${enumName}`;

    result.content = `export type ${name} = ${schema.enum.map(val => `"${val}"`).join(" | ")};`

    context.generatedTypes.push(enumName);

    return result;
}