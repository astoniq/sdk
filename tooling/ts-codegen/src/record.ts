import {tsTypeFromSchema} from "./index.js";
import {CodegenContext, TsProperty} from "./common.js";
import {SchemaFormValues} from "@astoniq/sdk-jtd-utils";


export function tsRecordFromSchema(
    schema: SchemaFormValues,
    context: CodegenContext,
): TsProperty {
    const innerType = tsTypeFromSchema(schema.values, {
        typePrefix: context.typePrefix,
        generatedTypes: context.generatedTypes,
        instancePath: `${context.instancePath}/value`,
        schemaPath: `${context.schemaPath}/values`,
        discriminatorParent: "",
        discriminatorKey: "",
        discriminatorValue: "",
    });
    const typeName = `Record<string, ${innerType.typeName}>`;
    return {
        typeName: schema.nullable ? `${typeName} | null` : typeName,
        content: innerType.content,
    };
}