import { buildMessage, ValidateBy } from 'class-validator';
import { PARAMETER_TYPE, params } from 'inversify-express-utils';
import VALIDATION from '@enums/validation.enum';
import { fluentProvide } from 'inversify-binding-decorators';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const checkEmailDomain = (email: string, domain: string) : boolean => {
  const emailDomain = email.split('@')[1];
  return emailRegex.test(email) && emailDomain === domain;
}
export const SpecificEmailDomain = (domain: string): PropertyDecorator => {
  return ValidateBy({
    name: VALIDATION.SPECIFIC_EMAIL_DOMAIN,
    validator: {
      validate: (value, _): boolean => checkEmailDomain(value, domain),
      defaultMessage: buildMessage(eachPrefix => eachPrefix + `$property must use @${domain}.`)
    }
  });
}

export const requestQuery = () : ParameterDecorator => params(PARAMETER_TYPE.QUERY)
export const ProvideSingleton = <T>(identifier: symbol): (target: T) => void => {
  return fluentProvide(identifier)
    .inSingletonScope()
    .done();
};