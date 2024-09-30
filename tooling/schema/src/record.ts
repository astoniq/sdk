import {ARecordSchema, ASchema, ASchemaMetadata} from "./schemas.js";

/**
 * Create a schema for a record with strings keys
 *
 * @example
 * const StringRecord = a.record(
 *   a.string(),
 * );
 *
 * const ObjectRecord = a.record(
 *   a.object({
 *     id: a.string(),
 *     date: a.timestamp(),
 *   })
 * )
 */
export function record<TInnerSchema extends ASchema>(
    schema: TInnerSchema,
    metadata: ASchemaMetadata = {}
): ARecordSchema<TInnerSchema> {
    return {
        values: schema,
        metadata: metadata,
        output: {}
    }
}