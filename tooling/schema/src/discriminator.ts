import {ADiscriminatorSchema, AObjectSchema, ASchemaMetadata, InferType, ResolveObject} from "./schemas.js";

type InferDiscriminatorType<
    TDiscriminatorKey extends string,
    TMapping extends Record<string, AObjectSchema<any>>,
    TJoinedMapping extends JoinedDiscriminator<TDiscriminatorKey, TMapping>,
> = ResolveObject<TJoinedMapping[keyof TJoinedMapping]>;

type JoinedDiscriminator<
    TUnionKey extends string,
    TInput extends Record<string, AObjectSchema<any>>,
> = {
    [TKey in keyof TInput]: InferType<TInput[TKey]> & Record<TUnionKey, TKey>;
};

/**
 * Create a discriminated union / tagged union
 *
 * This is an implementation of https://jsontypedef.com/docs/jtd-in-5-minutes/#discriminator-schemas
 *
 * @example
 * const Schema = a.discriminator("eventType", {
 *   CREATED: a.object({
 *     id: a.string(),
 *     createdAt: a.timestamp(),
 *   }),
 *   UPDATED: a.object({
 *     id: a.string(),
 *     createdAt: a.timestamp(),
 *     updatedAt: a.timestamp(),
 *   })
 * })
 */


export function discriminator<
    TDiscriminatorKey extends string,
    TMapping extends Record<string, AObjectSchema<any>>,
>(
    discriminator: TDiscriminatorKey,
    mapping: TMapping,
    metadata: ASchemaMetadata = {}
): ADiscriminatorSchema<
    InferDiscriminatorType<
        TDiscriminatorKey,
        TMapping,
        JoinedDiscriminator<TDiscriminatorKey, TMapping>
    >
> {
    return {
        discriminator,
        mapping,
        metadata,
        output: {} as any
    }
}