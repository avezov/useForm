import { DefaultValidatorProps, Validator, ValidatorProps } from "../Validator";

const DEFAULT_EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

type EmailProps = DefaultValidatorProps & {
  regexp?: RegExp
}

export class EmailValidator<T> extends Validator<T> {
  regexp: RegExp = DEFAULT_EMAIL_REGEXP;


  constructor(props: ValidatorProps<T, EmailProps>) {
    super(props);
    if (props.params.regexp instanceof RegExp) {
      this.regexp = props.params.regexp;
    }
  }

  validate(): boolean {
    const isValid = !!this.regexp.test(String(this.field.value));
    this.setError(isValid);
    return isValid;
  }
}


export function email(params: EmailProps): [typeof EmailValidator, EmailProps] {
  return [EmailValidator, params]
}