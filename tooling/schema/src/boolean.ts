import {AScalarSchema, ASchemaMetadata} from "./schemas.js";

/**
 * @example
 * const Schema = a.boolean();
 * */
export function boolean(
    metadata: ASchemaMetadata = {}
): AScalarSchema<'boolean', boolean> {
    return {
        type: 'boolean',
        metadata: metadata,
        output: false
    }
}