import { DefaultValidatorProps, Validator } from "../Validator";

type NotEmptyParams = DefaultValidatorProps & {}

export class NotEmptyValidator<T> extends Validator<T> {
  validate(): boolean {
    const isValid = !!this.field.value;
    this.setError(isValid);
    return isValid;
  }
}


export function notEmpty(params: NotEmptyParams): [typeof NotEmptyValidator, NotEmptyParams] {
  return [NotEmptyValidator, params]
}