import {TsProperty} from "./common.js";

export function tsAnyFromSchema(
): TsProperty {
    const typeName = "any";
    return {
        typeName,
        content: "",
    };
}