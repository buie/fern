import { OpenAPIV3 } from "openapi-types";

export function isReferenceObject(
    parameter:
        | OpenAPIV3.ReferenceObject
        | OpenAPIV3.ParameterObject
        | OpenAPIV3.SchemaObject
        | OpenAPIV3.RequestBodyObject
        | OpenAPIV3.SecuritySchemeObject
): parameter is OpenAPIV3.ReferenceObject {
    return (parameter as OpenAPIV3.ReferenceObject).$ref != null;
}
