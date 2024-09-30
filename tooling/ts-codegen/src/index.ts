import {AppDefinition} from "@astoniq/sdk-codegen";
import prettier from "prettier";
import {
    isSchemaFormDiscriminator,
    isSchemaFormElements,
    isSchemaFormEnum,
    isSchemaFormProperties,
    isSchemaFormRef,
    isSchemaFormType, isSchemaFormValues,
    Schema
} from "@astoniq/sdk-jtd-utils";
import {tsAnyFromSchema} from "./any.js";
import {CodegenContext, TsProperty} from "./common.js";
import {
    tsBigIntFromSchema,
    tsBooleanFromSchema,
    tsDateFromSchema,
    tsFloatFromSchema,
    tsIntFromSchema,
    tsStringFromSchema
} from "./primitives.js";
import {tsEnumFromSchema} from "./enum.js";
import {tsRefFromSchema} from "./ref.js";
import {tsObjectFromSchema} from "./object.js";
import {tsArrayFromSchema} from "./array.js";
import {tsRecordFromSchema} from "./record.js";
import {tsTaggedUnionFromSchema} from "./discriminator.js";
import {writeFileSync} from "fs";
import {a} from "@astoniq/sdk-schema";

async function createTypescriptClient(
    def: AppDefinition
): Promise<string> {

    const types: string[] = []

    const context: CodegenContext = {
        typePrefix: "",
        generatedTypes: [],
        instancePath: "",
        schemaPath: "",
        discriminatorParent: "",
        discriminatorKey: "",
        discriminatorValue: "",
    };

    for (const key of Object.keys(def.definitions)) {
        const typeDef = def.definitions[key];
        const result = tsTypeFromSchema(typeDef, {
            typePrefix: context.typePrefix,
            generatedTypes: context.generatedTypes,
            instancePath: `/${key}`,
            schemaPath: `/${key}`,
            discriminatorParent: "",
            discriminatorKey: "",
            discriminatorValue: "",
        });

        if (result.content) {
            types.push(result.content)
        }
    }

    return await prettier.format(types.join("\n"), {
        parser: "typescript"
    })
}


export function tsTypeFromSchema(
    schema: Schema,
    context: CodegenContext
): TsProperty {
    if (isSchemaFormType(schema)) {
        switch (schema.type) {
            case "string":
                return tsStringFromSchema(schema);
            case "boolean":
                return tsBooleanFromSchema(schema);
            case "timestamp":
                return tsDateFromSchema(schema);
            case "float32":
            case "float64":
                return tsFloatFromSchema(schema);
            case "int8":
                return tsIntFromSchema(schema);
            case "uint8":
                return tsIntFromSchema(schema);
            case "int16":
                return tsIntFromSchema(schema);
            case "uint16":
                return tsIntFromSchema(schema);
            case "int32":
                return tsIntFromSchema(schema);
            case "uint32":
                return tsIntFromSchema(schema);
            case "int64":
                return tsBigIntFromSchema(schema);
            case "uint64":
                return tsBigIntFromSchema(schema);
        }
    }

    if (isSchemaFormEnum(schema)) {
        return tsEnumFromSchema(schema, context);
    }

    if (isSchemaFormProperties(schema)) {
        return tsObjectFromSchema(schema, context);
    }
    if (isSchemaFormElements(schema)) {
        return tsArrayFromSchema(schema, context);
    }

    if (isSchemaFormValues(schema)) {
        return tsRecordFromSchema(schema, context);
    }

    if (isSchemaFormDiscriminator(schema)) {
        return tsTaggedUnionFromSchema(schema, context);
    }

    if (isSchemaFormRef(schema)) {
        return tsRefFromSchema(schema, context);
    }

    return tsAnyFromSchema()
}

const User = a.object({
    id: a.string(),
    photo: a.optional(
        a.object({
            url: a.string(),
            width: a.nullable(a.int32()),
            height: a.nullable(a.int32()),
        }),
    ),
}, {
    id: 'User'
});

const PostComment = a.discriminator("commentType", {
    TEXT: a.object({
        userId: a.string(),
        user: User,
        text: a.string(),
    }),
    IMAGE: a.object({
        userId: a.string(),
        user: User,
        imageUrl: a.string(),
    }),
    VIDEO: a.object({
        userId: a.string(),
        user: User,
        videoUrl: a.string(),
    }),
}, {
    id: 'PostComment'
});

const BinaryTree = a.recursive(
    (self) =>
        a.object({
            left: a.nullable(self),
            right: a.nullable(self),
        }),
    {
        id: 'BinaryTree'
    });

const Post = a.object({
    id: a.string(),
    isFeatured: a.boolean(),
    userId: a.string(),
    user: User,
    type: a.enumerator(["text", "image", "video"]),
    title: a.string(),
    content: a.string(),
    tags: a.optional(a.array(a.string())),
    createdAt: a.timestamp(),
    updatedAt: a.timestamp(),
    numComments: a.uint32(),
    numLikes: a.int32(),
    unknownField: a.any(),
    comments: a.array(PostComment),
    numArray: a.array(a.number()),
    stringArray: a.array(a.string()),
    metadata: a.record(
        a.object({
            key: a.string(),
            createdAt: a.timestamp(),
        }),
    ),
    rec: BinaryTree
}, {
    id: 'Post'
});


const def: AppDefinition = {
    definitions: {
        User,
        PostComment,
        Post,
        BinaryTree
    },
}

const result = await createTypescriptClient(def);
writeFileSync('client.ts', result)