import {ASchemaMetadata, AStringEnumSchema} from "./schemas.js";


/**
 * An enumeration of string values
 *
 * This is an implementation of:
 * https://jsontypedef.com/docs/jtd-in-5-minutes/#enum-schemas
 *
 * @example
 * const Schema = a.enumerator(["A", "B"], {id: 'Schema'})
 */
export function enumerator<TKeys extends string, TValues extends TKeys[]>(
    values: TValues,
    metadata: ASchemaMetadata = {}
): AStringEnumSchema<TValues> {
    return {
        enum: values,
        metadata: metadata,
        output: values[0]
    }
}