import { TGenericErrorResponse } from "../interfaces/error.types";




export const handleDuplicateError = (err: any): TGenericErrorResponse => {

    const fieldMatch = err?.message.match(/fields: \(([^)]+)\)/);
    const duplicateField = fieldMatch ? fieldMatch[1] : "Value";
    return {
        statusCode: 400,
        message: `${duplicateField} is Already Exist!`
    }
}