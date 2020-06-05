const utils = require("../utils");
const { pulpoError } = require("../functions");

class PulpoValidator {
  constructor(schema) {
    this.schema = schema;
    this.validationResults = {};
  }

  validate(obj) {
    if (!PulpoValidator.isObjectEqualToSchema(obj, this.schema)) {
      this.generateValidationResults({
        isValid: false,
        error: pulpoError("differentKeys"),
      });
    } else {
      for (let key in obj) {
        this.generateValidationResults({
          [key]: {
            value: obj[key],
            isValid: this.schema[key].runValidations(obj[key]),
            ...(this.schema[key].errors.length && {
              errors: this.schema[key].errors,
            }),
          },
        });
      }
      // this.checkOveralValidation();
    }
    return { ...this.validationResults };
  }

  generateValidationResults({ isValid, error, ...field }) {
    if (Object.keys(field).length) {
      if (!this.validationResults.data) this.validationResults.data = {};
      this.validationResults.data = {
        ...this.validationResults.data,
        ...field,
      };
      this.validationResults = {
        ...this.validationResults,
        ...(!field[Object.keys(field)[0]].isValid && { isValid: false }),
      };
    }
    if (isValid !== undefined) this.validationResults.isValid = isValid;
    if (error !== undefined) this.validationResults.error = error;
    if (this.validationResults.isValid === undefined) this.validationResults.isValid = true;
  }

  // checkOveralValidation() {
  //   if (!this.validationResults.data) return;
  //   this.validationResults.isValid = true;
  //   for (let field in this.validationResults.data) {
  //     if (!this.validationResults.data[field].isValid) {
  //       this.validationResults.isValid = false;
  //       break;
  //     }
  //   }
  // }

  static isObjectEqualToSchema(obj, schema) {
    return utils.arraysAreEqual(Object.keys(schema), Object.keys(obj));
  }
}

module.exports = PulpoValidator;