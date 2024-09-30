import {AScalarSchema, ASchemaMetadata, NumberType} from "./schemas.js";


function numberScalarType<TType extends NumberType>(
    type: TType,
    metadata: ASchemaMetadata,
): AScalarSchema<TType, number> {
    return {
        type,
        metadata,
        output: 0
    }
}

export function float32(metadata: ASchemaMetadata = {}) {
    return numberScalarType("float32", metadata);
}

export function float64(metadata: ASchemaMetadata = {}) {
    return numberScalarType("float64", metadata);
}

export function uint8(metadata: ASchemaMetadata = {}) {
    return numberScalarType("uint8", metadata);
}

export function int8(metadata: ASchemaMetadata = {}) {
    return numberScalarType("int8", metadata);
}

export function int16(metadata: ASchemaMetadata = {}) {
    return numberScalarType("int16", metadata);
}

export function uint16(metadata: ASchemaMetadata = {}) {
    return numberScalarType("uint16", metadata);
}

export function int32(metadata: ASchemaMetadata = {}) {
    return numberScalarType("int32", metadata);
}

export function uint32(metadata: ASchemaMetadata = {}) {
    return numberScalarType("uint32", metadata);
}

export function int64(metadata: ASchemaMetadata = {}) {
    return numberScalarType("int64", metadata);
}

export function uint64(metadata: ASchemaMetadata = {}) {
    return numberScalarType("uint64", metadata);
}

export function number(metadata: ASchemaMetadata = {}) {
    return float64(metadata);
}

