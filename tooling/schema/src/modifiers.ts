import {ASchema, ASchemaMetadata} from "./schemas.js";

/**
 * Transforms a schema into a nullable type
 *
 * @example
 * const NullableString = a.nullable(a.string())
 * const NullableObject = a.nullable(
 *   a.object({
 *     id: a.string(),
 *     description: a.nullable(a.string())
 *   })
 * )
 */
export function nullable<T>(
    schema: ASchema<T>,
    metadata: ASchemaMetadata = {},
): ASchema<T | null> {
    return {
        ...schema,
        metadata: {
            ...schema.metadata,
            ...metadata
        },
        nullable: true,
        output: null as T | null
    }
}

/**
 * Make an object field optional
 *
 *
 * @example
 * const User = a.object({
 *   id: a.string(),
 *   // make the email field optional
 *   email: a.optional(a.string())
 * })
 */
export function optional<T>(
    schema: ASchema<T>,
    metadata: ASchemaMetadata = {},
): ASchema<T | undefined> {
    return {
        ...schema,
        metadata: {
            ...schema.metadata,
            ...metadata
        },
        optional: true,
        output: undefined as T | undefined
    }
}

export function clone<T>(
    schema: ASchema<T>,
    metadata: ASchemaMetadata = {},
): ASchema<T> {
    return {
        ...schema,
        metadata: {
            ...schema.metadata,
            ...metadata
        },
    };
}