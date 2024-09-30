import {
    isSchemaFormDiscriminator,
    isSchemaFormElements,
    isSchemaFormEnum,
    isSchemaFormProperties,
    isSchemaFormRef,
    isSchemaFormValues,
    type Type as JtdType,
    TypeValues,
} from "@astoniq/sdk-jtd-utils";

export interface ASchemaMetadata {
    id?: string;
    description?: string;
    isDeprecated?: boolean;
}

export interface ASchema<T = any> {
    metadata: ASchemaMetadata;
    nullable?: boolean;
    optional?: boolean;
    output: T
}

export function isASchema(input: unknown): input is ASchema {
    if (typeof input !== "object") {
        return false
    }

    return !(!input || !('metadata' in input));
}

export const NumberTypeValues = [
    "float32",
    "float64",
    "int8",
    "int16",
    "int32",
    "int64",
    "uint8",
    "uint16",
    "uint32",
    "uint64",
] as const;
export type NumberType = (typeof NumberTypeValues)[number];

export type MaybeNullable<
    T = any,
    TIsNullable extends boolean = false,
> = TIsNullable extends true ? T | null : T;

export type Resolve<T> = T;
export type ResolveObject<T> = Resolve<{ [k in keyof T]: T[k] }>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type InferType<TInput extends ASchema<any>> = Resolve<TInput["output"]>;

export type InferSubType<
    TUnion extends Record<string, any>,
    TKey extends keyof TUnion,
    TVal extends TUnion[TKey],
> = TUnion extends Record<TKey, TVal> ? TUnion : never;

// basic types
export interface AScalarSchema<T extends JtdType | NumberType = any, TVal = any> extends ASchema<TVal> {
    type: T;
}

export function isAScalarSchema(input: unknown): input is AScalarSchema {
    return (
        isASchema(input) &&
        "type" in input &&
        typeof input.type === "string" &&
        (TypeValues.includes(input.type as any))
    )
}

export interface AArraySchema<TInnerSchema extends ASchema<any> = any> extends ASchema<Array<InferType<TInnerSchema>>> {
    elements: TInnerSchema
}

export function isAArraySchema(input: unknown): input is AArraySchema {
    return isASchema(input) && isSchemaFormElements(input)
}

export interface AStringEnumSchema<TValues extends string[]> extends ASchema<TValues[number]> {
    enum: TValues
}

export function isAStringEnumSchema(
    input: unknown,
): input is AStringEnumSchema<any> {
    return isASchema(input) && isSchemaFormEnum(input);
}

export interface ADiscriminatorSchema<T> extends ASchema<T> {
    discriminator: string;
    mapping: Record<string, AObjectSchema<any>>;
}

export function isADiscriminatorSchema(
    input: unknown,
): input is ADiscriminatorSchema<any> {
    return isASchema(input) && isSchemaFormDiscriminator(input);
}

// records
export interface ARecordSchema<
    TInnerSchema extends ASchema<any>,
    TNullable extends boolean = false
> extends ASchema<MaybeNullable<Record<string, InferType<TInnerSchema>>, TNullable>> {
    values: TInnerSchema;
}

export function isARecordSchema(
    input: unknown,
): input is ARecordSchema<any, any> {
    return isASchema(input) && isSchemaFormValues(input);
}

// object types
export interface AObjectSchema<TVal = any, TStrict extends boolean = false>
    extends ASchema<TVal> {
    properties: Record<string, ASchema>;
    optionalProperties?: Record<string, ASchema>;
    strict?: TStrict;
}

export function isAObjectSchema(input: unknown): input is AObjectSchema {
    return isASchema(input) && isSchemaFormProperties(input);
}

export interface AObjectSchemaMetadata<TAdditionalProps extends boolean = false>
    extends ASchemaMetadata {
    strict?: TAdditionalProps;
}

// recursive types
export interface ARefSchema<T> extends ASchema<T> {
    ref: string;
}

export function isARefSchema(input: unknown): input is ARefSchema<any> {
    return isASchema(input) && isSchemaFormRef(input);
}

// object helper types
export type InferObjectOutput<TInput = any> = ResolveObject<
    InferObjectRawType<TInput>
>;

export type InferObjectRawType<TInput> =
    TInput extends Record<any, any>
        ? {
            [TKey in keyof TInput]: TInput[TKey]["optional"] extends true
                ?
                | TInput[TKey]["output"]
                | undefined
                : TInput[TKey]["output"];
        }
        : never;

export function isObject(input: unknown): input is Record<any, any> {
    return typeof input === "object" && input !== null;
}