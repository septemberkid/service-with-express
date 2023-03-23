import { ValidateBy, buildMessage } from 'class-validator';

const SPECIFIC_EMAIL_DOMAIN  = 'SPECIFIC_EMAIL_DOMAIN';
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const checkEmailDomain = (email: string, domain: string) : boolean => {
  const emailDomain = email.split('@')[1];
  return emailRegex.test(email) && emailDomain === domain;
}
export const SpecificEmailDomain = (domain: string): PropertyDecorator => {
  return ValidateBy({
    name: SPECIFIC_EMAIL_DOMAIN,
    validator: {
      validate: (value, _): boolean => checkEmailDomain(value, domain),
      defaultMessage: buildMessage(eachPrefix => eachPrefix + `$property must use @${domain}.`)
    }
  });
}