import {CodegenContext, getTsTypeName, TsProperty} from "./common.js";
import {SchemaFormDiscriminator} from "@astoniq/sdk-jtd-utils";
import {tsObjectFromSchema} from "./object.js";


export function tsTaggedUnionFromSchema(
    schema: SchemaFormDiscriminator,
    context: CodegenContext,
): TsProperty {
    const typeName = getTsTypeName(schema, context);
    const prefixedTypeName = `${context.typePrefix}${typeName}`;

    const result: TsProperty = {
        typeName: schema.nullable
            ? `${prefixedTypeName} | null`
            : prefixedTypeName,
        content: ""
    }

    if (context.generatedTypes.includes(typeName)) return result;

    const subTypes: { value: string; data: TsProperty }[] = [];
    const discriminatorKey = schema.discriminator;

    for (const key of Object.keys(schema.mapping)) {
        const subSchema = schema.mapping[key]!;
        const subType = tsObjectFromSchema(subSchema, {
            typePrefix: context.typePrefix,
            generatedTypes: context.generatedTypes,
            instancePath: context.instancePath,
            schemaPath: `${context.schemaPath}/mapping/${key}`,
            discriminatorParent: typeName,
            discriminatorKey: discriminatorKey,
            discriminatorValue: key,
        });
        subTypes.push({ value: key, data: subType });
    }

    result.content = `export type ${prefixedTypeName} = ${subTypes.map((type) => type.data.typeName).join(" |")};
    ${subTypes.map((type) => type.data.content).join("\n")}`;

    context.generatedTypes.push(typeName);
    return result;
}