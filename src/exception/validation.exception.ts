import { ValidationError } from 'class-validator';


export default class ValidationException {
  public validations: {[key: string] : string[]} = {};
  constructor(protected errors: ValidationError[]){
    console.log(errors)
    errors[0].children = [
      new ValidationError()
    ]
    this.collectAllErrors(errors);
  }

  private collectAllErrors(errors: ValidationError[]) {
    errors.forEach(value => {
      let errors = [];
      if (value.constraints) {
        errors = Object.values(value.constraints);
      }
      this.validations[value.property] = errors;
    })
  }

  public static newError(field: string, type: symbol, message: string) : ValidationException {
    const validationError: ValidationError = new ValidationError();
    validationError.property = field;
    validationError.constraints = {
      [type]: message
    };
    return new ValidationException([validationError])
  }
}