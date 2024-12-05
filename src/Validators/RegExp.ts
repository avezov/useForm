import { DefaultValidatorProps, Validator, ValidatorProps } from "../Validator";

const DEFAULT_REGEXP = /[0-9]+/;

type RegExpProps = DefaultValidatorProps & {
  regexp?: RegExp
}

export class RegExpValidator<T> extends Validator<T> {
  regexp: RegExp = DEFAULT_REGEXP;


  constructor(props: ValidatorProps<T, RegExpProps>) {
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

export function regexp(params: RegExpProps): [typeof RegExpValidator, RegExpProps] {
  return [RegExpValidator, params]
}
