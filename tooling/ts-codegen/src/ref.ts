import {SchemaFormRef} from "@astoniq/sdk-jtd-utils";
import {CodegenContext, TsProperty, validVarName} from "./common.js";
import {pascalCase} from "scule";

export function tsRefFromSchema(
    schema: SchemaFormRef,
    context: CodegenContext,
): TsProperty {
    const typeName = pascalCase(validVarName(schema.ref), { normalize: true });
    const prefixedTypeName = `${context.typePrefix}${typeName}`;
    return {
        typeName: schema.nullable
            ? `${prefixedTypeName} | null`
            : prefixedTypeName,
        content: "",
    };
}