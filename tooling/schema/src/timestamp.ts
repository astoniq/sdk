import {AScalarSchema, ASchemaMetadata} from "./schemas.js";


/**
 * Create a Date schema
 *
 * @example
 * const Schema = a.timestamp();
 * a.validate(Schema, new Date()) // true
 */
export function timestamp(
    metadata: ASchemaMetadata = {},
): AScalarSchema<"timestamp", Date> {
    return {
        type: "timestamp",
        metadata: metadata,
        output: new Date(),
    };
}