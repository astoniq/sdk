import {AArraySchema, ASchema, ASchemaMetadata} from "./schemas.js";

/**
 * @example
 * const Schema = a.array(a.string());
 */
export function array<TInnerSchema extends ASchema = any>(
    schema: TInnerSchema,
    metadata: ASchemaMetadata = {}
): AArraySchema<TInnerSchema> {
    return {
        elements: schema,
        metadata: metadata,
        output: [] as any
    }
}