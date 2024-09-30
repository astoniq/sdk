import {ASchema, ASchemaMetadata} from "./schemas.js";


/**
 * Create a schema that accepts anything
 */
export function any(metadata: ASchemaMetadata = {}): ASchema<any> {
    return {
        metadata,
        output: undefined as any
    }
}