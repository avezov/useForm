import { DefaultValidatorProps, Validator, ValidatorProps } from "../Validator";

type MinLengthProps = DefaultValidatorProps & {
  minLength: number
}

export class MinLengthValidator<T> extends Validator<T> {
  minLength = 0;

  constructor(props: ValidatorProps<T, MinLengthProps>) {
    super(props);
    this.minLength = props.params.minLength ?? 0
  }

  validate(): boolean {
    const isValid = (this.field.value as { length: number }).length >= this.minLength;
    this.setError(isValid);
    return isValid;
  }
}


export function minLength(params: MinLengthProps): [typeof MinLengthValidator, MinLengthProps] {
  return [MinLengthValidator, params]
}