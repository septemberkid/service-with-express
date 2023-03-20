import { ValidationError } from 'class-validator';

export default class ValidationException {
  public validations: {[key: string] : string[]} = {};
  constructor(protected errors: ValidationError[]){
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
}