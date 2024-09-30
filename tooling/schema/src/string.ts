import {AScalarSchema, ASchemaMetadata} from "./schemas.js";

/**
 * @example
 * const Schema = a.string();
 */
export function string(
    metadata: ASchemaMetadata = {}
): AScalarSchema<'string', string> {
    return {
        type: 'string',
        metadata: metadata,
        output: ''
    }
}