import { DefaultValidatorProps, Validator, ValidatorProps } from "../Validator";

type MaxLengthProps = DefaultValidatorProps & {
  maxLength: number
}

export class MaxLengthValidator<T> extends Validator<T> {
  maxLength = 0;

  constructor(props: ValidatorProps<T, MaxLengthProps>) {
    super(props);
    this.maxLength = props.params.maxLength ?? 0
  }

  validate(): boolean {
    const isValid = (this.field.value as string | []).length <= this.maxLength;
    this.setError(isValid);
    return isValid;
  }
}


export function maxLength(params: MaxLengthProps): [typeof MaxLengthValidator, MaxLengthProps] {
  return [MaxLengthValidator, params]
}