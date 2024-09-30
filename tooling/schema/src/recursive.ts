import {ADiscriminatorSchema, AObjectSchema, ARefSchema, ASchemaMetadata} from "./schemas.js";



type RecursiveCallback<T> = (
    self: ARefSchema<T>,
) => AObjectSchema<T> | ADiscriminatorSchema<T>;

/**
 * @example
 * ```ts
 * type BinaryTree = {
 *   left: BinaryTree | null;
 *   right: BinaryTree | null;
 * }
 *
 * const BinaryTree = a.recursive<BinaryTree>(
 *   (self) => a.object({
 *     left: a.nullable(self),
 *     right: a.nullable(self),
 *   })
 * );
 * ```
 */
export function recursive<T = any>(
    callback: RecursiveCallback<T>,
    metadata: ASchemaMetadata = {},
): AObjectSchema<T> | ADiscriminatorSchema<T> {

    if (!metadata.id) {
        throw Error('Recursive always include id metadata')
    }

    const id = metadata.id;
    return callback({
        ref: id,
        metadata: {
            ...metadata,
            id,
        },
        output: null as T
    })
}
