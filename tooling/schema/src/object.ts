import {AObjectSchema, AObjectSchemaMetadata, ASchema, InferObjectOutput, InferType, ResolveObject} from "./schemas.js";
import {SchemaFormProperties} from "@astoniq/sdk-jtd-utils";
import {optional} from "./modifiers.js";

/**
 * Create an object schema
 *
 * @example
 * const Schema = a.object({
 *   foo: a.string(),
 *   bar: a.number()
 * });
 */
export function object<
    TInput extends Record<any, ASchema> = {},
    TAdditionalProps extends boolean = false>(
    input: TInput,
    metadata: AObjectSchemaMetadata<TAdditionalProps> = {}
): AObjectSchema<InferObjectOutput<TInput>, TAdditionalProps> {

    const schema: SchemaFormProperties = {
        properties: {},
    }

    if (typeof metadata.strict === "boolean") {
        schema.strict = metadata.strict;
    }

    for (const key of Object.keys(input)) {
        const prop = input[key];
        if (prop.optional) {
            if (!schema.optionalProperties) {
                schema.optionalProperties = {}
            }
            schema.optionalProperties[key] = prop;
            continue;
        }
        schema.properties[key] = prop
    }

    return {
        ...(schema as any),
        metadata,
        output: {} as any satisfies InferObjectOutput<TInput>
    }
}


/**
 * Create an object schema using a subset of keys from another object schema
 *
 * @example
 * const BaseObject = a.object({
 *   foo: a.string(),
 *   bar: a.string(),
 *   baz: a.string(),
 * }) // { foo: string; bar: string; baz: string; }
 *
 * const SubObject = a.pick(User, ['foo']) // { foo: string; }
 */
export function pick<
    TSchema extends AObjectSchema<any, any> = any,
    TKeys extends keyof InferType<TSchema> = any,
    TAdditionalProps extends boolean = false
>(
    inputSchema: TSchema,
    keys: TKeys[],
    metadata: AObjectSchemaMetadata<TAdditionalProps> = {}
): AObjectSchema<Pick<InferType<TSchema>, TKeys>, TAdditionalProps> {

    const schema: SchemaFormProperties = {
        properties: {},
        nullable: inputSchema.nullable
    }

    if (typeof metadata.strict === "boolean") {
        schema.strict = metadata.strict;
    }

    Object.keys(inputSchema.properties).forEach((key) => {
        if (!schema.properties) {
            return;
        }
        if (keys.includes(key as any)) {
            schema.properties[key] = inputSchema.properties[key]!;
        }
    });
    if (inputSchema.optionalProperties) {
        schema.optionalProperties = {};
        Object.keys(inputSchema.optionalProperties).forEach((key) => {
            if (!schema.optionalProperties || !inputSchema.optionalProperties) {
                return;
            }
            if (keys.includes(key as any)) {
                schema.optionalProperties[key] =
                    inputSchema.optionalProperties[key]!;
            }
        });
    }

    return {
        ...(schema as any),
        metadata,
        output: {} as any satisfies Pick<InferType<TSchema>, TKeys>,
    }
}

export function omit<
    TSchema extends AObjectSchema<any, any> = any,
    TKeys extends keyof InferType<TSchema> = any,
    TAdditionalProps extends boolean = false
>(
    inputSchema: TSchema,
    keys: TKeys[],
    metadata: AObjectSchemaMetadata<TAdditionalProps> = {}
): AObjectSchema<Omit<InferType<TSchema>, TKeys>, TAdditionalProps> {
    const schema: SchemaFormProperties = {
        properties: {
            ...inputSchema.properties,
        },
        nullable: inputSchema.nullable,
    };
    if (typeof metadata.strict === "boolean") {
        schema.strict = metadata.strict;
    }
    Object.keys(inputSchema.properties).forEach((key) => {
        if (keys.includes(key as any)) {
            delete schema.properties[key];
        }
    });
    if (inputSchema.optionalProperties) {
        schema.optionalProperties = {
            ...(inputSchema.optionalProperties as any),
        };
        Object.keys(inputSchema.optionalProperties).forEach((key) => {
            if (!schema.optionalProperties) {
                return;
            }
            if (keys.includes(key as any)) {
                delete schema.optionalProperties[key];
            }
        });
    }

    return {
        ...(schema as any),
        metadata,
        output: {} as any
    }
}

export function extend<
    TBaseSchema extends AObjectSchema<any, any> = any,
    TSchema extends AObjectSchema<any, any> = any,
    TAdditionalProps extends boolean = false,
>(
    baseSchema: TBaseSchema,
    inputSchema: TSchema,
    metadata: AObjectSchemaMetadata<TAdditionalProps> = {},
): AObjectSchema<
    ResolveObject<InferType<TBaseSchema> & InferType<TSchema>>,
    TAdditionalProps
> {

    const schema: SchemaFormProperties = {
        properties: {
            ...baseSchema.properties,
            ...inputSchema.properties,
        },
        optionalProperties: {
            ...baseSchema.optionalProperties,
            ...inputSchema.optionalProperties,
        },
    };
    if (typeof metadata.strict === "boolean") {
        schema.strict = metadata.strict;
    }

    return {
        ...(schema as any),
        metadata,
        output: {} as any as InferType<TBaseSchema> & InferType<TSchema>
    }
}

export function partial<
    TSchema extends AObjectSchema<any, any> = any,
    TAdditionalProps extends boolean = false,
>(
    schema: TSchema,
    metadata: AObjectSchemaMetadata<TAdditionalProps> = {},
): AObjectSchema<Partial<InferType<TSchema>>, TAdditionalProps>
{

    const newSchema: SchemaFormProperties = {
        properties: {},
        optionalProperties: {},
        nullable: schema.nullable,
    };
    if (typeof metadata.strict === "boolean") {
        schema.strict = metadata.strict;
    }
    for (const key of Object.keys(schema.properties)) {
        const prop = schema.properties[key]!;
        (newSchema.optionalProperties as any)[key] = optional(prop);
    }
    if (schema.optionalProperties && newSchema.optionalProperties) {
        for (const key of Object.keys(schema.optionalProperties)) {
            const prop = schema.optionalProperties[key]!;
            if (prop.optional) {
                newSchema.optionalProperties[key] = prop;
            } else {
                newSchema.optionalProperties[key] = optional(prop);
            }
        }
    }

    return {
        ...(newSchema as any),
        metadata,
        output: {} as any
    }
}