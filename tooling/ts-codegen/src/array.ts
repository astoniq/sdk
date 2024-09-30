import {SchemaFormElements} from "@astoniq/sdk-jtd-utils";
import {CodegenContext, TsProperty} from "./common.js";
import {tsTypeFromSchema} from "./index.js";

export function tsArrayFromSchema(
    schema: SchemaFormElements,
    context: CodegenContext,
): TsProperty {
    const innerType = tsTypeFromSchema(schema.elements, {
        typePrefix: context.typePrefix,
        generatedTypes: context.generatedTypes,
        instancePath: `${context.instancePath}/element`,
        schemaPath: `${context.schemaPath}/elements`,
        discriminatorParent: "",
        discriminatorKey: "",
        discriminatorValue: "",
    });
    const typeName = `(${innerType.typeName})[]`;
    return {
        typeName: schema.nullable ? `${typeName} | null` : typeName,
        content: innerType.content,
    };
}