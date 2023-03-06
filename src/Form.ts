import { forEach, mapValues, values } from 'lodash'
import { AvailableValidators } from './Validator'
import FormField from './FormField'

export type FormProps = {
  fields: Record<string, FormFieldProps>
  onSubmit?(formData: Record<string, any>): void
}

export type FormFieldProps = {
  defaultValue?: number | string | number[] | string[] | boolean | boolean[],
  valueType?: any
  validators?: AvailableValidators[]
}

type FieldNames<T extends FormProps> = {
  [K in keyof T['fields']]?: FormField<T['fields'][K]['valueType']>
}

type SetFieldNames<T extends FormProps> = {
  [K in keyof T['fields']]?: T['fields'][K]['valueType']
}

export class Form<T extends FormProps> {
  private refresh: () => void;
  private onSubmit: (formData: FieldNames<T>) => void;

  fields: FieldNames<T> = {}
  isValid: boolean = false;

  constructor(props: T, refresh: () => void) {
    this.refresh = refresh;
    this.fields = mapValues(props.fields, field => new FormField(field, this.refresh))
    this.onSubmit = props.onSubmit as (formData: FieldNames<T>) => void;
  }

  handleSubmit = () => {
    const isValid = this.validate();

    if (isValid) {
      const formData = this.getFormData();
      this.onSubmit?.(formData)
    }

    return isValid;
  }

  private setIsValid(isValid: boolean) {
    this.isValid = isValid;
    this.refresh()
  }

  getFormData(): FieldNames<T> {
    return mapValues(this.fields, field => field?.value)
  }

  setFormData(data: SetFieldNames<T>) {
    forEach(data, (value, key) => {
      this.fields[key]?.setValue(value, false);
    })

    this.validate()
  }

  validate() {
    const results = values(this.fields).map(field => field?.validate())
    const isValid = results.every(valid => valid)
    this.setIsValid(isValid);
    return isValid
  }
}
