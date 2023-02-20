import { FormField } from "./Form";
import { maxLength, MaxLengthValidator } from "./Validators/MaxLength";
import { minLength, MinLengthValidator } from "./Validators/MinLength";
import { notEmpty, NotEmptyValidator } from "./Validators/NotEmpty";

export type DefaultValidatorProps = {
  errorText: string
}

export type Validators<T> =
  | undefined
  | NotEmptyValidator<T>
  | MinLengthValidator<T>
  | MaxLengthValidator<T>

export type AvailableValidators =
  | ReturnType<typeof notEmpty>
  | ReturnType<typeof minLength>
  | ReturnType<typeof maxLength>


export type ValidatorProps<T, Params extends DefaultValidatorProps> = {
  field: FormField<T>,
  params: Partial<Params>
}

export class Validator<T> {
  field: FormField<T>;

  defaultErrorText?: string;
  errorText?: string;

  constructor({ field, params }: ValidatorProps<T, DefaultValidatorProps>) {
    this.field = field;
    if (params?.errorText) {
      this.errorText = params.errorText
    } else {
      this.errorText = this.defaultErrorText
    }
  }

  setError(isValid: boolean) {
    this.field.setError(isValid, isValid ? undefined : this.errorText)
  }

  validate() {
    return true;
  }

}
