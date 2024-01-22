import jsonschema from "jsonschema";

/**
 * @description - validate schema
 * @params {object} - input schema
 * @params {object} - expected schema 
 * @returns {boolean} -  true if valid
 */
 function validate(object, schema) {
    return jsonschema.validate(object, schema).valid;
 }

 /**
 * @description - give errors if schama is not valid
 * @params {object} - input schema
 * @params {object} - expected schema 
 * @returns {array} -  list of errors
 */
 function getErrors(object, schema) {
    return jsonschema.validate(object, schema).errors[0];
 }

 export { validate, getErrors };