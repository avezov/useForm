import { DefaultValidatorProps, Validator, ValidatorProps } from "../Validator";

const DEFAULT_DOMAIN_REGEXP = /([a-zа-яё0-9_\.-]+)\.([a-zа-яё0-9-]+)/;

type DomainProps = DefaultValidatorProps & {
  regexp?: RegExp
}

export class DomainValidator<T> extends Validator<T> {
  regexp: RegExp = DEFAULT_DOMAIN_REGEXP;


  constructor(props: ValidatorProps<T, DomainProps>) {
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


export function domain(params: DomainProps): [typeof DomainValidator, DomainProps] {
  return [DomainValidator, params]
}