import {CodegenContext, getTsTypeName, TsProperty, validVarName} from "./common.js";
import {SchemaFormProperties} from "@astoniq/sdk-jtd-utils";
import {camelCase} from "scule";
import {tsTypeFromSchema} from "./index.js";

export function tsObjectFromSchema(
    schema: SchemaFormProperties,
    context: CodegenContext,
): TsProperty {
    const typeName = getTsTypeName(schema, context);
    const prefixedTypeName = `${context.typePrefix}${typeName}`;

    const result: TsProperty = {
        typeName: schema.nullable
            ? `${prefixedTypeName} | null`
            : prefixedTypeName,
        content: "",
    }



    if (context.generatedTypes.includes(typeName)) {
        return result;
    }

    const fieldParts: string[] = [];
    const subContentParts: string[] = [];

    if (
        context.discriminatorParent &&
        context.discriminatorValue &&
        context.discriminatorKey
    ) {
        const key = validVarName(
            camelCase(context.discriminatorKey, {normalize: true}),
        );
        fieldParts.push(`${key}: "${context.discriminatorValue}",`);
    }


    for (const key of Object.keys(schema.properties)) {
        const subSchema = schema.properties[key];
        const prop = tsTypeFromSchema(subSchema, {
            typePrefix: context.typePrefix,
            generatedTypes: context.generatedTypes,
            instancePath: `/${typeName}/${key}`,
            schemaPath: `/${typeName}/properties/${key}`,
            discriminatorParent: "",
            discriminatorKey: "",
            discriminatorValue: "",
        });

        if (prop.content) subContentParts.push(prop.content);

        const fieldName = validVarName(camelCase(key));

        fieldParts.push(
            `${fieldName}: ${prop.typeName},`,
        );
    }

    for (const key of Object.keys(schema.optionalProperties ?? {})) {
        const subSchema = schema.optionalProperties![key]!;
        const prop = tsTypeFromSchema(subSchema, {
            typePrefix: context.typePrefix,
            generatedTypes: context.generatedTypes,
            instancePath: `/${typeName}/${key}`,
            schemaPath: `/${typeName}/optionalProperties/${key}`,
            discriminatorParent: "",
            discriminatorKey: "",
            discriminatorValue: "",
        });
        if (prop.content) subContentParts.push(prop.content);

        const fieldName = validVarName(camelCase(key));
        fieldParts.push(
            `${fieldName}?: ${prop.typeName},`,
        );
    }

    result.content = `export interface ${prefixedTypeName} {
    ${fieldParts.map((part) => `${part}`).join("\n")}}
    ${subContentParts.join("\n")}`;

    context.generatedTypes.push(typeName);
    return result;
}